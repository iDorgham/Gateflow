# Phase 04: SEO, motion, accessibility, verification

### Primary role

**FRONTEND** + **QA**

### Tool selection

|            | Tool       | Why                                    |
| ---------- | ---------- | -------------------------------------- |
| **Tool 1** | Cursor     | SEO metadata + polish                  |
| **Tool 2** | Gemini CLI | Second opinion on meta/structured data |

### Skills to load

- `seo-core`, `seo-content`, `ads-accessibility-rtl`, `nextjs-performance`
- `verification-before-completion`

### MCP

- **cursor-ide-browser** — Lighthouse spot or manual perf check

### Context

- `CONTEXT_marketing_rebuild_dashboard_parity.md`
- `apps/marketing/components/json-ld.tsx`, `app/sitemap.ts`, `app/robots.ts`

### Goal

Ensure **no SEO regressions**, motion respects **prefers-reduced-motion**, accessibility basics hold, and repo **preflight** is green after the redesign tranche.

### Scope (in)

- `metadata` / `opengraph-image` routes — verify titles, descriptions, canonical base `NEXT_PUBLIC_SITE_URL`
- JSON-LD remains valid
- Audit Framer Motion usage: reduced-motion, no CLS-heavy animations
- Run `pnpm preflight` (full monorepo gate)

### Scope (out)

- New marketing campaigns or A/B tooling
- Changing domain

### Steps

1. Grep for broken `metadataBase`, missing `template` titles on child pages
2. Review motion in `hero-animated-content.tsx` and section entrances
3. Keyboard/focus spot-check on Nav, CTA buttons, cookie banner
4. `pnpm preflight`
5. Tick `TASKS_marketing_rebuild_dashboard_parity.md` complete; prepare lifecycle move to `done/` when approved

### Acceptance criteria

- [ ] No regression in sitemap/robots generation (build succeeds)
- [ ] OG routes still build for main landing pages
- [ ] Motion respects `prefers-reduced-motion` on updated sections
- [ ] `pnpm preflight` passes
- [ ] TASKS file updated for all phases

### Files likely touched

- `apps/marketing/app/[locale]/layout.tsx` (metadata review)
- `apps/marketing/components/sections/hero-animated-content.tsx` (and other motion)
- `docs/plan/planned/marketing_rebuild_dashboard_parity/TASKS_marketing_rebuild_dashboard_parity.md`

### Handoff

Plan complete — move folder per `PLAN_LIFECYCLE.md`; sync `ALL_TASKS_BACKLOG.md`.
