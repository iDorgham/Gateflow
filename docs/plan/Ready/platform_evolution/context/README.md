# Plan context — `platform_evolution`

Use this folder for **plan-local** references so `/dev` does not rely on chat memory.

| File                           | Purpose                                                 |
| ------------------------------ | ------------------------------------------------------- |
| `api.md`                       | Admin dashboard API routes, CMS endpoints, ISR webhooks |
| `contracts.md`                 | Security, multi-tenancy, RBAC, PII encryption reminders |
| `database.md`                  | Prisma models introduced per phase, migration names     |
| `design.md`                    | UI patterns, ADS tokens, dark-mode, motion policy       |
| `structure.md`                 | File map, package boundaries, cross-app targets         |
| `documentation.md`             | PRD paths, guides, reference docs index                 |
| `HEADLESS_CMS_ARCHITECTURE.md` | Blog + Landing Page publish flow, ISR, API contracts    |
| `CRM_SCOPE.md`                 | GateFlow Lead CRM vs Client CRM boundaries              |

**Global learning:** `docs/development/learning/` — cross-plan patterns.  
**Per-phase issues:** `../phase_logs/PHASE_LOG_phase_NN.md` (mandatory after each `/dev` phase).
