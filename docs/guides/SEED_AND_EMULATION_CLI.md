# Seed and traffic emulation CLI

`@gate-access/db` routes `pnpm prisma db seed` through `prisma/seed-entry.ts` (Phase 9). Arguments after `--` are parsed by the seed CLI.

## Common commands

From `packages/db` (or use `pnpm --filter=@gate-access/db exec prisma db seed -- …` from the repo root):

```bash
# Help
pnpm prisma db seed -- --help

# No writes: skip legacy dev seed (emulation still respects dry-run inside runEmulation)
pnpm prisma db seed -- --dry-run

# In-memory uniqueness self-test + read-only SQL duplicate scan on active Contact email/phone
pnpm prisma db seed -- --test-integrity

# Assert organization count (requires --dry-run unless you are also running emulation)
pnpm prisma db seed -- --organizations.min=2 --organizations.max=5 --dry-run

# Full Red Sea demo: all orgs, role logins, contacts/units/classrooms, 180-day scans
pnpm --filter=@gate-access/db seed:demo
# equivalent:
pnpm prisma db seed -- --demo-full
```

`--demo-full` is idempotent. It runs the legacy org/admin seed first, then fills every demo organization with Hurghada-area contacts (Egyptian + German/Russian/British/Italian/Polish/Ukrainian/Dutch and other Red Sea nationalities), units (classrooms for the school org), role accounts, and scan history over 180 days when `QR_SIGNING_SECRET` is set.

### Demo logins (password `password123` or `SEED_PASSWORD`)

| Role | Selena | School | Club | Nightclub | Events |
|------|--------|--------|------|-----------|--------|
| Org admin | `admin@selenadev.com` | `admin@school.demo` | `admin@club.demo` | `admin@nightclub.demo` | `admin@event_organiser.demo` |
| Security manager | `security@selenadev.com` | `security@school.demo` | `security@club.demo` | `security@nightclub.demo` | `security@event_organiser.demo` |
| Gate operator | `guard@selenadev.com` | `guard@school.demo` | `guard@club.demo` | `guard@nightclub.demo` | `guard@event_organiser.demo` |
| Resident | `resident@selenadev.com` | `resident@school.demo` | `resident@club.demo` | `resident@nightclub.demo` | `resident@event_organiser.demo` |
| Super admin | `superadmin@gateflow.demo` (platform, no org) | | | | |

Selena projects: **Selena Bay** (Hurghada), **Vernada** (Sahl Hasheesh), **El Gouna Residences**, **Soma Bay Villas**.


## Traffic emulation (same knobs as `POST /api/admin/emulate-traffic`)

Requires `--organizationId` and at least one of: `--emulate`, `--scenario`, `--scans` / `--totalScans`, `--pastDays`, `--incidentRate`, `--seed` / `--randomSeed`.

```bash
pnpm prisma db seed -- \
  --organizationId=<tenant_id> \
  --scenario=nightclub \
  --scans=15000 \
  --pastDays=30 \
  --incidentRate=0.25 \
  --seed=12345 \
  --dry-run
```

Optional entity overrides: `--projectId`, `--gateId`, `--unitId`, `--contactId`, `--createdByUserId`.

## Global Emulation Mode (Platform-Wide)

To simulate traffic concurrently across all active organizations in the platform, enable **Global Mode**:

```bash
# Target the entire platform (ignoring single organizationId)
pnpm prisma db seed -- --globalMode --scenario=peak-hour --scans=100 --pastDays=1
```

_Note: Global Mode requires `ALLOW_ADMIN_OPERATIONS=1` and is typically used for dashboard stress testing._

## Admin Dashboard Hubs (UI-First)

While the CLI is powerful for automated runs, the **Admin Dashboard** provides a unified command center for high-density operations:

### 1. Seeding Hub `/monitoring/seeding`

- **Seeding Wizard**: Visual hierarchy configuration for Phases, Buildings, Floors, and Units.
- **Deterministic Scale**: Real-time estimation of total units generated before execution.
- **Relational Integrity**: Automatically links generated units to round-robin contacts from the org pool.

### 2. Emulation Hub `/monitoring/emulation`

- **Scenario Studio**: Toggle between predefined traffic patterns (Nightclub, Peak Hour, Steady Stream).
- **Global Toggle**: Enable/Disable platform-wide concurrent simulation via the UI.
- **Precision Inputs**: Define exact scan counts and incident rates for targeted testing.

### 3. Monitoring Hub `/monitoring/hub`

- **SSE Real-time Tracking**: Powered by Server-Sent Events, this hub provides a live feed of all platform operations.
- **Operation Insight**: Drill down into specific runs via the side drawer to inspect metadata payloads and performance impacts.
- **Audit Trails**: Every action (Seed, Emulate, Reset) is logged with `system-admin` attribution for full accountability.

### Security

- Do **not** pass `QR_SIGNING_SECRET` on the command line.
- **Live** emulation (without `--dry-run`) requires `QR_SIGNING_SECRET` (≥ 32 characters) and either `NODE_ENV=development` or `ALLOW_EMULATION_SEED=1`.

## Legacy dev seed only

To run the previous standalone script (Selena org + users) without the router:

```bash
npx tsx prisma/seed_dev.ts
```

## Dashboard field contract (read-only check)

After seeding, verify Prisma rows expose the fields expected by CRM / QR / scans UIs:

```bash
pnpm --filter=@gate-access/db run verify:seed-contract
```

This loads the first `Contact` (and optional `Unit`, `QRCode`, `ScanLog`) and asserts key names exist; it exits 0 if tables are empty (with a skip message).

## Default project + tags seed

`prisma/seed.ts` remains available for “default Main project per org” and related fixes; run directly if needed:

```bash
npx tsx prisma/seed.ts
```
