import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Butterfly from '../icons/Butterfly';
import { LockIcon, MailIcon } from '../icons';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div style={{ textAlign: 'center', marginBottom: 'var(--sp-lg)' }}>
          <Butterfly size={36} style={{ margin: '0 auto var(--sp-xs)', color: 'var(--color-rosegold)' }} />
          <h1 style={{ fontSize: 'var(--fs-xl)' }}>لوحة التحكم</h1>
          <p className="text-muted" style={{ fontSize: 'var(--fs-sm)', marginTop: '0.25rem' }}>Papillon Rose</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-sm)' }}>
          <div className="field">
            <label htmlFor="admin-email">البريد الإلكتروني</label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-email" type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@papillonrose.com"
                style={{ paddingRight: '2.5rem' }}
              />
              <MailIcon size={16} style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="admin-pw">كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-pw" type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingRight: '2.5rem' }}
              />
              <LockIcon size={16} style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>
          {error && <p className="field-error" style={{ padding: '0.6rem', background: '#FEE8E8', borderRadius: 8 }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 'var(--sp-xs)' }}>
            {loading ? <span className="spinner" /> : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
