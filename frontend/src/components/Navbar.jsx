import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition ${
      isActive ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-white/60'
    }`;

  return (
    <header className="sticky top-0 z-40">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="glass flex items-center justify-between rounded-2xl px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-ink-900 text-white shadow-soft">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 15h2v2h-2zM11 7h2v6h-2z"/>
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </span>
            <span className="text-lg font-semibold tracking-tight text-ink-900">VaxBook</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/search" className={linkClass}>Search</NavLink>
            {user && <NavLink to="/my-bookings" className={linkClass}>My Bookings</NavLink>}
            {user?.role === 'admin' && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-ink-500">Hi, <span className="text-ink-800 font-medium">{user.name}</span></span>
                <button onClick={logout} className="btn-ghost">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn-ghost">Login</NavLink>
                <NavLink to="/register" className="btn-primary">Register</NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
