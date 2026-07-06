import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'papillon_rose_wishlist';

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore — wishlist just won't persist
    }
  }, [items]);

  const toggle = useCallback((product) => {
    setItems((prev) => {
      const exists = prev.some((it) => it.id === product.id);
      if (exists) return prev.filter((it) => it.id !== product.id);
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          title: product.title_ar,
          price: product.price,
          cover_image: product.cover_image,
        },
      ];
    });
  }, []);

  const isWishlisted = useCallback((id) => items.some((it) => it.id === id), [items]);

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist يجب أن يُستخدم داخل WishlistProvider');
  return ctx;
}
