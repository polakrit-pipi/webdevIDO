'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Zap, Eye, EyeOff, Loader } from 'lucide-react';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/login', { email, password });
      localStorage.setItem('admin_token', data.token);
      toast.success('Welcome back!');
      router.push('/');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0f172a',
    }}>
      <div style={{
        width: '100%', maxWidth: 400, padding: '0 16px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 52, height: 52, background: '#6366f1', borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <Zap size={26} color="#fff" />
          </div>
          <h1 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 800, margin: 0 }}>ideabyido Admin</h1>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>Sign in to your admin account</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#1e293b', borderRadius: 16, padding: 32,
          border: '1px solid #334155',
        }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ color: '#cbd5e1' }}>Email</label>
              <input
                id="admin-email"
                type="email"
                className="form-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@ideabyido.com"
                required
                style={{ background: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
              />
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label" style={{ color: '#cbd5e1' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-password"
                  type={show ? 'text' : 'password'}
                  className="form-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ background: '#0f172a', borderColor: '#334155', color: '#f1f5f9', paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#64748b',
                  }}
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '11px 16px', fontSize: 14 }}
            >
              {loading ? <Loader size={16} className="animate-spin" /> : null}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
