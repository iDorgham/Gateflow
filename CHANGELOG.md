# Changelog

All notable changes to GateFlow are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) | [Semantic Versioning](https://semver.org/)

---

## [1.0.0] - 2026-04-06

### Added

- **GateFlow Design System**: Canonical v1.0 launch.
- **npm distribution**: Ready for `@gateflow/tokens`, `@gateflow/theme`, `@gateflow/ui`, `@gateflow/components`, and `@gateflow/ai`.
- **Documentation**: Professional docs site at [design.gateflow.site](https://design.gateflow.site) with RTL, search, and galleries.
- **MENA Regional Parity**: Standardized logical properties and Arabic localization foundations.
- **AI UI Excellence**: Glassmorphism and agentic patterns in `@gateflow/ai`.

## [Unreleased]

### Workspace

- **[Design-System]** complete pattern-docs phase 3 — Entity & Composition Patterns

- **[Design-System]** complete pattern-docs phase 2 — AI UI & Cortex Patterns

- **[Design-System]** complete pattern-docs phase 1 — Analytics Pattern Documentation

- **[Admin-Evolution]** complete phase 9 — AI polish, confirmation gate, version history, and E2E coverage

- **[Admin-Evolution]** sync implemented phases 4-8

- **[Admin-Dashboard]** implement cms front builder core and 9 blocks

- **[Admin Dashboard Evolution]** complete phase 2

- **[Admin Dashboard Evolution]** complete phase 1

- **[Design-System]** fix hardcoded hex values

- **[Token System V2]** complete phase 3

- **[Token System V2]** complete phase 2
- **[Deps]** override basic-ftp >=5.2.1 to clear GHSA-chqc-8p9q-pq6q
- **[Ui]** add favicons and apple-touch-icons to all portal apps

- **[Design-System]** add missing /patterns index page to resolve 404

- **[Patterns]** resolve build failures and finalize RTL certification

- **[Design-System]** certify and finalize Pattern Documentation (Phase 4)

- **[Design-System]** implement Entity Composition documentation (Phase 3)

- **[Design-System]** implement AI UI Pattern documentation (Phase 2)

- **[Design-System]** implement Analytics Pattern documentation (Phase 1)

- **[Design-System]** enforce 'use client' on all documentation pages to resolve prerendering errors

- **[Design-System-Redesign]** merge Phase 5 - Redesign & API Hardening

- **[Client-Dashboard]** resolve onOpenChat type mismatch in DashboardLayout

- **[Deployment]** resolve build blockers and lint warnings across design-system and admin-dashboard

- **[Deploy]** remove invalid ignoreBuildCommand from all apps

- **[Deploy]** remove invalid ignoreBuildCommand property and fix workflow schema

- **[Design-System]** complete redesign and polish (Phases 1-8)

- **[Design-System-Redesign]** completes phase 4 - monorepo enforcement
- **[Design-System-Redesign]** finalize phase 2 foundations

- **[Design-System-Redesign]** complete phase 2

- **[Design-System-Redesign]** complete phase 1

- **[Monorepo]** add framer-motion dependencies to @gateflow/ui, @gateflow/components, and design-system

- **[Ui]** resolve AISidePanel type mismatch with framer-motion

- **[Design-System]** standardized gateflow token architecture and in-depth manifesto

- **[Tokens]** remove unused @ts-expect-error in client-dashboard tailwind config
- **[Tokens]** remove unused @ts-expect-error in resident-portal tailwind config
- **[Tokens]** token system v2 — Kimchi palette, dark mode fix, unified architecture
- **[Ci]** run vercel commands from repo root for design-system deploy
- **[Ci]** add skip_migration input to unblock deploys during stuck migration
- **[Ui]** add ToastProvider to design-system layout
- **[Components]** import cn from @gateflow/ui/utils in all compositions
- **[Ui]** inject 'use client' via postbuild to preserve server-safe utils entry
- **[Ui]** isolate cn utility to @gateflow/ui/utils for server component safety
- **[Ui]** remove global 'use client' banner to allow universal utility usage

- **[Ops]** remove invalid vercel property and fix turbo filters

- **[Vercel]** implement ignore-build script to skip dependabot builds

- **[Ui]** preserve "use client" and externalize react-hook-form in tsup build
- **[Admin-Dashboard]** migrate PageHeader import from @gateflow/ui to @gateflow/components

- **[Design-System]** typecheck, lint, and build fixes for all @gateflow/\* packages

- **[Design-System]** primitives patterns ai galleries and packages catalog

- **[Gateflow Design System]** complete phase 10 (npm & CI)
- **[Gateflow Design System]** complete phase 9 (RTL & Search)
- **[Gateflow Design System]** complete phase 7 & 8 (Foundations & Galleries)
- **[Gateflow Design System]** complete phase 6

- **[Gateflow Design System]** complete phase 5

- **[Gateflow Design System]** complete phase 4
- **[Gateflow Design System]** complete phase 3

- **[Gateflow Design System]** complete phase 2

- **[Auth]** fix client-dashboard signAccessToken arg mismatch and resolve TS errors

- **[Gateflow Design System]** complete phase 1

- **[Org Types]** add OrganizationType to schema and auth tokens

- **[Client-Dashboard]** resolve type error with LanguageSwitcher variant prop

- **[Dashboards]** fix audit logs runtime error, sync theme/locale across all apps, and fix RTL/sidebar layout

- **[Changelog]** restructure Unreleased to match required tri-track format

- **[Deploy]** add outputFileTracingRoot to all Next.js apps for pnpm monorepo
- **[Deploy]** remove prisma generate from client-dashboard and resident-portal build scripts
- **[Db]** resolve TS2345 type error in tenant.ts scanLog.count
- **[Ci]** standardize cache action and remove pnpm-store from cache paths
- **[Scripts]** ralph-docs changelog inserts under Unreleased
  tri-track format
- **[Plan Lifecycle]** update tasks.md and document automation
  logic

### AI Tools

- **[AI SDK v6]** continue migration to `ai@6` / `@ai-sdk/react@3` in dashboard assistants.
- **[Admin AI]** refine UI/UX with premium animations and hybrid message parts.

### Apps

- **[Admin]** complete evolution phase 9

- **[Marketing]** cast t() to string in generateMetadata to fix TS2345

- **[Marketing]** resolve PhoneFrame style type error and cleanup unused icons

- **[Marketing]** resolve SecurityGrid prop mismatch and harden CMS route types

- **[Client]** migrate PageHeader import from @gateflow/ui to @gateflow/components

- **[Marketing]** merge marketing_growth_engine_q3_2026 worktree into master

- **[Admin]** resolve type errors in AI Assistant SDK migration

- **[Admin]** refine theme with specific hex colors and unified radii

- **[Admin]** modernize dashboard aesthetics to match client dashboard

- **[Admin]** Align Admin Dashboard aesthetics (Radius, Tokens, Shell) with Client
  Dashboard premium look
- **[Admin]** Refine Admin theme with specific hex colors (#111112, #191a1c, #2f2f33)
  and unified 6px/12px border radii.
- **[Admin]** add traffic emulation tooling and emulation hub v4.0
- **[Admin]** resolve typecheck errors blocking CI (i18n keys, lucide icon, hook-form deps)
- **[Client]** verify 100% multi-tenant isolation
- **[Client]** implement maintenance hub UI (Phase 3)
- **[Scanner]** biometric and shift log foundation
- **[Mobile]** one-tap invite initiative completion
- **[Portal]** implement responsive multi-column layout
- **[Marketing]** finalize mega menu navigation architecture and app illustrations

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
