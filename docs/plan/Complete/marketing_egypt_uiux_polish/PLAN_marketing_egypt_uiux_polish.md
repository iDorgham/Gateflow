# PLAN: Marketing App Egyptian Arabic (ar-EG) Content, UI/UX & CWV Performance

**Slug:** `marketing_egypt_uiux_polish`  
**Application:** `apps/marketing`  
**Status:** 🟢 Complete — All 4 Phases Certified  
**Created:** 2026-08-26  
**Target:** Q3 2026  
**Primary App:** `apps/marketing`  
**Skills:** `ads-a11y-rtl`, `i18n`, `ui-ux-pro-max`, `seo-content`, `nextjs-performance`

---

## Overview

Transform GateFlow's marketing website (`apps/marketing`) into an elite, high-converting B2B acquisition platform for Egyptian gated communities, commercial hubs, educational campuses, and sporting clubs. Upgrade the Egyptian Arabic (`ar-EG`) localization with authentic compound and security enterprise vernacular, resolve deep package import anomalies and orphan directories, align design tokens to ADS standards, and optimize Hero LCP/CLS Core Web Vitals to deliver sub-1.2s load times.

---

## Phases

| #   | Phase                                              | Primary Role | Preferred Tool    | Scope & Deliverables                                                                                                         | Status |
| --- | -------------------------------------------------- | ------------ | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | **Code Hygiene & Package Normalization**           | FRONTEND     | Cursor / OpenCode | Remove orphan dir `app/[locale`, replace deep relative import in `nav.tsx` with `@gateflow/ui`, enforce ADS tokens.          | [x]    |
| 2   | **Egyptian Arabic (`ar-EG`) Localization Upgrade** | i18n         | Cursor / Gemini   | Overhaul `landing.json`, `solutions.json`, `pricing.json`, `navigation.json`, `contact.json` for Egyptian compound security. | [x]    |
| 3   | **UI/UX & Responsive RTL Polish**                  | FRONTEND     | Cursor            | Framer Motion micro-interactions, responsive mobile drawer layout, trust anchors, pricing toggle.                            | [x]    |
| 4   | **Core Web Vitals & Performance Verification**     | QA           | Cursor / Claude   | Hero bundle size optimization, lazy-loading heavy visual components, LCP/CLS testing, preflight verification.                | [x]    |

---

## Technical Constraints & Invariants

- **Package Architecture**: Use `@gate-access/ui` and `@gate-access/types` workspace imports — no cross-package `../../../packages/...` relative paths.
- **RTL & Bidi Invariants**: Full bidirectional support (`dir="rtl"` / `dir="ltr"`), CSS logical properties (`margin-inline`, `padding-inline`), phone numbers and code badges in `dir="ltr"`.
- **Localization Invariants**: All copy keyed through `getTranslation(locale, namespace)` with fallback defaults.
- **Performance Invariants**: Hero LCP < 1.2s, CLS < 0.02, 100% clean typecheck and lint.
- **Verification Gates**: `pnpm turbo lint typecheck --filter=marketing` must pass after each phase.

---

## Tools Reference

| Tool             | Best for                                               | Mode                   |
| ---------------- | ------------------------------------------------------ | ---------------------- |
| **Cursor**       | Interactive UI/UX, RTL visual review, dictionary edits | IDE (pair-programming) |
| **Gemini CLI**   | Fast structural analysis, translation validation       | Headless               |
| **Claude CLI**   | Complex refactoring and performance profiling          | Headless               |
| **OpenCode CLI** | Code generation and package import cleanup             | Headless               |
