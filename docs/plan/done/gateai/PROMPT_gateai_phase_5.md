# Pro Prompt — Phase 5: Scheduling Engine Skeleton + AiTask Model

**Primary role:** BACKEND-Database
**Preferred tool:** Gemini CLI

### Goal
Build the foundation for recurring AI tasks like scheduled weekly reports.

### Steps
1. Add `AiTask` model to `schema.prisma` with `type`, `params`, `cron`, `lastRun`, and `orgId`.
2. Run Prisma migration.
3. Setup a simple cron job handler (using Upstash Cron or similar).
4. Implement the logic to "convert" an AI request into a scheduled `AiTask`.
5. `/github` — feat(gateai): phase 5 — recurring task engine.
