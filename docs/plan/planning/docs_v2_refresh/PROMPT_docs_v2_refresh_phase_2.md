# Phase 2: Core Guides v2 — Review & Update

## Primary role
CONTENT / DX

## Preferred tool
- [x] Cursor (default)

## Context
- **Project**: GateFlow Docs v2
- **Refs**:
  - `docs/PRD_v6.0.md` — canonical truth
  - `docs/guides/ARCHITECTURE.md` (164 lines)
  - `docs/guides/SECURITY_OVERVIEW.md` (220 lines)
  - `docs/guides/DEVELOPMENT_GUIDE.md` (171 lines)
  - `docs/guides/ENVIRONMENT_VARIABLES.md` (125 lines)
  - `CLAUDE.md` — authoritative stack/env var list

## Goal
Ensure the 4 core guides are accurate, internally consistent with `PRD_v6.0.md`, and useful to a new contributor. Fill gaps, fix stale references, keep each guide concise.

## Scope (in)
- **`ARCHITECTURE.md`**:
  - Confirm app list matches PRD v6 (6 apps: client-dashboard, admin-dashboard, scanner-app, marketing, resident-portal, resident-mobile).
  - Confirm packages list matches repo (db, types, ui, config, api-client, i18n).
  - Add/verify the QR lifecycle flow summary (generate → sign → email → scan → validate → log).
  - Note any Phase 2 (Resident Portal) items as "planned" clearly.
- **`SECURITY_OVERVIEW.md`**:
  - Verify JWT details (15 min access, 30 day refresh, HS256, Argon2id params) match `CLAUDE.md`.
  - Confirm watchlist, identity levels, and scanner invariants are covered.
  - Add a **"Key invariants"** section if missing: (1) soft deletes only, (2) all queries scope by orgId, (3) QR must be HMAC-signed, (4) tokens in secure cookies not localStorage.
- **`DEVELOPMENT_GUIDE.md`**:
  - Confirm dev port table is accurate (3000/3001/3002/8081).
  - Add or verify a **"Slash commands"** section: `/idea`, `/plan`, `/dev`, `/ship`, `/guide`.
  - Confirm `pnpm turbo dev`, `pnpm turbo lint`, `pnpm turbo typecheck`, `pnpm turbo test` are listed.
- **`ENVIRONMENT_VARIABLES.md`**:
  - Cross-reference with `CLAUDE.md` env var lists. Fill in any missing vars.
  - Ensure `ANTHROPIC_API_KEY` (AI assistant) is documented.

## Steps (ordered)
1. Read `ARCHITECTURE.md` end-to-end. Make targeted updates where stale or incomplete.
2. Read `SECURITY_OVERVIEW.md` end-to-end. Add "Key invariants" section if not present.
3. Read `DEVELOPMENT_GUIDE.md` end-to-end. Verify slash commands and ports.
4. Read `ENVIRONMENT_VARIABLES.md` end-to-end. Add `ANTHROPIC_API_KEY` if missing.
5. Commit: `docs: update core guides v2 (architecture, security, dev, env) (phase 2)`.

## Acceptance criteria
- [ ] `ARCHITECTURE.md` lists all 6 apps and 6 packages accurately.
- [ ] `SECURITY_OVERVIEW.md` has a "Key invariants" section with at least 4 invariants.
- [ ] `DEVELOPMENT_GUIDE.md` lists all dev ports and slash commands.
- [ ] `ENVIRONMENT_VARIABLES.md` includes `ANTHROPIC_API_KEY`.
- [ ] No guide references a "v5" concept as current.
