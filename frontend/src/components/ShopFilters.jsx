import { CloseIcon } from './icons';

const SORT_OPTIONS = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'popular', label: 'الأكثر مبيعًا' },
  { value: 'rating', label: 'الأعلى تقييمًا' },
  { value: 'price_asc', label: 'السعر: من الأقل' },
  { value: 'price_desc', label: 'السعر: من الأعلى' },
];

export default function ShopFilters({
  categories,
  filters,
  onFilterChange,
  onClearFilters,
  isMobileOpen,
  onCloseMobile,
}) {
  const hasActiveFilters = filters.category || filters.min_price || filters.max_price;

  return (
    <>
      <div className={`filters-overlay ${isMobileOpen ? 'is-open' : ''}`} onClick={onCloseMobile} />
      <aside className={`shop-filters ${isMobileOpen ? 'is-open' : ''}`}>
        <div className="shop-filters-mobile-header">
          <h3>الفلترة والترتيب</h3>
          <button className="btn-icon" onClick={onCloseMobile} aria-label="إغلاق">
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="shop-filter-group">
          <h4 className="shop-filter-title">الترتيب حسب</h4>
          <div className="shop-filter-options">
            {SORT_OPTIONS.map((opt) => (
              <label key={opt.value} className="shop-filter-radio">
                <input
                  type="radio"
                  name="sort"
                  checked={filters.sort === opt.value}
                  onChange={() => onFilterChange({ sort: opt.value })}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="shop-filter-group">
          <h4 className="shop-filter-title">الفئة</h4>
          <div className="shop-filter-options">
            <label className="shop-filter-radio">
              <input
                type="radio"
                name="category"
                checked={!filters.category}
                onChange={() => onFilterChange({ category: '' })}
              />
              <span>جميع الفئات</span>
            </label>
            {categories.map((cat) => (
              <label key={cat.id} className="shop-filter-radio">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat.slug}
                  onChange={() => onFilterChange({ category: cat.slug })}
                />
                <span>{cat.name_ar}</span>
                <span className="text-muted" style={{ fontSize: 'var(--fs-2xs)' }}>({cat.product_count})</span>
              </label>
            ))}
          </div>
        </div>

        <div className="shop-filter-group">
          <h4 className="shop-filter-title">نطاق السعر (دج)</h4>
          <div className="shop-filter-price-inputs">
            <input
              type="number"
              placeholder="من"
              min="0"
              value={filters.min_price}
              onChange={(e) => onFilterChange({ min_price: e.target.value })}
            />
            <span className="text-muted">—</span>
            <input
              type="number"
              placeholder="إلى"
              min="0"
              value={filters.max_price}
              onChange={(e) => onFilterChange({ max_price: e.target.value })}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button className="btn btn-ghost shop-filter-clear" onClick={onClearFilters}>
            مسح كل الفلاتر
          </button>
        )}

        <button className="btn btn-primary shop-filters-apply-mobile" onClick={onCloseMobile}>
          عرض النتائج
        </button>
      </aside>
    </>
  );
}
