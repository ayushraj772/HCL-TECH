import { useState, useEffect } from 'react';
import { searchHospitals } from '../../api/hospitals';
import { listVaccines } from '../../api/vaccines';
import { listSlots, upsertSlot } from '../../api/slots';

const today = () => new Date().toISOString().slice(0, 10);

export default function ManageSlots() {
  const [hospitals, setHospitals] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [slots, setSlots] = useState([]);

  const [form, setForm] = useState({ hospitalId: '', vaccineId: '', date: today(), totalCapacity: '', pricePerDose: '' });
  const [filterHospital, setFilterHospital] = useState('');
  const [filterDate, setFilterDate] = useState(today());

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    searchHospitals({}).then(d => setHospitals(d.hospitals || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.hospitalId) { setVaccines([]); return; }
    listVaccines({ hospitalId: form.hospitalId }).then(d => setVaccines(d.vaccines || [])).catch(() => {});
  }, [form.hospitalId]);

  const loadSlots = () => {
    if (!filterHospital && !filterDate) return;
    setLoading(true);
    const params = {};
    if (filterHospital) params.hospitalId = filterHospital;
    if (filterDate) params.date = filterDate;
    listSlots(params)
      .then(d => setSlots(d.slots || []))
      .catch(() => setError('Failed to load slots'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadSlots(); }, [filterHospital, filterDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'hospitalId') {
      setForm(f => ({ ...f, hospitalId: value, vaccineId: '' }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSaving(true);
    try {
      await upsertSlot({
        hospitalId: form.hospitalId,
        vaccineId: form.vaccineId,
        date: form.date,
        totalCapacity: Number(form.totalCapacity),
        pricePerDose: Number(form.pricePerDose),
      });
      setSuccess('Slot saved successfully.');
      setForm(f => ({ ...f, totalCapacity: '', pricePerDose: '' }));
      // Sync the filter to match the slot we just created so it appears in the table
      setFilterHospital(form.hospitalId);
      setFilterDate(form.date);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const fillEdit = (slot) => {
    setForm({
      hospitalId: slot.hospitalId?._id || slot.hospitalId,
      vaccineId: slot.vaccineId?._id || slot.vaccineId,
      date: slot.date,
      totalCapacity: slot.totalCapacity,
      pricePerDose: slot.pricePerDose,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-ink-900">Manage Slots</h2>
        <p className="mt-1 text-sm text-ink-500">Set daily capacity per hospital, vaccine, and date.</p>
      </div>

      {success && <div className="mt-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{success}</div>}
      {error && <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>}

      {/* Upsert Form */}
      <div className="card mt-6">
        <h3 className="text-base font-semibold text-ink-900 mb-4">Create / Update Slot</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1">Hospital *</label>
            <select name="hospitalId" value={form.hospitalId} onChange={handleChange} required
              className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink-900 shadow-sm outline-none focus:ring-2 focus:ring-ink-900/20">
              <option value="">Select hospital</option>
              {hospitals.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1">Vaccine *</label>
            <select name="vaccineId" value={form.vaccineId} onChange={handleChange} required
              disabled={!form.hospitalId}
              className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink-900 shadow-sm outline-none focus:ring-2 focus:ring-ink-900/20 disabled:opacity-50">
              <option value="">{form.hospitalId ? 'Select vaccine' : 'Select hospital first'}</option>
              {vaccines.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1">Date *</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} required min={today()}
              className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink-900 shadow-sm outline-none focus:ring-2 focus:ring-ink-900/20" />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1">Total Capacity *</label>
            <input type="number" name="totalCapacity" value={form.totalCapacity} onChange={handleChange} required min="1" placeholder="e.g. 50"
              className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink-900 shadow-sm outline-none focus:ring-2 focus:ring-ink-900/20" />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1">Price per Dose (₹) *</label>
            <input type="number" name="pricePerDose" value={form.pricePerDose} onChange={handleChange} required min="0" placeholder="e.g. 500"
              className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink-900 shadow-sm outline-none focus:ring-2 focus:ring-ink-900/20" />
          </div>

          <div className="flex items-end">
            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? 'Saving…' : 'Save Slot'}
            </button>
          </div>
        </form>
      </div>

      {/* Slots Table */}
      <div className="mt-8">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h3 className="text-base font-semibold text-ink-900">Existing Slots</h3>
          <select value={filterHospital} onChange={e => setFilterHospital(e.target.value)}
            className="rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink-900 shadow-sm outline-none focus:ring-2 focus:ring-ink-900/20">
            <option value="">All hospitals</option>
            {hospitals.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
          </select>
          <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
            className="rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink-900 shadow-sm outline-none focus:ring-2 focus:ring-ink-900/20" />
        </div>

        {loading ? (
          <div className="card text-center text-ink-500 py-8">Loading…</div>
        ) : slots.length === 0 ? (
          <div className="card text-center text-ink-500 py-8">No slots found for selected filters.</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/60 bg-white/40 text-left">
                  <th className="px-4 py-3 font-medium text-ink-600">Date</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Hospital</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Vaccine</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Capacity</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Booked</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Available</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Price</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((s, i) => {
                  const available = s.totalCapacity - s.bookedCount;
                  return (
                    <tr key={s._id} className={`border-b border-white/40 transition hover:bg-white/40 ${i % 2 === 0 ? '' : 'bg-white/20'}`}>
                      <td className="px-4 py-3 font-medium text-ink-900">{s.date}</td>
                      <td className="px-4 py-3 text-ink-600">{s.hospitalId?.name || '—'}</td>
                      <td className="px-4 py-3 text-ink-600">{s.vaccineId?.name || '—'}</td>
                      <td className="px-4 py-3 text-ink-600">{s.totalCapacity}</td>
                      <td className="px-4 py-3 text-ink-600">{s.bookedCount}</td>
                      <td className="px-4 py-3">
                        <span className={`chip ${available > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {available}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink-600">₹{s.pricePerDose}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => fillEdit(s)} className="btn-ghost py-1 px-3 text-xs">Edit</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
