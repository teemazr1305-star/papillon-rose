const express = require('express');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

/* GET /api/reviews — recent approved reviews across all products (for homepage) */
router.get('/', (req, res) => {
  const { limit = 9 } = req.query;
  const reviews = db
    .prepare(`
      SELECT r.*, p.title_ar AS product_title, p.slug AS product_slug
      FROM reviews r
      JOIN products p ON p.id = r.product_id
      WHERE r.is_approved = 1
      ORDER BY r.created_at DESC
      LIMIT ?
    `)
    .all(Number(limit));
  res.json({ reviews });
});

/* POST /api/reviews — customer submits a review for a product */
router.post('/', (req, res) => {
  const { product_id, customer_name, rating, comment } = req.body;

  if (!product_id || !customer_name || !rating) {
    return res.status(400).json({ error: 'المنتج، الاسم، والتقييم مطلوبون' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'التقييم يجب أن يكون بين 1 و 5' });
  }

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
  if (!product) return res.status(404).json({ error: 'المنتج غير موجود' });

  const info = db
    .prepare('INSERT INTO reviews (product_id, customer_name, rating, comment) VALUES (?, ?, ?, ?)')
    .run(product_id, customer_name, rating, comment || null);

  // Recalculate product rating average
  const stats = db
    .prepare('SELECT AVG(rating) AS avg, COUNT(*) AS count FROM reviews WHERE product_id = ? AND is_approved = 1')
    .get(product_id);
  db.prepare('UPDATE products SET rating_avg = ?, rating_count = ? WHERE id = ?')
    .run(Math.round(stats.avg * 10) / 10, stats.count, product_id);

  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ review });
});

/* ---------- ADMIN ---------- */

router.delete('/:id', requireAdmin, (req, res) => {
  const review = db.prepare('SELECT * FROM reviews WHERE id = ?').get(req.params.id);
  if (!review) return res.status(404).json({ error: 'التقييم غير موجود' });

  db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);

  const stats = db
    .prepare('SELECT AVG(rating) AS avg, COUNT(*) AS count FROM reviews WHERE product_id = ? AND is_approved = 1')
    .get(review.product_id);
  db.prepare('UPDATE products SET rating_avg = ?, rating_count = ? WHERE id = ?')
    .run(stats.avg || 0, stats.count, review.product_id);

  res.json({ message: 'تم حذف التقييم' });
});

module.exports = router;
