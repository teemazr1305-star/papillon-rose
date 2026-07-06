const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db/database');
const { signAdminToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/* POST /api/auth/login */
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });
  }

  const admin = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email);
  if (!admin) {
    return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
  }

  const valid = bcrypt.compareSync(password, admin.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
  }

  const token = signAdminToken(admin);
  res.json({
    token,
    admin: { id: admin.id, email: admin.email, full_name: admin.full_name },
  });
});

/* GET /api/auth/me — verify current token, used to keep dashboard session alive */
router.get('/me', requireAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

/* PUT /api/auth/password — change password from dashboard */
router.put('/password', requireAdmin, (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) {
    return res.status(400).json({ error: 'كلمة المرور الحالية والجديدة مطلوبتان' });
  }
  if (new_password.length < 6) {
    return res.status(400).json({ error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' });
  }

  const admin = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(req.admin.id);
  const valid = bcrypt.compareSync(current_password, admin.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'كلمة المرور الحالية غير صحيحة' });
  }

  const newHash = bcrypt.hashSync(new_password, 10);
  db.prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?').run(newHash, admin.id);
  res.json({ message: 'تم تغيير كلمة المرور بنجاح' });
});

module.exports = router;
