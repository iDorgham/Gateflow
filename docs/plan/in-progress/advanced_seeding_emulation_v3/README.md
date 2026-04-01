# Advanced Seeding Emulation v3

Lifecycle status and execution entrypoint for `advanced_seeding_emulation_v3`.

## Status

- **Lifecycle:** `planned`
- **Plan file:** `docs/plan/planned/advanced_seeding_emulation_v3/PLAN_advanced_seeding_emulation_v3.md`
- **Checklist:** `docs/plan/planned/advanced_seeding_emulation_v3/SCHEMA_TO_SEEDER_CONTRACT_CHECKLIST.md`
- **IDEA source:** `docs/plan/context/IDEA_advanced_seeding_emulation_v3.md`

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

- All prompts and checklist references are already normalized to `planned`.
- Keep security hard gates active in every phase:
  - `organizationId` scoping
  - `deletedAt: null` on soft-deleted models
  - HMAC-SHA256 QR signing via `QR_SIGNING_SECRET`
  - Super Admin + rate limit for emulation API
