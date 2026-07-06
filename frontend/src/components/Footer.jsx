import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import Butterfly from './icons/Butterfly';
import { InstagramIcon, FacebookIcon, TikTokIcon, MailIcon, WhatsAppIcon, CheckIcon } from './icons';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const data = await api.subscribeNewsletter(email.trim());
      setStatus('success');
      setMessage(data.message);
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  }

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-newsletter">
          <Butterfly size={30} className="footer-motif" />
          <h3 className="footer-newsletter-title">انضمي إلى عائلة Papillon Rose</h3>
          <p className="footer-newsletter-text">
            كوني أول من يعلم بالمنتجات الجديدة والعروض الخاصة — رسالة واحدة بالشهر، بلا إزعاج.
          </p>
          <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
            <div className="footer-newsletter-input">
              <MailIcon size={18} />
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
              {status === 'loading' ? <span className="spinner" /> : 'اشتراك'}
            </button>
          </form>
          {status === 'success' && (
            <p className="footer-newsletter-feedback is-success">
              <CheckIcon size={14} /> {message}
            </p>
          )}
          {status === 'error' && <p className="footer-newsletter-feedback is-error">{message}</p>}
        </div>

        <div className="footer-grid">
          <div className="footer-col footer-col-brand">
            <span className="header-logo-main" style={{ fontSize: 'var(--fs-xl)' }}>Papillon Rose</span>
            <p className="text-muted footer-tagline">Élégance • Douceur • Confiance</p>
            <p className="text-secondary footer-about-text">
              قرطاسية رقمية مصممة بحب من الجزائر — بلانرز وقوالب تساعدك على تنظيم حياتك بأناقة وهدوء.
            </p>
            <div className="footer-social">
              <a href="https://www.instagram.com/papillon__rose5" target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="Instagram">
                <InstagramIcon size={18} />
              </a>
              <a href="#" className="btn-icon" aria-label="Facebook">
                <FacebookIcon size={18} />
              </a>
              <a href="#" className="btn-icon" aria-label="TikTok">
                <TikTokIcon size={18} />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">المتجر</h4>
            <Link to="/shop" className="footer-link">جميع المنتجات</Link>
            <Link to="/shop?featured=1" className="footer-link">الأكثر مبيعًا</Link>
            <Link to="/categories" className="footer-link">الفئات</Link>
            <Link to="/wishlist" className="footer-link">المفضلة</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">المساعدة</h4>
            <Link to="/faq" className="footer-link">الأسئلة الشائعة</Link>
            <Link to="/contact" className="footer-link">تواصلي معنا</Link>
            <Link to="/about" className="footer-link">قصة العلامة</Link>
            <Link to="/reviews" className="footer-link">آراء العميلات</Link>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">تواصلي معنا</h4>
            <a href="https://wa.me/213550000000" target="_blank" rel="noopener noreferrer" className="footer-link footer-link-icon">
              <WhatsAppIcon size={16} /> واتساب
            </a>
            <a href="https://www.instagram.com/papillon__rose5" target="_blank" rel="noopener noreferrer" className="footer-link footer-link-icon">
              <InstagramIcon size={16} /> @papillon__rose5
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="text-muted">© {new Date().getFullYear()} Papillon Rose. جميع الحقوق محفوظة.</p>
          <p className="text-muted">صُنع بحب 🦋 في الجزائر</p>
        </div>
      </div>
    </footer>
  );
}
