# PLAN: GateAI Operations Hub (v2.0)

**Initiative:** Transform GateAI from a chat interface into a high-density Operations Workbench with Infinite Canvas, Intelligent Tagging, Scheduled Analytics, and Task Automation.
**Status:** Planning
**Target:** Client Dashboard (`apps/client-dashboard`)

---

## 🎯 Vision & Goals
Upgrade the existing GateAI chat interface into a full-scale Operations Hub. This will involve an infinite canvas for data visualization (Tiptap + Recharts), a robust tagging system for context, an NLP-driven scheduling engine backed by Redis, and refined SaaS-level glassmorphism aesthetics from the Atlassian Design System.

### Success Criteria
- 40% dashboard adoption within 60 days
- 80% success rate on common AI intents
- >90% reduction in manual report/QR creation time
- Page load performance <1.2s
- Zero security incidents (org data leakage)

---

## 🔒 Core Constraints
- **Security:** Strict multi-tenancy (`organizationId` on all queries). Soft deletes (`deletedAt: null`). RBAC enforcement.
- **Audit Logging:** All AI mutations logged to `AiActionLog`.
- **Rate Limiting:** AI endpoints protected via Upstash Redis.
- **RTL Support:** Full Arabic verification.
- **Tech Stack:** Next.js 14, standard `shadcn` UI components, Framer Motion, Recharts, Prisma 5, `pnpm` only.

---

## 🚀 Phase Roadmap

### `PROMPT_gateai_hub_v2_phase_1.md`
**Phase 1: Foundation & Secure Shell**
- **Scope:** Layout architecture, design tokens, security baseline.
- **Deliverables:** 3-column layout, Navy/Orange glass tokens, strict `organizationId` enforcement at the route level.
- **Role:** FULLSTACK

### `PROMPT_gateai_hub_v2_phase_2.md`
**Phase 2: Intelligent Tagging + Analytics Indexing**
- **Scope:** First-class tagging for AI history, documents, and scan data.
- **Deliverables:** DB `Tag` model extension, `TagSidebar` component, Analytics indexing pipeline.
- **Role:** FULLSTACK
- **Dependency:** Requires Phase 1.

### `PROMPT_gateai_hub_v2_phase_3.md`
**Phase 3: Infinite Canvas + Live Analytics Blocks**
- **Scope:** Tiptap-powered workspace with embedded Recharts.
- **Deliverables:** `CanvasEditor`, Live Blocks (charts/tables), Auto-save with optimistic UI, Drop-to-Analyze functionality.
- **Role:** FRONTEND
- **Dependency:** Requires Phase 2 tagging.

### `PROMPT_gateai_hub_v2_phase_4.md`
**Phase 4: Scheduling Engine + Automation Hub**
- **Scope:** NLP-driven task creation, cron-like scheduling, automated reports.
- **Deliverables:** `TaskBuilder` (Gemini 1.5), `AutomationList`, Redis-backed scheduler, PDF/CSV generator with email delivery options.
- **Role:** AI/BACKEND
- **Dependency:** Requires Phase 3 canvas blocks for reporting limits.

### `PROMPT_gateai_hub_v2_phase_5.md`
**Phase 5: Polish, Motion & RTL Audit**
- **Scope:** Premium micro-interactions, accessibility, Arabic RTL verification.
- **Deliverables:** Framer Motion transitions, `prefers-reduced-motion` fallbacks, RTL layout audit.
- **Role:** UIUX/ANIMATOR
- **Dependency:** Requires all core logic implementations (Phases 1-4).

---

## 🛠️ Execution Strategy 
To begin work, run the `/dev gateai_hub_v2 1` command against `PROMPT_gateai_hub_v2_phase_1.md`. Do not proceed to phase N+1 until N successfully passes `pnpm preflight`.
