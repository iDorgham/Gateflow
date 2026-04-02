# Advanced Seeding Emulation v3

Lifecycle status and execution entrypoint for `advanced_seeding_emulation_v3`.

## Status

- **Lifecycle:** `done` (all 9 phases)
- **Plan file:** `./PLAN_advanced_seeding_emulation_v3.md` (also `docs/plan/done/advanced_seeding_emulation_v3/PLAN_advanced_seeding_emulation_v3.md`)
- **Checklist:** `./SCHEMA_TO_SEEDER_CONTRACT_CHECKLIST.md`
- **IDEA source:** `docs/plan/context/IDEA_advanced_seeding_emulation_v3.md`
- **Ops CLI:** `docs/guides/SEED_AND_EMULATION_CLI.md`

## Canonical /dev Commands

Use one phase at a time:

```bash
/dev advanced_seeding_emulation_v3 phase 1
/dev advanced_seeding_emulation_v3 phase 2
/dev advanced_seeding_emulation_v3 phase 3
/dev advanced_seeding_emulation_v3 phase 4
/dev advanced_seeding_emulation_v3 phase 5
/dev advanced_seeding_emulation_v3 phase 6
/dev advanced_seeding_emulation_v3 phase 7
/dev advanced_seeding_emulation_v3 phase 8
/dev advanced_seeding_emulation_v3 phase 9
```

## Notes

- Security hard gates for seeding and emulation:
  - `organizationId` scoping
  - `deletedAt: null` on soft-deleted models
  - HMAC-SHA256 QR signing via `QR_SIGNING_SECRET`
  - Super Admin + rate limit for emulation API
