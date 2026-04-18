import { Link } from 'react-router-dom';

export default function HospitalCard({ hospital }) {
  return (
    <div className="card card-hover flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M12 9v6M9 12h6"/>
            </svg>
          </div>
          <span className="chip">{hospital.pincode}</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-ink-900">{hospital.name}</h3>
        <p className="text-sm text-ink-500">{hospital.city}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">{hospital.address}</p>
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-white/60 pt-4">
        <span className="text-xs text-ink-500">View vaccines & slots</span>
        <Link to={`/hospitals/${hospital._id}`} className="btn-primary">
          Open
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </Link>
      </div>
    </div>
  );
}
