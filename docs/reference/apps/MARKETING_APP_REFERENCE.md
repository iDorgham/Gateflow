# GateFlow Marketing App Reference

Comprehensive reference for `apps/marketing` covering structure, implemented work, navigation/menu model, and API surfaces.

## Coverage Status

- Pages/routes: covered.
- Menu/navigation: covered.
- API routes: covered (exhaustive).
- UI component inventory: now covered at module level (`components/**`).
- Function-level implementation details: summarized by module, not line-by-line per function.
- DB model interaction map: covered at domain level.

## App Purpose

- Public acquisition and conversion surface for GateFlow.
- Supports bilingual EN/AR experience with RTL-aware UI.
- Connects brand storytelling to measurable attribution and lead flows.

## What Has Been Completed

Based on app code and changelog history:

- Marketing growth engine work merged (Q3 initiative stream).
- Mega menu navigation architecture implemented.
- SEO metadata normalization and title templating strategy implemented.
- Token alignment and RTL layout refinements shipped in multiple phases.
- Performance-focused tracking optimizations (including Partytown work) documented in changelog.
- Resource/legal/help pages and blog surfaces are established.

## Application Structure

## Core Paths

- `apps/marketing/app` - App Router pages and route handlers.
- `apps/marketing/components` - navigation and marketing UI sections.
- `apps/marketing/lib` - content and intent/attribution support logic.
- `apps/marketing/docs` - app-level docs.

### UI/UX Module Inventory

- `components/nav.tsx` - desktop/mobile navigation + mega menu UX.
- `components/footer.tsx`, `components/theme-toggle.tsx`, `components/language-switcher.tsx`.
- Section system in `components/sections/*`:
  - hero, social proof, trust bar, stats, features, how-it-works,
  - solution/legal layouts, comparison, CTA blocks, screenshots, testimonials.
- Conversion/engagement components:
  - `contact-form.tsx`, `chat-widget.tsx`, `intent-link.tsx`, `intent-landing-tracker.tsx`,
  - `cookie-consent.tsx`, `cookie-banner.tsx`.
- Content components:
  - `blog-card.tsx`, `pricing-card.tsx`, `feature-card.tsx`, `json-ld.tsx`.

## Current Page Surface (`app/[locale]`)

- Home and core marketing:
  - `/`
  - `/features`
  - `/pricing`
  - `/contact`
  - `/company`
  - `/resources`
- Solutions:
  - `/solutions`
  - `/solutions/compounds`
  - `/solutions/events`
  - `/solutions/schools`
  - `/solutions/clubs`
- Content/legal:
  - `/blog`
  - `/blog/[slug]`
  - `/legal/[doc]`
  - `/legal/privacy`
  - `/legal/terms`
  - `/legal/cookies`
  - `/legal/security`
  - `/help`
- Routing and utility:
  - `/[slug]`
  - `/s/[shortId]`
  - `/login`
  - `/forbidden`
  - `/unauthorized`
  - `/resources/playbooks/[vertical]`

## Menu and Navigation Architecture

Defined in `apps/marketing/components/nav.tsx`:

- Top-level menu:
  - Home
  - Solutions (mega menu)
  - Pricing
  - Resources (mega menu)
- Mega menu features:
  - solution cards with icon + description,
  - quick links,
  - featured content/spotlight panel,
  - mobile navigation fallbacks.
- Action controls:
  - locale switcher,
  - theme toggle,
  - sign-in CTA,
  - contact/get-started CTA.

## API Surface (Complete Current Inventory)

All handlers under `apps/marketing/app/api`:

- `/api/contact`
- `/api/marketing/intent-event`
- `/api/revalidate`

## API Intent by Domain

- `contact`: lead/contact intake.
- `marketing/intent-event`: intent/campaign event tracking.
- `revalidate`: incremental content revalidation triggers.

## Function/Service Layer

Core service modules in `apps/marketing/lib`:

- `cms.ts` - content retrieval/integration logic.
- `blog.ts`, `blog-data.ts` - blog content handling.
- `marketing-intent.ts` - attribution/intent flow logic.
- `metadata-title.ts` - SEO metadata title strategy.
- `actions/invitation.ts` - invitation-related server actions.
- `i18n/get-translation.ts` - locale content lookup.
- `utils.ts` - shared app utilities.

## DB Touchpoints (Domain-Level)

Marketing app DB concerns are mostly read/content and attribution/event bridging. Relevant schema domains include:

- `LandingPage`, `LandingPageSection` (CMS landing content).
- `BlogPost`, `BlogCategory` (blog engine).
- `ShortLinkClick`, `QrShortLink`, `QRCode` (campaign and link attribution bridge).
- Lead/contact side effects integrate with downstream client/admin CRM domains.

## Implemented Marketing + Attribution Capabilities

From code/docs/changelog references:

- UTM and intent tracking surfaces are integrated (`intent-event`, UTM-related libs/workflows).
- CRM/lead flow support is represented in marketing and downstream dashboard integrations.
- SEO-focused metadata and structured content routing are already in place.
- Marketing content engine and playbook-resource routing are established for vertical narratives.

## Dependencies and Shared Contracts

- Shared UI primitives/tokens via `@gate-access/ui`.
- Shared i18n resources via `@gate-access/i18n`.
- Workspace-level architecture and quality gates from root scripts and CI workflows.

## Planning Notes for AI Tools

- Treat `components/nav.tsx` as the primary source for navigation IA decisions.
- Treat `app/[locale]/**` as the page map source of truth.
- Treat API routes above as the only current marketing backend surface.
- For future work, preserve:
  - AR/EN parity,
  - token-based styling,
  - attribution continuity from public touchpoints to downstream app analytics.
