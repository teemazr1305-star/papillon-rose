import { useState } from 'react';
import { ChevronDownIcon } from '../components/icons';

const FAQS = [
  {
    q: 'كيف أستلم منتجاتي بعد الطلب؟',
    a: 'بعد تأكيد طلبك عبر واتساب وإتمام الدفع، ستصلك ملفاتك مباشرة عبر واتساب أو البريد الإلكتروني في أقل من ساعة.',
  },
  {
    q: 'ما هي طرق الدفع المتاحة؟',
    a: 'حاليًا نقبل الدفع عبر CCP، Baridimob، أو التحويل البنكي. سيتم توضيح التفاصيل بعد تأكيد طلبك عبر واتساب.',
  },
  {
    q: 'هل يمكنني طباعة المنتجات الرقمية؟',
    a: 'بالطبع! كل منتجاتنا مصممة بدقة عالية (300 DPI) وجاهزة للطباعة المنزلية أو الاحترافية. يمكنك طباعتها بحجم A4 أو A5 حسب البلانر.',
  },
  {
    q: 'هل يمكنني استخدام المنتجات على التابلت (iPad)؟',
    a: 'نعم! ملفات PDF متوافقة مع تطبيقات مثل GoodNotes وNotability وXodo. ستتمكنين من الكتابة عليها رقميًا بسهولة.',
  },
  {
    q: 'هل يمكنني استرداد المبلغ بعد الشراء؟',
    a: 'نظرًا لأن منتجاتنا رقمية وتُسلَّم فورًا، لا يمكن استرداد المبلغ بعد الاستلام. لكن في حال وجود مشكلة في الملف نلتزم بإصلاحها أو استبدالها.',
  },
  {
    q: 'هل يمكنني إعادة بيع أو مشاركة الملفات؟',
    a: 'لا. حقوق الملكية الفكرية محفوظة لـ Papillon Rose. المنتجات للاستخدام الشخصي فقط. يُمنع إعادة البيع أو المشاركة.',
  },
  {
    q: 'هل تتوفر نسخ مطبوعة؟',
    a: 'نعم، بعض المنتجات (مثل Becoming Her Planner) متوفرة كنسخة مطبوعة تُطلب بشكل منفصل عبر واتساب.',
  },
  {
    q: 'كم من الوقت يستغرق الرد على رسائل واتساب؟',
    a: 'نرد على جميع الرسائل خلال 2-6 ساعات في أوقات العمل (9ص - 9م). في أوقات الذروة قد يمتد الوقت قليلًا.',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? 'is-open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <ChevronDownIcon size={18} className="faq-chevron" />
      </button>
      {open && <p className="faq-answer">{a}</p>}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="container-narrow section">
      <div style={{ textAlign: 'center', marginBottom: 'var(--sp-2xl)' }}>
        <span className="eyebrow">مساعدة</span>
        <h1 className="section-title" style={{ marginTop: 'var(--sp-xs)' }}>الأسئلة الشائعة</h1>
        <p className="section-subtitle" style={{ margin: '0 auto', marginTop: 'var(--sp-xs)' }}>
          كل ما تحتاجين معرفته قبل وبعد الشراء
        </p>
      </div>
      <div className="faq-list">
        {FAQS.map((item) => <FAQItem key={item.q} {...item} />)}
      </div>
    </div>
  );
}
