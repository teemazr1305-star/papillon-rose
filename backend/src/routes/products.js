const express = require('express');
const slugify = require('slugify');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

/**
 * Helper: turn a raw product row + its images into the shape
 * the frontend expects.
 */
function attachImages(product) {
  const images = db
    .prepare('SELECT id, image_path, alt_text FROM product_images WHERE product_id = ? ORDER BY display_order ASC')
    .all(product.id);
  return { ...product, images: images.map((i) => i.image_path), is_featured: !!product.is_featured, is_active: !!product.is_active };
}

/* ============================================================
 * GET /api/products
 * Public listing with search, category filter, price range,
 * sorting, and pagination — powers the Shop page.
 * ========================================================== */
router.get('/', (req, res) => {
  const {
    q,              // search query
    category,       // category slug
    min_price,
    max_price,
    sort = 'newest', // newest | price_asc | price_desc | popular | rating
    featured,       // '1' to only return featured products
    page = 1,
    limit = 12,
  } = req.query;

  const where = ['p.is_active = 1'];
  const params = {};

  if (q) {
    where.push('(p.title_ar LIKE @q OR p.title_fr LIKE @q OR p.title_en LIKE @q OR p.short_description LIKE @q)');
    params.q = `%${q}%`;
  }

  if (category) {
    where.push('c.slug = @category');
    params.category = category;
  }

  if (min_price) {
    where.push('p.price >= @min_price');
    params.min_price = Number(min_price);
  }

  if (max_price) {
    where.push('p.price <= @max_price');
    params.max_price = Number(max_price);
  }

  if (featured === '1') {
    where.push('p.is_featured = 1');
  }

  const sortMap = {
    newest: 'p.created_at DESC',
    price_asc: 'p.price ASC',
    price_desc: 'p.price DESC',
    popular: 'p.sales_count DESC',
    rating: 'p.rating_avg DESC',
  };
  const orderBy = sortMap[sort] || sortMap.newest;

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const perPage = Math.min(Number(limit) || 12, 48);
  const offset = (Math.max(Number(page), 1) - 1) * perPage;

  const totalRow = db
    .prepare(`
      SELECT COUNT(*) AS count
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ${whereClause}
    `)
    .get(params);

  const rows = db
    .prepare(`
      SELECT p.*, c.slug AS category_slug, c.name_ar AS category_name_ar, c.name_fr AS category_name_fr
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT @limit OFFSET @offset
    `)
    .all({ ...params, limit: perPage, offset });

  res.json({
    products: rows.map(attachImages),
    pagination: {
      total: totalRow.count,
      page: Number(page),
      limit: perPage,
      total_pages: Math.ceil(totalRow.count / perPage),
    },
  });
});

/* ============================================================
 * GET /api/products/:slug
 * Single product detail page data.
 * ========================================================== */
router.get('/:slug', (req, res) => {
  const product = db
    .prepare(`
      SELECT p.*, c.slug AS category_slug, c.name_ar AS category_name_ar, c.name_fr AS category_name_fr
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.slug = ? AND p.is_active = 1
    `)
    .get(req.params.slug);

  if (!product) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }

  const reviews = db
    .prepare('SELECT id, customer_name, rating, comment, created_at FROM reviews WHERE product_id = ? AND is_approved = 1 ORDER BY created_at DESC')
    .all(product.id);

  const related = db
    .prepare(`
      SELECT p.*, c.slug AS category_slug
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1
      LIMIT 4
    `)
    .all(product.category_id, product.id);

  res.json({
    product: attachImages(product),
    reviews,
    related: related.map(attachImages),
  });
});

/* ============================================================
 * ADMIN ROUTES — require Bearer token
 * ========================================================== */

