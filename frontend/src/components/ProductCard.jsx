import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productImageUrl } from '../utils/api';
import { HeartIcon, CartIcon, StarIcon } from './icons';

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : 0;

  function handleQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  }

  function handleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      className="product-card card card-hover reveal"
      style={{ transitionDelay: `${Math.min(index, 6) * 60}ms` }}
    >
      <div className="product-card-image-wrap">
        <img
          src={productImageUrl(product.cover_image)}
          alt={product.title_ar}
          loading="lazy"
          className="product-card-image"
        />
        <div className="product-card-badges">
          {hasDiscount && <span className="badge badge-sale">خصم {discountPercent}%</span>}
          {product.stock_status === 'coming_soon' && <span className="badge badge-soft">قريبًا</span>}
        </div>
        <button
          className={`product-card-wishlist ${wishlisted ? 'is-active' : ''}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <HeartIcon size={17} filled={wishlisted} />
        </button>
        {product.stock_status === 'available' && (
          <button className="product-card-quickadd" onClick={handleQuickAdd} aria-label="إضافة سريعة للسلة">
            <CartIcon size={16} />
            <span>إضافة للسلة</span>
          </button>
        )}
      </div>

      <div className="product-card-body">
        {product.category_name_ar && (
          <span className="product-card-category">{product.category_name_ar}</span>
        )}
        <h3 className="product-card-title">{product.title_ar}</h3>
        {product.rating_count > 0 && (
          <div className="product-card-rating">
            <StarIcon size={13} filled />
            <span>{product.rating_avg.toFixed(1)}</span>
            <span className="text-muted">({product.rating_count})</span>
          </div>
        )}
        <div className="product-card-price">
          <span className="product-card-price-current">{product.price} دج</span>
          {hasDiscount && <span className="product-card-price-old">{product.compare_at_price} دج</span>}
        </div>
      </div>
    </Link>
  );
}
