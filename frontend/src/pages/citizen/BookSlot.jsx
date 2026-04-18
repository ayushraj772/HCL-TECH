import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHospital, getHospitalAvailability } from '../../api/hospitals';
import { createBooking } from '../../api/bookings';

export default function BookSlot() {
  const { hospitalId, vaccineId } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState('');
  const [form, setForm] = useState({ patientName: '', patientAge: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const [h, a] = await Promise.all([
        getHospital(hospitalId),
        getHospitalAvailability(hospitalId, { vaccineId }),
      ]);
      setHospital(h.hospital);
      setSlots(a.slots);
    })();
  }, [hospitalId, vaccineId]);

  const selectedSlot = useMemo(() => slots.find(s => s.date === date), [slots, date]);
  const vaccineName = slots[0]?.vaccineId?.name;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { booking } = await createBooking({
        hospitalId,
        vaccineId,
        date,
        patientName: form.patientName,
        patientAge: Number(form.patientAge),
      });
      alert(`Booking confirmed!\nConfirmation code: ${booking.confirmationCode}`);
      navigate('/my-bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl pt-4">
      <h2 className="text-3xl font-bold tracking-tight text-ink-900">Book a slot</h2>
      <p className="mt-1 text-sm text-ink-500">
        {hospital?.name}{vaccineName && ` · ${vaccineName}`}
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
        <form onSubmit={submit} className="card md:col-span-3 space-y-5">
          <div>
            <label className="label">Select date</label>
            <select value={date} onChange={(e) => setDate(e.target.value)} required className="input">
              <option value="">— choose a date —</option>
              {slots.map(s => {
                const available = s.totalCapacity - s.bookedCount;
                return (
                  <option key={s._id} value={s.date} disabled={available <= 0}>
                    {s.date} · {available > 0 ? `${available} left · ₹${s.pricePerDose}` : 'Full'}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Patient name</label>
              <input
                required
                placeholder="Full name"
                value={form.patientName}
                onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Patient age</label>
              <input
                required
                type="number"
                min="0"
                max="120"
                placeholder="Age"
                value={form.patientAge}
                onChange={(e) => setForm({ ...form, patientAge: e.target.value })}
                className="input"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200/70 bg-rose-50/60 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button disabled={submitting} className="btn-primary w-full py-3 text-base">
            {submitting ? 'Booking…' : 'Confirm booking'}
          </button>
        </form>

        {/* Summary */}
        <aside className="card md:col-span-2 h-fit">
          <div className="text-xs uppercase tracking-wider text-ink-500">Summary</div>
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-500">Hospital</span>
              <span className="text-ink-800 font-medium text-right">{hospital?.name || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">Vaccine</span>
              <span className="text-ink-800 font-medium">{vaccineName || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">Date</span>
              <span className="text-ink-800 font-medium">{date || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-500">Availability</span>
              <span className="text-ink-800 font-medium">
                {selectedSlot ? `${selectedSlot.totalCapacity - selectedSlot.bookedCount} left` : '—'}
              </span>
            </div>
            <div className="border-t border-white/60 pt-3 flex justify-between items-baseline">
              <span className="text-ink-500">Price locked</span>
              <span className="text-2xl font-semibold tracking-tight text-ink-900">
                {selectedSlot ? `₹${selectedSlot.pricePerDose}` : '—'}
              </span>
            </div>
          </div>
          <p className="mt-4 text-xs text-ink-500 leading-relaxed">
            Your price is captured at the moment of booking and will not change if the hospital updates rates later.
          </p>
        </aside>
      </div>
    </div>
  );
}
