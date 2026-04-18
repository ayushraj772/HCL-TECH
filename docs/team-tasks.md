# Team Task Split

Fill in names next to the **Owner** column. Each folder works independently — people only touch their own folder so there are no merge conflicts.

---

## Person 1 — Frontend (Citizen) — Owner: _________
Work in `frontend/src/pages/citizen/` and `frontend/src/components/`.

Pages to build / polish:
- [ ] `Home.jsx` — landing page with search CTA
- [ ] `HospitalSearch.jsx` — filters (city, pincode, name, vaccine, max price) + results grid
- [ ] `HospitalDetails.jsx` — vaccine list + day-by-day availability calendar
- [ ] `BookSlot.jsx` — date picker, patient info form, confirmation
- [ ] `MyBookings.jsx` — list + cancel + modify
- [ ] `Login.jsx` / `Register.jsx`

APIs you consume: `frontend/src/api/*.js` (already wired).

---

## Person 2 — Frontend (Admin) — Owner: _________
Work in `frontend/src/pages/admin/`.

Pages to build:
- [ ] `Dashboard.jsx` — stats cards + nav tiles (done; plug real stats)
- [ ] `ManageHospitals.jsx` — create/update hospital form + table
- [ ] `ManageVaccines.jsx` — per-hospital CRUD for vaccines
- [ ] `ManageSlots.jsx` — set `totalCapacity` for (hospital, vaccine, date)
- [ ] `Bookings.jsx` — view bookings by day + export option

Use: `api/hospitals.js`, `api/vaccines.js`, `api/slots.js`, `client.get('/admin/...')`.

---

## Person 3 — Backend (API + Business Logic) — Owner: _________
Work in `backend/src/`.

Tasks:
- [ ] Tighten validators in `validators/` (express-validator on all POST/PUT)
- [ ] Add rate limiting + `helmet` for safety
- [ ] Implement `GET /admin/stats` properly (bookings-per-day aggregation)
- [ ] Prevent **duplicate booking** — same user + same (vaccine, date) should 409
- [ ] Add pagination to search endpoints
- [ ] Write Jest tests in `tests/` for booking concurrency (no-overbooking)

---

## Person 4 — Database + DevOps + Docs — Owner: _________
Work in `database/`, `docs/`, and root.

Tasks:
- [ ] Extend `database/seed/*.json` (more cities, more vaccines)
- [ ] Add `database/erd.png` (a visual ERD — can use dbdiagram.io)
- [ ] Keep `docs/api-spec.md` in sync with any backend changes
- [ ] Write `docs/demo-script.md` — step-by-step demo flow for judges
- [ ] Add GitHub Actions workflow (`.github/workflows/ci.yml`) to run `npm test`
- [ ] (Optional) Dockerfile + docker-compose for Mongo + backend + frontend

---

## Daily sync checklist
1. `git pull origin main` before you start.
2. Create a branch per task: `feat/<area>-<short-name>` (e.g. `feat/admin-manage-slots`).
3. PR into `main`; at least one other person reviews.
4. Keep backend/frontend in sync via `docs/api-spec.md` — if you change an endpoint, update the doc in the same PR.
