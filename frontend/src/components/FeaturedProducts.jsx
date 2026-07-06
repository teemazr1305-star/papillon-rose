import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { ChevronLeftIcon } from './icons';

export default function FeaturedProducts({ products = [] }) {
  if (!products.length) return null;

  return (
    <section className="section featured-products">
      <div className="container">
        <div className="section-header-row reveal">
          <div>
            <span className="eyebrow">الأكثر حبًا</span>
            <h2 className="section-title">منتجات مختارة لكِ</h2>
          </div>
          <Link to="/shop" className="featured-products-link">
            عرض الكل <ChevronLeftIcon size={16} />
          </Link>
        </div>

        <div className="product-grid">
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
