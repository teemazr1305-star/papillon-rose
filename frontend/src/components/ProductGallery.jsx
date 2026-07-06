import { useState } from 'react';
import { productImageUrl } from '../utils/api';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './icons';

export default function ProductGallery({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    images = ['placeholder.png'];
  }

  function goNext() {
    setActiveIndex((i) => (i + 1) % images.length);
  }
  function goPrev() {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  }

  return (
    <div className="gallery">
      <div className="gallery-main" onClick={() => setLightboxOpen(true)}>
        <img src={productImageUrl(images[activeIndex])} alt={`${title} — معاينة ${activeIndex + 1}`} />
        {images.length > 1 && (
          <>
            <button
              className="gallery-nav gallery-nav-prev"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="الصورة السابقة"
            >
              <ChevronRightIcon size={18} />
            </button>
            <button
              className="gallery-nav gallery-nav-next"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="الصورة التالية"
            >
              <ChevronLeftIcon size={18} />
            </button>
            <span className="gallery-counter">{activeIndex + 1} / {images.length}</span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="gallery-thumbs scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`gallery-thumb ${activeIndex === idx ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`عرض الصورة ${idx + 1}`}
            >
              <img src={productImageUrl(img)} alt="" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="إغلاق">
            <CloseIcon size={22} />
          </button>
          <img
            src={productImageUrl(images[activeIndex])}
            alt={`${title} — معاينة كبيرة`}
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                className="lightbox-nav lightbox-nav-prev"
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                aria-label="الصورة السابقة"
              >
                <ChevronRightIcon size={22} />
              </button>
              <button
                className="lightbox-nav lightbox-nav-next"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                aria-label="الصورة التالية"
              >
                <ChevronLeftIcon size={22} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
