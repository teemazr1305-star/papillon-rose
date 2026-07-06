const express = require('express');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

/* GET /api/dashboard/stats — overview numbers for the admin home screen */
router.get('/stats', requireAdmin, (req, res) => {
  const totalProducts = db.prepare('SELECT COUNT(*) AS c FROM products WHERE is_active = 1').get().c;
  const totalOrders = db.prepare('SELECT COUNT(*) AS c FROM orders').get().c;
  const pendingOrders = db.prepare("SELECT COUNT(*) AS c FROM orders WHERE status = 'pending_whatsapp'").get().c;
  const confirmedRevenue = db
    .prepare("SELECT COALESCE(SUM(total), 0) AS sum FROM orders WHERE status IN ('confirmed', 'delivered')")
    .get().sum;

  const topProducts = db
    .prepare(`
      SELECT id, title_ar, slug, cover_image, sales_count, price
      FROM products
      WHERE is_active = 1
      ORDER BY sales_count DESC
      LIMIT 5
    `)
    .all();

  const recentOrders = db
    .prepare(`
      SELECT o.id, o.order_number, o.total, o.status, o.created_at, c.full_name, c.phone
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      ORDER BY o.created_at DESC
      LIMIT 5
    `)
    .all();

  res.json({
    stats: {
      total_products: totalProducts,
      total_orders: totalOrders,
      pending_orders: pendingOrders,
      confirmed_revenue: confirmedRevenue,
    },
    top_products: topProducts,
    recent_orders: recentOrders,
  });
});

module.exports = router;
