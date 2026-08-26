# FOR_PLAN_PROMPT — Lighthouse & Performance (Mobile + Desktop)

**Slug:** `lighthouse_perf_mobile_desktop`  
**Domain:** Code · Frontend / Performance  
**Primary surfaces:** `apps/marketing`, `apps/client-dashboard` (+ `packages/ui` if shared)  
**Lifecycle:** `/idea` → `/draft` → `/prompt` → `/plan` → `/plan ready` → `/dev` → `/ship`

---

## Mission

Make **scheduled** Lighthouse CI on `master` pass for **marketing (mobile + desktop)** and **dashboard (desktop)** by fixing real Core Web Vitals and correcting bad measurement targets—not by soft-passing schedule asserts or silently lowering thresholds.

**Outcome:** Daily cron is a trustworthy regression gate; both form factors meet `.lighthouserc.js` floors on intentional production URLs; short evidence is recorded under `docs/guides/performance/`.

---

## In scope

1. **Baseline** — Exact failing asserts per URL × form factor (categories + LCP / FCP / TBT / CLS) from the latest failed schedule or a fresh LHCI run.
2. **Marketing mobile** — LCP-visible hero, fonts (`display: swap` + weight trim), critical images, CLS, TBT.
3. **Marketing desktop** — Same CWV rules + bundle isolation, best-practices, SEO on the same public URLs.
4. **Dashboard desktop** — Intentional audit target (login optimized, public health URL, or documented auth strategy)—stop treating an accidental `/en` → `/en/login` redirect as the product homepage unless chosen deliberately.
5. **Docs** — Before/after for mobile and desktop; residual risks; any workflow URL change noted.
6. **Policy** — Schedule remains **hard-fail** on assert miss once green.

## Out of scope

- Soft-passing `schedule` to fake green CI
- Dropping thresholds without measured justification + CHANGELOG
- Auth / QR / multi-tenant security model changes
- Unrelated visual redesign

---

## Users & constraints

| Area            | Rule                                                  |
| --------------- | ----------------------------------------------------- |
| Package manager | **pnpm only**                                         |
| UI              | Token-first / ADS — no hardcoded hex                  |
| i18n            | AR/EN RTL; logical properties (`margin-inline`, etc.) |
| Stack           | Next.js 16, React 19, monorepo filters                |
| Security        | No weakening of org scoping, CSRF, or QR signing      |
| Tooling         | Antigravity / Cursor; FRONTEND primary role           |

**Production targets (current workflow):**

| Job       | URLs                                                       | Form factors     |
| --------- | ---------------------------------------------------------- | ---------------- |
| Marketing | `https://www.gateflow.site`, `/en/features`, `/en/pricing` | Mobile + desktop |
| Dashboard | `https://app.gateflow.site/en` (live → `/en/login`)        | Desktop only     |

**Assert floors** (`.lighthouserc.js` — keep unless justified):

- Performance ≥ **0.65** · Accessibility ≥ **0.85** · Best practices ≥ **0.88** · SEO ≥ **0.90**
- LCP ≤ **2500 ms** · TBT ≤ **200 ms** · CLS ≤ **0.15**

**Known context (2026-08-26):** Schedule hard-fails; PRs soft-pass. Probe OK (sites up). Failure is assert miss, not collect/DNS. Reference run: https://github.com/iDorgham/Gateflow/actions/runs/32938556944  
Killers doc: `docs/guides/performance/ANALYSIS_performance_killers.md` (hero opacity, fonts, image wildcard, Recharts, missing Suspense—**re-verify on current master**).

---

## Definition of done

- [ ] Baseline matrix: URL × mobile|desktop × categories + CWV (with evidence)
- [ ] Marketing **mobile** meets floors on workflow URLs
- [ ] Marketing **desktop** meets floors on the same URLs
- [ ] Dashboard **desktop** passes on a **documented, intentional** target
- [ ] Schedule policy still hard-fails on real regression
- [ ] Lint + typecheck green on touched workspaces
- [ ] `docs/guides/performance/` updated (before/after, residuals)
- [ ] No ADS/token or RTL regressions

---

## Suggested phase breakdown

1. **Diagnose & baseline** — Actions/LHCI evidence; dashboard redirect called out
2. **Marketing mobile CWV** — LCP → fonts/images → TBT/CLS
3. **Marketing desktop CWV** — Bundle, BP, SEO; re-assert desktop
4. **Dashboard desktop target + scores** — URL strategy + workflow if needed
5. **Verify, docs, schedule gate** — Evidence pack; no silent soft-pass

Each phase prompt must include: **Primary role**, **Preferred tool**, **Steps**, **Acceptance criteria**, and EC rules from `PHASED_DEVELOPMENT_WORKFLOW.md`. Prefer FRONTEND; add DEVOPS only if `lighthouse.yml` changes.
