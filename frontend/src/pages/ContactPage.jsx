import { WhatsAppIcon, InstagramIcon, MailIcon } from '../components/icons';

export default function ContactPage() {
  const CHANNELS = [
    {
      icon: WhatsAppIcon,
      title: 'واتساب',
      value: '0550 00 00 00',
      sub: 'الأسرع — رد خلال ساعات',
      href: 'https://wa.me/213550000000',
      color: '#25D366',
    },
    {
      icon: InstagramIcon,
      title: 'إنستغرام',
      value: '@papillon__rose5',
      sub: 'رسائل مباشرة ومتابعة المنتجات الجديدة',
      href: 'https://www.instagram.com/papillon__rose5',
      color: '#E4405F',
    },
    {
      icon: MailIcon,
      title: 'البريد الإلكتروني',
      value: 'contact@papillonrose.com',
      sub: 'للاستفسارات التفصيلية',
      href: 'mailto:contact@papillonrose.com',
      color: 'var(--accent-primary)',
    },
  ];

  return (
    <div className="container-narrow section">
      <div style={{ textAlign: 'center', marginBottom: 'var(--sp-2xl)' }}>
        <span className="eyebrow">تواصلي معنا</span>
        <h1 className="section-title" style={{ marginTop: 'var(--sp-xs)' }}>نحن هنا من أجلكِ</h1>
        <p className="section-subtitle" style={{ margin: '0 auto', marginTop: 'var(--sp-xs)' }}>
          أي سؤال أو استفسار — تواصلي معنا عبر القناة التي تناسبك
        </p>
      </div>

      <div className="contact-channels">
        {CHANNELS.map((ch) => (
          <a key={ch.title} href={ch.href} target="_blank" rel="noopener noreferrer" className="contact-channel-card">
            <div className="contact-channel-icon" style={{ background: ch.color + '18', color: ch.color }}>
              <ch.icon size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--fs-md)' }}>{ch.title}</h3>
              <p style={{ fontWeight: 600, marginTop: '0.15rem' }}>{ch.value}</p>
              <p className="text-muted" style={{ fontSize: 'var(--fs-xs)', marginTop: '0.2rem' }}>{ch.sub}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="contact-hours">
        <h3 style={{ fontSize: 'var(--fs-md)', marginBottom: 'var(--sp-sm)' }}>أوقات الرد</h3>
        <div className="contact-hours-grid">
          <div><strong>السبت — الخميس</strong><br /><span className="text-secondary">9:00 ص — 9:00 م</span></div>
          <div><strong>الجمعة</strong><br /><span className="text-secondary">3:00 م — 9:00 م</span></div>
        </div>
      </div>
    </div>
  );
}
