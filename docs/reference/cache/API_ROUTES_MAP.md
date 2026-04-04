# API Routes Map Cache

**Generated:** 2026-03-24
**Source:** `apps/client-dashboard/src/app/api/` + `apps/admin-dashboard/src/app/api/`
**Update when:** route added/removed, auth pattern changes.

Auth legend: **S** = session (getSessionClaims), **B** = bearer JWT (requireAuth), **P** = public

---

## Client Dashboard (`apps/client-dashboard`) — port 3001

### Analytics

| Route                             | Methods | Auth | Notes                             |
| --------------------------------- | ------- | ---- | --------------------------------- |
| `/api/analytics/summary`          | GET     | S    | KPIs; React Query polls every 45s |
| `/api/analytics/heatmap`          | GET     | S    | **Redis cached 10 min**           |
| `/api/analytics/operators`        | GET     | S    | Leaderboard                       |
| `/api/analytics/funnel`           | GET     | S    | Marketing funnel                  |
| `/api/analytics/campaigns`        | GET     | S    | UTM campaigns                     |
| `/api/analytics/visits-over-time` | GET     | S    | Time-series                       |
| `/api/analytics/top-gates`        | GET     | S    | Gate ranking                      |
| `/api/analytics/top-units`        | GET     | S    | Unit ranking                      |
| `/api/analytics/peak-days`        | GET     | S    | Day-of-week peaks                 |
| `/api/analytics/scan-outcome`     | GET     | S    | Pass/Fail breakdown               |
| `/api/analytics/new-vs-returning` | GET     | S    | Visitor type                      |
| `/api/analytics/visitor-type`     | GET     | S    | Visitor segments                  |
| `/api/analytics/unit-types`       | GET     | S    | Unit type distribution            |
| `/api/analytics/utm-matrix`       | GET     | S    | UTM cross-tab                     |
| `/api/analytics/incidents`        | GET     | S    | Incident analytics                |
| `/api/analytics/quota`            | GET     | S    | QR quota usage                    |
| `/api/analytics/export`           | GET     | S    | CSV export                        |
| `/api/analytics/export-pdf`       | GET     | S    | PDF export                        |
| `/api/analytics/export/marketing` | GET     | S    | Marketing CSV                     |

### AI / GateAI

| Route                           | Methods   | Auth | Notes                   |
| ------------------------------- | --------- | ---- | ----------------------- |
| `/api/ai/assistant`             | POST      | S    | Claude Haiku assistant  |
| `/api/ai/chat`                  | POST      | S    | Chat stream             |
| `/api/ai/actions/execute`       | POST      | S    | Execute AI action       |
| `/api/ai/actions/log`           | POST      | S    | Log AI action           |
| `/api/ai/actions/[id]/feedback` | POST      | S    | Feedback on action      |
| `/api/ai/reports/generate`      | POST      | S    | Generate report         |
| `/api/gateai/automations`       | GET, POST | S    | Automations CRUD        |
| `/api/gateai/tags`              | GET, POST | S    | AI tags                 |
| `/api/cron/ai-tasks`            | POST      | P    | Cron signature verified |

### Auth

| Route               | Methods | Auth | Notes                           |
| ------------------- | ------- | ---- | ------------------------------- |
| `/api/auth/login`   | POST    | P    | Returns access + refresh tokens |
| `/api/auth/logout`  | POST    | S    | Clears cookies                  |
| `/api/auth/refresh` | POST    | P    | Rotates refresh token           |

### QR Codes

| Route                      | Methods            | Auth | Notes                       |
| -------------------------- | ------------------ | ---- | --------------------------- |
| `/api/qrcodes`             | GET, POST          | S    | List + create               |
| `/api/qrcodes/[id]`        | GET, PATCH, DELETE | S    | Single QR                   |
| `/api/qrcodes/validate`    | POST               | P    | Scanner validation endpoint |
| `/api/qrcodes/export`      | GET                | S    | CSV export                  |
| `/api/qrcodes/bulk-delete` | POST               | S    | Bulk delete                 |
| `/api/qr/bulk-create`      | POST               | S    | Bulk create                 |
| `/api/qr/send-email`       | POST               | S    | Send QR via email           |

