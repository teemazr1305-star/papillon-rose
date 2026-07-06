import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { api, productImageUrl } from '../utils/api';
import { WhatsAppIcon, ShieldIcon, LockIcon } from '../components/icons';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', wilaya: '', customer_note: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  function validate() {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'الاسم مطلوب';
    if (!form.phone.trim()) e.phone = 'رقم الهاتف مطلوب';
    else if (!/^0[5-7]\d{8}$/.test(form.phone.trim())) e.phone = 'رقم هاتف جزائري غير صالح (مثال: 0550123456)';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'البريد الإلكتروني غير صالح';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length) return;

    setLoading(true);
    setServerError('');
    try {
      const data = await api.createOrder({
        ...form,
        items: items.map((it) => ({ product_id: it.id, quantity: it.quantity })),
      });
      clearCart();
      // Open WhatsApp deep link
      window.open(data.whatsapp_url, '_blank');
      navigate(`/order-confirmation/${data.order.order_number}`);
    } catch (err) {
      setServerError(err.message);
      setLoading(false);
    }
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  if (items.length === 0) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h2>سلتك فارغة</h2>
        <p className="text-secondary" style={{ margin: '0.5rem 0 1.5rem' }}>أضيفي منتجات للسلة قبل إتمام الطلب</p>
        <Link to="/shop" className="btn btn-primary">تصفحي المتجر</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <span className="eyebrow">إتمام الطلب</span>
          <h1 className="section-title">بيانات الطلب</h1>
        </div>

        <div className="checkout-layout">
          {/* Form */}
          <form className="checkout-form" onSubmit={handleSubmit} noValidate>
            <div className="checkout-section-card">
              <h3 className="checkout-section-title">بيانات التواصل</h3>
              <div className="checkout-fields">
                <div className="field">
                  <label htmlFor="full_name">الاسم الكامل *</label>
                  <input
                    id="full_name" type="text" value={form.full_name}
                    onChange={(e) => set('full_name', e.target.value)}
                    placeholder="مثال: سارة بن عمار"
                    className={errors.full_name ? 'has-error' : ''}
                  />
                  {errors.full_name && <span className="field-error">{errors.full_name}</span>}
                </div>

                <div className="field">
                  <label htmlFor="phone">رقم الهاتف (واتساب) *</label>
                  <input
                    id="phone" type="tel" value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="0550 12 34 56"
                    className={errors.phone ? 'has-error' : ''}
                  />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>

                <div className="field">
                  <label htmlFor="email">البريد الإلكتروني (اختياري)</label>
                  <input
                    id="email" type="email" value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="sara@example.com"
                    className={errors.email ? 'has-error' : ''}
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="field">
                  <label htmlFor="wilaya">الولاية (اختياري)</label>
                  <input
                    id="wilaya" type="text" value={form.wilaya}
                    onChange={(e) => set('wilaya', e.target.value)}
                    placeholder="مثال: وهران"
                  />
                </div>

                <div className="field" style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="customer_note">ملاحظة للبائعة (اختياري)</label>
                  <textarea
                    id="customer_note" rows={3} value={form.customer_note}
                    onChange={(e) => set('customer_note', e.target.value)}
                    placeholder="أي تفاصيل إضافية تودين إضافتها..."
                  />
                </div>
              </div>
            </div>

            <div className="checkout-whatsapp-info">
              <WhatsAppIcon size={22} />
              <div>
                <strong>كيف يعمل الطلب؟</strong>
                <p className="text-secondary">بعد الضغط على "إرسال الطلب"، سيفتح واتساب تلقائيًا برسالة جاهزة تحتوي على تفاصيل طلبك. أرسليها للبائعة وانتظري التأكيد.</p>
              </div>
            </div>

            {serverError && <p className="field-error" style={{ padding: '0.75rem', background: '#FEE', borderRadius: 8 }}>{serverError}</p>}

            <button type="submit" className="btn btn-primary btn-lg checkout-submit-btn" disabled={loading}>
              {loading
                ? <><span className="spinner" /> جارٍ إنشاء الطلب...</>
                : <><WhatsAppIcon size={20} /> إرسال الطلب عبر واتساب</>
              }
            </button>

            <div className="checkout-trust">
              <ShieldIcon size={15} /> بياناتك محفوظة وآمنة
              <LockIcon size={15} /> لا نحفظ بيانات دفع
            </div>
          </form>

          {/* Order summary */}
          <div className="checkout-summary">
            <div className="checkout-section-card">
              <h3 className="checkout-section-title">ملخص الطلب</h3>
              <div className="checkout-summary-items">
                {items.map((item) => (
                  <div key={item.id} className="checkout-summary-item">
                    <img src={productImageUrl(item.cover_image)} alt={item.title} className="checkout-summary-img" />
                    <div className="checkout-summary-item-info">
                      <p className="checkout-summary-item-title">{item.title}</p>
                      <p className="text-muted" style={{ fontSize: 'var(--fs-xs)' }}>الكمية: {item.quantity}</p>
                    </div>
                    <span className="checkout-summary-item-price">{item.price * item.quantity} دج</span>
                  </div>
                ))}
              </div>
              <div className="checkout-summary-total">
                <span>المجموع</span>
                <span className="checkout-summary-total-value">{subtotal} دج</span>
              </div>
              <p className="text-muted" style={{ fontSize: 'var(--fs-xs)', textAlign: 'center', marginTop: '0.5rem' }}>
                منتجات رقمية — لا توجد رسوم شحن
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
