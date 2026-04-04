# Phase 7: Arabic i18n & RTL localization

> **Plan:** `PLAN_org_types_dashboard.md` (plan folder root)  
> **Slug:** `org_types_dashboard`

### Primary role

**FRONTEND** + **i18n**

### Tool selection

|               | Tool       | Why                            |
| ------------- | ---------- | ------------------------------ |
| **Preferred** | **Cursor** | Locale files + UI verification |
| **Fallback**  | —          | —                              |

### Skills to load

1. `.cursor/skills/i18n/SKILL.md` — Arabic copy, pluralization, formal tone for MENA B2B
2. `.cursor/skills/ads-accessibility-rtl/SKILL.md`
3. `.cursor/skills/design-guide/SKILL.md`

### Context

- **Locales:** `packages/i18n/src/locales/en.json`, `ar-EG.json`
- **New keys** introduced in Phases 3–6: `orgType.*`, extended `sidebar.*`, `dashboard.*`, `settings.*`, `emptyStates.*`, terminology for all five types
- **PRD / product tone:** professional, security-conscious, MENA market

### Goal

Add **high-quality Arabic (Egypt/Gulf neutral formal)** strings for **all** new English keys, ensure **RTL layout** is correct for **every organization type** (especially REAL_ESTATE flows), and fix any LTR assumptions introduced earlier.

### Scope (in)

- Complete `ar-EG.json` parity for new keys; no missing fallbacks in production paths
- Audit dashboard layout, sidebar, settings, modals, charts (Recharts **mirroring** if needed), tables (`text-start`/`text-end`), icons that imply direction
- Pluralization where English uses counts; Arabic plural rules via i18next if configured
- Spot-check **font rendering** and **mixed EN/AR** in proper names (e.g. compound names)
- Document key namespace in a short comment at top of `en.json` section or in config file

### Scope (out)

- Translating unrelated legacy strings (only strings touched or introduced by org-type work + required neighbors for coherence)
- Marketing site

### Steps (ordered)

1. Export/list all i18n keys added since Phase 3 (script or grep `orgType.` etc.).
2. Translate to Arabic with consistent terminology sheet (unit = وحدة / سكن، student = طالب، member = عضو، guest = ضيف، VIP = كبار الشخصيات، gate = بوابة، compound = مجمع سكني).
3. Run dashboard in `ar-EG` for **REAL_ESTATE**, **SCHOOL**, **NIGHTCLUB** (minimum) + quick pass CLUB + EVENT_ORGANISER.
4. Fix RTL bugs (scroll containers, `space-x` misuse, chart margins, dialog footers).
5. Add visual/regression notes in PR description (screenshots optional).
6. `pnpm turbo lint` + `pnpm turbo typecheck`; run i18n validation if repo has a script.

### Acceptance criteria

**Functional correctness**

- [ ] No missing-key console warnings on scanned pages for all five types in Arabic.
- [ ] REAL_ESTATE Arabic experience reads naturally for gated-compound operators.

**Code quality**

- [ ] Lint/typecheck pass.

**Security & architecture**

- [ ] N/A beyond ensuring no secrets in locale files.

**Testing**

- [ ] Manual RTL verification checklist completed for listed types.
- [ ] Optional: Playwright or smoke test hook for `locale=ar-EG` if repo already supports it.

**UX & polish**

- [ ] Charts and tables readable; legends and axes labels not clipped.
- [ ] Settings long forms scroll correctly under RTL.

**Documentation**

- [ ] Translation keys namespaced (`orgType`, `dashboard`, `sidebar`, `settings`, …) documented in PLAN or config header.

### Files likely touched

- `packages/i18n/src/locales/en.json`
- `packages/i18n/src/locales/ar-EG.json`
- `apps/client-dashboard/src/**/*.tsx` (RTL class fixes only)
- Possibly `apps/client-dashboard/src/lib/analytics/**` for chart margin helpers
