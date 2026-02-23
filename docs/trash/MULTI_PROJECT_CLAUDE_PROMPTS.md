# Claude Prompt Set for Multi-Project Support Implementation

This document contains ready-to-use Claude prompts to implement multi-project support in GateFlow. Each prompt is self-contained and specifies exact output format.

---

## Implementation Status

| #   | Prompt              | Status                   | Notes                                                                                                                                      |
| :-- | :------------------ | :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Migration + Seed    | ⚠️ **Files Created**     | Run `npx prisma migrate deploy` to apply                                                                                                   |
| 2-5 | Filtering & Context | ❌ **Use Merged Prompt** | Consolidated into [MERGED_PROJECT_FILTERING_PROMPT.md](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/MERGED_PROJECT_FILTERING_PROMPT.md) |
| 2   | Project Switcher UI | ✅ **Already Implemented** | Exists in shell.tsx                                                                                                                        |

---

## Prompt 1: Run Migration & Seed (DO THIS FIRST)

**Priority:** P0  
**Status:** Files created, needs to be run

### Commands to execute:

```bash
# Navigate to db folder
cd packages/db

# Apply migration
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Seed default projects
npx tsx prisma/seed.ts
```

### What it does:

- Creates `Project` table
- Adds `projectId` to `Gate` and `QRCode` (nullable)
- Creates "Main" project for each existing organization
- Assigns existing Gates/QRs to Main project

---

> [!IMPORTANT]
> Prompts 2 through 5 have been merged into a single comprehensive implementation prompt to streamline the development process.

---

## Quick Start (After Migration)

```bash
# 1. Apply migration & seed (from Prompt 1)
cd packages/db && npx prisma migrate deploy && npx prisma generate && npx tsx prisma/seed.ts

# 2. Start dev server
cd ../.. && pnpm turbo dev

# 3. Test
# - Login to dashboard
# - See project switcher in sidebar
# - Visit /dashboard/projects
```

---

## What Works After Migration

| Feature                             | Status             |
| ----------------------------------- | ------------------ |
| Project model in schema             | ✅                 |
| projectId on Gate/QRCode            | ✅                 |
| Project switcher in sidebar         | ✅                 |
| Project switch API                  | ✅                 |
| Projects page (/dashboard/projects) | ✅                 |
| Default "Main" project created      | ✅ (via seed)      |
| Filter QRs by project               | ❌ Not implemented |
| Filter Gates by project             | ❌ Not implemented |
| Filter Scans by project             | ❌ Not implemented |

---

## Remaining Prompt to Run

After migration, run this single merged prompt:

1. **[Merged Project Filtering Prompt](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/MERGED_PROJECT_FILTERING_PROMPT.md)** - Implements filtering for QRs, Gates, Scans, and adds Project Context.

---

## Superseded Prompts

The individual prompts for filtering and context have been merged. Refer to the table at the top or the merged prompt file for current instructions.

---

**Document Version:** 2.0  
**Last Updated:** February 2026  
**Reference:** PRD_v4.0.md, PRD_v5.0.md
