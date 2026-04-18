import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/citizen/Home';
import HospitalSearch from './pages/citizen/HospitalSearch';
import HospitalDetails from './pages/citizen/HospitalDetails';
import BookSlot from './pages/citizen/BookSlot';
import MyBookings from './pages/citizen/MyBookings';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import ManageHospitals from './pages/admin/ManageHospitals';
import ManageVaccines from './pages/admin/ManageVaccines';
import ManageSlots from './pages/admin/ManageSlots';
import AdminBookings from './pages/admin/Bookings';
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';

export default function App() {
  return (
    <div className="relative min-h-screen">
      {/* Decorative blurred orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#c7d0c0] opacity-50 blur-3xl" />
        <div className="absolute top-10 right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-[#e4dcc8] opacity-50 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-[#d3cbbb] opacity-40 blur-3xl" />
      </div>

      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<HospitalSearch />} />
          <Route path="/hospitals/:id" element={<HospitalDetails />} />
          <Route path="/book/:hospitalId/:vaccineId" element={<RequireAuth><BookSlot /></RequireAuth>} />
          <Route path="/my-bookings" element={<RequireAuth><MyBookings /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="/admin/hospitals" element={<RequireAdmin><ManageHospitals /></RequireAdmin>} />
          <Route path="/admin/vaccines" element={<RequireAdmin><ManageVaccines /></RequireAdmin>} />
          <Route path="/admin/slots" element={<RequireAdmin><ManageSlots /></RequireAdmin>} />
          <Route path="/admin/bookings" element={<RequireAdmin><AdminBookings /></RequireAdmin>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
