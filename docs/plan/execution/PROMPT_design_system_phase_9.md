# Phase 9: RTL, search, polish, deployment (`design.gateflow.site`)

> **Plan:** `docs/plan/execution/PLAN_gateflow_design_system.md`  
> **Depends on:** Phase 8

### Primary role

**FRONTEND** + **DevOps** (Vercel)

### Tool selection

|               | Tool             | Why                  |
| ------------- | ---------------- | -------------------- |
| **Preferred** | **Cursor**       | i18n + Next metadata |
| **Fallback**  | Vercel dashboard | DNS / domains        |

### Skills to load

**Also apply:** `docs/plan/execution/PLAN_gateflow_design_system.md` → **Production skills** → phase **9** groups.

**Motion default:** `creative-animation` + `docs/guides/MOTION_AND_ANIMATION.md` only; do not add `framer-motion` / `animejs` unless this phase explicitly requires them (PLAN § **Motion default policy**).

1. `.agents/skills/i18n/SKILL.md`, `.agents/skills/ads-arabic-egypt-uae-design/SKILL.md`, `.agents/skills/ads-accessibility-rtl/SKILL.md` — RTL, locale switching, MENA copy/layout notes
2. `.agents/skills/design-guide/SKILL.md`, `.agents/skills/responsive-design/SKILL.md` — audit mirrored layouts after `dir` flip
3. `.agents/skills/creative-animation/SKILL.md` — ensure global motion prefs still respected in localized shell
4. `.agents/skills/vercel-deployment/SKILL.md` or `.agents/skills/vercel/SKILL.md`
5. `.agents/skills/seo-core/SKILL.md` — docs metadata / OG

### Context

- **RTL:** Toggle **English / Arabic** (minimal strings), `dir="rtl"` on `<html>` or layout wrapper, mirror layout where needed; use `@gate-access/i18n` if messages already exist, or local `messages/` for design-system only — **prefer** consistency with monorepo i18n strategy (grep `resident-portal` / `marketing` patterns).
- **Search:** Lightweight client search (e.g. Flexsearch / Pagefind / Orama) **or** static filter over manifest JSON generated at build — pick one; must work on static export **only if** you choose export; default Next deployment is fine.
- **Polish:** OG image, favicon, sitemap, `robots.txt`, 404 page, skip-to-content link, focus styles.
- **Deployment:** Document Vercel steps: new project → root monorepo → set **Root Directory** to `apps/design-system` (or turborepo remote cache pattern), build command `cd ../.. && pnpm build:design`, output `.next`. Add domain `design.gateflow.site` (DNS CNAME/A per Vercel). Environment variables if any.

### Goal

Production-ready docs site: bilingual shell, search, polished meta, and **documented** path to live `design.gateflow.site`—hand off to **Phase 10** for npm publish of library packages (docs may stub “Coming to npm” until Phase 10 lands, then swap to live versions).

### Scope (in)

- RTL toggle + persistence (cookie or localStorage — align with privacy note in footer).
- Search UI in header.
- `CHANGELOG.md` section or dedicated `app/changelog` fed from **design-system app** releases (or link to root CHANGELOG subsection — document single source of truth).
- `vercel.json` in `apps/design-system` if needed for headers, redirects, or `design.gateflow.site` rewrite.
- Update root `CHANGELOG.md` under **Workspace** for new packages + app.

### Scope (out)

- Auth-gated docs.
- Multi-region edge logic.

### Steps (ordered)

1. Implement locale + direction provider; audit key layouts for hard-coded `ml-`/`pl-` — prefer logical properties (`ms-`, `pe-`, `border-s`, …).
2. Add search index generation script in `apps/design-system/scripts/` if using build-time index.
3. SEO: metadata API, openGraph, twitter, canonical host `https://design.gateflow.site`.
4. Write `apps/design-system/README.md` deployment section; optional `docs/deployment/DESIGN_SYSTEM_SITE.md` if repo convention prefers long-form ops docs.
5. Run full gate: `pnpm preflight` **or** at minimum `turbo lint typecheck build` across touched workspaces.
6. Commit: `chore(design-system): RTL, search, polish, and Vercel deployment docs`

### Acceptance criteria

- [ ] **RTL:** Arabic mode mirrors nav and content; no major overlap/clipping on homepage + tokens + one component page.
- [ ] **Search:** Finds at least headings for main sections (smoke test procedure documented).
- [ ] **Deploy doc:** Step-by-step Vercel + DNS; subdomain named explicitly.
- [ ] **Changelog:** Users can see what shipped (page or link).
- [ ] **Repo health:** Preflight or agreed turbo subset passes.
- [ ] **Motion deps:** RTL/search polish stays **CSS / Tailwind** (`creative-animation`). **No** new **`framer-motion`** / **`animejs`** on the design-system app **unless** a **new acceptance bullet** is added to this prompt first.

### Files likely touched

- `apps/design-system/app/**`
- `apps/design-system/components/**`
- `apps/design-system/vercel.json`
- `apps/design-system/README.md`
- `CHANGELOG.md` (root)
- `docs/plan/backlog/ALL_TASKS_BACKLOG.md` — mark initiative done when Phase 10 also complete

### Security / privacy checklist

- [ ] No secrets in repo; Vercel env documented only if needed
- [ ] Cookie/localStorage use documented for RTL/locale persistence
