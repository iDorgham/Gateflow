# Changelog

All notable changes to GateFlow are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) | [Semantic Versioning](https://semver.org/)

---

## [Unreleased]

_(next release notes go here)_

### Security

- **[Repo]** enable security policy, dependabot, and codeql analysis

### Maintenance

- **[Github Security Hardening] **Started development of Github Security Hardening

---

## [0.1.0] — 2026-03-23

### Features

- **[Pagespeed 100] **complete phase 5 - final audit & certification

- **[Security] **complete github hardening and fix design violations

- **[Github Security Hardening] **complete phase 1
- **[Github Security Hardening] **complete phase 1

- **[Crm] **certify and finalize projects_crm v2.0 initiative

- **[Ui] **refine dark mode borders and language switcher alignment

- **[Ui] **relocate team chat to right panel and move collapse button to footer

- **[Ui] **relocate team chat to right panel and move collapse button to footer

- **[Security] **certify 100% multi-tenant isolation (Phase 7)

- **[Projects Crm] **complete phase 5 operations polish & audit

- **[Crm] **phase 3 - visitor watchlist status and security alerts
- **[Projects Crm] **implement phase 2 - invitation gateway and UI

- **[Crm] **update plan for schema and fix assistant route lint

- **[Crm] **5-phase execution roadmap for projects_crm v2.0

- **[Crm] **initialize projects_crm v2.0 planning

- **[Perf] **phase 5 live audit + manifest fix + ADS token cleanup + ai-sdk security patch

- **[Ai] **add AI SDK v6 migration initiative to backlog

- **[Security Isolation Fix] **complete phase 6 - gate-assignment management UI

- **[Security Isolation Fix] **complete phase 5 - automated enforcement & certification

- **[Security Isolation Fix] **complete phase 5 - automated enforcement & certification

- **[Marketing] **update marketing site and UI component library

- **[Ai] **add response format rule, slim AI workflow rule, add ralph to all tools
- **[Dev] **add persistent memory and progressive disclosure to dev workflow

- **[Plan] **structured plan folders, phase parts, and 2-tool selection

- **[Ui] **automate UI/UX Pro Max skill across plan/dev workflows

- **[Ui] **install UI/UX Pro Max skill and sync across assistants

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

- **[Marketing] **implement Partytown for Meta Pixel and GA4 to reduce TBT

- **[Pagespeed 100] **complete phase 5 - Lighthouse CI certification infra ready

- **[Pagespeed 100] **complete phase 5 - Lighthouse CI certification infra ready

- **[Cert]** phase 5 certification infra — regression guide + final LHCI thresholds

- **[Assets]** font display:swap + image allowlist + avif/webp + dvh + preconnect — phase 2
- **[Ci]** establish lighthouse ci pipeline and performance baseline — phase 1

### Bug Fixes

- **[Admin] **simplify AI assistant tools to native objects for SDK v5 typing

- **[Admin] **targeted @ts-expect-error for AI assistant tools

- **[Admin] **use @ts-expect-error instead of @ts-ignore per ESLint

- **[Admin] **finalize AI assistant tools type bypass via variable isolation

- **[Admin] **restore as any for individual tools to bypass tsc

- **[Admin] **bypass strict type check for ai assistant tools

- **[Ai] **migrate AI SDK v4 → v5 type incompatibilities

- **[Deps] **solve Recharts 3.x tooltip formatter type errors

- **[Db] **comment out directUrl to prevent CI validation errors

- **[Security] **mark global maintenance queries with ignore-security-guard

- **[Security] **phase 4 — analytics export & incidents org isolation confirmed

- **[Security] **phase 3 — QR codes & workspace exports org isolation

- **[Security] **phase 2 — CRM contacts & units org isolation confirmed
- **[Security] **phase 1 — gates & scans org isolation hardening

- **[Security] **add organizationId scoping to contactUnit.findMany

- **[Crm] **replace hardcoded hex colors with ADS tokens

- **[Client] **pin react-hook-form to packages/ui instance to fix dual-version conflict
- **[Client] **add react paths to tsconfig for @types/react module identity
- **[Typecheck] **resolve React 19 module identity and ref-as-prop issues in admin-dashboard
- **[Ui] **double-cast LucideIcon and props to satisfy resident-mobile strict typecheck

- **[Ui] **resolve @types/react version mismatch in loading-spinner and pagination

- **[Ci] **fix zod-to-json-schema webpack error by raising zod to 3.25.76; fix Next.js 15 type errors (async cookies and params) in all apps
- **[Deps] **pin ai@4, zod@3.23.8 workspace override; fix ai/react types and bulk-scan compat
- **[Security] **resolve CodeQL ReDoS/Injection alerts and transitive vulnerabilities

- **[Build] **resolve next.js type error and align node engine versions

- **[Db]** add automated prisma migrate deploy to CI and fix schema drift

- **[Db]** add missing nanoid dependency for qr queries
- **[Ci]** update Node.js to 22 and opt into Node.js 24 for all workflows

---

- **[Security]** implement hmac-sha256 signature utility for invites
- **[Pagespeed]** complete phase 4 - virtualization & bundle optimization
- **[Pagespeed 100]** optimize analytics bundle with dynamic chart imports
- **[Pagespeed 100]** complete phase 3 - server-side streaming & suspense
- **[Tools]** doc automation — changelog, versioning, PRD, organize
- **[Tools]** plan lifecycle automation + phase runner
- Initial production release of GateFlow v0.1.0
- 6-app monorepo: client-dashboard, admin-dashboard, scanner-app, resident-mobile, resident-portal, marketing
- HMAC-SHA256 QR signing + offline-first scanner architecture
- Multi-tenant Prisma middleware with org-scoped isolation

- **[Resident-Mobile]** finalize phase 5 - i18n, GateAI pre-clearance, and security
  audit
- **[Resident-Mobile]** complete one-tap invite initiative (phases 1-5)
- **[Resident Mobile One Tap]** add recent guests to express invite ui
- **[Resident Mobile One Tap]** implement phase 3 - express invite ui
- **[Resident Mobile One Tap]** implement phase 2 - express invite api
- **[Security]** implement hmac-sha256 signature utility for invites

- **[Pagespeed] **complete phase 4 - virtualization & bundle optimization

- **[Pagespeed 100] **optimize analytics bundle with dynamic chart imports

- **[Pagespeed 100] **complete phase 3 - server-side streaming & suspense

- **[Tools] **doc automation — changelog, versioning, PRD, organize
- **[Tools] **plan lifecycle automation + phase runner
- Initial production release of GateFlow v0.1.0
- 6-app monorepo: client-dashboard, admin-dashboard, scanner-app, resident-mobile, resident-portal, marketing
- HMAC-SHA256 QR signing + offline-first scanner architecture
- Multi-tenant Prisma middleware with org-scoped isolation
- Atlassian Design System tokens + full AR/EN RTL support
- GateAI intelligent operations assistant
- Projects CRM: contacts, units, live logs, team management
- Marketing Suite: UTM attribution, Meta Pixel, CRM webhooks
