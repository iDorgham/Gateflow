# PLAN_gateai: GateFlow — Intelligent Operations Agent (GateAI)

GateAI is a secure, organization-scoped natural-language agent designed to reduce manual operational time for property managers and residents. This plan outlines the phased implementation from read-only intelligence to complex, secure mutations.

## Core Mandates
- **Scoping:** Every query must include `organizationId` and `deletedAt: null`.
- **Security:** Use `@gate-access/db` for all interactions. Mutations require explicit confirmation.
- **Audit:** Every interaction is logged in `AiActionLog`.
- **Performance:** Use Gemini 1.5 Flash for speed and cost.

---

## Phases

### Phase 0: Ready & /ai Page Scaffold
- **Primary role:** FRONTEND
- **Preferred tool:** Cursor
- **Scope:** Create the `/ai` page skeleton, navigation links, and bilingual (AR/EN) layout.
- **Deliverables:** `/app/[locale]/dashboard/ai/page.tsx`, updated sidebar navigation.
- **Acceptance Criteria:** Page renders at `/ai`, layout matches dashboard, Sidebar link active.
- **Effort:** 2 days

### Phase 1: Basic Read-Only Chat + Gemini 1.5 Flash Hello World
- **Primary role:** BACKEND-API
- **Preferred tool:** Cursor
- **Scope:** API route for chat, `useChat` integration, basic streaming responses.
- **Deliverables:** `/api/ai/chat/route.ts`, Chat component in `/dashboard/ai`.
- **Acceptance Criteria:** API returns "Hello" from Gemini, UI streams the response.
- **Effort:** 3 days

### Phase 2: Scoped Context Injection + Simple Real Q&A
- **Primary role:** BACKEND-API
- **Preferred tool:** Cursor
- **Scope:** Inject organization and project context into prompts. Real factual answers about its own data.
- **Deliverables:** Prompt engineering logic, context gathering helpers.
- **Acceptance Criteria:** AI can answer "How many gates are in this project?" accurately.
- **Effort:** 4 days

### Phase 3: Inline Recharts Visuals from Analytics
- **Primary role:** FRONTEND
- **Preferred tool:** Cursor
- **Scope:** Render Recharts components within chat based on AI-suggested data.
- **Deliverables:** Dynamic chart renderer in chat.
- **Acceptance Criteria:** AI says "Here is a chart of scans" and a real chart appears.
- **Effort:** 5 days

### Phase 4: One-Shot Report Generation (PDF/CSV download)
- **Primary role:** BACKEND-API
- **Preferred tool:** Cursor
- **Scope:** Logic to generate PDF/CSV reports via natural language.
- **Deliverables:** Report generation service.
- **Acceptance Criteria:** User says "Export last week's scans to PDF" and receives a download link.
- **Effort:** 5 days

### Phase 5: Scheduling Engine Skeleton + AiTask Model
- **Primary role:** BACKEND-Database
- **Preferred tool:** Gemini CLI
- **Scope:** Prisma schema update for `AiTask` and recurring report scheduling logic.
- **Deliverables:** New Prisma models, background job runner (Upstash/Cron).
- **Acceptance Criteria:** Database migration success, task can be created via DB.
- **Effort:** 4 days

### Phase 6: Mutation Safety Layer + Confirmation UX Pattern
- **Primary role:** SECURITY
- **Preferred tool:** Multi-CLI (Claude + Cursor)
- **Scope:** "Confirm & Execute" pattern for mutations.
- **Deliverables:** Confirmation dialog, mutation middleware.
- **Acceptance Criteria:** No mutation tool executes without `confirmed: true` from UI.
- **Effort:** 6 days

### Phase 7: Bulk QR Creation Agent – MVP
- **Primary role:** BACKEND-API
- **Preferred tool:** Cursor
- **Scope:** Natural language to bulk QR creation.
- **Deliverables:** QR creation function calling.
- **Acceptance Criteria:** "Create 10 QRs for guests" shows a preview table, then executes on confirm.
- **Effort:** 7 days

### Phase 8: Feedback, Usage Tracking, Rate Limiting & Polish
- **Primary role:** ARCHITECTURE
- **Preferred tool:** Cursor
- **Scope:** `AiActionLog`, cost tracking, rate limiting, and feedback UI.
- **Deliverables:** Logging model, rate limit middleware, feedback components.
- **Acceptance Criteria:** Every prompt is logged, rate limit works, cost is calculated.
- **Effort:** 5 days

### Phase 9: Resident Portal / Mobile Mini-Version
- **Primary role:** MOBILE
- **Preferred tool:** Cursor
- **Scope:** Simplified GateAI chat on Resident Portal/Mobile for guest passes.
- **Deliverables:** `/ai` route in resident apps.
- **Acceptance Criteria:** Residents can ask for guest QRs on mobile.
- **Effort:** 6 days

### Phase 10: Hardening, Red-Teaming & Monitoring
- **Primary role:** SECURITY
- **Preferred tool:** Multi-CLI
- **Scope:** Full security review, audit trail verification, final hardening.
- **Deliverables:** Security audit report, hardened configs.
- **Acceptance Criteria:** No unauthorized access during red-team test.
- **Effort:** 5 days

---

## Acceptance Criteria (Global)
- [ ] `pnpm preflight` passes on all affected workspaces.
- [ ] Multi-tenancy enforced 100% via `organizationId`.
- [ ] No hard deletes.
- [ ] Bilingual support (Arabic/English) for all UI.
