# CONTEXT: GateFlow Platform Evolution — The Operating System Hub

**Mission:** Transform the Admin Dashboard into a premium, intelligent **Operating System Hub** for platform operators, internal teams (Sales, Marketing, Dev, Support), and super-admins. Deeply integrate AI automation across CRM, Task Manager, Style Editing, Landing Page Builder, and Blog Content to create a highly productive, creative, and automated environment.

---

## 🏛️ Strategic Vision & Market Audit

### Market Positioning (2026 Trends)

Based on current global property management SaaS trends, GateFlow is positioned at the intersection of **Access Control** and **Building Operating Systems**.

- **Unified Access**: Market leaders integrate physical access (QR) with digital resident identity and hospitality services.
- **Predictive Operations**: AI is shifting from "Chatbot" to "Operational Forecaster" (predictive maintenance and crowd-flow triage).
- **Embedded RegTech**: Automated compliance reporting for ESG and local regulatory standards is becoming standard in enterprise property SaaS.

### Strategist Ideation (Three Levels)

1. **Level 1 (Polish)**: Zero-latency context switching and AI-driven support triage to route requests to Dev, Sales, or Tech.
2. **Level 2 (Evolution)**: Contextual **RBAC at the Unit/Project level** and a **Performance Hub** to expose caching and security states to organization admins.
3. **Level 3 (Revolution)**: Converging scanner and resident mobile apps into a single **"GateFlow Operations"** app that dynamically adapts its UI based on identity (Resident vs. Guard).

---

## 🛡️ Operational Mandates & Constraints

### 1. Multi-Tenancy & Security

- **Strict Scoping**: Every database query MUST include `organizationId` and `deletedAt: null`. This is the primary security invariant.
- **Audit Logging**: All AI-driven actions (publishing, scoring, sending) MUST be logged in `AiActionLog` with status `PENDING_CONFIRMATION` until approved by a human.
- **Security Check**: Load `gf-security` skill during implementation of any data or auth surface.

### 2. Departmental RBAC Roles (define in Phase 1c)

All `/api/**` routes for each department must check role server-side. Return `403` for unauthorized access.

| Role               | CRM               | Tasks           | Blog/CMS   | Landing Pages | Support     | Ops Dashboard | Admin Settings |
| :----------------- | :---------------- | :-------------- | :--------- | :------------ | :---------- | :------------ | :------------- |
| `SUPER_ADMIN`      | Full              | Full            | Full       | Full          | Full        | Full          | Full           |
| `SALES_REP`        | Own leads only    | Own tasks       | Read-only  | None          | None        | None          | None           |
| `SALES_MANAGER`    | All leads + deals | All sales tasks | Read-only  | None          | None        | Summary       | None           |
| `MARKETING_EDITOR` | Summary only      | Marketing tasks | Full draft | Full          | None        | Summary       | None           |
| `DEV_ADMIN`        | Audit logs        | Dev tasks       | None       | None          | Escalations | Full          | Read-only      |
| `SUPPORT_AGENT`    | None              | Support tasks   | None       | None          | Full        | None          | None           |

### 3. Data Privacy (PII — MANDATORY before CRM Phase 2)

- **Field-level encryption**: `email` and `phone` on `Lead` model — encrypted at rest (AES-256-GCM).
- **No raw PII in AI prompts**: Strip/hash PII before any LLM API call. Use metadata tiers only (companySize, region, orgType).
- **Consent flag**: `Lead.consentGiven` must be `true` before AI can generate outreach drafts.
- **Data residency**: Comply with Saudi PDPL, UAE PDPPL, and GDPR for MENA market data.

### 4. Design Aesthetics (ADS v7)

- **Token Compliance**: 100% adherence to Atlassian Design System (ADS) tokens. No hardcoded colors.
- **Visual Parity**: Client and Admin dashboards must be indistinguishable in visual quality.
- **Micro-interactions**: CSS-first transitions. Add `framer-motion` only where a phase prompt explicitly requires it.

### 5. AI Safety & Interaction (SDK v6)

- **Vercel AI SDK v6**: Use core patterns including tool calling and generative UI where applicable.
- **Human-in-the-Loop (HiTL)**: AI actions require human confirmation before external impact (emails, site publishing).
- **Image Generation**: Support for visual asset generation (Grok Imagine or equivalent) within the Landing Page and Blog builders.

