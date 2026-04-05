# PROMPT: Phase 7 — Support Hub, Audit Trail, Ops Analytics & Platform Hardening

**Mission**: Build the final operational layer of the Admin Dashboard: a **unified Support inbox** with AI triage, a searchable **Audit Trail viewer** for all `AiActionLog` entries, a **predictive Analytics hub**, and **Platform Hardening controls** (rate limiting, caching, session management).

> **Depends on:** All previous phases (1-6). This phase ties together CRM, Tasks, CMS, and Branding into operational dashboards.

> **Note**: This phase is intentionally broader because it is the "polish and operationalize" phase. Each sub-section is a distinct module but shares the same Ops area of the Admin Dashboard sidebar.

---

## 🔑 RBAC for Ops Hub

| Role               | Support Inbox    | Audit Trail      | Analytics             | Hardening Settings |
| :----------------- | :--------------- | :--------------- | :-------------------- | :----------------- |
| `SUPER_ADMIN`      | Full             | Full             | Full                  | Full               |
| `DEV_ADMIN`        | Escalations only | Full             | Full                  | Full               |
| `SUPPORT_AGENT`    | Full (own queue) | Own actions      | Summary only          | None               |
| `SALES_MANAGER`    | None             | CRM actions only | Sales funnel only     | None               |
| `MARKETING_EDITOR` | None             | CMS actions only | Marketing funnel only | None               |

---

## 🏛️ Strategic Goals (4 Sub-Modules)

### Module A: Unified Support Hub

- AI-first self-service for client/resident inquiries.
- Human escalation to GateFlow Support team.
- Ticket lifecycle: `OPEN` → `AI_TRIAGED` → `ASSIGNED` → `RESOLVED` → `CLOSED`.

### Module B: Audit Trail Viewer

- Searchable, filterable UI for the `AiActionLog` table that has been accumulating data since Phase 1.
- Every AI action (CRM scoring, blog drafts, task bot triggers, branding changes) is visible here.
- Exportable as CSV/XLSX for PDPL/GDPR compliance requests.

### Module C: Predictive Analytics Hub

- Recharts-based dashboards: Lead funnel, deal pipeline value, blog traffic, landing page conversion rates.
- AI cost tracking: Vercel AI SDK usage per department per month.
- "AI Weekly Summary" generator.

### Module D: Platform Hardening Controls

- Rate limiting configuration per API route group.
- Cache revalidation controls (override ISR timing).
- Session TTL profiles (strict for security-sensitive orgs, relaxed for demos).

---

## 🛠️ Step-by-Step Implementation

### Step 1: Support Hub Schema & AI Triage (BACKEND + AI)

- Load `gateflow-database`, `gateflow-security`, `gf-ai-ux-patterns`.
- Update `prisma/schema.prisma`:

```prisma
enum TicketStatus {
  OPEN
  AI_TRIAGED
  ASSIGNED
  IN_PROGRESS
  RESOLVED
  CLOSED
}

enum TicketPriority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

model SupportTicket {
  id               String         @id @default(cuid())
  organizationId   String?        // null = general inquiry
  subject          String
  status           TicketStatus   @default(OPEN)
  priority         TicketPriority @default(MEDIUM)
  assigneeId       String?        // GateFlow support agent
  aiTriageSummary  String?        @db.Text  // AI-generated summary
  aiSuggestedAction String?       // AI recommendation
  source           String         // 'client_dashboard' | 'marketing_site' | 'email' | 'manual'
  messages         SupportMessage[]
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
  resolvedAt       DateTime?
  deletedAt        DateTime?
}

model SupportMessage {
  id           String        @id @default(cuid())
  ticketId     String
  ticket       SupportTicket @relation(fields: [ticketId], references: [id])
  senderId     String?       // null = AI
  senderType   String        // 'USER' | 'AGENT' | 'AI'
  content      String        @db.Text
  createdAt    DateTime      @default(now())
}
```

- Run `npx prisma migrate dev --name add_support_tickets`.
- Create `apps/admin-dashboard/src/app/api/support/triage/route.ts`:
  - Use **Vercel AI SDK v6** to analyze incoming ticket messages.
  - AI produces: `{ summary, suggestedPriority, suggestedAssignee, suggestedAction }`.
  - Status moves to `AI_TRIAGED`.
  - If AI confidence > 90%, suggest auto-resolution with HiTL confirmation.
  - Log to `AiActionLog` as `SUPPORT_AI_TRIAGED`.
- Create `apps/admin-dashboard/src/app/api/support/escalate/route.ts`:
  - Creates a Task (Phase 3) linked to the ticket.
  - Sends in-app notification (Phase 3 notification system) to the assigned agent.

### Step 2: Audit Trail Viewer (FRONTEND)

- Build `AuditTrailViewer.tsx`:
  - **Data source**: `AiActionLog` table (populated by Phases 1-6).
  - **Columns**: Timestamp, User, Action Type, Department, Status (PENDING/CONFIRMED/REJECTED), Reasoning excerpt.
  - **Filters**: Date range, action type dropdown, department, status, user.
  - **Search**: Full-text search on `reasoning` and `payload` fields.
  - **Detail Panel**: Click a row → side panel shows full `payload` JSON, reasoning text, linked entity (Lead, Task, BlogPost, etc.).
  - **Export**: "Export to CSV" and "Export to XLSX" buttons for compliance reporting.
  - **Access**: `SUPER_ADMIN` and `DEV_ADMIN` see everything. Other roles see only their own department's actions.
- **MENA/RTL**: Arabic column headers. Date format: `dd/MM/yyyy` (MENA standard). Timezone: configurable per org (default: Asia/Riyadh).

