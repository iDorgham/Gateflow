# Session Memory — repo_hygiene

## Active State

- **Branch:** `chore/repo-hygiene-v0.3.0` (from `origin/master` @ `fde072c`)
- **Phase:** in progress — Phase 00 complete locally
- **Next:** Phase 00b vulns → 01 cleanup → 02 lifecycle → 03 docs → 05 prod P0 → 04 release

## Phase 00 — CI / deploy (2026-07-24)

- Latest master CI @ `fde072c` (#163): **success** (Lint/Typecheck/Test/Security/Perf/CI OK)
- Publish GateFlow Design System: last fails on `62070077` / `4ed7e492` (broken lockfile era). Re-check after vuln lockfile rewrite.
- Vercel: client-dashboard + marketing **READY** @ `e802466`; later master pushes often **CANCELED** (Hobby/ignore); #160 production **ERROR** was broken `pnpm-lock.yaml`.
- Lighthouse schedule reds: **accepted non-blocking** (PR soft-pass already in workflow).

## Cross-Session Decisions

| Decision                                                 | Why                              | Still valid? |
| -------------------------------------------------------- | -------------------------------- | ------------ |
| Tag `v0.3.0` after hygiene                               | Baseline after Phase 0 bootstrap | Yes          |
| Fix Dependabot via `pnpm.overrides`                      | Avoid hand-editing lockfile      | Yes          |
| Marketing P0 only for `.short` + Prisma engine packaging | Highest runtime clusters         | Yes          |
