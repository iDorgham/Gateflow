# CLI Usage and Results Log

**Purpose:** Record which CLI was used for which task and the outcome. Over time, this supports better decisions (which CLI for which task type) and analysis of usage vs. results.

**Used by:** gf-guide, gf-dev, and gf-cli-limits skill. After any task completed with a CLI (e.g. during `/dev` or ad‑hoc), append a short entry below so we can refine tool choice and respect limits.

---

## How to record (for agents)

After a task or phase was executed **using a CLI** (Cursor, Codex CLI, Claude CLI, Gemini CLI (Antigravity), Opencode CLI, Kiro CLI, Kilo CLI, Qwen CLI):

1. Append one line to the **Log entries** section in this file (or add a new row to the table).
2. Include: **Date**, **CLI**, **Task/phase** (e.g. phase 1 of core_security_v6, or "ad-hoc: review auth.ts"), **Outcome** (success / partial / fail), **Notes** (optional: limit impact, quality, or "near daily limit").
3. Keep entries short (one line or one table row). This file is for pattern analysis and limits awareness, not full incident reports (use `incidents.md` for that).

**Template line:**

```text
- **YYYY-MM-DD** | **Claude CLI** | Phase 2 core_security_v6 | success | —
```

**Template table row:**

| Date       | CLI        | Task / phase             | Outcome | Notes |
| ---------- | ---------- | ------------------------ | ------- | ----- |
| YYYY-MM-DD | Claude CLI | phase 1 core_security_v6 | success | —     |

---

## Log entries

| Date       | CLI          | Task / phase                                                   | Outcome | Notes                                                                                                                   |
| ---------- | ------------ | -------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| 2026-07-24 | Codex CLI    | Phase 00 gateflow_workflow_bootstrap (doctor + adapter)        | success | `codex doctor` OK; adapter `codex exec -C {workdir}`; td doctor shows codex ✓                                           |
| 2026-03-17 | Gemini CLI   | Phase 5 atlassian_ui_remake                                    | success | Standardized Organizations, Users, Scans and Audit Logs.                                                                |
| 2026-03-17 | Antigravity  | Phase 5 gateai_hub_v2                                          | success | Unified motion tokens and RTL logical properties.                                                                       |
| 2026-03-22 | Gemini CLI   | Audit: Broad scan for multi-tenant leaks                       | success | Found several un-scoped queries.                                                                                        |
| 2026-03-22 | Opencode CLI | Audit: Code-path check for structure                           | success | Verified structure in dashboard settings.                                                                               |
| 2026-03-22 | Claude CLI   | Audit: Deep security audit of short-link & auth                | success | Fixed critical scoping in `requireAuth` and `s/.../route.ts`.                                                           |
| 2026-03-22 | Antigravity  | Team Management Suite                                          | success | Full implementation: Roles, Invitations, Audit, Activity, Sessions.                                                     |
| 2026-03-24 | Antigravity  | marketing:build stabilization (Next 15)                        | success | Fixed LucideIcon types (Icon, LoadingSpinner) and pricing i18n keys.                                                    |
| 2026-03-24 | Gemini CLI   | Phase 5 security_isolation_fix                                 | success | Certified 15+ API routes as secured with zero dashboard violations.                                                     |
| 2026-03-25 | Gemini CLI   | Phase 5 pagespeed_100                                          | success | Lighthouse CI infra certified; local mobile perf ~72-75 established.                                                    |
| 2026-03-25 | Antigravity  | security_isolation_fix: Phase 6 update                         | success | Merged Gate-Assignment UI design draft into the official plan as Phase 6.                                               |
| 2026-03-30 | Qwen CLI     | Phase 3 autonomous_ops_intelligence                            | partial | Webhook+incident+SSE notifier improvements; tests required manual follow-up due to tool approval gating.                |
| 2026-04-02 | Cursor       | Marketing useRef + eslint-config-next 15 + push master         | success | `pnpm`/git only; pre-push preflight passed; Dependabot `ai-6.0.138` already contained merged master on remote.          |
| 2026-04-02 | Cursor       | Commit `fix/admin-access-key-hardening` (admin key, turbo, CI) | success | `pnpm docs:changelog:check`; `turbo typecheck lint --filter=admin-dashboard`.                                           |
| 2026-04-02 | Vercel CLI   | Redeploy admin-dashboard render-boundary fix                   | partial | `vercel redeploy` completed; local `/en/admins` verified 200. Remote smoke check requires Vercel protection bypass/SSO. |
| 2026-04-29 | Antigravity  | Phase 1 token_system_v2                                        | success | Fixed dark mode wiring across tailwind configs and tokens.css.                                                          |
| 2026-04-29 | Antigravity  | Phase 2 token_system_v2                                        | success | Redesigned palette to Kimchi brand and warm neutrals in tokens.css.                                                     |
| 2026-04-29 | Antigravity  | Phase 3 token_system_v2                                        | success | Unified token architecture by removing dual definitions in globals.css and tokens.ts.                                   |
| 2026-04-29 | Antigravity  | Phase 4 token_system_v2                                        | success | Completed app integration: updated design-system color page, scrubbed hardcoded hex in layouts, and verified dark mode. |
| 2026-04-29 | Antigravity  | fix_hex_violations                                             | success | Replaced hardcoded #09090b with semantic bg-zinc-950 in design-system docs to meet 100% skill compliance.               |
| 2026-04-29 | Antigravity  | Phase 1 admin_dashboard_evolution                              | success | Reorganized admin sidebar, established org nested routing, and added skeleton layouts for CMS, CRM, and Analytics.      |
| 2026-04-29 | Antigravity  | Phase 2 admin_dashboard_evolution                              | success | Implemented CMS nested navigation and comprehensive settings, pages, landing pages, blog, and menu views.               |