// CREATE
router.post('/', requireAdmin, (req, res) => {
  const {
    title_ar, title_fr, title_en, short_description, description,
    price, compare_at_price, category_id, cover_image, file_format,
    page_count, language, is_featured, stock_status,
  } = req.body;

  if (!title_ar || !price || !cover_image) {
    return res.status(400).json({ error: 'العنوان بالعربية، السعر، وصورة الغلاف مطلوبة' });
  }

  let slug = slugify(title_en || title_fr || title_ar, { lower: true, strict: true });
  // ensure uniqueness
  const exists = db.prepare('SELECT id FROM products WHERE slug = ?').get(slug);
  if (exists) slug = `${slug}-${Date.now()}`;

  const info = db
    .prepare(`
      INSERT INTO products (
        title_ar, title_fr, title_en, slug, short_description, description,
        price, compare_at_price, category_id, cover_image, file_format,
        page_count, language, is_featured, stock_status
      ) VALUES (
        @title_ar, @title_fr, @title_en, @slug, @short_description, @description,
        @price, @compare_at_price, @category_id, @cover_image, @file_format,
        @page_count, @language, @is_featured, @stock_status
      )
    `)
    .run({
      title_ar,
      title_fr: title_fr || null,
      title_en: title_en || null,
      slug,
      short_description: short_description || null,
      description: description || null,
      price,
      compare_at_price: compare_at_price || null,
      category_id: category_id || null,
      cover_image,
      file_format: file_format || null,
      page_count: page_count || null,
      language: language || null,
      is_featured: is_featured ? 1 : 0,
      stock_status: stock_status || 'available',
    });

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ product: attachImages(product) });
});

// UPDATE
router.put('/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'المنتج غير موجود' });

  const fields = [
    'title_ar', 'title_fr', 'title_en', 'short_description', 'description',
    'price', 'compare_at_price', 'category_id', 'cover_image', 'file_format',
    'page_count', 'language', 'is_featured', 'is_active', 'stock_status',
  ];

  const updates = {};
  for (const f of fields) {
    if (req.body[f] !== undefined) {
      updates[f] = (f === 'is_featured' || f === 'is_active') ? (req.body[f] ? 1 : 0) : req.body[f];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'لا توجد تغييرات لحفظها' });
  }

  const setClause = Object.keys(updates).map((k) => `${k} = @${k}`).join(', ');
  db.prepare(`UPDATE products SET ${setClause}, updated_at = datetime('now') WHERE id = @id`)
    .run({ ...updates, id: req.params.id });

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json({ product: attachImages(product) });
});

// DELETE (soft delete by default, hard delete with ?hard=1)
router.delete('/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'المنتج غير موجود' });

  if (req.query.hard === '1') {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    return res.json({ message: 'تم حذف المنتج نهائيًا' });
  }

  db.prepare("UPDATE products SET is_active = 0, updated_at = datetime('now') WHERE id = ?").run(req.params.id);
  res.json({ message: 'تم إخفاء المنتج' });
});

// ADD PREVIEW IMAGES to a product
router.post('/:id/images', requireAdmin, upload.array('images', 10), (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'المنتج غير موجود' });

  const insert = db.prepare(`
    INSERT INTO product_images (product_id, image_path, display_order, alt_text)
    VALUES (@product_id, @image_path, @display_order, @alt_text)
  `);

  const currentCount = db.prepare('SELECT COUNT(*) AS c FROM product_images WHERE product_id = ?').get(product.id).c;

  const files = req.files || [];
  files.forEach((file, idx) => {
    insert.run({
      product_id: product.id,
      image_path: file.filename,
      display_order: currentCount + idx,
      alt_text: product.title_ar,
    });
  });

  const images = db.prepare('SELECT id, image_path FROM product_images WHERE product_id = ? ORDER BY display_order ASC').all(product.id);
  res.status(201).json({ images });
});

// DELETE a single preview image
router.delete('/images/:imageId', requireAdmin, (req, res) => {
  const image = db.prepare('SELECT * FROM product_images WHERE id = ?').get(req.params.imageId);
  if (!image) return res.status(404).json({ error: 'الصورة غير موجودة' });

  db.prepare('DELETE FROM product_images WHERE id = ?').run(req.params.imageId);
  res.json({ message: 'تم حذف الصورة' });
});

// UPLOAD a cover image (returns filename to use as cover_image)
router.post('/upload-cover', requireAdmin, upload.single('cover'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'لم يتم رفع أي صورة' });
  res.status(201).json({ filename: req.file.filename });
});

module.exports = router;
