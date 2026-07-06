import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productImageUrl } from '../utils/api';
import { CloseIcon, PlusIcon, MinusIcon, TrashIcon, CartIcon } from './icons';
import Butterfly from './icons/Butterfly';

export default function CartDrawer() {
  const { items, subtotal, isOpen, setIsOpen, removeItem, updateQuantity } = useCart();

  return (
    <>
      <div className={`drawer-overlay ${isOpen ? 'is-open' : ''}`} onClick={() => setIsOpen(false)} />
      <aside className={`cart-drawer ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
        <div className="cart-drawer-header">
          <h3 className="cart-drawer-title">
            <CartIcon size={20} /> سلة المشتريات
          </h3>
          <button className="btn-icon" onClick={() => setIsOpen(false)} aria-label="إغلاق السلة">
            <CloseIcon size={19} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer-empty">
            <Butterfly size={44} className="mobile-drawer-motif" />
            <p className="text-secondary">سلتك فارغة حاليًا</p>
            <p className="text-muted" style={{ fontSize: 'var(--fs-sm)' }}>
              تصفحي متجرنا واكتشفي منتجاتنا الرقمية الأنيقة
            </p>
            <Link to="/shop" className="btn btn-primary" onClick={() => setIsOpen(false)}>
              ابدئي التسوق
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={productImageUrl(item.cover_image)}
                    alt={item.title}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <p className="cart-item-title">{item.title}</p>
                    <p className="cart-item-price">{item.price} دج</p>
                    <div className="cart-item-controls">
                      <div className="cart-item-qty">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="إنقاص الكمية">
                          <MinusIcon size={13} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="زيادة الكمية">
                          <PlusIcon size={13} />
                        </button>
                      </div>
                      <button className="cart-item-remove" onClick={() => removeItem(item.id)} aria-label="حذف المنتج">
                        <TrashIcon size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-drawer-subtotal">
                <span>المجموع الفرعي</span>
                <span className="cart-drawer-subtotal-value">{subtotal} دج</span>
              </div>
              <p className="text-muted" style={{ fontSize: 'var(--fs-xs)', textAlign: 'center' }}>
                منتجات رقمية — لا توجد رسوم شحن
              </p>
              <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setIsOpen(false)}>
                إتمام الطلب
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
