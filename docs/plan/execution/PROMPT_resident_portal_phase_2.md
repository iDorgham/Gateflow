## Phase 2: Resident Portal web shell & authentication

### Primary role

FRONTEND  
Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

Load these skills when implementing (from `.cursor/skills/`):

- [x] react — React/Next.js patterns
- [x] gf-architecture — monorepo, conventions
- [x] gf-api — API routes, validation, rate limiting (for auth hooks)
- [ ] gf-security — auth, RBAC, QR, multi-tenant (if you touch backend auth)
- [ ] gf-i18n — Arabic/English, RTL, when wiring translations

### MCP to use

| MCP              | When                                      |
|------------------|-------------------------------------------|
| Context7         | Next.js/React patterns, App Router docs   |
| cursor-ide-browser | E2E verification of login and navigation (optional) |

### Preferred tool

- [x] Cursor (default)
- [ ] OpenCode CLI — scaffolds/refactors (optional)
- [ ] Multi-CLI — not required for this phase

### Context

- **Apps**: `apps/resident-portal` (new), `apps/client-dashboard` (reference for auth patterns)
- **Packages**: `@gate-access/ui`, `@gate-access/api-client`, `@gate-access/i18n`, `@gate-access/types`
- **Rules**: pnpm only; reuse existing auth helpers (JWT, cookies) and RBAC patterns from client-dashboard; RESIDENT users must be properly scoped by `organizationId`.
- **Refs**: `CLAUDE.md`, `docs/PRD_v6.0.md` sections 3.5 and 4; `apps/client-dashboard/src/app/login/`, `apps/client-dashboard/src/lib/auth.ts`

### Goal

Create a functional Resident Portal web app with RESIDENT login and a minimal, mobile-optimised dashboard shell ready to host visitor QR and history features.

### Scope (in)

- Scaffold `apps/resident-portal` as a Next.js 14 App Router app with shared config (TS, ESLint, Tailwind) aligned to existing apps.
- Implement login route/page for RESIDENT users, reusing shared auth utilities where possible.
- Add a basic layout (e.g. sidebar/top-nav + content area) with routes for:
  - Home / dashboard
  - Visitor QR management (stub page)
  - Visitor history (stub page)
- Ensure the app is mobile-optimised (responsive layout, basic navigation) and uses `@gate-access/ui` components.

### Scope (out)

- Actual QR creation logic, quota enforcement, and visitor history queries (later phases).
- Push notifications or complex analytics surfaces.

### Steps (ordered)

1. Inspect existing apps (`apps/client-dashboard`, `apps/marketing`) to mirror Next.js configuration, Tailwind setup, and `tsconfig` patterns.
2. Create `apps/resident-portal` with:
   - `next.config`/`package.json` aligned to other web apps.
   - Base folder structure under `src/app` using App Router (e.g. `/(public)/login`, `/(dashboard)/layout`, `(dashboard)/dashboard`, `(dashboard)/visitor-qrs`, `(dashboard)/history`).
3. Wire up auth:
   - Reuse/shared auth helpers (`requireAuth`-style) or create a resident-specific helper that validates RESIDENT role and `organizationId`.
   - Implement a `/login` page that posts to an existing or new auth endpoint and stores tokens using the same patterns as client-dashboard.
4. Build layout shell:
   - Import shared components from `@gate-access/ui` for nav, buttons, typography.
   - Implement responsive layout that works well on mobile and desktop (using Tailwind and existing design tokens).
   - Add stub content to Visitor QRs and History routes.
5. Add basic routing guards so dashboard routes require RESIDENT auth and redirect unauthenticated users to login.
6. Run:
   - `pnpm turbo lint --filter=resident-portal`
   - `pnpm turbo typecheck --filter=resident-portal`
7. Optional: start the app (`pnpm turbo dev --filter=resident-portal`) and manually test login and navigation; optionally use `browser-use` subagent for automated verification.

### SuperDesign (optional — for UI phases)

For a richer UX, you may run SuperDesign before refining the layout:

- **SuperDesign:** Create a design draft for the Resident Portal dashboard shell (login + main navigation + visitor QR/history pages) before deep UI polish.

### Subagents (optional)

| Subagent | When | Prompt |
|----------|------|--------|
| **explore** | Need to confirm existing login/auth patterns | "Trace the login/auth flow in `apps/client-dashboard` (UI → API → cookies). Return key files and how the JWT/cookies are wired." |
| **browser-use** | Verify login + routing | "Login to resident-portal at its localhost port as RESIDENT, navigate between dashboard, Visitor QRs, and History, and report any navigation or layout issues." |

### Commands (when to run)

- Before phase: `/ready` — optional, to ensure clean git and preflight.
- After phase: `/github` — add new `apps/resident-portal` files, commit (e.g. `feat(resident-portal): scaffold app shell and auth`), pull --rebase, push.

### Acceptance criteria

**Checklist:**

- [ ] `apps/resident-portal` exists and builds in dev mode.
- [ ] Resident login route works end-to-end for RESIDENT users.
- [ ] Dashboard shell layout renders on mobile and desktop, using shared UI components.
- [ ] `pnpm turbo lint --filter=resident-portal` passes.
- [ ] `pnpm turbo typecheck --filter=resident-portal` passes.

**Given/When/Then (optional):**

- **Given** a valid RESIDENT account, **When** the user logs in via the Resident Portal, **Then** they should be redirected to the main dashboard shell and see stub links/routes for Visitor QRs and History.

### Files likely touched

- `apps/resident-portal/package.json`
- `apps/resident-portal/next.config.*`
- `apps/resident-portal/src/app/(public)/login/page.tsx`
- `apps/resident-portal/src/app/(dashboard)/layout.tsx`
- `apps/resident-portal/src/app/(dashboard)/dashboard/page.tsx`
- `apps/resident-portal/src/app/(dashboard)/visitor-qrs/page.tsx`
- `apps/resident-portal/src/app/(dashboard)/history/page.tsx`
- Shared config files (e.g. `tsconfig.json`, Tailwind config references)

### Multi-CLI (optional — only for complex/high-risk phases)

Not required; use Cursor and Context7 if documentation lookups are needed.

