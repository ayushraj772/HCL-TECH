import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Smart search',
    desc: 'Filter by city, pincode, vaccine type and price — find what you need in one view.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
    ),
  },
  {
    title: 'Daily availability',
    desc: 'See live, day-by-day slot capacity for every hospital and every vaccine.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
    ),
  },
  {
    title: 'Price transparency',
    desc: 'Compare cost per dose across hospitals. Price is locked the moment you book.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    ),
  },
  {
    title: 'No overbooking',
    desc: 'Atomic capacity checks guarantee your slot is real — or you fail gracefully.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="space-y-10 pt-6">
      {/* Hero */}
      <section className="glass-strong rounded-3xl px-6 py-14 md:px-14 md:py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="chip mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live hospital availability
          </span>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-ink-900">
            Find. Compare. <span className="italic text-ink-700">Book.</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-ink-600">
            Search nearby hospitals offering specific vaccines, check daily availability, and
            book a slot in seconds — with locked pricing and instant confirmation.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/search" className="btn-primary px-6 py-3 text-base">
              Search Hospitals
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/register" className="btn-ghost px-6 py-3 text-base">Create account</Link>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="card card-hover">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-white">
              {f.icon}
            </div>
            <h3 className="text-base font-semibold text-ink-900">{f.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Stats strip */}
      <section className="glass rounded-2xl px-6 py-6 md:py-7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { k: '4+', v: 'Partner hospitals' },
            { k: '9+', v: 'Vaccines available' },
            { k: '7-day', v: 'Forward booking' },
            { k: '100%', v: 'Price locked' },
          ].map((s) => (
            <div key={s.v}>
              <div className="text-2xl md:text-3xl font-semibold tracking-tight text-ink-900">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-ink-500">{s.v}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
