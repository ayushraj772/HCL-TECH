import { useEffect, useState } from 'react';
import { myBookings, cancelBooking } from '../../api/bookings';

const statusBadge = {
  confirmed: 'badge-success',
  cancelled: 'badge-danger',
  completed: 'badge-warn',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    myBookings()
      .then(({ bookings }) => setBookings(bookings))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const onCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    await cancelBooking(id);
    load();
  };

  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-ink-900">My bookings</h2>
        <p className="mt-1 text-sm text-ink-500">View, cancel or manage your upcoming appointments.</p>
      </div>

      {loading ? (
        <div className="card text-center text-ink-500">Loading bookings…</div>
      ) : bookings.length === 0 ? (
        <div className="card text-center text-ink-500">You have no bookings yet.</div>
      ) : (
        <div className="space-y-3">
          {bookings.map(b => (
            <div key={b._id} className="card flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-ink-900">{b.vaccineId?.name}</h4>
                  <span className={statusBadge[b.status] || 'chip'}>{b.status}</span>
                </div>
                <div className="text-sm text-ink-600">
                  {b.hospitalId?.name} · {b.hospitalId?.city}
                </div>
                <div className="text-sm text-ink-500">
                  <span className="text-ink-700">{b.date}</span> · Patient: {b.patientName} ({b.patientAge})
                </div>
                <div className="text-sm text-ink-500">
                  Code <span className="font-mono text-ink-800">{b.confirmationCode}</span> · ₹{b.lockedPrice}
                </div>
              </div>
              {b.status === 'confirmed' && (
                <button onClick={() => onCancel(b._id)} className="btn-outline border-rose-200 text-rose-700 hover:bg-rose-50">
                  Cancel booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
