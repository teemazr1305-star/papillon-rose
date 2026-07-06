import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ShopFilters from '../components/ShopFilters';
import { api } from '../utils/api';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { FilterIcon, SearchIcon } from '../components/icons';
import Butterfly from '../components/icons/Butterfly';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const containerRef = useRef(null);

  const filters = {
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    sort: searchParams.get('sort') || 'newest',
    featured: searchParams.get('featured') || '',
    page: Number(searchParams.get('page')) || 1,
  };

  useEffect(() => {
    api.getCategories().then((data) => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getProducts({ ...filters, limit: 12 })
      .then((data) => {
        if (cancelled) return;
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .catch((err) => console.error(err))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useScrollReveal(containerRef, [products]);

  const updateFilters = useCallback(
    (updates) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      next.delete('page'); // reset pagination on filter change
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  function goToPage(page) {
    const next = new URLSearchParams(searchParams);
    next.set('page', page);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function clearFilters() {
    setSearchParams({});
  }

  const activeCategory = categories.find((c) => c.slug === filters.category);

  return (
    <div className="shop-page" ref={containerRef}>
      <div className="shop-header">
        <div className="container">
          <span className="eyebrow">المتجر</span>
          <h1 className="section-title">
            {filters.q ? `نتائج البحث عن "${filters.q}"` : activeCategory ? activeCategory.name_ar : 'جميع المنتجات'}
          </h1>
          {activeCategory?.description && (
            <p className="section-subtitle">{activeCategory.description}</p>
          )}
        </div>
      </div>

      <div className="container shop-layout">
        <ShopFilters
          categories={categories}
          filters={filters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
          isMobileOpen={mobileFiltersOpen}
          onCloseMobile={() => setMobileFiltersOpen(false)}
        />

        <div className="shop-results">
          <div className="shop-results-bar">
            <button className="btn btn-outline btn-sm shop-filters-toggle" onClick={() => setMobileFiltersOpen(true)}>
              <FilterIcon size={16} /> الفلترة
            </button>
            <p className="text-muted shop-results-count">
              {loading ? 'جارٍ التحميل...' : `${pagination.total} منتج`}
            </p>
          </div>

          {loading ? (
            <div className="product-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="product-card-skeleton skeleton" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="shop-empty-state">
              <Butterfly size={48} className="mobile-drawer-motif" />
              <h3>لم نعثر على نتائج</h3>
              <p className="text-secondary">جربي تعديل البحث أو الفلاتر المستخدمة</p>
              <button className="btn btn-outline" onClick={clearFilters}>
                <SearchIcon size={16} /> مسح الفلاتر
              </button>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((product, idx) => (
                  <ProductCard key={product.id} product={product} index={idx} />
                ))}
              </div>

              {pagination.total_pages > 1 && (
                <div className="shop-pagination">
                  {Array.from({ length: pagination.total_pages }).map((_, i) => (
                    <button
                      key={i}
                      className={`shop-pagination-btn ${pagination.page === i + 1 ? 'is-active' : ''}`}
                      onClick={() => goToPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
