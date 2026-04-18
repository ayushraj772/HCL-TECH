# Backend - Vaccine Booking API

Node.js + Express + MongoDB (Mongoose).

## Setup

```bash
cd backend
npm install
copy .env.example .env
# edit .env with your MONGO_URI
npm run seed
npm run dev
```

API: `http://localhost:5000/api`

## Structure

- `src/config/` — DB connection, environment
- `src/models/` — Mongoose schemas (User, Hospital, Vaccine, Slot, Booking)
- `src/routes/` — Express routers
- `src/controllers/` — Route handlers
- `src/middleware/` — auth, admin-check, error handler
- `src/validators/` — express-validator chains
- `src/utils/seed.js` — Seeds DB from `database/seed/*.json`

See `docs/api-spec.md` for the full API contract.
