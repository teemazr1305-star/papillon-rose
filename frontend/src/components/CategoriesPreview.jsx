import { Link } from 'react-router-dom';
import { PackageIcon, ImageIcon, GridIcon, EditIcon } from './icons';

const ICON_MAP = {
  planner: PackageIcon,
  coloring: ImageIcon,
  printable: GridIcon,
  template: EditIcon,
};

export default function CategoriesPreview({ categories = [] }) {
  if (!categories.length) return null;

  return (
    <section className="section categories-preview">
      <div className="container">
        <div className="section-header reveal">
          <span className="eyebrow">تسوّقي حسب الفئة</span>
          <h2 className="section-title">اكتشفي مجموعاتنا</h2>
        </div>

        <div className="categories-grid">
          {categories.map((cat, idx) => {
            const Icon = ICON_MAP[cat.icon] || PackageIcon;
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="category-tile reveal"
                style={{ transitionDelay: `${idx * 70}ms` }}
              >
                <div className="category-tile-icon">
                  <Icon size={26} />
                </div>
                <h3 className="category-tile-title">{cat.name_ar}</h3>
                <p className="category-tile-count">{cat.product_count} منتج</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
