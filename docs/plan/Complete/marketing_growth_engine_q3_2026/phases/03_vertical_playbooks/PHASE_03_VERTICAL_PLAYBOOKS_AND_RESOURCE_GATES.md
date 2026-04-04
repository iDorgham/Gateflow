# Phase 03 Deliverable: Vertical Playbooks and Resource Lead Gates

**Plan:** `marketing_growth_engine_q3_2026`  
**Phase:** 03 — Vertical playbooks & resource lead gates  
**Status:** Done (playbooks + gated transitions live)

## 1) Vertical playbook assets shipped

Implemented playbook pages for all target verticals:

- `/[locale]/resources/playbooks/compounds`
- `/[locale]/resources/playbooks/schools`
- `/[locale]/resources/playbooks/events`
- `/[locale]/resources/playbooks/clubs`

Each playbook includes:

- vertical-specific summary
- rollout outcomes
- step-by-step rollout sequence
- lead-gate CTA to contact

## 2) Resource lead-gate flow and CTA alignment

Updated resources hub to feature playbook cards and vertical routing:

- Added featured and full playbook sections on `apps/marketing/app/[locale]/resources/page.tsx`
- Converted card actions to `IntentLink` so transitions preserve intent and surface metadata
- Ensured playbook-to-contact gates keep taxonomy context (`intent`, `surface`)

## 3) EN/AR parity

Localized content added for both locales:

- `apps/marketing/locales/en/resources.json`
- `apps/marketing/locales/ar-EG/resources.json`

New keys cover playbook titles, summaries, outcomes, rollout steps, and lead-gate copy.

## 4) SEO and internal linking

- Added per-playbook metadata generation via localized title + summary.
- Added playbook routes to sitemap in `apps/marketing/app/sitemap.ts`.
- Reinforced internal linking from resources hub to playbook routes and from playbooks to contact flow.

## 5) Verification

- `pnpm turbo lint --filter=marketing`
- `pnpm --filter marketing exec tsc --noEmit`

Typecheck passed; lint completed with pre-existing workspace warnings and no new blocking issues in touched files.
