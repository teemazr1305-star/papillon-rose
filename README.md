# 🦋 Papillon Rose — دليل التشغيل الكامل

## المتطلبات الأساسية

قبل أي شيء، تأكدي أن Node.js مثبت على جهازك:

1. اذهبي إلى https://nodejs.org
2. حملي النسخة LTS (الأحدث الموصى بها)
3. ثبّتيها بالضغط Next → Next → Install
4. افتحي Terminal (Command Prompt على Windows) واكتبي:
   ```
   node --version
   ```
   يجب أن ترى رقمًا مثل v20.x.x أو أعلى ✅

---

## خطوات التشغيل

### الخطوة 1 — تشغيل الـ Backend (السيرفر)

افتحي Terminal واكتبي:

```bash
cd papillon-rose/backend
npm install
npm run seed
npm run dev
```

✅ يجب أن ترى:
```
🦋  Papillon Rose API يعمل الآن
Local: http://localhost:4000
```

**لا تغلقي هذا الـ Terminal!**

---

### الخطوة 2 — تشغيل الـ Frontend (الموقع)

افتحي Terminal ثانية (Terminal جديد) واكتبي:

```bash
cd papillon-rose/frontend
npm install
npm run dev
```

✅ يجب أن ترى:
```
Local: http://localhost:5173
```

---

### الخطوة 3 — افتحي الموقع

افتحي المتصفح وادخلي على:

- **الموقع الرئيسي:** http://localhost:5173
- **لوحة التحكم (Admin):** http://localhost:5173/admin

---

## بيانات تسجيل الدخول للـ Admin

```
البريد الإلكتروني: admin@papillonrose.com
كلمة المرور:      papillon2026
```

⚠️ **غيّري كلمة المرور من لوحة التحكم مباشرة بعد أول تسجيل دخول!**

---

## إعدادات مهمة قبل النشر الفعلي

افتحي ملف `backend/.env` وعدّلي هاد القيم:

```env
# رقم واتساب الخاص بك (بصيغة دولية بدون + ومسافات)
# مثال: 0550 12 34 56  →  213550123456
STORE_WHATSAPP_NUMBER=213XXXXXXXXX

# مفتاح سري طويل وعشوائي (غيّريه حتمًا!)
JWT_SECRET=ضعي-هنا-نصًا-عشوائيًا-طويلًا-من-60-حرفًا
```

---

## هيكل المشروع

```
papillon-rose/
├── backend/
│   ├── src/
│   │   ├── db/          ← قاعدة البيانات والـ seed
│   │   ├── middleware/  ← المصادقة ورفع الصور
│   │   └── routes/      ← كل الـ API endpoints
│   ├── uploads/         ← صور المنتجات (تُرفع من الـ Admin)
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── images/      ← الشعار والصور الثابتة
    └── src/
        ├── components/  ← Header, Footer, Cart, Admin...
        ├── context/     ← Cart, Wishlist, Auth
        ├── pages/       ← كل صفحات الموقع
        ├── styles/      ← نظام التصميم الكامل
        └── utils/       ← API client
```

---

## كيف تضيفين منتجًا جديدًا؟

1. افتحي http://localhost:5173/admin
2. سجلي دخولك
3. اضغطي على "المنتجات" في القائمة الجانبية
4. اضغطي على "منتج جديد"
5. ارفعي صورة الغلاف، أدخلي البيانات، واضغطي "إضافة المنتج"
6. يظهر المنتج فورًا في المتجر ✅

---

## النشر على الإنترنت (الخطوات العامة)

### خيار 1 — Railway (الأسهل والمجاني)
1. اذهبي إلى https://railway.app
2. أنشئي حسابًا
3. اضغطي "New Project" → "Deploy from GitHub"
4. ارفعي الـ backend و frontend كمشاريع منفصلة

### خيار 2 — Render
1. اذهبي إلى https://render.com
2. Backend: New → Web Service → ارفعي backend
3. Frontend: New → Static Site → ارفعي frontend بعد `npm run build`

---

## ملاحظات تقنية

- **قاعدة البيانات:** SQLite — ملف واحد `papillon_rose.sqlite` في مجلد `backend/src/db/`
- **صور المنتجات:** مخزنة محليًا في `backend/uploads/products/`
- **الـ API:** يعمل على المنفذ 4000 — الـ Frontend يعمل على 5173
- **الـ Proxy:** Vite مُهيأ تلقائيًا لتوجيه `/api` و `/uploads` للـ backend

---

## مشاكل شائعة وحلولها

| المشكلة | الحل |
|---------|------|
| `npm install` يفشل | تأكدي أن Node.js v18+ مثبت |
| الموقع لا يتصل بالـ API | تأكدي أن الـ backend يعمل على port 4000 |
| صور المنتجات لا تظهر | تأكدي أن مجلد `uploads/products/` موجود |
| خطأ "Module not found" | شغّلي `npm install` مجددًا |

---

صُنع بحب 🦋 — Papillon Rose  
Élégance • Douceur • Confiance
