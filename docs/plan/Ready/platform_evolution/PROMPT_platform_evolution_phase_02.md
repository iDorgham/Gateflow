# PROMPT: Phase 2 — Enhanced CRM System with AI Lead Scoring & Intelligence

**Mission**: Integrate an intelligent, AI-powered CRM into the Admin Dashboard for the Sales team. Features: Predictive Lead Scoring, Automated Nurturing (HiTL), and AI Deal Forecasting using **Vercel AI SDK v6**.

---

## 🏛️ Strategic Goals

1.  **AI Lead Scoring**: Automatically rank inbound leads based on company size, region (MENA), and historical conversion patterns.
2.  **Predictive Intelligence**: Suggest the "Next Best Action" for the sales team (e.g., "Schedule demo with Gate A manager").
3.  **Automated Nurturing (HiTL)**: Draft AI emails or follow-ups for GateFlow Sales—MUST require human confirmation before sending.
4.  **CRM Dashboard (EN/AR)**: Dedicated CRM tab in Admin for Sales operators.

---

## 🛠️ Step-by-Step Implementation

### Step 1: Database CRM Extension (BACKEND)

- Update `prisma/schema.prisma`:
  - Create `Lead` and `Deal` tables with `source`, `status`, `score`, and `notes`.
  - Link `Lead` and `Deal` to `Organization` (multi-tenancy).
  - Add `AiActionLog` entries for CRM-specific tasks (`CRM_LEAD_SCORED`, `CRM_DRAFT_GEN`).
- Run `npx prisma migrate dev`.

### Step 2: AI Lead Scoring Workflow (AI/FULLSTACK)

- Load `gf-api` and `gf-ai-ux-patterns`.
- Create `apps/admin-dashboard/src/app/api/crm/score-lead/route.ts`:
  - Use **Vercel AI SDK v6** with Groq/OpenAI to analyze lead metadata.
  - Implement a `scoreLead` tool that updates the DB and logs the AI reasoning.
- **Security**: Audit Log every scoring action with a "Reasoning Trace" stored in the DB.

### Step 3: Sales Command Dashboard (FRONTEND)

- Load `gf-ads-data-density` and `ui-ux-pro-max`.
- Build `CrmDashboard.tsx`:
  - Views: Kanban Lead board, AI Insights panel, Deal Forecast chart (Recharts).
  - Features: "Ask AI for Lead Summary" button with a typing effect.
  - **HiTL (Human in the Loop)**: AI-generated emails must appear in a draft editor for human review and edit before sending.
- **MENA/RTL**: All labels (Leads, Deals, Status) translated to Arabic (RTL). Mirror charts and timelines.

---

## ✅ Acceptance Criteria (Definition of Done)

- [ ] **AI Utility**: AI successfully scores a dummy lead and provides clear reasoning.
- [ ] **HiTL Integrity**: No emails or status changes are sent externally without "Confirm" button click.
- [ ] **Security**: Every CRM action is logged in `AiActionLog`.
- [ ] **Aesthetics**: Premium 2026 SaaS look for the CRM board using ADS tokens only.
- [ ] **RTL**: Arabic CRM interface is native and correctly aligned.
- [ ] **Pre-flight**: `pnpm turbo build` passes for the admin app.
