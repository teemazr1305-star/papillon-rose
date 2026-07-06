/**
 * Database connection + schema bootstrap.
 *
 * Uses better-sqlite3: a real, synchronous, file-backed SQL database.
 * It is production-grade for small/medium stores (many real Etsy-scale
 * shops run on SQLite). If you outgrow it, the schema below uses
 * standard SQL so migrating to PostgreSQL later is a straightforward
 * port — same tables, same columns, swap the driver in this file only.
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'papillon_rose.sqlite');

// Make sure the folder exists (useful if DB_PATH is nested)
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// Sensible production pragmas for SQLite
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function init() {
  db.exec(`
    -- ===========================================================
    -- CATEGORIES
    -- Categories are fully dynamic: Fatima can add/edit/delete
    -- them from the admin dashboard, no code changes ever needed.
    -- ===========================================================
    CREATE TABLE IF NOT EXISTS categories (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name_ar       TEXT NOT NULL,
      name_fr       TEXT,
      name_en       TEXT,
      slug          TEXT NOT NULL UNIQUE,
      description   TEXT,
      icon          TEXT,              -- icon keyword e.g. "planner", "coloring", "printable"
      display_order INTEGER NOT NULL DEFAULT 0,
      is_active     INTEGER NOT NULL DEFAULT 1,
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- ===========================================================
    -- PRODUCTS
    -- The core catalog entity. New products = new rows here,
    -- the storefront renders them automatically. No redesign needed.
    -- ===========================================================
    CREATE TABLE IF NOT EXISTS products (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      title_ar          TEXT NOT NULL,
      title_fr          TEXT,
      title_en          TEXT,
      slug              TEXT NOT NULL UNIQUE,
      short_description TEXT,
      description       TEXT,              -- long description, supports line breaks
      price             REAL NOT NULL,      -- current selling price (DZD)
      compare_at_price  REAL,               -- optional "before discount" price, NULL = no discount
      category_id       INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      cover_image       TEXT NOT NULL,      -- filename in /uploads/products
      file_format       TEXT,               -- e.g. "PDF" or "PDF + PNG"
      page_count        INTEGER,
      language          TEXT,               -- e.g. "AR/FR"
      is_featured       INTEGER NOT NULL DEFAULT 0,
      is_active         INTEGER NOT NULL DEFAULT 1,   -- soft-delete / draft toggle
      stock_status      TEXT NOT NULL DEFAULT 'available', -- available | coming_soon
      rating_avg        REAL NOT NULL DEFAULT 0,
      rating_count      INTEGER NOT NULL DEFAULT 0,
      sales_count       INTEGER NOT NULL DEFAULT 0,
      created_at        TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
    CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);

    -- ===========================================================
    -- PRODUCT IMAGES (one-to-many: each product can have many
    -- preview images, ordered for the gallery / lightbox)
    -- ===========================================================
    CREATE TABLE IF NOT EXISTS product_images (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id    INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      image_path    TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      alt_text      TEXT,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

    -- ===========================================================
    -- PRODUCT DOWNLOAD FILES
    -- The actual deliverable(s) sent/unlocked after a confirmed order.
    -- Kept separate from preview images on purpose.
    -- ===========================================================
    CREATE TABLE IF NOT EXISTS product_files (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id    INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      file_path     TEXT NOT NULL,
      file_label    TEXT,              -- e.g. "Planner PDF - A4"
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- ===========================================================
    -- CUSTOMERS (lightweight — no password required, just identity
    -- captured at checkout time for order contact / WhatsApp)
    -- ===========================================================
    CREATE TABLE IF NOT EXISTS customers (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name     TEXT NOT NULL,
      phone         TEXT NOT NULL,
      email         TEXT,
      wilaya        TEXT,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- ===========================================================
    -- ORDERS
    -- Created the moment a customer confirms checkout. Status starts
    -- as "pending_whatsapp" until Fatima confirms payment manually,
    -- then she flips it from the admin dashboard.
    -- ===========================================================
    CREATE TABLE IF NOT EXISTS orders (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number    TEXT NOT NULL UNIQUE,   -- human-friendly e.g. PR-20260630-0001
      customer_id     INTEGER NOT NULL REFERENCES customers(id),
      subtotal        REAL NOT NULL,
      total           REAL NOT NULL,
      payment_method  TEXT NOT NULL DEFAULT 'whatsapp', -- whatsapp | chargily (future)
      status          TEXT NOT NULL DEFAULT 'pending_whatsapp',
      -- pending_whatsapp -> confirmed -> delivered   (or) -> cancelled
      customer_note   TEXT,
      created_at      TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
    CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);

    -- ===========================================================
    -- ORDER ITEMS (line items, snapshot of price at purchase time
    -- so future price edits never rewrite order history)
    -- ===========================================================
    CREATE TABLE IF NOT EXISTS order_items (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id      INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id    INTEGER REFERENCES products(id) ON DELETE SET NULL,
      product_title TEXT NOT NULL,        -- snapshot, survives product edits/deletes
      unit_price    REAL NOT NULL,        -- snapshot
      quantity      INTEGER NOT NULL DEFAULT 1
    );

    CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

    -- ===========================================================
    -- REVIEWS
    -- ===========================================================
    CREATE TABLE IF NOT EXISTS reviews (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id    INTEGER REFERENCES products(id) ON DELETE CASCADE,
      customer_name TEXT NOT NULL,
      rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment       TEXT,
      is_approved   INTEGER NOT NULL DEFAULT 1,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);

    -- ===========================================================
    -- NEWSLETTER SUBSCRIBERS
    -- ===========================================================
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      email         TEXT NOT NULL UNIQUE,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- ===========================================================
    -- ADMIN USERS (for dashboard login)
    -- ===========================================================
    CREATE TABLE IF NOT EXISTS admin_users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      full_name     TEXT,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

module.exports = { db, init };
