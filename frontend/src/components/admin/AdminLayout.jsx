import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GridIcon, PackageIcon, EditIcon, TrendingIcon, LogoutIcon,
  ShieldIcon, RefreshIcon
} from '../icons';
import Butterfly from '../icons/Butterfly';

const NAV = [
  { to: '/admin', label: 'الرئيسية', icon: GridIcon, end: true },
  { to: '/admin/products', label: 'المنتجات', icon: PackageIcon },
  { to: '/admin/categories', label: 'الفئات', icon: EditIcon },
  { to: '/admin/orders', label: 'الطلبات', icon: TrendingIcon },
  { to: '/admin/reviews', label: 'التقييمات', icon: ShieldIcon },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <Butterfly size={22} />
          <span>لوحة التحكم</span>
        </div>
        <nav className="admin-sidebar-nav">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">{admin?.full_name?.[0] || 'A'}</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 'var(--fs-sm)' }}>{admin?.full_name}</p>
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--text-muted)' }}>{admin?.email}</p>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogoutIcon size={16} /> خروج
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
