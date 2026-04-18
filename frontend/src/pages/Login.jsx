import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md pt-10">
      <div className="glass-strong rounded-3xl p-8">
        <h2 className="text-2xl font-bold tracking-tight text-ink-900">Welcome back</h2>
        <p className="mt-1 text-sm text-ink-500">Sign in to book vaccines and manage your appointments.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" required placeholder="you@example.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input" />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" required placeholder="••••••••" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input" />
          </div>
          {error && (
            <div className="rounded-xl border border-rose-200/70 bg-rose-50/60 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
          <button disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-500 text-center">
          Don't have an account? <Link to="/register" className="font-medium text-ink-900 underline-offset-2 hover:underline">Register</Link>
        </p>
      </div>

      <p className="mt-4 text-center text-xs text-ink-500">
        Demo: <span className="font-mono">citizen@demo.com</span> / <span className="font-mono">pass1234</span>
      </p>
    </div>
  );
}
