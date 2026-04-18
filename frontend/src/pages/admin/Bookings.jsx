import { useState, useEffect } from 'react';
import { getBookingsByDay } from '../../api/admin';
import { searchHospitals } from '../../api/hospitals';

const STATUS_COLORS = {
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  completed: 'bg-blue-100 text-blue-700',
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [date, setDate] = useState('');        // empty = all dates
  const [hospitalId, setHospitalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    searchHospitals({}).then(d => setHospitals(d.hospitals || [])).catch(() => {});
  }, []);

  const load = () => {
    setLoading(true);
    setError('');
    const params = { _t: Date.now() };   // cache-bust so 304 never occurs
    if (date) params.date = date;
    if (hospitalId) params.hospitalId = hospitalId;
    getBookingsByDay(params)
      .then(d => setBookings(d.bookings || []))
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [date, hospitalId]);

  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  const cancelled = bookings.filter(b => b.status === 'cancelled').length;

  return (
    <div className="pt-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-ink-900">Bookings</h2>
        <p className="mt-1 text-sm text-ink-500">View and filter bookings by date and hospital.</p>
      </div>

      {/* Filters */}
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-ink-600">Date:</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink-900 shadow-sm outline-none focus:ring-2 focus:ring-ink-900/20" />
          {date && (
            <button onClick={() => setDate('')} className="text-xs text-ink-400 hover:text-ink-700 underline">
              Clear
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-ink-600">Hospital:</label>
          <select value={hospitalId} onChange={e => setHospitalId(e.target.value)}
            className="rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink-900 shadow-sm outline-none focus:ring-2 focus:ring-ink-900/20">
            <option value="">All hospitals</option>
            {hospitals.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
          </select>
        </div>
        <button onClick={load} className="btn-primary py-2 px-4 text-sm">Refresh</button>
      </div>

      {/* Stats Strip */}
      {!loading && bookings.length > 0 && (
        <div className="mt-4 flex gap-4">
          <div className="card flex-1 text-center py-3">
            <p className="text-2xl font-bold text-ink-900">{bookings.length}</p>
            <p className="text-xs text-ink-500 mt-0.5">Total</p>
          </div>
          <div className="card flex-1 text-center py-3">
            <p className="text-2xl font-bold text-green-600">{confirmed}</p>
            <p className="text-xs text-ink-500 mt-0.5">Confirmed</p>
          </div>
          <div className="card flex-1 text-center py-3">
            <p className="text-2xl font-bold text-red-500">{cancelled}</p>
            <p className="text-xs text-ink-500 mt-0.5">Cancelled</p>
          </div>
        </div>
      )}

      {error && <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>}

      {/* Bookings Table */}
      <div className="mt-6">
        {loading ? (
          <div className="card text-center text-ink-500 py-10">Loading…</div>
        ) : bookings.length === 0 ? (
          <div className="card text-center text-ink-500 py-10">
            No bookings found.{date ? ` Try clearing the date filter to see all bookings.` : ''}
          </div>
        ) : (
          <div className="overflow-x-auto overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/60 bg-white/40 text-left">
                  <th className="px-4 py-3 font-medium text-ink-600">Code</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Patient</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Age</th>
                  <th className="px-4 py-3 font-medium text-ink-600">User</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Hospital</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Vaccine</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Date</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Price</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={b._id} className={`border-b border-white/40 transition hover:bg-white/40 ${i % 2 === 0 ? '' : 'bg-white/20'}`}>
                    <td className="px-4 py-3 font-mono text-xs font-medium text-ink-900">{b.confirmationCode}</td>
                    <td className="px-4 py-3 text-ink-900">{b.patientName}</td>
                    <td className="px-4 py-3 text-ink-600">{b.patientAge}</td>
                    <td className="px-4 py-3">
                      <div className="text-ink-900">{b.userId?.name || '—'}</div>
                      <div className="text-xs text-ink-500">{b.userId?.phone || b.userId?.email || ''}</div>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{b.hospitalId?.name || '—'}</td>
                    <td className="px-4 py-3 text-ink-600">{b.vaccineId?.name || '—'}</td>
                    <td className="px-4 py-3 text-ink-600">{b.date}</td>
                    <td className="px-4 py-3 text-ink-600">₹{b.lockedPrice}</td>
                    <td className="px-4 py-3">
                      <span className={`chip ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-600'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
