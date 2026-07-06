import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useScrolledPast } from '../hooks/useScrollReveal';
import { SearchIcon, CartIcon, HeartIcon, MenuIcon, CloseIcon } from './icons';
import Butterfly from './icons/Butterfly';

const NAV_LINKS = [
  { to: '/shop', label: 'المتجر' },
  { to: '/categories', label: 'الفئات' },
  { to: '/about', label: 'قصتنا' },
  { to: '/reviews', label: 'آراء العميلات' },
  { to: '/contact', label: 'تواصلي معنا' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const scrolled = useScrolledPast(24);
  const { count: cartCount, setIsOpen: setCartOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  return (
    <>
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <button
            className="header-menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="فتح القائمة"
          >
            <MenuIcon size={22} />
          </button>

          <Link to="/" className="header-logo" aria-label="Papillon Rose — الصفحة الرئيسية">
            <Butterfly size={26} className="header-logo-icon" />
            <span className="header-logo-text">
              <span className="header-logo-main">Papillon Rose</span>
              <span className="header-logo-sub">PAPILLON ROSE</span>
            </span>
          </Link>

          <nav className="header-nav">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`header-nav-link ${location.pathname === link.to ? 'is-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <button className="btn-icon" onClick={() => setSearchOpen(true)} aria-label="بحث">
              <SearchIcon size={19} />
            </button>
            <Link to="/wishlist" className="btn-icon header-action-link" aria-label="المفضلة">
              <HeartIcon size={19} />
              {wishlistCount > 0 && <span className="header-badge">{wishlistCount}</span>}
            </Link>
            <button
              className="btn-icon header-action-link"
              onClick={() => setCartOpen(true)}
              aria-label="سلة المشتريات"
            >
              <CartIcon size={19} />
              {cartCount > 0 && <span className="header-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <div className={`mobile-drawer-overlay ${mobileOpen ? 'is-open' : ''}`} onClick={() => setMobileOpen(false)} />
      <aside className={`mobile-drawer ${mobileOpen ? 'is-open' : ''}`}>
        <div className="mobile-drawer-header">
          <span className="header-logo-main">Papillon Rose</span>
          <button className="btn-icon" onClick={() => setMobileOpen(false)} aria-label="إغلاق القائمة">
            <CloseIcon size={20} />
          </button>
        </div>
        <nav className="mobile-drawer-nav">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="mobile-drawer-link">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mobile-drawer-footer">
          <Butterfly size={32} className="mobile-drawer-motif" />
          <p className="text-muted" style={{ fontSize: 'var(--fs-xs)' }}>Élégance • Douceur • Confiance</p>
        </div>
      </aside>

      {/* Search overlay */}
      <div className={`search-overlay ${searchOpen ? 'is-open' : ''}`}>
        <div className="container">
          <form className="search-overlay-form" onSubmit={handleSearchSubmit}>
            <SearchIcon size={22} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="ابحثي عن بلانر، كتاب تلوين، قالب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button" className="btn-icon" onClick={() => setSearchOpen(false)} aria-label="إغلاق البحث">
              <CloseIcon size={20} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
