import { useState, useEffect } from 'react';
import { listVaccines, createVaccine, updateVaccine, deleteVaccine } from '../../api/vaccines';
import { searchHospitals } from '../../api/hospitals';

const empty = { hospitalId: '', name: '', manufacturer: '', pricePerDose: '', description: '' };

export default function ManageVaccines() {
  const [vaccines, setVaccines] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [filterHospital, setFilterHospital] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadHospitals = () =>
    searchHospitals({}).then(d => setHospitals(d.hospitals || [])).catch(() => {});

  const loadVaccines = (hospitalId = filterHospital) => {
    setLoading(true);
    const params = hospitalId ? { hospitalId } : {};
    listVaccines(params)
      .then(d => setVaccines(d.vaccines || []))
      .catch(() => setError('Failed to load vaccines'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadHospitals(); loadVaccines(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setError(''); setShowForm(true); };
  const openEdit = (v) => {
    setEditing(v);
    setForm({
      hospitalId: v.hospitalId?._id || v.hospitalId || '',
      name: v.name,
      manufacturer: v.manufacturer || '',
      pricePerDose: v.pricePerDose,
      description: v.description || '',
    });
    setError('');
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditing(null); setError(''); };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFilter = (e) => {
    setFilterHospital(e.target.value);
    loadVaccines(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSaving(true);
    try {
      const payload = { ...form, pricePerDose: Number(form.pricePerDose) };
      if (editing) {
        await updateVaccine(editing._id, payload);
        setSuccess('Vaccine updated.');
      } else {
        await createVaccine(payload);
        setSuccess('Vaccine created.');
      }
      closeForm();
      loadVaccines();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (v) => {
    if (!confirm(`Delete "${v.name}"? This will deactivate it.`)) return;
    try {
      await deleteVaccine(v._id);
      setSuccess('Vaccine deleted.');
      loadVaccines();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ink-900">Manage Vaccines</h2>
          <p className="mt-1 text-sm text-ink-500">Define vaccines offered by each hospital and cost per dose.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add Vaccine</button>
      </div>

      {success && <div className="mt-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{success}</div>}
      {error && !showForm && <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>}

      {/* Filter */}
      <div className="mt-5 flex items-center gap-3">
        <label className="text-sm font-medium text-ink-600">Filter by hospital:</label>
        <select value={filterHospital} onChange={handleFilter}
          className="rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink-900 shadow-sm outline-none focus:ring-2 focus:ring-ink-900/20">
          <option value="">All hospitals</option>
          {hospitals.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-ink-900">{editing ? 'Edit Vaccine' : 'Add Vaccine'}</h3>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-ink-600 mb-1">Hospital *</label>
                <select name="hospitalId" value={form.hospitalId} onChange={handleChange} required
                  className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink-900 shadow-sm outline-none focus:ring-2 focus:ring-ink-900/20">
                  <option value="">Select hospital</option>
                  {hospitals.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                </select>
              </div>
              {[
                { name: 'name', label: 'Vaccine Name *', placeholder: 'e.g. Covaxin' },
                { name: 'manufacturer', label: 'Manufacturer', placeholder: 'e.g. Bharat Biotech' },
                { name: 'pricePerDose', label: 'Price per Dose (₹) *', placeholder: '500', type: 'number' },
                { name: 'description', label: 'Description', placeholder: 'Brief description' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-medium text-ink-600 mb-1">{f.label}</label>
                  <input
                    name={f.name}
                    type={f.type || 'text'}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    required={f.label.includes('*')}
                    min={f.type === 'number' ? '0' : undefined}
                    className="w-full rounded-xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink-900 shadow-sm outline-none focus:ring-2 focus:ring-ink-900/20"
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={closeForm} className="btn-ghost flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vaccine List */}
      <div className="mt-6">
        {loading ? (
          <div className="card text-center text-ink-500 py-10">Loading…</div>
        ) : vaccines.length === 0 ? (
          <div className="card text-center text-ink-500 py-10">No vaccines found. Click "+ Add Vaccine" to create one.</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/60 bg-white/40 text-left">
                  <th className="px-4 py-3 font-medium text-ink-600">Vaccine</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Hospital</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Manufacturer</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Price/Dose</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Status</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vaccines.map((v, i) => (
                  <tr key={v._id} className={`border-b border-white/40 transition hover:bg-white/40 ${i % 2 === 0 ? '' : 'bg-white/20'}`}>
                    <td className="px-4 py-3 font-medium text-ink-900">{v.name}</td>
                    <td className="px-4 py-3 text-ink-600">{v.hospitalId?.name || '—'}</td>
                    <td className="px-4 py-3 text-ink-600">{v.manufacturer || '—'}</td>
                    <td className="px-4 py-3 text-ink-600">₹{v.pricePerDose}</td>
                    <td className="px-4 py-3">
                      <span className={`chip ${v.active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {v.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => openEdit(v)} className="btn-ghost py-1 px-3 text-xs">Edit</button>
                      <button onClick={() => handleDelete(v)} className="rounded-lg px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition">Delete</button>
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
