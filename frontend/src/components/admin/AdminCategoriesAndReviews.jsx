import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { PlusIcon, EditIcon, TrashIcon, CheckIcon, CloseIcon } from '../icons';

// ─────────── CATEGORIES ───────────

function CategoryForm({ category, token, onSaved, onCancel }) {
  const isEdit = !!category;
  const [form, setForm] = useState({ name_ar: category?.name_ar || '', name_fr: category?.name_fr || '', name_en: category?.name_en || '', description: category?.description || '', icon: category?.icon || 'tag', display_order: category?.display_order || 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name_ar) { setError('اسم الفئة بالعربية مطلوب'); return; }
    setSaving(true);
    try {
      if (isEdit) await api.updateCategory(token, category.id, form);
      else await api.createCategory(token, form);
      onSaved();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="admin-form-overlay">
      <div className="admin-form-panel" style={{ maxWidth: 480 }}>
        <div className="admin-form-header">
          <h2 className="admin-section-title">{isEdit ? 'تعديل الفئة' : 'فئة جديدة'}</h2>
          <button className="btn-icon" onClick={onCancel}><CloseIcon size={18} /></button>
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="field"><label>اسم الفئة بالعربية *</label><input type="text" value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} /></div>
          <div className="field"><label>اسم الفئة بالفرنسية</label><input type="text" value={form.name_fr} onChange={(e) => setForm({ ...form, name_fr: e.target.value })} /></div>
          <div className="field"><label>وصف الفئة</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="field"><label>أيقونة</label>
              <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                <option value="planner">planner</option>
                <option value="coloring">coloring</option>
                <option value="printable">printable</option>
                <option value="template">template</option>
                <option value="tag">tag (افتراضي)</option>
              </select>
            </div>
            <div className="field"><label>ترتيب العرض</label><input type="number" min="0" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} /></div>
          </div>
          {error && <p className="field-error">{error}</p>}
          <div className="admin-form-actions">
            <button type="button" className="btn btn-ghost" onClick={onCancel}>إلغاء</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span className="spinner" /> : <><CheckIcon size={16} /> {isEdit ? 'حفظ' : 'إضافة'}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.getCategories().then((d) => setCategories(d.categories)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(cat) {
    if (!window.confirm(`حذف الفئة "${cat.name_ar}"؟`)) return;
    try { await api.deleteCategory(token, cat.id); load(); }
    catch (err) { alert(err.message); }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">إدارة الفئات</h1>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <PlusIcon size={17} /> فئة جديدة
        </button>
      </div>
      {loading ? <div className="admin-page-loading"><span className="spinner" style={{ width: 28, height: 28, borderTopColor: 'var(--accent-primary)' }} /></div> : (
        <div className="admin-section-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>الفئة</th><th>المنتجات</th><th>الترتيب</th><th>إجراءات</th></tr></thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td><p style={{ fontWeight: 600 }}>{c.name_ar}</p><p className="text-muted" style={{ fontSize: 'var(--fs-xs)' }}>{c.name_fr}</p></td>
                    <td>{c.product_count}</td>
                    <td>{c.display_order}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn-icon" style={{ width: 34, height: 34 }} onClick={() => { setEditing(c); setFormOpen(true); }}><EditIcon size={15} /></button>
                        <button className="btn-icon" style={{ width: 34, height: 34, color: 'var(--accent-danger)' }} onClick={() => handleDelete(c)}><TrashIcon size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {formOpen && <CategoryForm category={editing} token={token} onSaved={() => { setFormOpen(false); load(); }} onCancel={() => setFormOpen(false)} />}
    </div>
  );
}

// ─────────── REVIEWS ───────────

export function AdminReviews() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReviews(100).then((d) => setReviews(d.reviews)).finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('حذف هذا التقييم؟')) return;
    try { await api.deleteReview(token, id); setReviews((r) => r.filter((rv) => rv.id !== id)); }
    catch (err) { alert(err.message); }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header"><h1 className="admin-page-title">إدارة التقييمات</h1></div>
      {loading ? <div className="admin-page-loading"><span className="spinner" style={{ width: 28, height: 28, borderTopColor: 'var(--accent-primary)' }} /></div> : (
        <div className="admin-section-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>العميلة</th><th>التقييم</th><th>التعليق</th><th>المنتج</th><th>حذف</th></tr></thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.customer_name}</td>
                    <td>{'⭐'.repeat(r.rating)}</td>
                    <td style={{ fontSize: 'var(--fs-sm)', maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.comment || '—'}</td>
                    <td style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{r.product_title || '—'}</td>
                    <td><button className="btn-icon" style={{ width: 34, height: 34, color: 'var(--accent-danger)' }} onClick={() => handleDelete(r.id)}><TrashIcon size={15} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
