import { useState, useEffect } from 'react';
import { searchHospitals, createHospital, updateHospital } from '../../api/hospitals';

const empty = { name: '', city: '', pincode: '', address: '', phone: '', email: '' };

export default function ManageHospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () => {
    setLoading(true);
    searchHospitals({})
      .then(d => setHospitals(d.hospitals || []))
      .catch(() => setError('Failed to load hospitals'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setError(''); setShowForm(true); };
  const openEdit = (h) => { setEditing(h); setForm({ name: h.name, city: h.city, pincode: h.pincode, address: h.address, phone: h.phone || '', email: h.email || '' }); setError(''); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); setError(''); };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSaving(true);
    try {
      if (editing) {
        await updateHospital(editing._id, form);
        setSuccess('Hospital updated successfully.');
      } else {
        await createHospital(form);
        setSuccess('Hospital created successfully.');
      }
      closeForm();
      load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-ink-900">Manage Hospitals</h2>
          <p className="mt-1 text-sm text-ink-500">Create and update hospital details.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">+ Add Hospital</button>
      </div>

      {success && <div className="mt-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">{success}</div>}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-ink-900">{editing ? 'Edit Hospital' : 'Add Hospital'}</h3>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {[
                { name: 'name', label: 'Hospital Name', placeholder: 'e.g. City Care Hospital' },
                { name: 'city', label: 'City', placeholder: 'e.g. Mumbai' },
                { name: 'pincode', label: 'Pincode', placeholder: '400001' },
                { name: 'address', label: 'Address', placeholder: 'Full address' },
                { name: 'phone', label: 'Phone', placeholder: '+91 XXXXXXXXXX' },
                { name: 'email', label: 'Email', placeholder: 'hospital@example.com' },
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-xs font-medium text-ink-600 mb-1">{f.label}</label>
                  <input
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    required={['name', 'city', 'pincode', 'address'].includes(f.name)}
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

      {/* Hospital List */}
      <div className="mt-6">
        {loading ? (
          <div className="card text-center text-ink-500 py-10">Loading…</div>
        ) : hospitals.length === 0 ? (
          <div className="card text-center text-ink-500 py-10">No hospitals yet. Click "+ Add Hospital" to create one.</div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/60 shadow-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/60 bg-white/40 text-left">
                  <th className="px-4 py-3 font-medium text-ink-600">Name</th>
                  <th className="px-4 py-3 font-medium text-ink-600">City</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Pincode</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Phone</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Status</th>
                  <th className="px-4 py-3 font-medium text-ink-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hospitals.map((h, i) => (
                  <tr key={h._id} className={`border-b border-white/40 transition hover:bg-white/40 ${i % 2 === 0 ? '' : 'bg-white/20'}`}>
                    <td className="px-4 py-3 font-medium text-ink-900">{h.name}</td>
                    <td className="px-4 py-3 text-ink-600">{h.city}</td>
                    <td className="px-4 py-3 text-ink-600">{h.pincode}</td>
                    <td className="px-4 py-3 text-ink-600">{h.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`chip ${h.active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {h.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openEdit(h)} className="btn-ghost py-1 px-3 text-xs">Edit</button>
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
