# Phase 5: SEO Core Web Vitals 100, Arabic RTL Audit & Full Test Certification

## Primary Role

QA / SEO / DESIGN

## Tool Selection

- **Tool 1**: Cursor IDE (Structured data, RTL polish, tokens audit)
- **Tool 2**: Opencode CLI (Full test suite execution & lint)

## Context

- **Focused App**: `apps/marketing`
- **Scope**: SEO structured data, OpenGraph tags, Arabic RTL layout audit, full test suite.
- **Packages**: `@gate-access/ui/tokens`, `@gate-access/i18n`.

## Goal

Optimize marketing pages for Core Web Vitals (LCP < 1.2s, CLS = 0), inject structured JSON-LD schemas, verify full Arabic RTL parity, and certify 100% test pass rate.

## Scope (In)

1. SEO & Metadata Hardening:
   - Structured JSON-LD schemas (`SoftwareApplication`, `Organization`, `FAQPage`, `BreadcrumbList`).
   - Dynamic OpenGraph & Twitter preview cards for Arabic and English locales.
2. Design & RTL Audit:
   - Verify 100% semantic tokens from `@gate-access/ui/tokens` (`nativeTokensNewEra`).
   - Audit Arabic RTL text alignment, directionality, and button icons.
3. Automated Test Certification:
   - Run full test suite: `pnpm --filter marketing test` (100% pass).
   - Run `pnpm --filter marketing exec tsc --noEmit` (0 errors).
4. Write `phase_logs/PHASE_LOG_phase_05.md`.

## Acceptance Criteria

- [ ] Structured JSON-LD validates against schema.org validator with 0 errors.
- [ ] Arabic RTL renders with natural alignment and typography.
- [ ] Automated tests in `apps/marketing` pass with 100% green status.
- [ ] Zero TypeScript errors and zero lint warnings.
- [ ] Phase log `phase_logs/PHASE_LOG_phase_05.md` created.
