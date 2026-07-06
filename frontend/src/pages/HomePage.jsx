import { useEffect, useState, useRef } from 'react';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import CategoriesPreview from '../components/CategoriesPreview';
import WhyUs from '../components/WhyUs';
import ReviewsPreview from '../components/ReviewsPreview';
import { api } from '../utils/api';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [productsData, categoriesData, reviewsData] = await Promise.all([
          api.getProducts({ featured: '1', limit: 8 }),
          api.getCategories(),
          api.getReviews(6),
        ]);
        if (cancelled) return;
        setFeatured(productsData.products);
        setCategories(categoriesData.categories);
        setReviews(reviewsData.reviews);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useScrollReveal(containerRef, [loading]);

  return (
    <div ref={containerRef}>
      <Hero />
      <CategoriesPreview categories={categories} />
      <FeaturedProducts products={featured} />
      <WhyUs />
      <ReviewsPreview reviews={reviews} />
    </div>
  );
}
