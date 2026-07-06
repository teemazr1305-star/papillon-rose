import { useEffect, useRef, useState } from 'react';

/**
 * Adds the `.reveal` class behavior: elements fade/slide in once they
 * enter the viewport. Call once at the page level; it auto-observes
 * any element with class="reveal" inside the given container ref.
 */
export function useScrollReveal(containerRef, deps = []) {
  useEffect(() => {
    const root = containerRef?.current || document;
    const elements = root.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Detects scroll position past a threshold — used for sticky header shadow, back-to-top button */
export function useScrolledPast(threshold = 40) {
  const [past, setPast] = useState(false);
  const lastValue = useRef(false);

  useEffect(() => {
    function onScroll() {
      const isPast = window.scrollY > threshold;
      if (isPast !== lastValue.current) {
        lastValue.current = isPast;
        setPast(isPast);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return past;
}
