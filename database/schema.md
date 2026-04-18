# Database Schema

Database: **MongoDB** (Mongoose models in `backend/src/models/`).

## Collections

### `users`
| Field        | Type       | Notes |
|--------------|------------|-------|
| _id          | ObjectId   | PK |
| name         | String     | required |
| email        | String     | unique, required |
| password     | String     | bcrypt-hashed |
| phone        | String     | |
| role         | String     | `citizen` \| `admin` |
| hospitalId   | ObjectId   | if role=admin, which hospital they manage |
| createdAt, updatedAt | Date | auto |

### `hospitals`
| Field     | Type     | Notes |
|-----------|----------|-------|
| _id       | ObjectId | PK |
| name      | String   | indexed |
| city      | String   | indexed |
| pincode   | String   | indexed |
| address   | String   | |
| phone     | String   | |
| email     | String   | |
| active    | Boolean  | soft-delete flag |

### `vaccines`
| Field         | Type     | Notes |
|---------------|----------|-------|
| _id           | ObjectId | PK |
| hospitalId    | ObjectId | FK → hospitals |
| name          | String   | e.g. Covishield |
| manufacturer  | String   | |
| pricePerDose  | Number   | ₹ |
| description   | String   | |
| active        | Boolean  | |

Unique index: `(hospitalId, name)`.

### `slots`
Represents daily capacity for a (hospital, vaccine, date).

| Field          | Type     | Notes |
|----------------|----------|-------|
| _id            | ObjectId | PK |
| hospitalId     | ObjectId | FK → hospitals |
| vaccineId      | ObjectId | FK → vaccines |
| date           | String   | `YYYY-MM-DD` |
| totalCapacity  | Number   | set by admin |
| bookedCount    | Number   | incremented atomically on booking |
| pricePerDose   | Number   | snapshot at slot creation |

Unique index: `(hospitalId, vaccineId, date)`.

Virtual: `available = totalCapacity - bookedCount`.

### `bookings`
| Field             | Type     | Notes |
|-------------------|----------|-------|
| _id               | ObjectId | PK |
| userId            | ObjectId | FK → users |
| hospitalId        | ObjectId | FK → hospitals |
| vaccineId         | ObjectId | FK → vaccines |
| slotId            | ObjectId | FK → slots |
| date              | String   | `YYYY-MM-DD` |
| lockedPrice       | Number   | price at booking time (transparency) |
| patientName       | String   | |
| patientAge        | Number   | |
| status            | String   | `confirmed` \| `cancelled` \| `completed` |
| confirmationCode  | String   | unique, shown to user |

## Booking concurrency / no-overbooking

The booking create endpoint uses a **single atomic conditional update** on `slots`:

```js
Slot.findOneAndUpdate(
  { hospitalId, vaccineId, date, $expr: { $lt: ['$bookedCount', '$totalCapacity'] } },
  { $inc: { bookedCount: 1 } },
  { new: true }
)
```

If the slot is already full, the query returns `null` and the API responds `409 Conflict` — guaranteeing no overbooking under concurrency.

## ERD

```
users ──< bookings >── slots ──< vaccines >── hospitals
                     │                           │
                     └──────────────┬────────────┘
                                    │
                              bookings.hospitalId / .vaccineId
```
