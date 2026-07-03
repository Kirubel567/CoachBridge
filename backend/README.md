# CoachBridge API

NestJS + Prisma + PostgreSQL backend for the CoachBridge trainer/trainee
marketplace. Implements the contract in [`../docs/API.md`](../docs/API.md) and
serves the Next.js frontend in [`../frontend`](../frontend).

## Stack

- **NestJS 10** (Express) — modular REST API under `/api/v1`
- **Prisma 5 + PostgreSQL 16** — data layer
- **JWT (access + refresh) + Argon2** — auth (Phase 1)
- **Chapa** — escrow-lite payments (Phase 4)
- **Socket.io** — realtime messaging & notifications (Phase 6)

## Getting started

```bash
# 1. Start Postgres (from the repo root)
docker compose up -d

# 2. Install deps
npm install

# 3. Create the database schema
npm run prisma:migrate

# 4. Run the API (http://localhost:4000/api/v1)
npm run start:dev
```

Health check: `GET http://localhost:4000/api/v1/health`.

## Conventions

- Every response uses the envelope `{ success, data, meta? }` /
  `{ success: false, error: { code, message, field? } }` — see
  `src/common/`. The frontend's `lib/http.ts` speaks the same shape.
- Money is stored as **integer cents of ETB** (never floats).
- List endpoints accept `?page=&limit=&sort=` and return `meta` pagination.

## Build phases

0. **Foundation** — scaffold, Prisma, envelope/errors, health *(done)*
1. Auth, RBAC & Users
2. Trainer Discovery & Matching
3. Availability & Bookings
4. Payments (Chapa escrow-lite)
5. Plans, Progress & Reviews
6. Messaging & Notifications (realtime)
7. Certifications & Admin
8. Hardening & Go-live