### Step 3: Predictive Analytics Hub (DATA/FRONTEND)

- Load `gf-ads-data-density` and `gf-data-viz-chat`.
- Build `OpsDashboard.tsx`:
  - **Panel 1 — Lead Funnel**: Recharts funnel chart: NEW → CONTACTED → QUALIFIED → NEGOTIATION → CLOSED_WON. Data from `Lead` table (Phase 2).
  - **Panel 2 — Deal Pipeline**: Recharts bar chart: total deal value by stage, with forecast line.
  - **Panel 3 — CMS Performance**: Blog post views (from analytics API), landing page conversion rates (LeadForm submissions ÷ page views).
  - **Panel 4 — AI Usage Costs**:
    - Track AI API calls via a lightweight interceptor in the Vercel AI SDK wrapper.
    - Store per-request: `{ model, inputTokens, outputTokens, estimatedCost, department, timestamp }` in a `AiUsageLog` table.
    - Chart: monthly cost by department, model breakdown.
  - **AI Weekly Summary**: "Generate Summary" button → AI reads last 7 days of analytics data → produces a natural language executive briefing.
- **MENA/RTL**: All chart labels and legends in Arabic. Charts use `direction: rtl` for RTL bar charts. Funnel labels mirror.

### Step 4: Platform Hardening Controls (BACKEND/OPS)

- Load `gf-security` and `gf-nextjs-speed-core`.
- Build `HardeningSettings.tsx` (accessible to `SUPER_ADMIN` / `DEV_ADMIN` only):
  - **Rate Limiting Panel**:
    - Configure limits per API route group: `/api/auth/**`, `/api/crm/**`, `/api/cms/**`, `/api/tasks/**`.
    - UI: slider (requests/minute) + burst allowance field.
    - Saved to `PlatformConfig` table (key-value with `scope: 'rate_limit'`).
    - Applied via Edge middleware using `@upstash/ratelimit` or equivalent.
  - **Cache Revalidation Panel**:
    - Override ISR revalidation intervals for blog and landing pages.
    - "Force Revalidate Now" button per route.
    - Display current cache age and next revalidation time.
  - **Session TTL Panel**:
    - Profiles: `Strict` (1 hour — for security-sensitive clients), `Standard` (24 hours), `Demo` (7 days).
    - Set default per org or globally.
    - Display active sessions count per org.
  - Style: Premium "Cockpit" feel with status indicator dots (green/yellow/red) and gauge-style sliders.

### Step 5: Add AiUsageLog tracking (BACKEND)

- Add to `prisma/schema.prisma`:

```prisma
model AiUsageLog {
  id             String   @id @default(cuid())
  model          String   // 'gpt-4o', 'groq-llama', etc.
  inputTokens    Int
  outputTokens   Int
  estimatedCost  Float    // USD
  department     String   // 'SALES', 'MARKETING', 'DEV', 'SUPPORT'
  action         String   // 'LEAD_SCORED', 'BLOG_DRAFTED', 'TASK_GENERATED', 'SUPPORT_TRIAGED'
  createdAt      DateTime @default(now())
}
```

- Run `npx prisma migrate dev --name add_ai_usage_log`.
- Wrap Vercel AI SDK calls in a `trackAiUsage()` utility that logs every request.

---

## ✅ Acceptance Criteria (Definition of Done)

**Module A (Support)**

- [ ] Support ticket lifecycle works: OPEN → AI_TRIAGED → ASSIGNED → RESOLVED → CLOSED.
- [ ] AI triage produces a summary and suggested priority for an incoming ticket.
- [ ] Escalation creates a linked Task in the Phase 3 task system and notifies the assignee.
- [ ] HiTL: AI auto-resolution suggestions require human "Confirm" before closing.

**Module B (Audit Trail)**

- [ ] All `AiActionLog` entries from Phases 1-6 are visible and searchable.
- [ ] Filters work: date range, action type, department, status.
- [ ] CSV export produces a valid file with all visible columns.
- [ ] Non-admin roles see only their department's actions.

**Module C (Analytics)**

- [ ] Lead funnel chart renders correctly with real CRM data.
- [ ] AI cost tracker shows monthly spend breakdown by department and model.
- [ ] "Generate Weekly Summary" button produces a coherent executive briefing.

**Module D (Hardening)**

- [ ] Rate limiting slider changes take effect within 60 seconds.
- [ ] "Force Revalidate Now" successfully clears ISR cache for a specific route.
- [ ] Session TTL profile change affects new sessions immediately.
- [ ] Only `SUPER_ADMIN` / `DEV_ADMIN` can access hardening controls.

**Cross-cutting**

- [ ] **ADS Compliance**: All Ops Hub UI uses ADS tokens only. No hardcoded hex.
- [ ] **RTL**: Arabic labels, chart legends, and audit trail columns render correctly.
- [ ] **Pre-flight**: `pnpm turbo build --filter=admin-dashboard` passes.
- [ ] **Handover**: All 7 phases documented as "Done" with phase logs.

### Files likely touched

- `packages/db/prisma/schema.prisma` (SupportTicket, SupportMessage, AiUsageLog)
- `apps/admin-dashboard/src/app/api/support/**`
- `apps/admin-dashboard/src/components/support/SupportInbox.tsx`
- `apps/admin-dashboard/src/components/ops/AuditTrailViewer.tsx`
- `apps/admin-dashboard/src/components/ops/OpsDashboard.tsx`
- `apps/admin-dashboard/src/components/ops/HardeningSettings.tsx`
- `apps/admin-dashboard/src/lib/ai-usage-tracker.ts`
- `apps/admin-dashboard/src/middleware.ts` (rate limiting integration)
