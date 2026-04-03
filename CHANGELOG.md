# Changelog

All notable changes to GateFlow are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) | [Semantic Versioning](https://semver.org/)

---

## [Unreleased]

### Workspace

- **[Admin-Dashboard]** upgrade to react 19 and fix searchParams crash

- **[Admin Emulation Hub]** Phase 2: Emulation & Seeding Hub (UI) - Ops Hub & Seeding Controls
- **[Admin Emulation Hub]** Phase 1: Advanced Seeding Integration (Backend & API)

- **[Admin Emulation Hub]** complete phase 4

- **[Admin-Dashboard]** handle missing org emails and harden admin access key

- **[Admin-Dashboard]** ADMIN_ACCESS_KEY min length and locale-aware auth

- **[Tooling]** `@gate-access/config`: `eslint-config-next` ^15.5.14 (was 14.x) so `next lint` on Next 15 apps no longer hits circular ESLint config; root `.eslintrc.json` extends only `packages/config/eslintrc.cjs` (drops duplicate `@typescript-eslint/recommended`).
- **[Db]** `@gate-access/db/prisma` subpath re-exports `@prisma/client` only for client components; CRM/settings pick it up for `UnitType` / `GateMode`.
- **[Tooling]** Next apps include `global.d.ts` (declares `*.css` modules) in `tsconfig.json`.
- **[Tooling]** `turbo.json`: `test` task uses `outputs: []` (no `coverage/**` emitted by default) to avoid “no output files found” warnings.
- **[Tooling]** Root devDependencies pin TypeScript 5.9.3 and ESLint 8.57.1 (pnpm overrides).
- **[Db]** avoid node:crypto in client webpack graph; turbo env passthrough

- **[CI]** Dependabot: ignore `prisma` / `@prisma/client` `>=7` until a dedicated Prisma ORM 7 migration (schema + `prisma.config.ts` + client bootstrap per [upgrade guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)).

- **[Scripts]** `check-env.js`: `ADMIN_ACCESS_KEY` requires ≥32 characters; `setup-dev` / CI use long non-placeholder defaults; `.env.example` documents admin portal auth requirement.

- **[Scripts]** ralph-docs changelog inserts under Unreleased tri-track

- **[Plan Lifecycle]** `advanced_seeding_emulation_v3` plan assets live under `docs/plan/done/advanced_seeding_emulation_v3/` (completed); prompt/checklist links normalized to that path.
- **[Backlog]** added tracking entry for `advanced_seeding_emulation_v3` in `docs/plan/backlog/ALL_TASKS_BACKLOG.md`.
- **[Plan Docs]** added a local README for `advanced_seeding_emulation_v3` with lifecycle status and canonical `/dev` commands.
- **[Plan Docs]** initialize `resident_portal_responsive` 5-phase roadmap and phase prompts.
- **[Workspace Docs]** split documentation into Workspace, AI Tools, and Apps tracks.
- **[Workspace]** add dedicated workspace documentation hub under `docs/workspace/`.
- **[Workspace Version]** establish independent workspace version tracking alongside app versions.
- **[GitHub Security Hardening]** started development of GitHub hardening workflow and policy updates.
- **[Advanced Seeding Emulation V3 — DB]** Phase 1: partial unique indexes on active `Contact` (`organizationId` + `email` / `phone`, `deletedAt IS NULL`); `validateUniqueness` in `@gate-access/db` (`seed-integrity`); migration `seeding_integrity_foundation`.
- **[Advanced Seeding Emulation V3 — DB]** Phase 2: `red-sea-data` + `unit-id-formats` (`generateUnitId` × six strategies); `Project.unitIdFormat` enum + migration `add_project_unit_id_format`.
- **[Advanced Seeding Emulation V3 — DB]** Phase 3: `rich-contact` — 14 nationalities, IDEA v3 weight table, `generateRichContact` + `validateUniqueness`; distribution test N=10_000 seed=42 (±2%).
- **[Advanced Seeding Emulation V3 — DB]** Phase 4: `unit-hierarchy-seed` + `seedUnitHierarchyForProject` — logical phase/building/floor tree mapped to `Unit` + `generateUnitId`, org-unique `Unit.name` via `projectScopedUnitName`, `ContactUnit` owner links, batched `createMany` (~500).
- **[Advanced Seeding Emulation V3 — DB]** Phase 5: `rush-hour` — `sampleScanTimestamps` (uniform + Gaussian mixture), scenarios `luxury-compound` / `nightclub` / `private-school` / `wedding-venue`, optional `weekendAccent: mena`, `minInterScanMs` with window-anchored spacing, histogram + chi-square tests.
- **[Advanced Seeding Emulation V3 — DB]** Phase 6: `seedRelationalChain` + `relational-chain-seed` — HMAC-signed VISITOR `QRCode` (`signQRPayload` / `verifyQRSignature`), `VisitorQR`, batched `ScanLog` (~500) with unique `scanUuid`; org-scoped preflight + `scanLogWhereForOrganization`; tests for verify/tamper/isolation/chain depth.
- **[Advanced Seeding Emulation V3 — API]** Phase 7: `POST /api/admin/emulate-traffic` (client-dashboard) — Super Admin + CSRF, Upstash `checkRateLimit` (5/hour per admin), Zod body (`scenario`, `pastDays`, `totalScans`, `incidentRate`, `randomSeed`, `organizationId`, `dryRun`, optional entity overrides); `runEmulation` in `@gate-access/db`; `AiActionLog` per run (target org id, no secrets in metadata); Jest coverage for 401/403/429/400/404/500/200.
- **[Advanced Seeding Emulation V3 — Client Dashboard]** Phase 8: Super Admin `/{locale}/dashboard/emulation` multi-step wizard (ADS tokens, i18n, `csrfFetch` → Phase 7 API); sidebar “Traffic emulation” (platform section); client Zod mirror + `emulation-schema` unit tests.
- **[Advanced Seeding Emulation V3 — DB / Ops]** Phase 9: `prisma/seed-entry.ts` router (`--help`, `--dry-run`, `--test-integrity`, `--organizations.min/max`, emulation flags aligned with Phase 7); `executeSeedCli` + `packages/db` tests; `verify:seed-contract` script; `docs/guides/SEED_AND_EMULATION_CLI.md`; Prisma `seed` → `seed-entry.ts`; fix `prisma/seed.ts` loop variable (`organizationsWithProjects`).

### AI Tools

- **[AI SDK v6]** continue migration to `ai@6` / `@ai-sdk/react@3` in dashboard assistants.
- **[AI Tools Docs]** separate AI tooling updates from app delivery updates.
- **[AI SDK v6 Migration]** started implementation of the AI SDK v6 migration initiative.

### Apps

- **[Marketing]** resolve production build type errors for ProductScreenshots and ComparisonSection

- **[Marketing]** add missing locale prop to ProductScreenshots

- **[Marketing]** add app illustrations and update marketing sections

- **[Scanner]** biometric and shift log foundation

- **[Admin]** constant-time compare + emulation gate/unit overrides

- **[Admin]** correct emulation i18n namespace wiring

- **[Admin]** add traffic emulation tooling to admin dashboard

- **[Admin dashboard]** Single `src/middleware.ts`: locale redirect, admin session (SHA-256 of `ADMIN_ACCESS_KEY` → `admin_session` cookie), `503`/`401` JSON on `/api/admin/*` when misconfigured or unauthenticated; `requireAdmin(locale?)` → `/{locale}/login`; gates/projects/admins server actions pass `locale` via hidden field; `docs/deployment/ADMIN_DASHBOARD.md` production smoke test + RSC digest / Vercel log correlation.

- **[Marketing]** `AntigravityBackground`: pass initial value to `useRef` for React 19 typings (`number | undefined`).

- **[Marketing]** initiate June 2026 Resilience campaign & Master Landing Page Protocol

- **[Resident Portal]** implement responsive multi-column layout with adaptive Sidebar/BottomNav switching.
- **[Resident Portal]** develop maintenance hub, history timeline, and visitor management components with ADS compact density.
- **[Resident Portal]** establish PWA foundation with loading skeletons, pull-to-refresh, and error boundaries.
- **[Marketing]** finalize mega menu navigation architecture and refine mid-cta section design tokens.
- **[Maintenance]** continue maintenance management rollout across dashboards.
- **[Apps Version]** keep app release cadence independent from workspace/tooling cadence.

---

## [0.1.0] — 2026-03-23

### Features

- **[Marketing]** normalize all metadata titles via templatedMarketingTitle helper
- **[Marketing]** update marketing dashboard rebuild plan and remove obsolete context files

- **[Marketing]** SEO title dedup, motion-safe guards, JSON-LD env var (phase 04)
- **[Marketing]** add marketing dashboard rebuild plan and update tasks

- **[Marketing]** refactor section tokens and rtl layout (phase 03)

- **[Marketing]** refactor section tokens and rtl layout (phase 03)
- **[Marketing]** align layout shell tokens (phase 02)

- **[Marketing]** align tokens with @gate-access/ui (phase 01)

- **[Ops]** complete autonomous_ops_intelligence Phase 05 marketplace booking MVP

- **[Autonomous Ops Intelligence]** agentic foundation, perimeter bridge, and high-density UI

- **[AI]** UIMessage v6 parts, assistant fallbacks; docs template; scanner Jest

- **[AI]** UIMessage v6 parts, assistant fallbacks; docs template; scanner Jest

- **[AI]** native UIMessage parts rendering in AIAssistant sidebar (phase 4)
- **[-M]** complete phase feat(ai): native UIMessage parts rendering in ChatPanel (phase 3)

- **[AI]** fix server-side message conversion for AI SDK v6 (phase 4)
- **[AI]** migrate to AI SDK v6 + @ai-sdk/google v3 (phases 1 & 2)

- **[Maintenance]** starting phase 3 - Maintenance Hub UI

- **[Maintenance]** baseline sync and starting phase 2
- **[Maintenance]** baseline phase 1 and start phase 2

- **[DB]** add maintenance hub work order models

- **[Maintenance Management]** start phase 1 implementation

- **[Maintenance Management]** finalize phased planning and pro-prompts

- **[Maintenance Management]** initialize maintenance hub initiative

- **[PageSpeed 100]** complete phase 5 - final audit & certification

- **[Security]** complete GitHub hardening and fix design violations

- **[GitHub Security Hardening]** complete phase 1

- **[CRM]** certify and finalize projects_crm v2.0 initiative

- **[UI]** refine dark mode borders and language switcher alignment

- **[UI]** relocate team chat to right panel and move collapse button to footer

- **[Security]** certify 100% multi-tenant isolation (Phase 7)

- **[Projects CRM]** complete phase 5 operations polish & audit

- **[CRM]** phase 3 - visitor watchlist status and security alerts
- **[Projects CRM]** implement phase 2 - invitation gateway and UI

- **[CRM]** update plan for schema and fix assistant route lint

- **[CRM]** 5-phase execution roadmap for projects_crm v2.0

- **[CRM]** initialize projects_crm v2.0 planning

- **[Perf]** phase 5 live audit + manifest fix + ADS token cleanup + AI SDK security patch

- **[AI]** add AI SDK v6 migration initiative to backlog

- **[Security Isolation Fix]** complete phase 6 - gate-assignment management UI

- **[Security Isolation Fix]** complete phase 5 - automated enforcement & certification

- **[Marketing]** update marketing site and UI component library

- **[AI]** add response format rule, slim AI workflow rule, add ralph to all tools
- **[Dev]** add persistent memory and progressive disclosure to dev workflow

- **[Plan]** structured plan folders, phase parts, and 2-tool selection

- **[UI]** automate UI/UX Pro Max skill across plan/dev workflows

- **[UI]** install UI/UX Pro Max skill and sync across assistants

- **[Resident-Mobile]** finalize phase 5 - i18n, GateAI pre-clearance, and security
  audit
- **[Resident-Mobile]** complete one-tap invite initiative (phases 1-5)
- **[Resident Mobile One Tap]** add recent guests to express invite ui
- **[Resident Mobile One Tap]** implement phase 3 - express invite ui
- **[Resident Mobile One Tap]** implement phase 2 - express invite api

- **[Automation] Ralph Loop** — Complete developer automation engine: 19 Ralph
  scripts, 5 Husky git hooks, 12 quality-check scripts
- **[Automation] `pnpm ralph`** — Master workspace dashboard: git state, active
  plans, hook health, quality snapshot, next action
- **[Automation] Plan lifecycle** — `plan:new → plan:ready → plan:start →
plan:run → plan:done` with automatic folder moves and doc cascades
- **[Automation] Phase auto-close** — Commit messages with `phase 3`, `[p3]`,
  `closes phase 3` auto-mark PLAN phases `[x]`
- **[Automation] Phase runner** — `pnpm plan:run` selects right CLI, runs phase,
  marks done, auto-completes plan on last phase
- **[Automation] Hotfix workflow** — `hotfix:start/done/status` with auto branch,
  bump, tag, and PR
- **[Automation] Semantic versioning** — `version:bump/tag/info` with annotated
  git tags
- **[Automation] Docs release** — `docs:release` closes `[Unreleased]`, bumps
  version, creates tag; `docs:release:dry` previews
- **[Automation] On-plan-done cascade** — Auto-updates CHANGELOG, FEATURE_LOG, UPCOMING, PRD, README on plan completion
- **[Automation] Commitlint** — Conventional commits enforced on every commit; 13 types, 30 scopes
- **[Automation] lint-staged** — Pre-commit ESLint + Prettier on staged files only
- **[Automation] Secret scanner** — 12 HIGH patterns block commit, 4 MEDIUM warn; skips test files and CI yml
- **[Automation] Env validator** — Checks presence, placeholder detection, and min-length for all app env vars
- **[Automation] Bundle size guard** — Warn >10% / fail >25% growth vs stored baseline
- **[Automation] Circular import detector** — Pure static DFS analysis across all TS/JS files
- **[Automation] DB schema drift** — Hash-based change detection vs committed baseline
- **[Automation] TODO/FIXME report** — `check:todos` with git blame author + age, severity sorting, JSON output
- **[Automation] Pre-deploy checklist** — 5-check gate; `--fail` mode for CI
- **[Automation] Dev onboarding** — `pnpm setup:dev` interactive env setup + DB init + hook install
- **[Automation] Branch enforcer** — Pre-push validates branch name pattern
- **[Automation] PR size labels** — GitHub Action labels XS/S/M/L/XL + posts affected packages comment
- **[Automation] GitHub Release** — Auto-published from CHANGELOG on `v*` tag push
- **[Automation] Post-merge auto-bump** — Merging `feat/*` into master auto-bumps patch + tags
- **[Docs] Automation Guide** — Comprehensive `docs/guides/AUTOMATION_GUIDE.md` covering all scripts, hooks, and workflows
- **[Docs] README rewrite** — Full README with automation badges, command reference, best workflow guide, monorepo structure

### Performance

- **[Marketing]** implement Partytown for Meta Pixel and GA4 to reduce TBT

- **[PageSpeed 100]** complete phase 5 - Lighthouse CI certification infra ready

- **[Cert]** phase 5 certification infra — regression guide + final LHCI thresholds

- **[Assets]** font display:swap + image allowlist + avif/webp + dvh + preconnect — phase 2
- **[CI]** establish lighthouse ci pipeline and performance baseline — phase 1

### Bug Fixes

- **[Admin]** resolve type inference issues in AI assistant route

- **[DB]** resolve implicit any in transaction and refine types

- **[DB]** correct version for accelerate extension

- **[DB]** resolve type recursion and missing accelerate extension

- **[DB]** enable prisma accelerate and resolve production runtime crash

- **[DB]** enable Prisma Accelerate support in production via `@prisma/extension-accelerate` and `withAccelerate`.
- **[DB]** resolve production migration drift (P3009, P3018) for `add_refresh_token` and `update_scanlog_audit_trail`.
- **[Actions]** correct invalid actions/cache SHA (d2993c1... → 1bd1e32).
- **[Actions]** correct invalid pnpm/action-setup SHA (feaa2f5... → 0c17529).

- **[CI]** resolve GitHub Actions workflow failures - update stale action versions.
- **[CI]** resolve GitHub Actions build failures - perimeter webhook route exports and ai-hub client component.

- **[CI]** restore green status by resolving nextjs 15 type errors and cleaning up imports.

- **[CI]** resolve nextjs 15 type errors and update action versions

- **[CI]** resolve all stale action references and relax lighthouse thresholds

- **[CI]** update all action versions to fix stale commit SHA failures

- **[Client]** resolve build/type errors in maintenance hub and QR validation

- **[Admin]** simplify AI assistant tools to native objects for SDK v5 typing

- **[Admin]** targeted @ts-expect-error for AI assistant tools

- **[Admin]** use @ts-expect-error instead of @ts-ignore per ESLint

- **[Admin]** finalize AI assistant tools type bypass via variable isolation

- **[Admin]** restore as any for individual tools to bypass tsc

- **[Admin]** bypass strict type check for AI assistant tools

- **[AI]** migrate AI SDK v4 → v5 type incompatibilities

- **[Deps]** solve Recharts 3.x tooltip formatter type errors

- **[DB]** comment out directUrl to prevent CI validation errors

- **[Security]** mark global maintenance queries with ignore-security-guard

- **[Security]** phase 4 — analytics export & incidents org isolation confirmed

- **[Security]** phase 3 — QR codes & workspace exports org isolation

- **[Security]** phase 2 — CRM contacts & units org isolation confirmed
- **[Security]** phase 1 — gates & scans org isolation hardening

- **[Security]** add organizationId scoping to contactUnit.findMany

- **[CRM]** replace hardcoded hex colors with ADS tokens

- **[Client]** pin react-hook-form to packages/ui instance to fix dual-version conflict
- **[Client]** add react paths to tsconfig for @types/react module identity
- **[Typecheck]** resolve React 19 module identity and ref-as-prop issues in admin-dashboard
- **[UI]** double-cast LucideIcon and props to satisfy resident-mobile strict typecheck

- **[UI]** resolve @types/react version mismatch in loading-spinner and pagination

- **[CI]** fix zod-to-json-schema webpack error by raising zod to 3.25.76; fix Next.js 15 type errors (async cookies and params) in all apps
- **[Deps]** pin ai@4, zod@3.23.8 workspace override; fix ai/react types and bulk-scan compat
- **[Security]** resolve CodeQL ReDoS/Injection alerts and transitive vulnerabilities

- **[Build]** resolve Next.js type error and align node engine versions

- **[DB]** add automated prisma migrate deploy to CI and fix schema drift

- **[DB]** add missing nanoid dependency for qr queries
- **[CI]** update Node.js to 22 and opt into Node.js 24 for all workflows

---

- **[Security]** implement hmac-sha256 signature utility for invites
- **[PageSpeed]** complete phase 4 - virtualization & bundle optimization
- **[PageSpeed 100]** optimize analytics bundle with dynamic chart imports
- **[PageSpeed 100]** complete phase 3 - server-side streaming & suspense
- **[Tools]** doc automation — changelog, versioning, PRD, organize
- **[Tools]** plan lifecycle automation + phase runner
- Initial production release of GateFlow v0.1.0
- 6-app monorepo: client-dashboard, admin-dashboard, scanner-app, resident-mobile, resident-portal, marketing
- HMAC-SHA256 QR signing + offline-first scanner architecture
- Multi-tenant Prisma middleware with org-scoped isolation

- Atlassian Design System tokens + full AR/EN RTL support
- GateAI intelligent operations assistant
- Projects CRM: contacts, units, live logs, team management
- Marketing Suite: UTM attribution, Meta Pixel, CRM webhooks
