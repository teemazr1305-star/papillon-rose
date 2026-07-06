const express = require('express');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// ⚠️ Set this to Fatima's real WhatsApp business number (international format, no +, no spaces)
// e.g. Algeria number 0550 12 34 56 -> "213550123456"
const STORE_WHATSAPP_NUMBER = process.env.STORE_WHATSAPP_NUMBER || '213550000000';

function generateOrderNumber() {
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, '');
  const countToday = db
    .prepare("SELECT COUNT(*) AS c FROM orders WHERE order_number LIKE ?")
    .get(`PR-${datePart}-%`).c;
  const seq = String(countToday + 1).padStart(4, '0');
  return `PR-${datePart}-${seq}`;
}

function buildWhatsAppMessage(order, items, customer) {
  const lines = [
    `🦋 طلب جديد من موقع Papillon Rose`,
    ``,
    `رقم الطلب: ${order.order_number}`,
    `الاسم: ${customer.full_name}`,
    `الهاتف: ${customer.phone}`,
    customer.wilaya ? `الولاية: ${customer.wilaya}` : null,
    ``,
    `المنتجات:`,
    ...items.map((it) => `• ${it.product_title} × ${it.quantity} — ${it.unit_price * it.quantity} دج`),
    ``,
    `المجموع: ${order.total} دج`,
    order.customer_note ? `ملاحظة: ${order.customer_note}` : null,
  ].filter(Boolean);

  return lines.join('\n');
}

/* ============================================================
 * POST /api/orders
 * Creates an order from the cart at checkout, returns a ready
 * WhatsApp deep link the frontend opens immediately.
 * ========================================================== */
router.post('/', (req, res) => {
  const { full_name, phone, email, wilaya, items, customer_note } = req.body;

  if (!full_name || !phone) {
    return res.status(400).json({ error: 'الاسم ورقم الهاتف مطلوبان' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'السلة فارغة' });
  }

  // Validate products exist and snapshot their current price/title
  const getProduct = db.prepare('SELECT * FROM products WHERE id = ? AND is_active = 1');
  const resolvedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = getProduct.get(item.product_id);
    if (!product) {
      return res.status(400).json({ error: `أحد المنتجات في السلة لم يعد متوفرًا` });
    }
    const quantity = Math.max(1, Number(item.quantity) || 1);
    resolvedItems.push({
      product_id: product.id,
      product_title: product.title_ar,
      unit_price: product.price,
      quantity,
    });
    subtotal += product.price * quantity;
  }

  const trx = db.transaction(() => {
    // Upsert customer (very light — by phone number)
    let customer = db.prepare('SELECT * FROM customers WHERE phone = ?').get(phone);
    if (!customer) {
      const info = db
        .prepare('INSERT INTO customers (full_name, phone, email, wilaya) VALUES (?, ?, ?, ?)')
        .run(full_name, phone, email || null, wilaya || null);
      customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(info.lastInsertRowid);
    }

    const orderNumber = generateOrderNumber();
    const total = subtotal; // no shipping/tax logic for digital products

    const orderInfo = db
      .prepare(`
        INSERT INTO orders (order_number, customer_id, subtotal, total, payment_method, status, customer_note)
        VALUES (?, ?, ?, ?, 'whatsapp', 'pending_whatsapp', ?)
      `)
      .run(orderNumber, customer.id, subtotal, total, customer_note || null);

    const orderId = orderInfo.lastInsertRowid;

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_title, unit_price, quantity)
      VALUES (@order_id, @product_id, @product_title, @unit_price, @quantity)
    `);
    for (const item of resolvedItems) {
      insertItem.run({ order_id: orderId, ...item });

      // bump sales_count optimistically (counts "ordered", admin can adjust if cancelled)
      db.prepare('UPDATE products SET sales_count = sales_count + 1 WHERE id = ?').run(item.product_id);
    }

    return { orderId, orderNumber, total, customer };
  });

  const { orderId, orderNumber, total, customer } = trx();

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
  const message = buildWhatsAppMessage(order, resolvedItems, customer);
  const whatsappUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  res.status(201).json({
    order: {
      id: orderId,
      order_number: orderNumber,
      total,
      status: order.status,
    },
    whatsapp_url: whatsappUrl,
  });
});

/* GET /api/orders/:orderNumber — order confirmation page lookup */
router.get('/:orderNumber', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(req.params.orderNumber);
  if (!order) return res.status(404).json({ error: 'الطلب غير موجود' });

  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(order.customer_id);
  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

  res.json({ order, customer, items });
});

/* ---------- ADMIN ---------- */

/* GET /api/orders — list all orders, optional status filter */
router.get('/', requireAdmin, (req, res) => {
  const { status } = req.query;
  let query = `
    SELECT o.*, c.full_name, c.phone, c.wilaya
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
  `;
  const params = [];
  if (status) {
    query += ' WHERE o.status = ?';
    params.push(status);
  }
  query += ' ORDER BY o.created_at DESC';

  const orders = db.prepare(query).all(...params);
  res.json({ orders });
});

/* PUT /api/orders/:id/status — Fatima confirms payment / marks delivered */
router.put('/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending_whatsapp', 'confirmed', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'حالة غير صالحة' });
  }

  const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'الطلب غير موجود' });

  db.prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, req.params.id);
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  res.json({ order });
});

module.exports = router;
