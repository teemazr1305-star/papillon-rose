import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { PackageIcon, TrendingIcon, GridIcon, SparkleIcon } from '../icons';

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-icon" style={{ background: color + '18', color }}>
        <Icon size={22} />
      </div>
      <div>
        <p className="admin-stat-value">{value}</p>
        <p className="admin-stat-label">{label}</p>
      </div>
    </div>
  );
}

const STATUS_MAP = {
  pending_whatsapp: { label: 'ينتظر واتساب', color: '#C77B5A' },
  confirmed: { label: 'مؤكد', color: '#A8B39A' },
  delivered: { label: 'تم التسليم', color: '#7A9070' },
  cancelled: { label: 'ملغي', color: '#B0594A' },
};

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats(token).then(setData).finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="admin-page-loading"><span className="spinner" style={{ width: 32, height: 32, borderTopColor: 'var(--accent-primary)' }} /></div>;

  const { stats, top_products, recent_orders } = data;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">مرحبًا بكِ 🦋</h1>
        <p className="text-muted">نظرة عامة على متجر Papillon Rose</p>
      </div>

      <div className="admin-stats-grid">
        <StatCard label="المنتجات النشطة" value={stats.total_products} icon={PackageIcon} color="var(--accent-primary)" />
        <StatCard label="إجمالي الطلبات" value={stats.total_orders} icon={GridIcon} color="var(--color-sage)" />
        <StatCard label="طلبات تنتظر الرد" value={stats.pending_orders} icon={TrendingIcon} color="var(--accent-warning)" />
        <StatCard label="إيرادات مؤكدة (دج)" value={stats.confirmed_revenue.toLocaleString()} icon={SparkleIcon} color="var(--color-mocha)" />
      </div>

      <div className="admin-dashboard-grid">
        <div className="admin-section-card">
          <h2 className="admin-section-title">أحدث الطلبات</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>رقم الطلب</th><th>العميلة</th><th>المجموع</th><th>الحالة</th></tr>
              </thead>
              <tbody>
                {recent_orders.map((o) => {
                  const st = STATUS_MAP[o.status] || { label: o.status, color: 'gray' };
                  return (
                    <tr key={o.id}>
                      <td><Link to={`/admin/orders`} className="admin-table-link">{o.order_number}</Link></td>
                      <td>{o.full_name}</td>
                      <td>{o.total} دج</td>
                      <td><span className="admin-status-badge" style={{ '--st-color': st.color }}>{st.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-section-card">
          <h2 className="admin-section-title">المنتجات الأكثر مبيعًا</h2>
          <div className="admin-top-products">
            {top_products.map((p, idx) => (
              <div key={p.id} className="admin-top-product-row">
                <span className="admin-top-rank">{idx + 1}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{p.title_ar}</p>
                  <p className="text-muted" style={{ fontSize: 'var(--fs-xs)' }}>{p.price} دج</p>
                </div>
                <span className="text-secondary" style={{ fontSize: 'var(--fs-sm)' }}>{p.sales_count} مبيعة</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
