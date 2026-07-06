import { Link } from 'react-router-dom';
import Butterfly from './icons/Butterfly';
import { SparkleIcon } from './icons';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg-shape hero-bg-shape-1" />
      <div className="hero-bg-shape hero-bg-shape-2" />

      <div className="container hero-inner">
        <div className="hero-content">
          <span className="eyebrow">
            <SparkleIcon size={11} /> قرطاسية رقمية فاخرة
          </span>

          <h1 className="hero-title">
            نظّمي حياتك
            <br />
            بأناقة <span className="hero-title-accent">وهدوء</span>
          </h1>

          <p className="hero-description">
            بلانرز، كتب تلوين، وقوالب رقمية مصممة بحب — لتساعدك على تنظيم
            يومك، مشروعك، وأهدافك بأسلوب راقٍ يعكس ذوقك.
          </p>

          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary btn-lg">
              تسوقي الآن
            </Link>
            <Link to="/categories" className="btn btn-outline btn-lg">
              استكشفي الفئات
            </Link>
          </div>

          <div className="hero-trust">
            <div className="hero-trust-item">
              <strong>+200</strong>
              <span>عميلة سعيدة</span>
            </div>
            <div className="hero-trust-divider" />
            <div className="hero-trust-item">
              <strong>4.9</strong>
              <span>تقييم العميلات</span>
            </div>
            <div className="hero-trust-divider" />
            <div className="hero-trust-item">
              <strong>تحميل فوري</strong>
              <span>بعد التأكيد</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-frame">
            <img
              src="/images/logo-papillon-rose.png"
              alt="Papillon Rose"
              className="hero-visual-logo"
            />
          </div>
          <Butterfly size={32} className="hero-floating-butterfly hero-floating-butterfly-1" animate />
          <Butterfly size={20} className="hero-floating-butterfly hero-floating-butterfly-2" animate />
        </div>
      </div>

      <div className="hero-scroll-hint">
        <div className="motif-divider">
          <span className="line" />
          <Butterfly size={16} />
          <span className="line" />
        </div>
      </div>
    </section>
  );
}
