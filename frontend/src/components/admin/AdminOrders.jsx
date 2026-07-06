import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { WhatsAppIcon } from '../icons';

const STATUS_OPTIONS = [
  { value: 'pending_whatsapp', label: 'ينتظر واتساب', color: '#C77B5A' },
  { value: 'confirmed', label: 'مؤكد', color: '#A8B39A' },
  { value: 'delivered', label: 'تم التسليم', color: '#7A9070' },
  { value: 'cancelled', label: 'ملغي', color: '#B0594A' },
];

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  function load() {
    setLoading(true);
    api.getOrders(token, filterStatus || undefined)
      .then((d) => setOrders(d.orders))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [filterStatus]); // eslint-disable-line

  async function changeStatus(order, status) {
    setUpdatingId(order.id);
    try {
      await api.updateOrderStatus(token, order.id, status);
      setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status } : o));
    } catch (err) { alert(err.message); }
    finally { setUpdatingId(null); }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">إدارة الطلبات</h1>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button className={`btn btn-sm ${!filterStatus ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilterStatus('')}>الكل</button>
          {STATUS_OPTIONS.map((s) => (
            <button key={s.value} className={`btn btn-sm ${filterStatus === s.value ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilterStatus(s.value)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="admin-page-loading"><span className="spinner" style={{ width: 28, height: 28, borderTopColor: 'var(--accent-primary)' }} /></div>
      ) : orders.length === 0 ? (
        <p className="text-muted" style={{ padding: 'var(--sp-lg)' }}>لا توجد طلبات</p>
      ) : (
        <div className="admin-section-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>رقم الطلب</th><th>العميلة</th><th>الهاتف</th><th>المجموع</th><th>الحالة</th><th>التاريخ</th><th>واتساب</th></tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const currentStatus = STATUS_OPTIONS.find((s) => s.value === o.status);
                  return (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 700, fontSize: 'var(--fs-xs)', fontFamily: 'monospace' }}>{o.order_number}</td>
                      <td>{o.full_name}</td>
                      <td style={{ direction: 'ltr' }}>{o.phone}</td>
                      <td style={{ fontWeight: 600 }}>{o.total} دج</td>
                      <td>
                        <select
                          className="admin-status-select"
                          style={{ '--st-color': currentStatus?.color || 'gray' }}
                          value={o.status}
                          disabled={updatingId === o.id}
                          onChange={(e) => changeStatus(o, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </td>
                      <td style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>
                        {new Date(o.created_at).toLocaleDateString('ar-DZ')}
                      </td>
                      <td>
                        <a
                          href={`https://wa.me/${o.phone.replace(/^0/, '213')}?text=${encodeURIComponent(`مرحبا ${o.full_name}، بخصوص طلبك رقم ${o.order_number}`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="btn-icon" style={{ width: 34, height: 34, color: '#25D366' }}
                          aria-label="فتح واتساب"
                        >
                          <WhatsAppIcon size={16} />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
