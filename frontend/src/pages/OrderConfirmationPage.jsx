import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { CheckIcon, WhatsAppIcon } from '../components/icons';
import Butterfly from '../components/icons/Butterfly';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrder(orderNumber)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto', width: 32, height: 32, borderTopColor: 'var(--accent-primary)' }} />
      </div>
    );
  }

  return (
    <div className="container section">
      <div className="confirmation-card">
        <div className="confirmation-icon">
          <CheckIcon size={30} />
        </div>
        <Butterfly size={36} className="mobile-drawer-motif" />
        <h1 className="confirmation-title">تم إرسال طلبك! 🦋</h1>
        <p className="text-secondary confirmation-subtitle">
          شكرًا لطلبك من Papillon Rose. رقم طلبك هو:
        </p>
        <div className="confirmation-order-number">{orderNumber}</div>

        <div className="confirmation-steps">
          <div className="confirmation-step">
            <div className="confirmation-step-num">1</div>
            <p>تم فتح واتساب برسالة جاهزة — أرسليها لبائعتك</p>
          </div>
          <div className="confirmation-step">
            <div className="confirmation-step-num">2</div>
            <p>ستتواصل معكِ للتأكيد وتفاصيل الدفع</p>
          </div>
          <div className="confirmation-step">
            <div className="confirmation-step-num">3</div>
            <p>بعد تأكيد الدفع تصلك ملفاتك فورًا</p>
          </div>
        </div>

        {data && (
          <a
            href={`https://wa.me/213550000000?text=${encodeURIComponent(`مرحبا، أريد متابعة طلبي رقم ${orderNumber}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <WhatsAppIcon size={19} /> تواصلي مع البائعة
          </a>
        )}

        <Link to="/shop" className="btn btn-ghost" style={{ marginTop: '0.5rem' }}>
          متابعة التسوق
        </Link>
      </div>
    </div>
  );
}
