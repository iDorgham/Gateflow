# PROMPT: Phase 02 — Egyptian Arabic (`ar-EG`) Localization Upgrade

**Slug:** `marketing_egypt_uiux_polish`  
**Phase:** 02  
**Primary Role:** i18n  
**Preferred Tool:** Cursor / Gemini CLI  
**App Scope:** `apps/marketing`

---

## Objective

Overhaul the marketing website's Egyptian Arabic (`ar-EG`) dictionaries to replace literal or generic phrasing with authentic, high-converting Egyptian compound, gated community, and facility security enterprise vernacular.

---

## Context & Dictionaries to Touch

- `apps/marketing/locales/ar-EG/landing.json`
- `apps/marketing/locales/ar-EG/solutions.json`
- `apps/marketing/locales/ar-EG/pricing.json`
- `apps/marketing/locales/ar-EG/contact.json`
- `apps/marketing/locales/ar-EG/navigation.json`

---

## Key Terminology Upgrades

1. **Hero & Value Proposition**:
   - Headline: _بوابات ذكية مشفرة لإدارة دخول الكمبوندات والمشروعات الكبرى_
   - Subheadline: _وداعاً لفوضى تصاريح الواتساب ولقطات الشاشة — تصاريح زيارة رقمية مشفرة بضغطة واحدة، ربط مباشر بمحركات BFT و Came و Nice، وتزامن كامل بدون إنترنت._
2. **Compound & Vertical Focus**:
   - Explicit references to Egyptian compound hubs (_القاهرة الجديدة، التجمع الخامس، الشيخ زايد، 6 أكتوبر، العاصمة الإدارية، الساحل الشمالي_).
   - Tailored use-cases for Residential Compounds (كمبوندات سكنية), Business Parks (مراكز إدارية وتجارية), Schools (مدارس وجامعات), and Sporting Clubs (نوادي رياضية).
3. **Hardware & Security Clarity**:
   - Highlight integration with popular Egyptian barrier controllers (BFT, Came, Nice).
   - Anti-replay QR protection (حماية مشفرة مضادة للقطات الشاشة وإعادة الاستخدام).

---

## Acceptance Criteria

- [ ] `landing.json`, `solutions.json`, `pricing.json`, `contact.json`, and `navigation.json` in `ar-EG` are fully updated and refined.
- [ ] No broken translation keys or missing variables in localized components.
- [ ] `pnpm turbo lint typecheck --filter=marketing` passes cleanly.