### Scans

| Route                      | Methods | Auth | Notes                          |
| -------------------------- | ------- | ---- | ------------------------------ |
| `/api/scans/my-recent`     | GET     | B    | Last 100 scans for operator    |
| `/api/scans/bulk`          | POST    | B    | Offline sync (LWW)             |
| `/api/scans/export`        | GET     | S    | CSV export                     |
| `/api/scans/[scanId]/deny` | POST    | S    | Operator deny after valid scan |

### Projects

| Route                           | Methods            | Auth | Notes                        |
| ------------------------------- | ------------------ | ---- | ---------------------------- |
| `/api/projects`                 | GET, POST          | S    | List + create                |
| `/api/projects/[id]`            | GET, PATCH, DELETE | S    | Single project               |
| `/api/projects/[id]/logs`       | GET                | S    | Project audit logs           |
| `/api/projects/[id]/aggregates` | GET                | S    | Project stats                |
| `/api/projects/[id]/team`       | GET, PATCH         | S    | Project team                 |
| `/api/projects/wizard`          | POST               | S    | Multi-step wizard create     |
| `/api/project/switch`           | POST               | S    | Switch active project cookie |

### Gates

| Route                    | Methods   | Auth | Notes                          |
| ------------------------ | --------- | ---- | ------------------------------ |
| `/api/gates`             | GET, POST | S    | location field is optional     |
| `/api/gates/assigned`    | GET       | S    | Gates assigned to current user |
| `/api/gates/assignments` | POST      | S    | Create assignment              |

### Contacts & Units (CRM)

| Route                             | Methods            | Auth | Notes       |
| --------------------------------- | ------------------ | ---- | ----------- |
| `/api/contacts`                   | GET, POST          | S    |             |
| `/api/contacts/[id]`              | GET, PATCH, DELETE | S    |             |
| `/api/contacts/[id]/tags`         | GET, POST          | S    |             |
| `/api/contacts/[id]/tags/[tagId]` | DELETE             | S    |             |
| `/api/contacts/bulk-delete`       | POST               | S    |             |
| `/api/contacts/tags/bulk`         | POST               | S    |             |
| `/api/units`                      | GET, POST          | S    |             |
| `/api/units/[id]`                 | GET, PATCH, DELETE | S    |             |
| `/api/units/bulk-delete`          | POST               | S    |             |
| `/api/crm/contacts`               | GET, POST          | S    | CRM variant |
| `/api/crm/contacts/[id]`          | GET, PATCH, DELETE | S    |             |
| `/api/crm/units`                  | GET, POST          | S    |             |
| `/api/crm/units/[id]`             | GET, PATCH, DELETE | S    |             |

### Resident (Bearer JWT — mobile app)

| Route                          | Methods       | Auth | Notes                  |
| ------------------------------ | ------------- | ---- | ---------------------- |
| `/api/resident/me`             | GET           | B    |                        |
| `/api/resident/arrived`        | POST          | B    | Mark arrival           |
| `/api/resident/express-invite` | POST          | B    | Quick visitor invite   |
| `/api/resident/history`        | GET           | B    | Scan history           |
| `/api/resident/push-token`     | POST          | B    | Register push token    |
| `/api/resident/push/send`      | POST          | B    | Send push notification |
| `/api/resident/quota`          | GET           | B    | QR quota               |
| `/api/resident/units`          | GET           | B    | Resident's units       |
| `/api/resident/visitors`       | GET, POST     | B    |                        |
| `/api/resident/visitors/[id]`  | PATCH, DELETE | B    |                        |

### Team & Users

| Route                       | Methods   | Auth | Notes |
| --------------------------- | --------- | ---- | ----- |
| `/api/team/members`         | GET, POST | S    |       |
| `/api/team/messages`        | GET, POST | S    | Chat  |
| `/api/team/roles`           | GET, POST | S    |       |
| `/api/users`                | GET, POST | S    |       |
| `/api/users/me/preferences` | PATCH     | S    |       |

### Workspace & Billing

