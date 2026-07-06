import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'papillon_rose_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage unavailable — cart just won't persist across reloads
    }
  }, [items]);

  const addItem = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.id === product.id);
      if (existing) {
        return prev.map((it) =>
          it.id === product.id ? { ...it, quantity: it.quantity + quantity } : it
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          title: product.title_ar,
          price: product.price,
          cover_image: product.cover_image,
          quantity,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity } : it)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { subtotal, count } = useMemo(() => {
    return items.reduce(
      (acc, it) => ({
        subtotal: acc.subtotal + it.price * it.quantity,
        count: acc.count + it.quantity,
      }),
      { subtotal: 0, count: 0 }
    );
  }, [items]);

  const value = {
    items,
    subtotal,
    count,
    isOpen,
    setIsOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart يجب أن يُستخدم داخل CartProvider');
  return ctx;
}
