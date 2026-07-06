const express = require('express');
const slugify = require('slugify');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

/* GET /api/categories — public, with product counts */
router.get('/', (req, res) => {
  const categories = db
    .prepare(`
      SELECT
        c.*,
        (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = 1) AS product_count
      FROM categories c
      WHERE c.is_active = 1
      ORDER BY c.display_order ASC
    `)
    .all();
  res.json({ categories });
});

/* GET /api/categories/:slug */
router.get('/:slug', (req, res) => {
  const category = db.prepare('SELECT * FROM categories WHERE slug = ? AND is_active = 1').get(req.params.slug);
  if (!category) return res.status(404).json({ error: 'الفئة غير موجودة' });
  res.json({ category });
});

/* ---------- ADMIN ---------- */

router.post('/', requireAdmin, (req, res) => {
  const { name_ar, name_fr, name_en, description, icon, display_order } = req.body;
  if (!name_ar) return res.status(400).json({ error: 'اسم الفئة بالعربية مطلوب' });

  let slug = slugify(name_en || name_fr || name_ar, { lower: true, strict: true });
  const exists = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug);
  if (exists) slug = `${slug}-${Date.now()}`;

  const info = db
    .prepare(`
      INSERT INTO categories (name_ar, name_fr, name_en, slug, description, icon, display_order)
      VALUES (@name_ar, @name_fr, @name_en, @slug, @description, @icon, @display_order)
    `)
    .run({
      name_ar,
      name_fr: name_fr || null,
      name_en: name_en || null,
      slug,
      description: description || null,
      icon: icon || 'tag',
      display_order: display_order || 0,
    });

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ category });
});

router.put('/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'الفئة غير موجودة' });

  const fields = ['name_ar', 'name_fr', 'name_en', 'description', 'icon', 'display_order', 'is_active'];
  const updates = {};
  for (const f of fields) {
    if (req.body[f] !== undefined) {
      updates[f] = f === 'is_active' ? (req.body[f] ? 1 : 0) : req.body[f];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'لا توجد تغييرات لحفظها' });
  }

  const setClause = Object.keys(updates).map((k) => `${k} = @${k}`).join(', ');
  db.prepare(`UPDATE categories SET ${setClause}, updated_at = datetime('now') WHERE id = @id`)
    .run({ ...updates, id: req.params.id });

  const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  res.json({ category });
});

router.delete('/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'الفئة غير موجودة' });

  const productCount = db.prepare('SELECT COUNT(*) AS c FROM products WHERE category_id = ?').get(req.params.id).c;
  if (productCount > 0) {
    return res.status(400).json({
      error: `لا يمكن حذف هذه الفئة لأنها تحتوي على ${productCount} منتج. قم بنقل المنتجات أولاً أو احذفها.`,
    });
  }

  db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
  res.json({ message: 'تم حذف الفئة' });
});

module.exports = router;
