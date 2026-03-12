# GateFlow Environment Variables (Docs v2)

**Version:** 1.0  
**Aligned with:** `docs/PRD_v7.0.md`, `CLAUDE.md`  

> **⚠️ Never commit real `.env` or `.env.local` files.**  
> Only commit `.env.example` files with placeholder values.

---

## 1. Global

| Variable       | Required | Description                          | Used by                  |
|----------------|----------|--------------------------------------|--------------------------|
| `DATABASE_URL` | Yes      | PostgreSQL connection string         | All server-side code     |

Example:

```env
DATABASE_URL="postgresql://user:password@host:port/gateflow"
```

---

## 2. Client Dashboard (`apps/client-dashboard`)

Server/runtime:

| Variable              | Required | Description                                    |
|-----------------------|----------|------------------------------------------------|
| `DATABASE_URL`        | Yes      | DB connection (inherited from root env)       |
| `NEXTAUTH_SECRET`     | Yes      | JWT signing secret / session crypto           |
| `NEXTAUTH_URL`        | Yes      | Base URL for NextAuth callbacks (e.g. http://localhost:3001) |
| `QR_SIGNING_SECRET`   | Yes      | HMAC-SHA256 key for QR payload signing        |
| `UPSTASH_REDIS_REST_URL`   | Yes (prod) | Redis REST URL for rate limiting       |
| `UPSTASH_REDIS_REST_TOKEN` | Yes (prod) | Redis token for rate limiting         |
| `ANTHROPIC_API_KEY`        | Yes (AI assistant) | Anthropic API key for `/api/ai/assistant` (returns 503 if missing) |

Public (browser-consumable, `NEXT_PUBLIC_*`):

| Variable                      | Required | Description                                   |
|-------------------------------|----------|-----------------------------------------------|
| `NEXT_PUBLIC_API_URL`         | Yes      | Public API base URL used by frontend          |
| `NEXT_PUBLIC_APP_URL`         | Yes      | Public app URL (used in QR short links, redirects) |
| `NEXT_PUBLIC_DEFAULT_ORG_ID`  | No       | Pre-fills org ID in the test QR generator page |

---

## 3. Scanner App (`apps/scanner-app`)

Expo/React Native environment:

| Variable                  | Required | Description                                    |
|---------------------------|----------|------------------------------------------------|
| `EXPO_PUBLIC_API_URL`     | Yes      | Base URL of the client-dashboard API           |
| `EXPO_PUBLIC_QR_SECRET`   | Yes      | Shared HMAC secret for offline QR verification (same value as `QR_SIGNING_SECRET`) |

Scanner-specific notes:

- `EXPO_PUBLIC_QR_SECRET` must match `QR_SIGNING_SECRET` on the server — they share the same signing key.
- Tokens must be stored in **SecureStore** (never plain AsyncStorage).
- Offline scan queue is AES-256 encrypted using a PBKDF2-derived key.

---

## 4. Resident Portal (`apps/resident-portal`)

The resident portal follows the same patterns as client-dashboard:

Server/runtime:

| Variable              | Required | Description                                    |
|-----------------------|----------|------------------------------------------------|
| `DATABASE_URL`        | Yes      | DB connection                                  |
| `NEXTAUTH_SECRET`     | Yes      | JWT/session secret                             |
| `NEXTAUTH_URL`        | Yes      | Base URL for resident portal (e.g. http://localhost:3004) |

Public:

| Variable                       | Required | Description                                   |
|--------------------------------|----------|-----------------------------------------------|
| `NEXT_PUBLIC_RESIDENT_API_URL` | No (optional) | Explicit API base if different from main API |

Exact set may evolve; keep consistent with `ENVIRONMENT_VARIABLES.md` examples in archived docs.

---

## 5. Resident Mobile (`apps/resident-mobile`)

Expo/React Native (planned):

| Variable                    | Required | Description                           |
|-----------------------------|----------|---------------------------------------|
| `EXPO_PUBLIC_API_URL`       | Yes      | API base URL                          |
| `EXPO_PUBLIC_SENTRY_DSN`    | No       | Error monitoring DSN (if configured)  |

As with scanner-app, use EAS secrets or similar mechanisms for anything sensitive.

---

## 6. Marketing & Admin Dashboards

These Next.js apps use a similar pattern:

Marketing (`apps/marketing`):

| Variable                      | Required | Description                       |
|-------------------------------|----------|-----------------------------------|
| `NEXT_PUBLIC_APP_URL`         | Yes      | Marketing site URL                |
| `NEXT_PUBLIC_API_URL`         | No       | Optional API URL for contact forms, etc. |

Admin Dashboard (`apps/admin-dashboard`):

| Variable              | Required | Description                           |
|-----------------------|----------|---------------------------------------|
| `DATABASE_URL`        | Yes      | DB connection                         |
| `NEXTAUTH_SECRET`     | Yes      | JWT/session secret                    |
| `NEXTAUTH_URL`        | Yes      | Base URL (e.g. http://localhost:3002) |

---

## 7. Patterns & Best Practices

- **Prefix browser-visible values** with `NEXT_PUBLIC_` or `EXPO_PUBLIC_`.
- **Never expose secrets** (DB URLs, JWT secrets, QR signing) via public variables.
- For new apps or services:
  - Add them to this document.
  - Provide a corresponding `.env.example` with placeholder values.

