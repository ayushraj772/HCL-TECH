# Frontend - Vaccine Booking (React + Vite + Tailwind)

## Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Dev server: `http://localhost:5173` (proxies `/api` to `http://localhost:5000`).

## Structure

- `src/api/` — axios clients (auth, hospitals, vaccines, slots, bookings)
- `src/components/` — shared UI (Navbar, HospitalCard, RequireAuth, RequireAdmin)
- `src/context/AuthContext.jsx` — user + JWT auth state
- `src/pages/citizen/` — Citizen flow (search, details, book, my bookings)
- `src/pages/admin/` — Admin flow (dashboard, hospitals, vaccines, slots, bookings)
- `src/pages/Login.jsx`, `Register.jsx`
