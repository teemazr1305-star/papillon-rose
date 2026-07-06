import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import Butterfly from '../components/icons/Butterfly';

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="container section">
      <span className="eyebrow">قائمتي المفضلة</span>
      <h1 className="section-title" style={{ marginTop: 'var(--sp-xs)', marginBottom: 'var(--sp-xl)' }}>
        المنتجات المحفوظة ({items.length})
      </h1>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--sp-2xl)' }}>
          <Butterfly size={48} style={{ margin: '0 auto var(--sp-sm)', color: 'var(--color-rosegold)' }} />
          <h3>قائمتك المفضلة فارغة</h3>
          <p className="text-secondary" style={{ margin: '0.4rem 0 1.5rem' }}>أضيفي المنتجات التي تعجبك هنا لتجديها بسرعة لاحقًا</p>
          <Link to="/shop" className="btn btn-primary">تصفحي المتجر</Link>
        </div>
      ) : (
        <div className="product-grid">
          {items.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}
