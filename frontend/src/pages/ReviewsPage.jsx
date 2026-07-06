import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { StarIcon } from '../components/icons';
import Butterfly from '../components/icons/Butterfly';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReviews(50).then((d) => setReviews(d.reviews)).finally(() => setLoading(false));
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="container section">
      <div style={{ textAlign: 'center', marginBottom: 'var(--sp-xl)' }}>
        <span className="eyebrow">آراء عميلاتنا</span>
        <h1 className="section-title" style={{ marginTop: 'var(--sp-xs)' }}>كلمات أسعدتنا 🦋</h1>
        {reviews.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: 'var(--sp-sm)' }}>
            <StarIcon size={22} filled />
            <span style={{ fontSize: 'var(--fs-xl)', fontWeight: 700 }}>{avgRating}</span>
            <span className="text-muted">({reviews.length} تقييم)</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--sp-2xl)' }}>
          <Butterfly size={44} style={{ margin: '0 auto var(--sp-sm)', color: 'var(--color-rosegold)' }} />
          <p className="text-secondary">لا توجد تقييمات بعد</p>
        </div>
      ) : (
        <div className="reviews-page-grid">
          {reviews.map((r) => (
            <div key={r.id} className="review-card">
              <div className="review-card-stars">
                {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} size={14} filled={i < r.rating} />)}
              </div>
              <p className="review-card-comment">"{r.comment}"</p>
              <div className="review-card-footer">
                <span className="review-card-name">{r.customer_name}</span>
                {r.product_title && <span className="review-card-product">على: {r.product_title}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
