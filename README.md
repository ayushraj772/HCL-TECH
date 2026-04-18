# VaxBook — Hospital Vaccine Search & Slot Booking

Full-stack hackathon project. Citizens search hospitals, compare vaccine prices, and book daily slots. Hospital admins manage hospitals, vaccines, and capacity.

## Repo Structure

```
HCL_Tech_Hackathon/
├── frontend/     React + Vite + Tailwind (Citizen + Admin UI)
├── backend/      Node.js + Express + Mongoose REST API
├── database/     Mongo schema docs + JSON seed data
└── docs/         Problem statement, API spec, team task split
```

## Tech Stack

| Layer     | Choice |
|-----------|--------|
| Frontend  | React 18, Vite, React Router, Tailwind CSS, Axios |
| Backend   | Node.js, Express, Mongoose, JWT, bcrypt |
| Database  | MongoDB |
| Auth      | JWT in `Authorization: Bearer` header |

## Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas URI)

### 2. Backend
```bash
cd backend
npm install
copy .env.example .env
npm run seed      # populates demo hospitals, vaccines, 7 days of slots, demo users
npm run dev       # http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
copy .env.example .env
npm run dev       # http://localhost:5173
```

### 4. Demo accounts (after seeding)
- Citizen: `citizen@demo.com` / `pass1234`
- Admin:   `admin@demo.com` / `pass1234`

## Key Design Choices

- **Count-based slots** — each `(hospital, vaccine, date)` row carries `totalCapacity` + `bookedCount`. Simpler than time-based slots and matches the problem statement's "daily capacity" language.
- **Atomic no-overbooking** — bookings use a single `findOneAndUpdate` with `$expr: { $lt: ['$bookedCount', '$totalCapacity'] }` so two concurrent requests can never both succeed when only one slot is left.
- **Price transparency** — the slot's `pricePerDose` is copied into the booking as `lockedPrice` at confirmation time.
- **Role separation** — `requireAuth` + `requireAdmin` middleware; frontend has `RequireAuth` + `RequireAdmin` route guards.

## Docs

- Problem statement: [`docs/problem-statement.md`](./docs/problem-statement.md)
- API spec: [`docs/api-spec.md`](./docs/api-spec.md)
- DB schema: [`database/schema.md`](./database/schema.md)
- **Team task split:** [`docs/team-tasks.md`](./docs/team-tasks.md) ← start here
