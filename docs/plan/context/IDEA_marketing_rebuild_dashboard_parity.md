# IDEA: Marketing site rebuild — dashboard token parity & AI-skills workflow

**Slug:** `marketing_rebuild_dashboard_parity`  
**Status:** Planned — `docs/plan/Ready/marketing_rebuild_dashboard_parity/`  
**Created:** 2026-03-30  
**Related:** `IDEA_marketing_website.md` (content phases), `apps/marketing`, `packages/ui`, `apps/client-dashboard`

---

## Problem

The public marketing app (`apps/marketing`) and the client dashboard share a _narrative_ design direction (ADS-style `--ds-*` tokens, MENA/i18n) but **not a single mechanical source of truth** for colors, radii, and component primitives. Marketing ships its own `app/globals.css` with a large duplicated token block, while the dashboard leans on `@gate-access/ui` (`packages/ui` — `globals.css`, `tokens.ts`, shadcn building blocks). That drift causes:

- Visual inconsistency when prospects compare the website to the signed-in product.
- Double maintenance when token audits run (e.g. skill-discovery / hex normalization) across two surfaces.
- No explicit playbook for using **workspace AI skills** (design, SEO, content, motion) on marketing work the same way as on the dashboard.

The user goal: **rebuild / realign marketing** using **current AI skills** and the **same token and color system the dashboard uses**, without throwing away routes, i18n, or SEO investments.

---

## Vision

1. **Token & UI parity** — Marketing consumes the same canonical design outputs as the dashboard where feasible (shared package CSS variables, `cn()` / primitives from `@gate-access/ui`, ADS-oriented Tailwind theme). Marketing may keep **Inter + Cairo** for brand typography on the marketing layout if desired, but **semantic colors, borders, elevation, and spacing** should match dashboard semantics.
2. **AI-skills-driven execution** — Phase prompts explicitly load the right skills (e.g. `design-guide`, `ads-*`, `tailwind`, `seo-*`, `content-creation`, `creative-animation` / `motion` where appropriate) so `/dev` phases do not improvise from scratch.
3. **Preserve growth & compliance** — No regression on locale routes, `NEXT_PUBLIC_SITE_URL`, sitemap/robots, Partytown/analytics hooks, or legal/blog URLs unless intentionally migrated with redirects.

---

## Constraints (GateFlow)

- **pnpm only**; workspace imports (`@gate-access/ui`, shared types) — no duplicate `cn()` trees.
- **i18n / RTL** — Arabic (`ar-EG`) layouts must remain correct after token/layout refactors.
- **Performance** — Keep or improve Core Web Vitals; avoid heavy client JS on above-the-fold.
- **Security** — No secrets in client bundles; contact/API routes unchanged in behavior unless scoped.
- **QR / product claims** — Marketing copy must stay aligned with real product capabilities (no false security claims).

---

## Existing assets

| Asset                     | Location                                                         | Notes                                                                                                 |
| ------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Marketing app             | `apps/marketing`                                                 | Next 15, `@gate-access/ui` already in dependencies                                                    |
| Marketing globals         | `apps/marketing/app/globals.css`                                 | Large `--ds-*` block — candidate to replace/consolidate                                               |
| Dashboard shell reference | `apps/client-dashboard`, `packages/ui`                           | Canonical patterns for tokens + components                                                            |
| Prior content initiative  | `docs/plan/context/IDEA_marketing_website.md`                    | Many phases marked complete; this IDEA is **system + workflow** rebuild, not a duplicate content spec |
| Skills                    | `.cursor/skills/` — design, ads-_, seo-_, content-creation, etc. | To be referenced in phase prompts                                                                     |

---

## Scope

### In scope

- Audit diff between `apps/marketing/app/globals.css` and `packages/ui/src/globals.css` (and Tailwind configs); define a **single import / re-export or build-time shared layer** strategy.
- Refactor marketing layout and key sections to use **dashboard-aligned semantic classes** and shared UI primitives where it reduces drift (buttons, cards, inputs — without turning the whole site into app chrome).
- Update **Tailwind theme** in `apps/marketing/tailwind.config.ts` to track `packages/ui` conventions (colors mapped to CSS variables).
- Document **which AI skills** each phase must load (table in `PLAN_*.md`).
- Optional: thin marketing-specific “brand” tokens only where public site needs differentiation (documented exceptions).

### Out of scope (unless later IDEA)

- Replacing Resend/contact pipeline or rewriting all blog MDX.
- Changing domain, analytics IDs, or Partytown strategy without a dedicated infra phase.
- Full CMS or headless marketing stack.

---

## Success criteria

- Side-by-side: homepage + one dashboard overview screenshot frame share **matching primary/secondary/surface/border** semantics (measurable via token reference, not hand-waving).
- `apps/marketing` **does not** maintain a full duplicate ADS token file if the repo standard becomes “import from `@gate-access/ui` stylesheet entry” (or documented subset).
- New or updated components in marketing use `@gate-access/ui` patterns pass **`pnpm --filter marketing lint`** and **`pnpm preflight`** when touched in a phase.
- `PLAN_marketing_rebuild_dashboard_parity.md` lists **Primary role + Preferred tool + Skills to load** per phase.

---

## Risks & open questions

- **Bundle size:** Pulling more of `@gate-access/ui` into marketing may affect JS/CSS size — measure and tree-shake.
- **Font strategy:** Keep Inter/Cairo vs align with dashboard font stack — decision needed in Phase 1.
- **Dark mode:** Ensure `next-themes` + shared tokens still produce accessible contrast on all hero/CTA pairs.
- **Chat widget / AI features in marketing:** If rebuilt with Vercel AI SDK, align with `ai_sdk_v6_migration` roadmap to avoid double patterns.

---

## Next step

Phased plan and prompts live under **`docs/plan/Ready/marketing_rebuild_dashboard_parity/`**. Run **`/dev marketing_rebuild_dashboard_parity 1`** to start Phase 01.
