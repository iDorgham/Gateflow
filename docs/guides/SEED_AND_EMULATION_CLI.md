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
```

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
