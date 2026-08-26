# Draft — marketing_egypt_uiux_polish

**Slug:** `marketing_egypt_uiux_polish`  
**Application:** `apps/marketing`  
**Last updated:** 2026-08-26  
**Status:** Ready for `/plan marketing_egypt_uiux_polish`

> Generated [`FOR_PLAN_PROMPT.md`](file:///Users/Dorgham/Documents/Work/Devleopment/Gate-Access/docs/plan/Draft/marketing_egypt_uiux_polish/FOR_PLAN_PROMPT.md). Run **`/plan marketing_egypt_uiux_polish`** to produce the phased plan and prompts.

---

## 1. Executive Summary & Goals

Transform GateFlow's marketing website (`apps/marketing`) into a market-leading B2B acquisition engine for Egyptian gated communities, commercial hubs, educational campuses, and sporting clubs, while optimizing UI/UX and Core Web Vitals performance.

### Core Goals:

1. **Egyptian Arabic (`ar-EG`) Content Enhancement**:
   - Upgrade marketing copy to authentic, high-converting Egyptian compound & commercial security vernacular (e.g. _بوابات ذكية مشفرة للكمبوندات السكنية، تصاريح زوار فورية عبر واتساب، ربط مباشر بمحركات BFT/Came/Nice، أمان عسكري لمنع لقطات الشاشة، مسح فوري بدون إنترنت_).
   - Tailor vertical pages (`/solutions`) to Egyptian geography and real estate developments (_القاهرة الجديدة، التجمع الخامس، الشيخ زايد، 6 أكتوبر، العاصمة الإدارية، الساحل الشمالي، البحر الأحمر_).
2. **UI/UX & ADS Token Polish**:
   - Unify design token styling (`--ds-background-brand-bold`, `--ds-text-subtle`, `--ds-border-selected`).
   - Enhance interactive micro-animations, glassmorphism headers, and mobile navigation drawer.
   - Fix deep relative package imports in `components/nav.tsx` (`../../../packages/ui/...` → `@gate-access/ui`).
   - Clean up orphan typo directory `apps/marketing/app/[locale`.
3. **Performance & Core Web Vitals (CWV)**:
   - Optimize Largest Contentful Paint (LCP) on hero landing (< 1.2s).
   - Ensure Cumulative Layout Shift (CLS) is locked under 0.02 with explicit aspect ratios and image priority.
   - Defer and dynamically load heavy client widgets and sub-components.

---

## 2. In Scope vs Out of Scope

### In Scope:

- `apps/marketing/locales/ar-EG/` (`landing.json`, `solutions.json`, `pricing.json`, `product.json`, `contact.json`, `navigation.json`).
- `apps/marketing/components/` (Hero, Nav, Solutions, TrustBar, SecurityGrid, Footer).
- `apps/marketing/app/[locale]/` pages and layout optimization.
- Core Web Vitals, RTL fluid alignment, and accessibility (WCAG 2.2 AA).

### Out of Scope:

- Changing client-dashboard or admin-dashboard internal authentication routes.
- Database schema migrations (marketing is a stateless web app / client-side intent tracker).

---

## 3. Egyptian Arabic Copy Strategy & Vocabulary Matrix

| Generic Term                | Egyptian Enterprise Security Term                                                | Strategic Impact                                                |
| --------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| رموز الاستجابة السريعة (QR) | **تصاريح QR ذكية مشفرة عسكرياً**                                                 | Builds immediate trust for compound security chiefs             |
| أنظمة بوابات                | **بوابات ذكية متكاملة للكمبوندات والمؤسسات**                                     | Directly resonates with Egyptian compound developers            |
| استبدل فوضى الواتساب        | **وداعاً لفوضى مجموعات الواتساب ولقطات الشاشة — تصاريح رقمية بدون تطبيق للزائر** | Solves the #1 real-world headache of Cairo compound security    |
| بوابات الكترونية            | **ربط مباشر بمحركات وحواجز BFT و CAME و NICE بدون تغيير البنية التحتية**         | Eliminates objection regarding hardware replacement costs       |
| مسح بدون انترنت             | **مسح فوري بدون إنترنت (Offline-First) مع تزامن لحظي**                           | Critical reliability guarantee for spotty gate network coverage |

---

## 4. Suggested Phased Roadmap

1. **Phase 1 — Code Hygiene & Token Imports**:
   - Clean up orphan typo directory `apps/marketing/app/[locale`.
   - Normalize package imports in `nav.tsx` to workspace packages.
   - Audit and enforce ADS tokens across primary layouts.
2. **Phase 2 — Egyptian Arabic (`ar-EG`) Copy & Localization Upgrade**:
   - Overhaul `landing.json`, `solutions.json`, `pricing.json`, `navigation.json`, and `contact.json`.
   - Update compound and commercial proof anchors (+50 كمبوند سكني وإداري، +1 مليون حركة دخول).
3. **Phase 3 — UI/UX & Responsive RTL Polish**:
   - Polish hero section animations, trust badges, and interactive pricing toggles.
   - Ensure pixel-perfect RTL alignment and phone number/code LTR encapsulation (`dir="ltr"`).
4. **Phase 4 — Performance & Core Web Vitals Optimization**:
   - Optimize bundle size, lazy-load client-heavy visual components, and test LCP/CLS thresholds.
   - Verify deterministic typecheck, lint, and build.

---

## 5. Changelog

- **2026-08-26**: Initial draft created following `/focus marketing` and `/page-map` audit.
