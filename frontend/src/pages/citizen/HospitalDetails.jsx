import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHospital, getHospitalVaccines, getHospitalAvailability } from '../../api/hospitals';

export default function HospitalDetails() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [vaccines, setVaccines] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [h, v, a] = await Promise.all([
          getHospital(id),
          getHospitalVaccines(id),
          getHospitalAvailability(id, {}),
        ]);
        setHospital(h.hospital);
        setVaccines(v.vaccines);
        setSlots(a.slots);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return <div className="card mt-6 text-center text-ink-500">Loading hospital…</div>;
  }
  if (!hospital) {
    return <div className="card mt-6 text-center text-ink-500">Hospital not found.</div>;
  }

  const slotsByDate = slots.reduce((acc, s) => {
    (acc[s.date] = acc[s.date] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-8 pt-4">
      {/* Header */}
      <div className="glass-strong rounded-3xl p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="chip mb-3">{hospital.city}</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-ink-900">{hospital.name}</h2>
            <p className="mt-2 text-ink-600">{hospital.address}</p>
            <p className="mt-1 text-sm text-ink-500">
              Pincode <span className="text-ink-700">{hospital.pincode}</span>
              {hospital.phone && <> · {hospital.phone}</>}
            </p>
          </div>
          <Link to="/search" className="btn-ghost w-fit">← Back to search</Link>
        </div>
      </div>

      {/* Vaccines */}
      <section>
        <h3 className="mb-4 text-xl font-semibold text-ink-900">Vaccines offered</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vaccines.map(v => (
            <div key={v._id} className="card card-hover flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-semibold text-ink-900">{v.name}</div>
                {v.manufacturer && <div className="text-sm text-ink-500">{v.manufacturer}</div>}
                {v.description && <p className="mt-2 text-sm text-ink-600">{v.description}</p>}
                <div className="mt-3 text-sm text-ink-500">Per dose</div>
                <div className="text-2xl font-semibold tracking-tight text-ink-900">₹{v.pricePerDose}</div>
              </div>
              <Link to={`/book/${hospital._id}/${v._id}`} className="btn-primary self-end">Book</Link>
            </div>
          ))}
          {vaccines.length === 0 && (
            <div className="card col-span-full text-center text-ink-500">No vaccines listed for this hospital.</div>
          )}
        </div>
      </section>

      {/* Availability */}
      <section>
        <h3 className="mb-4 text-xl font-semibold text-ink-900">Upcoming availability</h3>
        {Object.keys(slotsByDate).length === 0 ? (
          <div className="card text-center text-ink-500">No upcoming slots.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(slotsByDate).map(([date, daySlots]) => (
              <div key={date} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm uppercase tracking-wider text-ink-500">Date</div>
                  <div className="font-semibold text-ink-900">{date}</div>
                </div>
                <ul className="space-y-2">
                  {daySlots.map(s => {
                    const available = s.totalCapacity - s.bookedCount;
                    return (
                      <li key={s._id} className="flex items-center justify-between rounded-xl bg-white/50 border border-white/60 px-3 py-2">
                        <div>
                          <div className="text-sm font-medium text-ink-800">{s.vaccineId?.name}</div>
                          <div className="text-xs text-ink-500">₹{s.pricePerDose} per dose</div>
                        </div>
                        {available > 0 ? (
                          <span className="badge-success">{available} left</span>
                        ) : (
                          <span className="badge-danger">Full</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
