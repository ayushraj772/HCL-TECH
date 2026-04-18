# Database

- **Engine:** MongoDB (local or Atlas).
- **ODM:** Mongoose (models live in `backend/src/models/`).
- **Schema documentation:** [schema.md](./schema.md).
- **Seed data:** JSON files in `seed/`. Loaded by `backend/src/utils/seed.js`.

## Running the seed

```bash
cd backend
npm run seed
```

This wipes and re-populates hospitals, vaccines, 7 days of slots, and demo users:

| Role    | Email              | Password |
|---------|--------------------|----------|
| citizen | citizen@demo.com   | pass1234 |
| admin   | admin@demo.com     | pass1234 |
