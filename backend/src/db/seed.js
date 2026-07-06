/**
 * Seed script — populates the database with starter categories and
 * a small set of real-looking products so the storefront isn't empty
 * on first run. Run with: npm run seed
 *
 * Safe to re-run: it clears existing rows first.
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { db, init } = require('./database');

init();

console.log('🌱 Seeding Papillon Rose database...');

const trx = db.transaction(() => {
  // Clear existing data (order matters because of foreign keys)
  db.exec(`
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM customers;
    DELETE FROM reviews;
    DELETE FROM product_files;
    DELETE FROM product_images;
    DELETE FROM products;
    DELETE FROM categories;
    DELETE FROM newsletter_subscribers;
    DELETE FROM admin_users;
  `);

  // ---------- Categories ----------
  const insertCategory = db.prepare(`
    INSERT INTO categories (name_ar, name_fr, name_en, slug, description, icon, display_order)
    VALUES (@name_ar, @name_fr, @name_en, @slug, @description, @icon, @display_order)
  `);

  const categories = [
    {
      name_ar: 'بلانرز',
      name_fr: 'Planners',
      name_en: 'Planners',
      slug: 'planners',
      description: 'بلانرز رقمية أنيقة لتنظيم يومك، مشاريعك، وأهدافك',
      icon: 'planner',
      display_order: 1,
    },
    {
      name_ar: 'كتب تلوين',
      name_fr: 'Coloriages',
      name_en: 'Coloring Books',
      slug: 'coloring-books',
      description: 'صفحات تلوين هادئة بطابع جزائري ودافئ',
      icon: 'coloring',
      display_order: 2,
    },
    {
      name_ar: 'قوالب قابلة للطباعة',
      name_fr: 'Imprimables',
      name_en: 'Printables',
      slug: 'printables',
      description: 'قوالب جاهزة للطباعة المنزلية أو الاحترافية',
      icon: 'printable',
      display_order: 3,
    },
    {
      name_ar: 'قوالب تصميم',
      name_fr: 'Templates',
      name_en: 'Templates',
      slug: 'templates',
      description: 'قوالب Canva وتصاميم جاهزة لعملك أو علامتك',
      icon: 'template',
      display_order: 4,
    },
  ];

  const categoryIds = {};
  for (const cat of categories) {
    const info = insertCategory.run(cat);
    categoryIds[cat.slug] = info.lastInsertRowid;
  }

  // ---------- Products ----------
  const insertProduct = db.prepare(`
    INSERT INTO products (
      title_ar, title_fr, title_en, slug, short_description, description,
      price, compare_at_price, category_id, cover_image, file_format,
      page_count, language, is_featured, is_active, stock_status,
      rating_avg, rating_count, sales_count
    ) VALUES (
      @title_ar, @title_fr, @title_en, @slug, @short_description, @description,
      @price, @compare_at_price, @category_id, @cover_image, @file_format,
      @page_count, @language, @is_featured, @is_active, @stock_status,
      @rating_avg, @rating_count, @sales_count
    )
  `);

  const insertImage = db.prepare(`
    INSERT INTO product_images (product_id, image_path, display_order, alt_text)
    VALUES (@product_id, @image_path, @display_order, @alt_text)
  `);

  const products = [
    {
      title_ar: 'بلانر Becoming Her',
      title_fr: 'Planner Becoming Her',
      title_en: 'Becoming Her Planner',
      slug: 'becoming-her-planner',
      short_description: 'بلانر شامل لتطوير الذات والتنظيم اليومي بطابع نباتي أنيق',
      description: `بلانر "Becoming Her" مصمم لكل امرأة تسعى لتنظيم حياتها بأناقة وهدوء.

يحتوي على صفحات لتخطيط اليوم، الأسبوع، والشهر، بالإضافة إلى متتبعات للعادات، الأهداف، والامتنان اليومي.

مناسب للطباعة المنزلية أو الاستخدام الرقمي على iPad أو تابلت بتطبيقات مثل GoodNotes.`,
      price: 800,
      compare_at_price: 1200,
      category_id: categoryIds['planners'],
      cover_image: 'becoming-her-cover.png',
      file_format: 'PDF',
      page_count: 45,
      language: 'AR/FR',
      is_featured: 1,
      is_active: 1,
      stock_status: 'available',
      rating_avg: 4.9,
      rating_count: 23,
      sales_count: 67,
    },
    {
      title_ar: 'بلانر رزق - تتبع الطلبات',
      title_fr: 'Planner Rizq - Suivi Commandes',
      title_en: 'Rizq Order Tracker Planner',
      slug: 'rizq-order-tracker',
      short_description: 'بلانر مخصص لأصحاب المشاريع الصغيرة لتتبع الطلبات والأرباح',
      description: `بلانر "رزق" صُمم خصيصًا لأصحاب المشاريع الصغيرة والمتاجر الإلكترونية.

يساعدك على تتبع كل طلب، حالة الدفع، الشحن، والأرباح الشهرية بطريقة منظمة وبصرية مريحة.

مثالي لمن يبيع عبر إنستغرام أو واتساب ويحتاج نظام بسيط وفعال.`,
      price: 600,
      compare_at_price: null,
      category_id: categoryIds['planners'],
      cover_image: 'rizq-planner-cover.png',
      file_format: 'PDF',
      page_count: 30,
      language: 'AR',
      is_featured: 1,
      is_active: 1,
      stock_status: 'available',
      rating_avg: 5.0,
      rating_count: 14,
      sales_count: 41,
    },
    {
      title_ar: 'كتاب تلوين جزائري دافئ',
      title_fr: 'Cahier de Coloriage Algérien Cosy',
      title_en: 'Cozy Algerian Coloring Book',
      slug: 'cozy-algerian-coloring-book',
      short_description: 'صفحات تلوين بطابع جزائري دافئ، رسومات بسيطة وهادئة',
      description: `مجموعة صفحات تلوين مستوحاة من التراث والحياة اليومية الجزائرية، برسم بسيط وأسلوب "cozy doodle" أوروبي هادئ.

مثالية لأوقات الاسترخاء، أو كهدية، أو حتى للطباعة وبيعها في المكتبات.

التصاميم خالية من تفاصيل الوجه المعقدة، تركز على الأجواء الدافئة والعناصر الزخرفية.`,
      price: 450,
      compare_at_price: 650,
      category_id: categoryIds['coloring-books'],
      cover_image: 'coloring-book-cover.png',
      file_format: 'PDF',
      page_count: 20,
      language: 'بدون نص',
      is_featured: 1,
      is_active: 1,
      stock_status: 'available',
      rating_avg: 4.8,
      rating_count: 9,
      sales_count: 28,
    },
    {
      title_ar: 'بلانر الصيف الشامل',
      title_fr: 'Planner Été Complet',
      title_en: 'Complete Summer Planner',
      slug: 'complete-summer-planner',
      short_description: 'خطط صيفك بالكامل: أهداف، لياقة، تعلم، واسترخاء',
      description: `بلانر مصمم خصيصًا لموسم الصيف، يساعدك على تنظيم وقتك بين الراحة وتحقيق أهدافك الشخصية.

يشمل صفحات لتخطيط الرحلات، متتبع القراءة، أهداف اللياقة، وقائمة "أشياء أريد تعلمها هذا الصيف".`,
      price: 700,
      compare_at_price: null,
      category_id: categoryIds['planners'],
      cover_image: 'summer-planner-cover.png',
      file_format: 'PDF',
      page_count: 38,
      language: 'AR/FR/EN',
      is_featured: 0,
      is_active: 1,
      stock_status: 'available',
      rating_avg: 4.7,
      rating_count: 11,
      sales_count: 19,
    },
    {
      title_ar: 'قالب بطاقات Instagram للمشاريع الصغيرة',
      title_fr: 'Templates Instagram pour Petites Entreprises',
      title_en: 'Instagram Templates for Small Business',
      slug: 'instagram-templates-small-business',
      short_description: 'مجموعة قوالب Canva جاهزة للتعديل لصفحتك على إنستغرام',
      description: `حزمة من 20 قالب Canva بتصميم أنيق ومتناسق، جاهزة لإضافة شعارك ومنتجاتك مباشرة.

تشمل قوالب لعروض المنتجات، الاقتباسات، الإعلانات عن خصومات، وقصص (Stories).

كل قالب قابل للتعديل بالكامل: الألوان، الخطوط، والصور.`,
      price: 550,
      compare_at_price: 800,
      category_id: categoryIds['templates'],
      cover_image: 'instagram-templates-cover.png',
      file_format: 'Canva Link + PNG',
      page_count: 20,
      language: 'بدون نص',
      is_featured: 1,
      is_active: 1,
      stock_status: 'available',
      rating_avg: 4.9,
      rating_count: 17,
      sales_count: 53,
    },
    {
      title_ar: 'قوالب فواتير وإيصالات للمشاريع الصغيرة',
      title_fr: 'Modèles de Factures pour Petites Entreprises',
      title_en: 'Invoice Templates for Small Business',
      slug: 'invoice-templates',
      short_description: 'قوالب فواتير وإيصالات أنيقة جاهزة للطباعة أو الإرسال الرقمي',
      description: `مجموعة قوالب فواتير وإيصالات بتصميم بسيط واحترافي، مناسبة لأصحاب المشاريع الصغيرة والمتاجر الإلكترونية.

سهلة التعديل عبر Canva أو Word، وتعطي انطباعًا احترافيًا لعملائك.`,
      price: 350,
      compare_at_price: null,
      category_id: categoryIds['printables'],
      cover_image: 'invoice-templates-cover.png',
      file_format: 'PDF + Canva',
      page_count: 8,
      language: 'AR/FR',
      is_featured: 0,
      is_active: 1,
      stock_status: 'coming_soon',
      rating_avg: 0,
      rating_count: 0,
      sales_count: 0,
    },
  ];

  for (const p of products) {
    const info = insertProduct.run(p);
    const productId = info.lastInsertRowid;

    // Each product gets its cover + 2 extra preview placeholders registered
    // (admin can replace these with real uploads at any time)
    insertImage.run({
      product_id: productId,
      image_path: p.cover_image,
      display_order: 0,
      alt_text: p.title_ar,
    });
  }

  // ---------- Reviews ----------
  const insertReview = db.prepare(`
    INSERT INTO reviews (product_id, customer_name, rating, comment, is_approved, created_at)
    VALUES (@product_id, @customer_name, @rating, @comment, 1, @created_at)
  `);

  const reviews = [
    { slug: 'becoming-her-planner', customer_name: 'سارة ب.', rating: 5, comment: 'بلانر رائع جداً، التصميم هادئ ومريح للعين والتنظيم فيه واضح بزاف. يستاهل تماماً.', created_at: '2026-05-12' },
    { slug: 'becoming-her-planner', customer_name: 'Imene K.', rating: 5, comment: 'Magnifique, exactement ce que je cherchais pour organiser mes journées avec douceur.', created_at: '2026-05-20' },
    { slug: 'rizq-order-tracker', customer_name: 'نور الهدى', rating: 5, comment: 'غيّر طريقة تسييري للطلبات بصراحة، صرت نلقا كلشي بسهولة.', created_at: '2026-06-02' },
    { slug: 'rizq-order-tracker', customer_name: 'Amina T.', rating: 5, comment: 'Très pratique pour mon petit commerce, je le recommande vivement.', created_at: '2026-06-10' },
    { slug: 'cozy-algerian-coloring-book', customer_name: 'هدى م.', rating: 5, comment: 'رسومات حلوة بزاف وهادئة، نديها كل ليلة قبل النوم للاسترخاء.', created_at: '2026-04-28' },
    { slug: 'instagram-templates-small-business', customer_name: 'Lina S.', rating: 5, comment: 'Templates superbes, faciles à personnaliser sur Canva, ma page a l\'air bien plus pro maintenant.', created_at: '2026-06-15' },
    { slug: 'instagram-templates-small-business', customer_name: 'وئام ر.', rating: 4, comment: 'جودة عالية وسهلة الاستعمال، نتمنى يزيدو قوالب أكثر للستوريز.', created_at: '2026-06-18' },
    { slug: 'complete-summer-planner', customer_name: 'Yasmine D.', rating: 4, comment: 'Très joli design, m\'aide à garder un équilibre cet été.', created_at: '2026-06-22' },
  ];

  const findProductIdBySlug = db.prepare('SELECT id FROM products WHERE slug = ?');
  for (const r of reviews) {
    const product = findProductIdBySlug.get(r.slug);
    if (product) {
      insertReview.run({
        product_id: product.id,
        customer_name: r.customer_name,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
      });
    }
  }

  // ---------- Admin user ----------
  // Default login: admin@papillonrose.com / papillon2026
  // ⚠️ Change this password after first login from the dashboard.
  const passwordHash = bcrypt.hashSync('papillon2026', 10);
  db.prepare(`
    INSERT INTO admin_users (email, password_hash, full_name)
    VALUES (?, ?, ?)
  `).run('admin@papillonrose.com', passwordHash, 'Fatima');
});

trx();

console.log('✅ Seed complete!');
console.log('   Categories: 4');
console.log('   Products: 6');
console.log('   Reviews: 8');
console.log('   Admin login → email: admin@papillonrose.com | password: papillon2026');
