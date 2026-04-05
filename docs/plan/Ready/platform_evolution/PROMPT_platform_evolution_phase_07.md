# PROMPT: Phase 7 — AI Support, Ops Hub, Analytics & Resilience

**Mission**: Build an **AI-integrated Support & Technical Ops Hub** for the Customer Success and Dev teams. Features: Unified Help Desk, Internal Ops Dashboard, and Platform Resilience analytics (Performance/Security).

---

## 🏛️ Strategic Goals

1.  **Unified Help Desk**: AI-first first-response widget for Marketing/Client dashboards with human escalation.
2.  **Internal Task Co-Pilot**: AI assistance for the Dev team to summarize logs or suggest fixes.
3.  **Predictive Analytics Hub**: Recharts-based dashboard for conversions, lead funnels, and infrastructure performance.
4.  **Resilience Dials**: Strategic technical hardening (Rate limiting, caching, session TTL profiles).

---

## 🛠️ Step-by-Step Implementation

### Step 1: Support Hub & AI Chat (AI/FULLSTACK)

- Load `gf-api` and `gf-ai-ux-patterns`.
- Update `apps/admin-dashboard/src/app/api/support/route.ts`:
  - Use **Vercel AI SDK v6** with a "Resident/Admin Assistant" persona.
  - Implement a `handoffToHuman` tool that creates a task in Phase 3.
- Build the **Support Inbox** in Admin:
  - Lists active chats (Open/Closed), AI Triage status, and Assignee.

### Step 2: Predictive Performance Hub (DATA/FULLSTACK)

- Load `gf-ads-data-density` and `ui-ux-pro-max`.
- Build `OpsDashboard.tsx`:
  - Views: **Conversion Funnel** (Leads → Deals), **Infrastructure Health** (Response times), and **AI Usage Costs**.
  - Features: "Ask AI for Weekly Growth Summary" button.
- **MENA/RTL**: Localization of all data labels and chart legends to Arabic.

### Step 3: Platform Hardening UI (BACKEND/OPS)

- Load `gf-security` and `gf-nextjs-speed-core`.
- Build **Resilience Settings** in Admin (Phase 6 implementation):
  - Features: Rate Limiting slider per Org, Session TTL profiles, Cache revalidation toggles.
  - Style: Premium "Cockpit" feel with gauges and real-time status indicators.

---

## ✅ Acceptance Criteria (Definition of Done)

- [ ] **AI Utility**: AI successfully summarizes 5 support messages into a single "Issue Summary".
- [ ] **Data Integrity**: Charts correctly show conversion from a Lead (Phase 2) to a Deal.
- [ ] **Security**: Rate-limiting and TTL changes correctly apply to the organization in real-time.
- [ ] **Aesthetics**: Professional Ops dashboard with high-density Recharts visualizations.
- [ ] **RTL**: Arabic analytics legends and labels are correctly translated and aligned.
- [ ] **Pre-flight**: `pnpm turbo build` passes for the admin app.
- [ ] **Handover**: All 7 phases of `platform_evolution` are documented as "Done" in the PRD.