- **Refactor Team Audit (ADS Tokens):**
  - **`qrcodes/page.tsx`**: Replaced 10+ raw hex violations with ADS tokens. Removed manual `dark:` background/border classes, relying on global token definitions.
  - **`create-qr-client.tsx`**: Migrated hardcoded QR colors to `token('elevation.surface')` and `token('color.text')`. Replaced `bg-slate-900` code block with `var(--ds-background-neutral-bold)`.
  - **`analytics-charts.tsx`**: Updated `ADS_TOOLTIP_STYLE` to use `var(--ds-shadow-raised)` instead of hardcoded RGBA.
  - **`settings-client.tsx`**: Cleaned up manual dark mode backgrounds (`#1D2125`, `#161A1D`) and fixed tab text color fallbacks.
  - **`contacts/page.tsx`**: Removed manual dark mode rings and hex fallbacks from table cells to ensure strict design system compliance.
  - **`scans` module**: Refactored 4 files (`page.tsx`, `scans-filters.tsx`, `ScansTable.tsx`, `ScanDetailDrawer.tsx`). Removed all raw hex violations and manual `dark:` classes.
  - **Verification**: Ran `pnpm preflight` — all checks passed with no new lint errors.

- **Team Management Suite Implementation:**
  - **Backend Actions**: Implemented context-aware actions for member/role CRUD with strict organization scoping and audit logging.
  - **Invitation Onboarding**: Designed a professional `/join` flow with email templates and automated session generation.
  - **Dynamic RBAC**: Built a type-safe `PermissionMatrix` with bulk toggles and dev-mode sanity auditing.
  - **Security Layer**: Integrated automated session revocation for immediate permission enforcement.
  - **Audit & Activity**: Created an organization-wide activity log capturing all administrative events for transparency.
  - **Verification**: Ran `pnpm preflight` — fixed a missing chat prop and checkbox naming inconsistency.

## Analysis (periodic)

When reviewing this log (e.g. weekly or before planning):

- Which CLI is used most for which task type? Prefer that in the task-to-tool matrix or GUIDE_PREFERENCES.
- Are paid CLIs (Claude, Gemini) often near limit? Prefer suggesting free-tier (Kiro, Kilo, Qwen) earlier in the day or for non-critical tasks.
- Any repeated partial/fail outcomes for a given CLI+task? Consider a different primary tool for that task in `docs/guides/TOOL_AND_CLI_REFERENCE.md`.
- **Date**: 2026-04-29
- **Command**: `/dev admin_dashboard_evolution 3`
- **Result**: Successfully implemented the Front Builder Core for the Admin Dashboard evolution. Scaffolded 9 CMS blocks, `BLOCK_REGISTRY`, `Canvas` with framer-motion `Reorder`, `StylePanel` with ADS token presets, and full `PageEditorPage` integration. Type checking and linting passed without errors.
