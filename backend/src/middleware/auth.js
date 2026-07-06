const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production';

/**
 * Protects admin-only routes. Expects:
 *   Authorization: Bearer <token>
 */
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'يجب تسجيل الدخول للوصول إلى لوحة التحكم' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول من جديد' });
  }
}

function signAdminToken(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email, full_name: admin.full_name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = { requireAdmin, signAdminToken, JWT_SECRET };
