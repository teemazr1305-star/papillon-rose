import { ZapIcon, ShieldIcon, HeartIcon, WhatsAppIcon } from './icons';

const FEATURES = [
  {
    icon: ZapIcon,
    title: 'تحميل فوري',
    text: 'بعد تأكيد الطلب، تصلك منتجاتك مباشرة جاهزة للاستخدام أو الطباعة.',
  },
  {
    icon: HeartIcon,
    title: 'تصميم بحب وعناية',
    text: 'كل منتج مصمم بأناقة وذوق رفيع، بألوان ولمسات تعكس الدفء والرقي.',
  },
  {
    icon: WhatsAppIcon,
    title: 'تواصل مباشر وسهل',
    text: 'أكملي طلبك عبر واتساب بخطوة واحدة — بدون تعقيد وبدون حسابات بنكية.',
  },
  {
    icon: ShieldIcon,
    title: 'دعم بعد الشراء',
    text: 'أي استفسار أو مشكلة في التحميل؟ نحن هنا للمساعدة في أي وقت.',
  },
];

export default function WhyUs() {
  return (
    <section className="section why-us">
      <div className="container">
        <div className="why-us-grid">
          {FEATURES.map((f, idx) => (
            <div key={f.title} className="why-us-item reveal" style={{ transitionDelay: `${idx * 70}ms` }}>
              <div className="why-us-icon">
                <f.icon size={22} />
              </div>
              <h3 className="why-us-title">{f.title}</h3>
              <p className="why-us-text">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
