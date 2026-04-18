import { useEffect, useState } from 'react';
import { searchHospitals } from '../../api/hospitals';
import HospitalCard from '../../components/HospitalCard';

export default function HospitalSearch() {
  const [filters, setFilters] = useState({ city: '', pincode: '', name: '', vaccine: '', maxPrice: '' });
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const { hospitals } = await searchHospitals(filters);
      setHospitals(hospitals);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reach the server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });
  const reset = () => {
    setFilters({ city: '', pincode: '', name: '', vaccine: '', maxPrice: '' });
    setTimeout(fetchData, 0);
  };

  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-ink-900">Search hospitals</h2>
        <p className="mt-1 text-sm text-ink-500">Filter by location, vaccine and max price.</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); fetchData(); }}
        className="card"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="label">City</label>
            <input name="city" value={filters.city} onChange={onChange} placeholder="Bangalore" className="input" />
          </div>
          <div>
            <label className="label">Pincode</label>
            <input name="pincode" value={filters.pincode} onChange={onChange} placeholder="560001" className="input" />
          </div>
          <div>
            <label className="label">Hospital name</label>
            <input name="name" value={filters.name} onChange={onChange} placeholder="Apollo" className="input" />
          </div>
          <div>
            <label className="label">Vaccine</label>
            <input name="vaccine" value={filters.vaccine} onChange={onChange} placeholder="Covishield" className="input" />
          </div>
          <div>
            <label className="label">Max price (₹)</label>
            <input name="maxPrice" value={filters.maxPrice} onChange={onChange} placeholder="1000" type="number" className="input" />
          </div>
        </div>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button type="button" onClick={reset} className="btn-outline">Reset</button>
          <button className="btn-primary">Apply filters</button>
        </div>
      </form>

      {error && (
        <div className="card border-rose-200/70 bg-rose-50/60 text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-10 w-10 rounded-xl bg-ink-200/70" />
              <div className="mt-4 h-5 w-1/2 rounded bg-ink-200/70" />
              <div className="mt-2 h-4 w-1/3 rounded bg-ink-200/60" />
              <div className="mt-4 h-4 w-full rounded bg-ink-200/40" />
              <div className="mt-1 h-4 w-2/3 rounded bg-ink-200/40" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-ink-500">
            <span>{hospitals.length} result{hospitals.length === 1 ? '' : 's'}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospitals.map(h => <HospitalCard key={h._id} hospital={h} />)}
            {hospitals.length === 0 && (
              <div className="card col-span-full text-center text-ink-500">
                No hospitals match your filters.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
