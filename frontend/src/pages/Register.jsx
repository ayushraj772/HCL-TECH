import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'citizen' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="mx-auto max-w-md pt-10">
      <div className="glass-strong rounded-3xl p-8">
        <h2 className="text-2xl font-bold tracking-tight text-ink-900">Create your account</h2>
        <p className="mt-1 text-sm text-ink-500">Join VaxBook to find and book vaccination slots.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="label">Full name</label>
            <input name="name" required placeholder="Jane Doe" value={form.name} onChange={onChange} className="input" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Email</label>
              <input name="email" type="email" required placeholder="you@example.com" value={form.email} onChange={onChange} className="input" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input name="phone" placeholder="+91 9…" value={form.phone} onChange={onChange} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Password (min 6)</label>
            <input name="password" type="password" required placeholder="••••••••" value={form.password} onChange={onChange} className="input" />
          </div>
          <div>
            <label className="label">Role</label>
            <select name="role" value={form.role} onChange={onChange} className="input">
              <option value="citizen">Citizen</option>
              <option value="admin">Hospital Admin</option>
            </select>
          </div>
          {error && (
            <div className="rounded-xl border border-rose-200/70 bg-rose-50/60 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
          <button disabled={loading} className="btn-primary w-full py-3 text-base">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-500 text-center">
          Already have an account? <Link to="/login" className="font-medium text-ink-900 underline-offset-2 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
