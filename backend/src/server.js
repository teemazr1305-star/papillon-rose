require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const { init } = require('./db/database');

// Make sure DB tables exist before anything else runs
init();

const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const ordersRouter = require('./routes/orders');
const reviewsRouter = require('./routes/reviews');
const authRouter = require('./routes/auth');
const newsletterRouter = require('./routes/newsletter');
const dashboardRouter = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded product images statically
const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(path.join(uploadsDir, 'products'), { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', store: 'Papillon Rose API', time: new Date().toISOString() });
});

// API routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/auth', authRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/dashboard', dashboardRouter);

// 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'هذا المسار غير موجود' });
});

// Centralized error handler (catches multer errors, thrown errors, etc.)
app.use((err, req, res, next) => {
  console.error(err);
  if (err.message && err.message.includes('صيغة الصورة')) {
    return res.status(400).json({ error: err.message });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'حجم الصورة كبير جدًا (الحد الأقصى 8 ميغابايت)' });
  }
  res.status(500).json({ error: 'حدث خطأ في الخادم، حاولي مرة أخرى' });
});

app.listen(PORT, () => {
  console.log(`
  🦋  Papillon Rose API يعمل الآن
  ───────────────────────────────
  Local:    http://localhost:${PORT}
  Health:   http://localhost:${PORT}/api/health
  Uploads:  http://localhost:${PORT}/uploads
  `);
});