| Route                             | Methods    | Auth | Notes               |
| --------------------------------- | ---------- | ---- | ------------------- |
| `/api/workspace/settings`         | GET, PATCH | S    |                     |
| `/api/workspace/billing/checkout` | POST       | S    | Stripe checkout     |
| `/api/workspace/billing/portal`   | POST       | S    | Stripe portal       |
| `/api/workspace/export`           | GET        | S    | Full export         |
| `/api/workspace/restore`          | POST       | S    | Restore from export |
| `/api/danger/delete-workspace`    | POST       | S    | Irreversible        |
| `/api/danger/export`              | GET        | S    |                     |
| `/api/danger/purge-scans`         | POST       | S    |                     |

### Misc

| Route                            | Methods            | Auth | Notes                     |
| -------------------------------- | ------------------ | ---- | ------------------------- |
| `/api/events/stream`             | GET                | S    | SSE real-time stream      |
| `/api/search`                    | GET                | S    | Global search             |
| `/api/tags`                      | GET, POST          | S    |                           |
| `/api/tags/[id]`                 | PATCH, DELETE      | S    |                           |
| `/api/tasks`                     | GET, POST          | S    |                           |
| `/api/tasks/[id]`                | GET, PATCH, DELETE | S    |                           |
| `/api/incidents`                 | GET, POST          | S    |                           |
| `/api/watchlist`                 | GET, POST          | S    |                           |
| `/api/watchlist/[id]`            | PATCH, DELETE      | S    |                           |
| `/api/api-keys`                  | GET, POST          | S    |                           |
| `/api/api-keys/[id]`             | DELETE             | S    |                           |
| `/api/webhooks`                  | GET, POST          | S    |                           |
| `/api/webhooks/[id]`             | GET, PATCH, DELETE | S    |                           |
| `/api/webhooks/[id]/test`        | POST               | S    |                           |
| `/api/webhooks/stripe`           | POST               | P    | Stripe signature verified |
| `/api/integrations`              | GET, POST          | S    |                           |
| `/api/notification-prefs`        | GET, PATCH         | S    |                           |
| `/api/notifications/expired-qrs` | GET                | S    | Bell dot                  |
| `/api/artifacts`                 | GET, POST          | S    |                           |
| `/api/artifacts/[id]`            | DELETE             | S    |                           |
| `/api/chat`                      | POST               | S    |                           |
| `/api/override/log`              | GET, POST          | S    |                           |
| `/api/scanner-rules`             | GET, POST          | S    |                           |
| `/api/onboarding/complete`       | POST               | S    |                           |
| `/api/marketing/utm-track`       | POST               | P    | UTM tracking              |
| `/api/setup/reset-admin`         | POST               | P    | Dev-only key required     |

### Short URL Resolver (not under /api/)

| Route          | Methods | Auth | Notes                                |
| -------------- | ------- | ---- | ------------------------------------ |
| `/s/[shortId]` | GET     | P    | Browser → HTML, Scanner → text/plain |

---

## Admin Dashboard (`apps/admin-dashboard`) — port 3002

All routes require `isAdminAuthorized(request)` (key-based + cookie).

| Route                                | Methods            | Notes                                |
| ------------------------------------ | ------------------ | ------------------------------------ |
| `/api/admin/login`                   | POST               | Public; validates `ADMIN_ACCESS_KEY` |
| `/api/auth/login`                    | POST               | Public                               |
| `/api/admin/organizations`           | GET, POST          |                                      |
| `/api/admin/organizations/[id]`      | GET, PATCH, DELETE |                                      |
| `/api/admin/users`                   | GET, POST          |                                      |
| `/api/admin/users/[id]`              | GET, PATCH, DELETE |                                      |
| `/api/admin/analytics`               | GET                | Platform-wide stats                  |
| `/api/admin/finance`                 | GET                | Revenue/billing                      |
| `/api/admin/health`                  | GET                | System health                        |
| `/api/admin/audit-logs/export`       | GET                |                                      |
| `/api/admin/authorization-keys`      | GET, POST          |                                      |
| `/api/admin/authorization-keys/[id]` | PATCH, DELETE      |                                      |
| `/api/admin/ai/assistant`            | POST               | Admin AI assistant                   |
