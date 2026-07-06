import { useState } from 'react';
import { api } from '../utils/api';
import { StarIcon } from './icons';

export default function ReviewForm({ productId, onSubmitted }) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('الرجاء إدخال اسمك');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const data = await api.submitReview({
        product_id: productId,
        customer_name: name.trim(),
        rating,
        comment: comment.trim() || null,
      });
      onSubmitted(data.review);
      setStatus('success');
      setName('');
      setComment('');
      setRating(5);
      setTimeout(() => { setShowForm(false); setStatus('idle'); }, 1800);
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  }

  if (!showForm) {
    return (
      <button className="btn btn-outline" onClick={() => setShowForm(true)} style={{ marginTop: 'var(--sp-md)' }}>
        أضيفي تقييمك
      </button>
    );
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h4 style={{ fontSize: 'var(--fs-md)' }}>شاركينا رأيك</h4>

      <div className="review-form-stars">
        {Array.from({ length: 5 }).map((_, i) => {
          const value = i + 1;
          const active = value <= (hoverRating || rating);
          return (
            <button
              key={i}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              aria-label={`${value} نجوم`}
            >
              <StarIcon size={24} filled={active} />
            </button>
          );
        })}
      </div>

      <div className="field">
        <label htmlFor="review-name">اسمك</label>
        <input
          id="review-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: سارة ب."
          className={error ? 'has-error' : ''}
        />
        {error && <span className="field-error">{error}</span>}
      </div>

      <div className="field">
        <label htmlFor="review-comment">تعليقك (اختياري)</label>
        <textarea
          id="review-comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="شاركينا تجربتك مع هذا المنتج..."
        />
      </div>

      <div className="review-form-actions">
        <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>إلغاء</button>
        <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? <span className="spinner" /> : status === 'success' ? 'شكرًا لكِ! 🦋' : 'إرسال التقييم'}
        </button>
      </div>
    </form>
  );
}
