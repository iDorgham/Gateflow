# IDEA: Marketing Growth Engine (Q3 2026)

**Slug:** `marketing_growth_engine_q3_2026`  
**Status:** Open — ready for `/plan marketing_growth_engine_q3_2026`  
**Created:** 2026-03-31  
**Related:** `docs/development/brainstorming/STRATEGY_marketing_growth_engine_q3_2026.md`, `apps/marketing`, `apps/client-dashboard`, `docs/reference/cache/API_ROUTES_MAP.md`

---

## Problem

GateFlow marketing has strong product depth and localized messaging, but the acquisition path is still too static for a high-intent B2B funnel. We need a tighter connection between:

- Visitor intent on marketing pages,
- Sales qualification actions (demo vs pilot vs migration),
- And downstream operational outcomes (first scan, activation quality).

Without this loop, campaign optimization and roadmap prioritization rely on partial conversion signals.

---

## Vision

1. **Adaptive intent funnel** — route users to the right CTA path based on role, property type, and migration intent.
2. **Vertical conversion assets** — publish resources and playbooks that map directly to compounds, schools, events, and clubs.
3. **Closed-loop attribution** — measure `campaign -> qualified lead -> first scan` using existing analytics + CRM + webhook rails.

---

## Constraints (GateFlow)

- Use `pnpm` workflows and existing monorepo packages/patterns.
- Preserve i18n/RTL behavior (`en` / `ar-EG`) across all funnel variants.
- Keep security/compliance posture intact (no secret leakage, no false claims).
- Reuse existing route infrastructure where possible; avoid duplicate API surfaces.
- Maintain performance and SEO quality baselines while adding conversion logic.

---

## Scope

### In scope

- Intent taxonomy for marketing CTAs (demo, pilot, migration, consult).
- CTA routing and tagging updates across key pages (home, solutions, pricing, resources).
- Vertical playbook strategy and lead-capture entry points.
- Analytics instrumentation spec for funnel stages and quality signals.
- Dashboard/reporting contract for tracking `campaign -> first scan`.

### Out of scope (unless later IDEA)

- Full CRM rewrite.
- New standalone CMS migration.
- Hardware-level product expansions (LPR/tailgating) outside marketing funnel scope.

---

## Success criteria

- CTA funnel paths are explicit and measurable by intent.
- At least one clear report path exists for `campaign -> qualified lead -> first scan`.
- Marketing pages keep SEO + i18n correctness after funnel updates.
- Plan phases can be executed incrementally with clear acceptance checks.

---

## Risks & open questions

- **Attribution completeness:** How much first-scan linkage is available per lead source today?
- **Funnel friction:** Added qualification steps might reduce top-of-funnel volume.
- **Operational ownership:** Which team owns the post-demo handoff events used in quality scoring?
- **Localization parity:** Arabic variants must not lag behind English conversion experiences.

---

## Next step

Run **`/plan marketing_growth_engine_q3_2026`** to generate phased execution prompts with KPI gates.
