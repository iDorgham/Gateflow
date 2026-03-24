# Workspace Index Cache

**Generated:** 2026-03-24
**Purpose:** Load this instead of reading package.json / configs.
**Update when:** major dependency bump, new app added, port change.

---

## Apps & Ports

| App              | Package            | Port | Framework   |
| ---------------- | ------------------ | ---- | ----------- |
| Marketing        | `marketing`        | 3000 | Next.js 15  |
| Client Dashboard | `client-dashboard` | 3001 | Next.js 15  |
| Admin Dashboard  | `admin-dashboard`  | 3002 | Next.js 15  |
| Resident Portal  | `resident-portal`  | 3004 | Next.js 15  |
| Scanner App      | `scanner-app`      | 8081 | Expo SDK 54 |
| Resident Mobile  | `resident-mobile`  | —    | Expo SDK 54 |

---

## Shared Packages

| Package               | Alias                     | Purpose                                 |
| --------------------- | ------------------------- | --------------------------------------- |
| `packages/db`         | `@gate-access/db`         | Prisma client, schema, auth helpers     |
| `packages/types`      | `@gate-access/types`      | Shared TS types + Zod schemas           |
| `packages/ui`         | `@gate-access/ui`         | shadcn/ui + Radix + Tailwind components |
| `packages/i18n`       | `@gate-access/i18n`       | i18next, en + ar-EG locales             |
| `packages/api-client` | `@gate-access/api-client` | HTTP client SDK                         |
| `packages/stripe`     | `@gate-access/stripe`     | Stripe billing/subscriptions            |
| `packages/config`     | `@gate-access/config`     | Shared ESLint + TS configs              |

---

## Key Dependency Versions

| Package                 | Version                                   |
| ----------------------- | ----------------------------------------- |
| next                    | ^15.5.14                                  |
| react                   | ^18.3.1 (dashboard) / ^19.2.4 (marketing) |
| typescript              | ^5.9.3                                    |
| tailwindcss             | ^3.4.19                                   |
| prisma / @prisma/client | ^5.22.0                                   |
| zod                     | 3.25.76                                   |
| framer-motion           | ^11.18.2                                  |
| @upstash/redis          | ^1.36.2                                   |
| @upstash/ratelimit      | ^2.0.5                                    |
| ai (Vercel AI SDK)      | ^4.3.19                                   |
| recharts                | ^2.15.4                                   |
| expo                    | ~54.0.33                                  |
| stripe                  | ^17.7.0                                   |
| jose                    | 4.15.9                                    |
| react-hook-form         | ^7.71.2                                   |
| turbo                   | ^2.8.13                                   |

---

## Environment Variables (key ones)

| Variable                     | Used by          | Purpose                                        |
| ---------------------------- | ---------------- | ---------------------------------------------- |
| `DATABASE_URL`               | packages/db      | PostgreSQL connection                          |
| `NEXTAUTH_SECRET`            | client/admin     | Session signing                                |
| `QR_SIGNING_SECRET`          | client-dashboard | HMAC-SHA256 QR signing                         |
| `EXPO_PUBLIC_QR_SECRET`      | scanner-app      | Local QR verify                                |
| `EXPO_PUBLIC_API_URL`        | scanner-app      | API base (default `http://localhost:3001/api`) |
| `NEXT_PUBLIC_APP_URL`        | client-dashboard | Short QR URL base                              |
| `NEXT_PUBLIC_DEFAULT_ORG_ID` | client-dashboard | Dev/test org pre-fill                          |
| `UPSTASH_REDIS_REST_URL`     | client-dashboard | Redis cache (optional)                         |
| `UPSTASH_REDIS_REST_TOKEN`   | client-dashboard | Redis cache (optional)                         |
| `ANTHROPIC_API_KEY`          | client-dashboard | AI assistant (503 if missing)                  |
| `ADMIN_ACCESS_KEY`           | admin-dashboard  | Admin auth key                                 |

Full reference: `docs/guides/ENVIRONMENT_VARIABLES.md`

---

## Common Commands

```bash
pnpm install                 # Install all deps
pnpm turbo dev               # Start all apps
pnpm turbo build             # Build all
pnpm turbo lint              # Lint all
pnpm preflight               # lint + typecheck + test

# DB (run from packages/db)
npx prisma generate          # Regenerate client
npx prisma db push           # Push schema (dev, no migration)
npx prisma migrate dev       # Create migration
npx prisma db seed           # Seed data
```

---

## Auth Patterns (quick ref)

| Context                       | Method                                         | Where               |
| ----------------------------- | ---------------------------------------------- | ------------------- |
| Client/Admin dashboard routes | `getSessionClaims()` → 401 if `!claims?.orgId` | Session cookie      |
| Scanner app / external APIs   | `requireAuth()` → Bearer JWT                   | `auth.sub` = userId |
| Admin dashboard               | `isAdminAuthorized(request)`                   | Key-based + cookie  |
| QR validation                 | Public                                         | No auth             |

**Important:** `auth.sub` = userId (not a `userId` field). Use `auth.sub` in API routes.
