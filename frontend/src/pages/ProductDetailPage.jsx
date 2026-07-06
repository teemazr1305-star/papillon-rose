import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductGallery from '../components/ProductGallery';
import ProductCard from '../components/ProductCard';
import ReviewForm from '../components/ReviewForm';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  HeartIcon, StarIcon, CartIcon, DownloadIcon, ShieldIcon, ZapIcon,
  ChevronLeftIcon, MinusIcon, PlusIcon, CheckIcon,
} from '../components/icons';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0 });
    api
      .getProduct(slug)
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="container section">
        <div className="product-detail-skeleton">
          <div className="skeleton" style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-lg)' }} />
          <div className="product-detail-skeleton-info">
            <div className="skeleton" style={{ height: 28, width: '70%', borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 18, width: '40%', borderRadius: 8 }} />
            <div className="skeleton" style={{ height: 90, width: '100%', borderRadius: 8 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h2>عذرًا، لم نجد هذا المنتج</h2>
        <p className="text-secondary" style={{ margin: '0.5rem 0 1.5rem' }}>قد يكون المنتج غير متوفر حاليًا أو تم حذفه</p>
        <Link to="/shop" className="btn btn-primary">تصفحي المتجر</Link>
      </div>
    );
  }

  const { product, reviews, related } = data;
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const wishlisted = isWishlisted(product.id);

  function handleAddToCart() {
    addItem(product, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  }

  function handleBuyNow() {
    addItem(product, quantity);
    navigate('/checkout');
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">الرئيسية</Link>
          <ChevronLeftIcon size={13} />
          <Link to="/shop">المتجر</Link>
          {product.category_slug && (
            <>
              <ChevronLeftIcon size={13} />
              <Link to={`/shop?category=${product.category_slug}`}>{product.category_name_ar}</Link>
            </>
          )}
          <ChevronLeftIcon size={13} />
          <span className="text-muted">{product.title_ar}</span>
        </nav>

        <div className="product-detail-layout">
          <ProductGallery images={product.images} title={product.title_ar} />

          <div className="product-detail-info">
            {product.category_name_ar && (
              <span className="product-card-category">{product.category_name_ar}</span>
            )}
            <h1 className="product-detail-title">{product.title_ar}</h1>

            {product.rating_count > 0 && (
              <div className="product-detail-rating">
                <div className="product-card-rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} size={15} filled={i < Math.round(product.rating_avg)} />
                  ))}
                </div>
                <span>{product.rating_avg.toFixed(1)} ({product.rating_count} تقييم)</span>
              </div>
            )}

            <p className="product-detail-short-desc">{product.short_description}</p>

            <div className="product-detail-price-row">
              <span className="product-detail-price">{product.price} دج</span>
              {hasDiscount && <span className="product-card-price-old">{product.compare_at_price} دج</span>}
              {hasDiscount && (
                <span className="badge badge-sale">
                  وفري {product.compare_at_price - product.price} دج
                </span>
              )}
            </div>

            <div className="product-detail-meta">
              {product.file_format && (
                <div className="product-detail-meta-item">
                  <DownloadIcon size={16} /> {product.file_format}
                </div>
              )}
              {product.page_count && (
                <div className="product-detail-meta-item">
                  <ZapIcon size={16} /> {product.page_count} صفحة
                </div>
              )}
              {product.language && (
                <div className="product-detail-meta-item">
                  <ShieldIcon size={16} /> {product.language}
                </div>
              )}
            </div>

            {product.stock_status === 'coming_soon' ? (
              <div className="product-detail-coming-soon">
                <span className="badge badge-soft">قريبًا</span>
                <p className="text-secondary">هذا المنتج غير متوفر للطلب حاليًا، تابعينا لمعرفة موعد الإطلاق</p>
              </div>
            ) : (
              <div className="product-detail-actions">
                <div className="cart-item-qty product-detail-qty">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="إنقاص">
                    <MinusIcon size={14} />
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)} aria-label="زيادة">
                    <PlusIcon size={14} />
                  </button>
                </div>

                <button className="btn btn-outline btn-lg product-detail-add-btn" onClick={handleAddToCart}>
                  {addedFeedback ? <><CheckIcon size={17} /> أُضيف للسلة</> : <><CartIcon size={17} /> أضيفي للسلة</>}
                </button>

                <button className="btn btn-primary btn-lg product-detail-buy-btn" onClick={handleBuyNow}>
                  اشتري الآن
                </button>

                <button
                  className={`btn-icon product-detail-wishlist ${wishlisted ? 'is-active' : ''}`}
                  onClick={() => toggle(product)}
                  aria-label="إضافة للمفضلة"
                >
                  <HeartIcon size={19} filled={wishlisted} />
                </button>
              </div>
            )}

            <div className="product-detail-trust">
              <div className="product-detail-trust-item">
                <ZapIcon size={15} /> تحميل فوري بعد التأكيد
              </div>
              <div className="product-detail-trust-item">
                <ShieldIcon size={15} /> دعم كامل بعد الشراء
              </div>
            </div>
          </div>
        </div>

        <div className="product-detail-description">
          <h2 className="product-detail-section-title">وصف المنتج</h2>
          <p>{product.description}</p>
        </div>

        <div className="product-detail-reviews">
          <h2 className="product-detail-section-title">تقييمات العميلات ({reviews.length})</h2>

          {reviews.length > 0 ? (
            <div className="product-reviews-list">
              {reviews.map((r) => (
                <div key={r.id} className="product-review-item">
                  <div className="product-review-item-header">
                    <span className="review-card-name">{r.customer_name}</span>
                    <div className="product-card-rating">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} size={12} filled={i < r.rating} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-secondary">{r.comment}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">كوني أول من يقيّم هذا المنتج</p>
          )}

          <ReviewForm productId={product.id} onSubmitted={(review) => {
            setData((prev) => ({ ...prev, reviews: [review, ...prev.reviews] }));
          }} />
        </div>

        {related.length > 0 && (
          <div className="product-detail-related">
            <h2 className="product-detail-section-title">قد يعجبك أيضًا</h2>
            <div className="product-grid">
              {related.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
