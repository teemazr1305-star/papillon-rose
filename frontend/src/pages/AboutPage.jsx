import Butterfly from '../components/icons/Butterfly';
import { SparkleIcon } from '../components/icons';

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container-narrow" style={{ textAlign: 'center', padding: 'var(--sp-3xl) var(--sp-md)' }}>
          <Butterfly size={44} style={{ margin: '0 auto var(--sp-sm)', color: 'var(--color-rosegold)' }} />
          <span className="eyebrow">قصتنا</span>
          <h1 className="section-title" style={{ marginTop: 'var(--sp-xs)' }}>الجمال يبدأ من هنا</h1>
          <p className="section-subtitle" style={{ margin: '0 auto', marginTop: 'var(--sp-sm)' }}>
            رحلة بدأت من شغف بالتنظيم والأناقة، ووصلت إلى متجر رقمي يساعد آلاف النساء على تنظيم حياتهن بأسلوب راقٍ.
          </p>
        </div>
      </div>

      <div className="container-narrow section">
        <div className="about-story">
          <div className="about-story-text">
            <span className="eyebrow"><SparkleIcon size={11} /> البداية</span>
            <h2 style={{ fontSize: 'var(--fs-xl)', margin: 'var(--sp-xs) 0 var(--sp-sm)' }}>من الورود إلى الرقميات</h2>
            <p className="text-secondary" style={{ lineHeight: 1.85 }}>
              بدأت Papillon Rose كمتجر صغير لبيع الورود والهدايا ذات الطابع الفراشاتي — ثم تطورت لتصبح علامة رقمية متميزة تقدم منتجات تنظيمية وإبداعية لكل امرأة تسعى لحياة أكثر جمالًا وانتظامًا.
            </p>
            <p className="text-secondary" style={{ lineHeight: 1.85, marginTop: 'var(--sp-sm)' }}>
              اسم Papillon Rose (الفراشة الوردية) ليس مجرد اسم — هو فلسفة: التحول، النمو، والأناقة في كل خطوة. مثل الفراشة التي تخرج من شرنقتها، نؤمن أن كل امرأة لديها القدرة على إعادة تنظيم حياتها وتحويلها إلى ما تحلم به.
            </p>
          </div>
          <div className="about-story-visual">
            <div className="about-logo-frame">
              <img src="/images/logo-papillon-rose.png" alt="Papillon Rose Logo" />
            </div>
          </div>
        </div>

        <div className="about-values">
          {[
            { icon: '✨', title: 'الأناقة', text: 'كل تصميم يعكس ذوقًا رفيعًا واهتمامًا بأدق التفاصيل.' },
            { icon: '🌸', title: 'الدفء', text: 'نصمم بحب ونفكر في راحة كل عميلة عند إنشاء كل منتج.' },
            { icon: '🦋', title: 'الثقة', text: 'نلتزم بتقديم منتجات ذات قيمة حقيقية تستحق كل دينار.' },
          ].map((v) => (
            <div key={v.title} className="about-value-card">
              <span style={{ fontSize: '2rem' }}>{v.icon}</span>
              <h3 style={{ fontSize: 'var(--fs-md)' }}>{v.title}</h3>
              <p className="text-secondary" style={{ fontSize: 'var(--fs-sm)' }}>{v.text}</p>
            </div>
          ))}
        </div>

        <div className="about-motto">
          <div className="motif-divider" style={{ color: 'var(--color-rosegold)', marginBottom: 'var(--sp-md)' }}>
            <span className="line" /><Butterfly size={20} /><span className="line" />
          </div>
          <p style={{ fontFamily: 'var(--font-script)', fontSize: 'var(--fs-2xl)', fontStyle: 'italic', color: 'var(--accent-primary)' }}>
            Élégance • Douceur • Confiance
          </p>
        </div>
      </div>
    </div>
  );
}