### 6. MENA-First Globalization

- **Full RTL Support**: Every UI feature must support English and Arabic with perfect RTL layout.
- **Culturally Appropriate AI**: Ensure AI-generated Arabic content uses appropriate local tones (e.g., Saudi/UAE market standards).

---

---

## 🏗️ Module Architecture — Who Uses What & Where It Publishes

> The Admin Dashboard is a **pure internal OS for the GateFlow company team**. Clients never directly use Admin Dashboard tools.

| Module                   | Admin Dashboard Tool             | Used By                  | Publishes / Targets                            | Notes                                    |
| :----------------------- | :------------------------------- | :----------------------- | :--------------------------------------------- | :--------------------------------------- |
| **Org Hierarchy**        | Nested routing + OrgSwitcher     | GateFlow Ops/Dev         | `admin-dashboard` internal                     | Phase 1                                  |
| **GateFlow CRM**         | Lead scoring, pipeline, deals    | GateFlow Sales team      | Internal DB — tracks leads for buying GateFlow | Leads come from `gateflow.site` visitors |
| **Client CRM**           | Resident/member/inquiry tracking | Client org admins        | Client dashboard per org                       | Separate — in `org_types_dashboard` plan |
| **Task Manager**         | Kanban + AI bots                 | GateFlow all departments | Internal task boards                           | Sales, Marketing, Dev, Support           |
| **Style Hub**            | Live theming, token overrides    | GateFlow Dev/Design      | `apps/client-dashboard` per org                | White-labeling for clients               |
| **Landing Page Builder** | Block-based AI page composer     | GateFlow Marketing team  | `www.gateflow.site/en/[slug]`                  | e.g. `/landingpage_a`, `/landingpage_b`  |
| **Blog CMS**             | AI draft + publish workflow      | GateFlow Content team    | `www.gateflow.site/en/blog/[slug]`             | Headless CMS → `apps/marketing`          |
| **Support Hub**          | Ticket queue + AI triage         | GateFlow Support team    | Internal inbox                                 | Human escalation from client chat        |
| **Ops Dashboard**        | Analytics, performance dials     | GateFlow Dev/Ops         | Internal dashboards                            | Platform-wide metrics                    |

### Out of Scope (this plan)

| Feature                             | Where Instead                           |
| :---------------------------------- | :-------------------------------------- |
| Freeform Webflow-level drag builder | Future roadmap (drag-any-element)       |
| Client billing / Stripe portal      | Separate billing plan                   |
| Resident Mobile UX changes          | `scanner-app` / `resident-mobile` plans |
| Firmware / hardware integration     | External hardware plan                  |
| Client CRM (detailed)               | `org_types_dashboard` Phase 5+          |

---

## 🔗 Headless CMS Data Flow (Blog & Landing Pages)

Content created in Admin Dashboard is stored in the shared DB and consumed by `apps/marketing`:

```
Admin Dashboard (CMS Editor)
       │
       │  writes to DB
       ▼
shared Prisma DB
  └── BlogPost (slugEn, slugAr, contentEn, contentAr, status: PUBLISHED)
  └── LandingPage (slug, sections[], status: PUBLISHED)
       │
       │  read at build/runtime by
       ▼
apps/marketing (Next.js)
  └── /en/blog/[slug]     → BlogPost.slugEn
  └── /ar/blog/[slug]     → BlogPost.slugAr
  └── /en/[slug]          → LandingPage.slug
  └── /ar/[slug]          → LandingPage (RTL version)
```

**Implementation requirement**: `apps/marketing` needs:

- `GET /api/cms/blog/[slug]` — fetch published blog post by slug
- `GET /api/cms/pages/[slug]` — fetch published landing page by slug
- ISR (Incremental Static Regeneration) revalidation triggered on `PUBLISHED` status change

---

## 🧪 Definition of Done

- Passes `pnpm preflight` (lint, typecheck, tests) in `admin-dashboard`, `packages/db`, `packages/ui`, and `apps/marketing` (for Phase 5-6).
- ADS compliance verified via `enforce-ads-design.js`.
- All AI workflows include mandatory human review/confirmation gates.
- Multi-language (EN + AR RTL) verified and working perfectly across all published routes.
- Security invariants (org scoping, soft deletes) verified.
- Published content renders correctly at target `gateflow.site` URLs.
