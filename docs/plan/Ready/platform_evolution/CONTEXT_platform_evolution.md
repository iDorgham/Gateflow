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

## 🏗️ Scope Overview

| In Scope                                 | Out of Scope                                      |
| :--------------------------------------- | :------------------------------------------------ |
| Nested org hierarchy & context switching | Significant Resident Mobile UX changes            |
| AI-Powered CRM & Lead Scoring            | Full Webflow-level freeform builder (Blocks only) |
| Advanced Task Manager with AI Bots       | Production billing/Stripe integration             |
| Style Editing Hub (Live Theming)         | Direct hardware firmware updates                  |
| AI Landing Page Builder & Blog Engine    |                                                   |
| Unified Support & Ops Analytics          |                                                   |

---

## 🧪 Definition of Done

- Passes `pnpm preflight` (lint, typecheck, tests) in `admin-dashboard`, `packages/db`, and `packages/ui`.
- ADS compliance verified via `enforce-ads-design.js`.
- All AI workflows include mandatory human review/confirmation gates.
- Multi-language (EN + AR RTL) verified and working perfectly.
- Security invariants (org scoping, soft deletes) verified.
