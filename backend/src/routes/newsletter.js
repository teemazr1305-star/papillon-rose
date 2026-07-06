const express = require('express');
const { db } = require('../db/database');

const router = express.Router();

/* POST /api/newsletter — subscribe */
router.post('/', (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'البريد الإلكتروني غير صالح' });
  }

  try {
    db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)').run(email.toLowerCase().trim());
    res.status(201).json({ message: 'تم الاشتراك بنجاح 🦋' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(200).json({ message: 'أنتِ مشتركة بالفعل في نشرتنا 💌' });
    }
    res.status(500).json({ error: 'حدث خطأ، حاولي مرة أخرى' });
  }
});

module.exports = router;
