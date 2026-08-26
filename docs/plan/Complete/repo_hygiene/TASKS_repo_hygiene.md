# TASKS — repo_hygiene

## Phase 00 — CI / deploy

- [x] Branch from `origin/master`
- [x] Confirm tip CI green; document Publish DS / Vercel / LH schedule

## Phase 00b — Vulns

- [x] Add `pnpm.overrides` for qs, uuid, ip-address, markdown-it, @babel/core, esbuild, @ai-sdk/provider-utils
- [x] Regenerate lockfile; verify no vulnerable versions remain

## Phase 01 — Cleanup

- [x] Remove tracked trash + scratch
- [x] Untrack `.lighthouseci`
- [x] Remove unused `assets/Images` dumps (keep banner/v10/palette/README)
- [x] Remove local root `admin-dashboard/`; tighten `.gitignore`

## Phase 02 — Plan lifecycle

- [x] Merge design-system Draft uniques → Complete/context; delete Draft twin
- [x] Delete Ready org_types_dashboard twin
- [x] Fix backlog paths/status; add repo_hygiene entry

## Phase 03 — Docs refresh

- [x] README / CLAUDE / PRD stale claims
- [x] `pnpm docs:organize` / `docs:clean`
- [x] CHANGELOG Unreleased hygiene + security bullets

## Phase 05 — Marketing P0

- [x] Language switcher `.short` null-guard
- [x] Prisma engine packaging for Vercel

## Phase 04 — Release

- [x] Version `0.3.0` + CHANGELOG section
- [x] Annotated tag `v0.3.0`
- [x] Handoff `/audit all`
