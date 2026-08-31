# 07. APPLICATION-BY-APPLICATION SCORECARDS & AUDITS — GATEFLOW

**Audit Date:** August 31, 2026  
**Focus:** Detailed Scorecards, Pros, Cons, and Recommendations for all 7 Monorepo Applications

---

## 1. Operator Console (`apps/client-dashboard`)

### Scorecard

- **Security:** 9/10 | **Multi-Tenancy:** 9/10 | **Reliability:** 9/10 | **UX:** 9/10 | **Accessibility:** 8/10 | **Testing:** 8/10 | **Maintainability:** 9/10

### Overview

Primary operational web app for property managers, community supervisors, and front-desk operators. Covers visitor pass generation, resident directories, incident tracking, gate management, and CRM.

### Pros

- Comprehensive feature set covering gate management, resident linking, analytics, and AI assistants.
- Strict session authentication (`getSession()`) and explicit tenant filtering on API routes.
- Danger zone endpoints include header challenges (`x-confirm-delete`).

### Cons

- Missing rate-limiting wrappers on bulk scan and pass validation APIs (P0-001).

---

## 2. Platform Control Plane (`apps/admin-dashboard`)

### Scorecard

- **Security:** 9/10 | **Multi-Tenancy:** 9/10 | **Reliability:** 9/10 | **UX:** 8/10 | **Accessibility:** 8/10 | **Testing:** 8/10 | **Maintainability:** 9/10

### Overview

Super-admin management application for platform owners to provision tenants, manage authorization keys, review cross-tenant audit logs, run emulation scenarios, and edit CMS content.

### Pros

- Dual authentication via HMAC session cookies (`admin_session`) and DB-backed authorization key tokens.
- Audited tenant reset handler (`/api/admin/reset-tenant`) with soft-delete cascading.

### Cons

- Emulation headers require strict environment guards in staging/production setups.

---

## 3. Physical Gate Scanner (`apps/scanner-app`)

### Scorecard

- **Security:** 9/10 | **Multi-Tenancy:** 9/10 | **Reliability:** 9/10 | **UX:** 9/10 | **Accessibility:** 8/10 | **Testing:** 8/10 | **Maintainability:** 9/10

### Overview

Expo React Native application used by security guards at physical property gates.

### Pros

- High-speed camera scanning with offline SQLite queue persistence and HMAC validation.
- Secure PIN storage with SHA-256 comparison and supervisor override flows.

### Cons

- Device clock drift requires server offset adjustment (P1-002).

---

## 4. Resident Mobile App (`apps/resident-mobile`)

### Scorecard

- **Security:** 9/10 | **Multi-Tenancy:** 9/10 | **Reliability:** 8/10 | **UX:** 9/10 | **Accessibility:** 8/10 | **Testing:** 7/10 | **Maintainability:** 8/10

### Overview

Expo mobile app for residents to issue visitor passes, view access history, and manage push notifications.

### Pros

- Simple pass creation UI with quick share links.
- Secure token storage via `expo-secure-store`.

### Cons

- Requires automated push token invalidation on logout.

---

## 5. Resident Web Portal (`apps/resident-portal`)

### Scorecard

- **Security:** 9/10 | **Multi-Tenancy:** 9/10 | **Reliability:** 8/10 | **UX:** 8/10 | **Accessibility:** 8/10 | **Testing:** 7/10 | **Maintainability:** 8/10

### Overview

PWA web application providing visitor pass creation and maintenance request management for residents.

### Pros

- Responsive mobile-first PWA design with Arabic RTL support.
- Scoped to authenticated resident's linked units.

### Cons

- Service worker caching strategy requires cache-busting automation on updates.

---

## 6. Marketing & Attribution (`apps/marketing`)

### Scorecard

- **Security:** 9/10 | **Multi-Tenancy:** N/A (Public) | **Reliability:** 9/10 | **UX:** 9/10 | **Accessibility:** 8/10 | **Testing:** 8/10 | **Maintainability:** 9/10

### Overview

Public marketing website featuring landing pages, blog, contact forms, and UTM attribution tracking.

### Pros

- SEO optimized with localized route metadata (EN/AR).
- Form inputs validated with Zod schemas.

### Cons

- Contact submission routes need CAPTCHA/bot defense.

---

## 7. Design System Catalog (`apps/design-system`)

### Scorecard

- **Security:** N/A | **Multi-Tenancy:** N/A | **Reliability:** 8/10 | **UX:** 8/10 | **Accessibility:** 8/10 | **Testing:** 7/10 | **Maintainability:** 8/10

### Overview

Documentation and catalog application displaying Atlassian Design System tokens and shared UI components.

### Pros

- Centralized reference for tokens, typography scales, and color variables.

### Cons

- Should be continuously updated with live Storybook components.
