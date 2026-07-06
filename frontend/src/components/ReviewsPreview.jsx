import { Link } from 'react-router-dom';
import { StarIcon } from './icons';
import Butterfly from './icons/Butterfly';

export default function ReviewsPreview({ reviews = [] }) {
  if (!reviews.length) return null;

  return (
    <section className="section reviews-preview">
      <div className="container">
        <div className="section-header reveal" style={{ textAlign: 'center', alignItems: 'center' }}>
          <span className="eyebrow">آراء عميلاتنا</span>
          <h2 className="section-title">كلمات أسعدتنا 🦋</h2>
        </div>

        <div className="reviews-scroll scrollbar-hide">
          {reviews.map((r, idx) => (
            <div key={r.id} className="review-card reveal" style={{ transitionDelay: `${idx * 60}ms` }}>
              <div className="review-card-stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} size={14} filled={i < r.rating} />
                ))}
              </div>
              <p className="review-card-comment">"{r.comment}"</p>
              <div className="review-card-footer">
                <span className="review-card-name">{r.customer_name}</span>
                {r.product_title && <span className="review-card-product">{r.product_title}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="reviews-preview-cta reveal">
          <Link to="/reviews" className="btn btn-outline">
            اقرئي جميع التقييمات
          </Link>
        </div>
      </div>
    </section>
  );
}
