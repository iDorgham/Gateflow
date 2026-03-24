# Common Errors & Gotchas

## Prisma

| Gotcha                     | Rule                                                                     |
| -------------------------- | ------------------------------------------------------------------------ |
| `QRCode` model             | Accessor is `prisma.qRCode` (camelCase)                                  |
| `ScanLog.auditTrail`       | `Json[]` — spread + cast: `[...trail, e] as unknown as Prisma.JsonArray` |
| Enum imports               | From `@gate-access/db`, NOT `@prisma/client`                             |
| Schema changes in dev      | `npx prisma db push` (not `migrate dev`)                                 |
| Enum `ADD VALUE` migration | Must run outside a PostgreSQL transaction                                |
| Tenant context             | `clearOrganizationContext()` MUST be in `finally` block                  |
| `generateScanUuid()`       | Is **async** — must `await` it                                           |

## TypeScript / Testing

| Gotcha              | Rule                                                                     |
| ------------------- | ------------------------------------------------------------------------ |
| Test file isolation | Add `export {}` at top to avoid `TS2451` across Jest files               |
| POST route tests    | Use `MockNextRequest` — Jest `node` env doesn't support `Request.json()` |
| `cn()` utility      | Re-exports from `@gate-access/ui` in client-dashboard + marketing        |

## Auth

| Gotcha              | Rule                                                                           |
| ------------------- | ------------------------------------------------------------------------------ |
| `auth.sub`          | = userId — there is NO `auth.userId` field                                     |
| Missing secrets     | `NEXTAUTH_SECRET`, `QR_SIGNING_SECRET`, `ADMIN_ACCESS_KEY` throw in production |
| `ANTHROPIC_API_KEY` | Missing → AI assistant returns 503, does not crash                             |

## UI Components

| Gotcha                          | Rule                                                                         |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `Dialog` from `@gate-access/ui` | Simple div, not Radix — use `{open && <Dialog>}`, NOT `<Dialog open={open}>` |
| `LoginControls`                 | Uses inline dropdown — avoids next-themes/next/navigation in packages/ui     |
| `animate-shake`                 | Must be in BOTH `client-dashboard` AND `admin-dashboard` tailwind configs    |

## Scanner

| Gotcha                           | Rule                                                           |
| -------------------------------- | -------------------------------------------------------------- |
| 4xx from `/api/qrcodes/validate` | Rejection — show rejected, do NOT queue offline                |
| 5xx / network error              | Offline — queue, show "accepted offline"                       |
| Test QRs from create-test page   | Not saved to DB → 403 "not_found" → scanner shows "rejected"   |
| Short URL scan                   | Fetch `/s/{shortId}` first to resolve payload before verifying |

## Architecture

| Gotcha                      | Rule                                                                            |
| --------------------------- | ------------------------------------------------------------------------------- |
| Dashboard pages             | Server-rendered — refresh page to see new scan counts                           |
| `CreateGateSchema.location` | Optional (not required) — in `apps/client-dashboard/src/app/api/gates/route.ts` |
