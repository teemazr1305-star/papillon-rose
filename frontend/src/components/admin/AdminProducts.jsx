import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api, productImageUrl } from '../../utils/api';
import { PlusIcon, EditIcon, TrashIcon, CheckIcon, CloseIcon, ImageIcon } from '../icons';

function ProductForm({ product, categories, token, onSaved, onCancel }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    title_ar: product?.title_ar || '',
    title_fr: product?.title_fr || '',
    title_en: product?.title_en || '',
    short_description: product?.short_description || '',
    description: product?.description || '',
    price: product?.price || '',
    compare_at_price: product?.compare_at_price || '',
    category_id: product?.category_id || '',
    cover_image: product?.cover_image || '',
    file_format: product?.file_format || 'PDF',
    page_count: product?.page_count || '',
    language: product?.language || 'AR/FR',
    is_featured: product?.is_featured || false,
    stock_status: product?.stock_status || 'available',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleCoverUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await api.uploadCover(token, file);
      set('cover_image', data.filename);
    } catch (err) { setError(err.message); }
    finally { setUploading(false); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title_ar || !form.price || !form.cover_image) {
      setError('العنوان بالعربية، السعر، وصورة الغلاف مطلوبة');
      return;
    }
    setSaving(true); setError('');
    try {
      const payload = { ...form, price: Number(form.price), compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null, category_id: form.category_id || null, page_count: form.page_count ? Number(form.page_count) : null };
      if (isEdit) await api.updateProduct(token, product.id, payload);
      else await api.createProduct(token, payload);
      onSaved();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="admin-form-overlay">
      <div className="admin-form-panel">
        <div className="admin-form-header">
          <h2 className="admin-section-title">{isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
          <button className="btn-icon" onClick={onCancel}><CloseIcon size={18} /></button>
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="field" style={{ gridColumn: '1/-1' }}>
              <label>صورة الغلاف *</label>
              <div className="admin-cover-upload">
                {form.cover_image && <img src={productImageUrl(form.cover_image)} alt="غلاف" className="admin-cover-preview" />}
                <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                  <ImageIcon size={15} /> {uploading ? 'جارٍ الرفع...' : 'رفع صورة'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverUpload} />
                </label>
                {form.cover_image && <span className="text-muted" style={{ fontSize: 'var(--fs-xs)' }}>{form.cover_image}</span>}
              </div>
            </div>
            <div className="field">
              <label>العنوان بالعربية *</label>
              <input type="text" value={form.title_ar} onChange={(e) => set('title_ar', e.target.value)} required />
            </div>
            <div className="field">
              <label>العنوان بالفرنسية</label>
              <input type="text" value={form.title_fr} onChange={(e) => set('title_fr', e.target.value)} />
            </div>
            <div className="field">
              <label>السعر (دج) *</label>
              <input type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} required />
            </div>
            <div className="field">
              <label>السعر قبل الخصم (اختياري)</label>
              <input type="number" min="0" value={form.compare_at_price} onChange={(e) => set('compare_at_price', e.target.value)} />
            </div>
            <div className="field">
              <label>الفئة</label>
              <select value={form.category_id} onChange={(e) => set('category_id', e.target.value)}>
                <option value="">بدون فئة</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
              </select>
            </div>
            <div className="field">
              <label>حالة التوفر</label>
              <select value={form.stock_status} onChange={(e) => set('stock_status', e.target.value)}>
                <option value="available">متوفر</option>
                <option value="coming_soon">قريبًا</option>
              </select>
            </div>
            <div className="field">
              <label>صيغة الملف</label>
              <input type="text" value={form.file_format} onChange={(e) => set('file_format', e.target.value)} placeholder="PDF" />
            </div>
            <div className="field">
              <label>عدد الصفحات</label>
              <input type="number" min="1" value={form.page_count} onChange={(e) => set('page_count', e.target.value)} />
            </div>
            <div className="field">
              <label>اللغة</label>
              <input type="text" value={form.language} onChange={(e) => set('language', e.target.value)} placeholder="AR/FR" />
            </div>
            <div className="field" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="featured" checked={form.is_featured} onChange={(e) => set('is_featured', e.target.checked)} />
              <label htmlFor="featured" style={{ marginBottom: 0 }}>منتج مميز (يظهر في الواجهة)</label>
            </div>
            <div className="field" style={{ gridColumn: '1/-1' }}>
              <label>وصف قصير</label>
              <input type="text" value={form.short_description} onChange={(e) => set('short_description', e.target.value)} />
            </div>
            <div className="field" style={{ gridColumn: '1/-1' }}>
              <label>الوصف الكامل</label>
              <textarea rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} />
            </div>
          </div>
          {error && <p className="field-error" style={{ padding: '0.6rem', background: '#FEE8E8', borderRadius: 8 }}>{error}</p>}
          <div className="admin-form-actions">
            <button type="button" className="btn btn-ghost" onClick={onCancel}>إلغاء</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="spinner" /> : <><CheckIcon size={16} /> {isEdit ? 'حفظ التعديلات' : 'إضافة المنتج'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.getProducts({ limit: 100 }),
      api.getCategories(),
    ]).then(([pd, cd]) => {
      setProducts(pd.products);
      setCategories(cd.categories);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(product) {
    if (!window.confirm(`هل أنتِ متأكدة من حذف "${product.title_ar}"؟`)) return;
    setDeletingId(product.id);
    try { await api.deleteProduct(token, product.id); load(); }
    catch (err) { alert(err.message); }
    finally { setDeletingId(null); }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">إدارة المنتجات</h1>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <PlusIcon size={17} /> منتج جديد
        </button>
      </div>

      {loading ? (
        <div className="admin-page-loading"><span className="spinner" style={{ width: 28, height: 28, borderTopColor: 'var(--accent-primary)' }} /></div>
      ) : (
        <div className="admin-section-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>المنتج</th><th>الفئة</th><th>السعر</th><th>الحالة</th><th>المبيعات</th><th>إجراءات</th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img src={productImageUrl(p.cover_image)} alt="" style={{ width: 36, height: 44, objectFit: 'cover', borderRadius: 6 }} />
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{p.title_ar}</p>
                          {p.is_featured && <span className="badge badge-new" style={{ fontSize: '0.6rem' }}>مميز</span>}
                        </div>
                      </div>
                    </td>
                    <td>{p.category_name_ar || '—'}</td>
                    <td>{p.price} دج</td>
                    <td>
                      <span className="admin-status-badge" style={{ '--st-color': p.stock_status === 'available' ? 'var(--accent-success)' : 'var(--text-muted)' }}>
                        {p.stock_status === 'available' ? 'متوفر' : 'قريبًا'}
                      </span>
                    </td>
                    <td>{p.sales_count}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn-icon" style={{ width: 34, height: 34 }} onClick={() => { setEditing(p); setFormOpen(true); }} aria-label="تعديل">
                          <EditIcon size={15} />
                        </button>
                        <button className="btn-icon" style={{ width: 34, height: 34, color: 'var(--accent-danger)' }} onClick={() => handleDelete(p)} disabled={deletingId === p.id} aria-label="حذف">
                          {deletingId === p.id ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <TrashIcon size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {formOpen && (
        <ProductForm
          product={editing}
          categories={categories}
          token={token}
          onSaved={() => { setFormOpen(false); load(); }}
          onCancel={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}
