# API Specification

Base URL: `http://localhost:5000/api`

All authenticated endpoints require header: `Authorization: Bearer <JWT>`.

---

## Auth

### `POST /auth/register`
Body: `{ name, email, password, phone?, role? }` (`role` = `citizen` | `admin`)
→ `{ user, token }`

### `POST /auth/login`
Body: `{ email, password }` → `{ user, token }`

### `GET /auth/me` 🔒
→ `{ user }`

---

## Hospitals

### `GET /hospitals`
Query: `city`, `pincode`, `name`, `vaccine`, `maxPrice`
→ `{ hospitals: [...] }`

### `GET /hospitals/:id`
→ `{ hospital }`

### `GET /hospitals/:id/vaccines`
→ `{ vaccines: [...] }`

### `GET /hospitals/:id/availability`
Query: `from`, `to` (YYYY-MM-DD), `vaccineId`
→ `{ slots: [...] }`

### `POST /hospitals` 🔒 admin
Body: `{ name, city, pincode, address, phone?, email? }` → `{ hospital }`

### `PUT /hospitals/:id` 🔒 admin → `{ hospital }`

---

## Vaccines

### `GET /vaccines`
Query: `hospitalId`, `name` → `{ vaccines: [...] }`

### `POST /vaccines` 🔒 admin
Body: `{ hospitalId, name, manufacturer?, pricePerDose, description? }`

### `PUT /vaccines/:id` 🔒 admin
### `DELETE /vaccines/:id` 🔒 admin (soft delete)

---

## Slots

### `GET /slots`
Query: `hospitalId`, `vaccineId`, `date` → `{ slots: [...] }`

### `POST /slots` 🔒 admin (upsert)
Body: `{ hospitalId, vaccineId, date, totalCapacity, pricePerDose }`

### `PUT /slots/:id` 🔒 admin

---

## Bookings

### `POST /bookings` 🔒
Body: `{ hospitalId, vaccineId, date, patientName, patientAge }`
- Atomically increments `slot.bookedCount` only if `bookedCount < totalCapacity`.
- Returns `409` if no slots available.
→ `{ booking }` (includes `confirmationCode` + `lockedPrice`)

### `GET /bookings/me` 🔒 → `{ bookings: [...] }`
### `GET /bookings/:id` 🔒 (owner or admin) → `{ booking }`
### `PUT /bookings/:id` 🔒 owner (edit patient name/age only)
### `DELETE /bookings/:id` 🔒 owner (cancel; decrements `bookedCount`)

---

## Admin

### `GET /admin/bookings` 🔒 admin
Query: `date`, `hospitalId` → `{ bookings }`

### `GET /admin/stats` 🔒 admin → `{ totalBookings, totalSlots }`

---

## Error shape
```json
{ "message": "Human readable error" }
```
