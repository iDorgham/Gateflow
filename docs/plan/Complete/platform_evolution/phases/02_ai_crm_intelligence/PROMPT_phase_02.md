# PROMPT: Phase 2 — Enhanced CRM System with AI Lead Scoring & Intelligence

**Mission**: Integrate an intelligent, AI-powered CRM into the Admin Dashboard for the Sales team. Features: Predictive Lead Scoring, Automated Nurturing (HiTL), and AI Deal Forecasting using **Vercel AI SDK v6**.

> **Depends on:** `platform_evolution` Phase 1 complete (AiActionLog table exists). `org_types_dashboard` Phase 1 complete (OrganizationType available for lead segmentation by org type).

---

## 🏛️ Strategic Goals

1. **AI Lead Scoring**: Automatically rank inbound leads based on company size, region (MENA), and historical conversion patterns.
2. **Predictive Intelligence**: Suggest the "Next Best Action" for the sales team (e.g., "Schedule demo with Gate A manager").
3. **Automated Nurturing (HiTL)**: Draft AI emails or follow-ups for GateFlow Sales — MUST require human confirmation before sending.
4. **CRM Dashboard (EN/AR)**: Dedicated CRM tab in Admin for Sales operators only (RBAC-gated).

---

## 🔐 Data Privacy & Security (MANDATORY — implement before any PII storage)

> [!CAUTION]
> Lead data contains personally identifiable information (PII). GDPR, Saudi PDPL, and UAE PDPPL compliance is mandatory for MENA market.

**Required before storing any lead data:**

- **Field-level encryption**: `email` and `phone` fields on `Lead` model must be encrypted at rest using a server-side key (e.g., `AES-256-GCM`).
- **PII audit trail**: Any access to decrypted PII must be logged in `AiActionLog` with the accessing user's ID.
- **Data retention policy**: Implement a `purgeAfterDays` field on `Lead`. Soft-deletes (`deletedAt`) are mandatory.
- **Consent flag**: `Lead.consentGiven (Boolean)` must be recorded; do not send AI-generated follow-ups if `consentGiven = false`.
- **No PII in AI prompts**: Strip/hash PII before sending to LLM APIs; use lead metadata (company size tier, region code, org type) for scoring, not raw email/name.

---

## 🔑 RBAC Roles for CRM (define in Phase 1c or at start of this phase)

| Role               | CRM Access                                      |
| :----------------- | :---------------------------------------------- |
| `SUPER_ADMIN`      | Full access: read, write, score, delete         |
| `SALES_REP`        | View leads, add notes, trigger AI scoring       |
| `SALES_MANAGER`    | All `SALES_REP` + edit deals, confirm AI drafts |
| `MARKETING_EDITOR` | View CRM summary widget only (no PII)           |
| `SUPPORT_AGENT`    | No CRM access                                   |
| `DEV_ADMIN`        | Audit logs only                                 |

Enforce via middleware: any `/api/crm/**` route must check role before processing.

---

## 🛠️ Step-by-Step Implementation

### Step 1: Database CRM Extension (BACKEND)

- Load `gateflow-database` and `gateflow-security` skills.
- Update `prisma/schema.prisma`:
  - Create `Lead` table: `id`, `organizationId`, `status` (enum: `NEW` | `CONTACTED` | `QUALIFIED` | `NEGOTIATION` | `CLOSED_WON` | `CLOSED_LOST`), `score (Int?)`, `source`, `notes`, `consentGiven (Boolean @default(false))`, `purgeAfterDays (Int @default(365))`, `encryptedEmail`, `encryptedPhone`, `deletedAt`, `createdAt`, `updatedAt`.
  - Create `Deal` table: `id`, `organizationId`, `leadId`, `value (Decimal)`, `stage`, `forecastCloseDate`, `createdAt`, `updatedAt`.
  - Link both to `Organization` (multi-tenancy). Ensure `deletedAt: null` on all reads.
- Run `npx prisma migrate dev --name add_crm_lead_deal`.
- Implement field-level encryption utility in `packages/utils/src/crypto.ts`.

### Step 2: AI Lead Scoring Workflow (AI/FULLSTACK)

- Load `gf-api` and `gf-ai-ux-patterns`.
- Create `apps/admin-dashboard/src/app/api/crm/score-lead/route.ts`:
  - Use **Vercel AI SDK v6** with Groq/OpenAI.
  - Strip PII before sending to LLM: pass only `{ orgType, region, companySize, source }`.
  - Implement `scoreLead` tool that returns `{ score: 0-100, reasoning: string, nextBestAction: string }`.
  - On completion: update `Lead.score` in DB, write to `AiActionLog` with `action: 'CRM_LEAD_SCORED'`, `status: 'CONFIRMED'`.
- Create `apps/admin-dashboard/src/app/api/crm/generate-draft/route.ts`:
  - Generate a follow-up email draft. Status must be `PENDING_CONFIRMATION` until human approves.
  - **Never call any email-sending API from this route.** Only returns draft text.

### Step 3: Sales Command Dashboard (FRONTEND)

- Load `gf-ads-data-density` and `ui-ux-pro-max`.
- Build `CrmDashboard.tsx` (accessible only to `SALES_REP` | `SALES_MANAGER` | `SUPER_ADMIN`):
  - **Views**: Kanban Lead board (by status), AI Insights panel, Deal Forecast chart (Recharts).
  - **AI Features**: "Score This Lead" button with streaming reasoning display. "Draft Follow-up" with diff-editor for human review.
  - **HiTL Panel**: AI email drafts show with `[Edit → Approve → Send]` three-step flow. Confirm button changes `AiActionLog.status` to `CONFIRMED`. Only then does the email dispatch API fire.
  - **Deal Forecast**: Recharts area chart showing pipeline value over time.
- **MENA/RTL**: All labels (Lead, Deal, Pipeline, Score) translated to Arabic. Mirror charts and timeline direction.

---

## ✅ Acceptance Criteria (Definition of Done)

- [ ] **PII Compliance**: `email` and `phone` encrypted at rest; no PII sent to LLM APIs in prompts.
- [ ] **RBAC**: `/api/crm/**` routes reject non-Sales roles with 403.
- [ ] **AI Utility**: AI successfully scores a dummy lead and provides clear `reasoning` + `nextBestAction`.
- [ ] **HiTL Integrity**: No emails sent externally without `CONFIRMED` status in `AiActionLog`.
- [ ] **Audit Trail**: Every CRM AI action logged in `AiActionLog` with user ID and timestamp.
- [ ] **Soft Deletes**: All lead/deal reads include `deletedAt: null` filter.
- [ ] **Aesthetics**: Premium 2026 SaaS CRM board using ADS tokens only.
- [ ] **RTL**: Arabic CRM interface is native and correctly aligned.
- [ ] **Pre-flight**: `pnpm turbo build --filter=admin-dashboard` passes.

### Files likely touched

- `packages/db/prisma/schema.prisma`
- `packages/utils/src/crypto.ts` (new — field-level encryption)
- `apps/admin-dashboard/src/app/api/crm/score-lead/route.ts`
- `apps/admin-dashboard/src/app/api/crm/generate-draft/route.ts`
- `apps/admin-dashboard/src/components/crm/CrmDashboard.tsx`
- `apps/admin-dashboard/src/middleware.ts` (RBAC role checks)
