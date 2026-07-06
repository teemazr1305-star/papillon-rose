import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';

// Layout
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

// Public pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import ReviewsPage from './pages/ReviewsPage';
import WishlistPage from './pages/WishlistPage';

// Admin
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import { AdminCategories, AdminReviews } from './components/admin/AdminCategoriesAndReviews';
import { ArrowUpIcon } from './components/icons';

/* ── Back to top button ── */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  if (!visible) return null;
  return (
    <button
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="العودة للأعلى"
    >
      <ArrowUpIcon size={18} />
    </button>
  );
}

/* ── Public storefront layout ── */
function PublicLayout() {
  return (
    <>
      <Header />
      <main><Outlet /></main>
      <Footer />
      <CartDrawer />
      <BackToTop />
    </>
  );
}

/* ── Admin route guard ── */
function RequireAdmin() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <span className="spinner" style={{ width: 32, height: 32, borderTopColor: 'var(--accent-primary)' }} />
      </div>
    );
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

/* ── 404 page ── */
function NotFoundPage() {
  return (
    <div className="container section" style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: 'var(--fs-3xl)', color: 'var(--color-mocha)' }}>404</h1>
      <p className="section-subtitle" style={{ margin: '0.5rem auto 1.5rem' }}>الصفحة التي تبحثين عنها غير موجودة</p>
      <a href="/" className="btn btn-primary">العودة للرئيسية</a>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public storefront */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/categories" element={<ShopPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
        </Route>
      </Route>
    </Routes>
  );
}
