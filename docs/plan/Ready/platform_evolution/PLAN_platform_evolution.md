# PLAN: GateFlow Platform Evolution — The Operating System Hub (v3.0)

**Mission:** Transform the Admin Dashboard into a premium, intelligent **Operating System Hub** for platform operators, internal teams (Sales, Marketing, Dev, Support), and super-admins. Deeply integrate AI automation across CRM, Task Manager, Style Editing, Landing Page Builder, and Blog Content.

**Slug:** `platform_evolution`  
**Status:** Ready  
**Primary apps:** `apps/admin-dashboard`, `apps/marketing`  
**Supporting:** `packages/db`, `packages/ui`, `packages/types`, `packages/api`

---

## 🏛️ Strategic Summary — Seven Integrated Phases

| Phase | Title                           | Primary Role  | Outcome                                                                                |
| :---- | :------------------------------ | :------------ | :------------------------------------------------------------------------------------- |
| **1** | **Nested Hierarchy & Routing**  | **BACKEND**   | Strategic refactor of Users/Projects/Gates into Org context; Smart context switching.  |
| **2** | **AI CRM & Lead Intelligence**  | **FULLSTACK** | Predictive lead scoring, automated nurturing, and AI deal forecasting for Sales teams. |
| **3** | **AI Task Manager & Bots**      | **FULLSTACK** | Kanban + Calendar views with rule-based AI bots for cross-departmental automation.     |
| **4** | **Style Hub & Live Theming**    | **FRONTEND**  | Token-safe white-labeling engine with real-time previews for client branding.          |
| **5** | **AI Landing Page Builder**     | **FULLSTACK** | Block-based composer with AI text/image generation (Vercel AI SDK v6).                 |
| **6** | **AI Blog Content Engine**      | **FULLSTACK** | Automated topic suggestion and full draft generation (EN/AR) with HiTL review.         |
| **7** | **Ops Hub & Resilience Polish** | **QA/OPS**    | Unified help desk queue, predictive analytics, and performance/caching hardening.      |

---

## 🛡️ Core Mandates & Constraints

### 1. Multi-Tenancy & Security

- **Strict Scoping**: Every DB query MUST include `organizationId` and `deletedAt: null`.
- **Audit Logs**: All AI-driven actions (publishing, scoring, sending) MUST be logged in `AiActionLog` with status `PENDING_CONFIRMATION` until approved by a human.
- **RBAC**: Access to department-specific hubs (CRM for Sales, Content for Marketing) must be guarded by `gateflow-security` roles.

### 2. Design & Aesthetics (ADS v7)

- **Token Only**: Use shared ADS tokens (e.g., `var(--ds-background-neutral-subtle)`). No hardcoded hex codes.
- **Micro-interactions**: Use Framer Motion for subtle, premium layout transitions and AI "thinking" states.
- **RTL/Arabic**: Native full-width support for Arabic (RTL). Mirror icons and layouts logically.

### 3. AI Safety & Vercel SDK v6

- **Tool Calling**: Use tool-calling for all AI interactions (CRM updates, Task creation, Blog drafting).
- **Human Review**: No external-facing impact (emails, publishing) without a human confirmation gate.
- **Image Generation**: Integrate Grok Imagine (or fallback) for landing page/blog visual assets.

---

## 🧪 Definition of Done

1.  **Code Quality**: Passes `pnpm preflight` (lint, typecheck, tests) in affected workspaces.
2.  **ADS Compliance**: Verified via `enforce-ads-design.js`.
3.  **Security Invariants**: Confirmed Org-scoping and Soft-deletes across all new entities.
4.  **Parity**: EN/AR RTL layouts are indistinguishable in quality.
5.  **Documentation**: `PRD_v7.0.md` and `ALL_TASKS_BACKLOG.md` updated with phase outcomes.
