# PROMPT_admin_dashboard_evolution_phase_8.md

**Phase:** 8  
**Plan:** Admin Dashboard Evolution  
**Focus:** CRM, Support System, Analytics Dashboard & Team Roles  
**Type:** Fullstack

---

## Overview

Phase 8 implements the four remaining top-level sections: CRM (Contacts, Companies, Deals, AI Lead Scoring), Support System (Tickets, AI Triage), Analytics Dashboard (KPIs, Charts, AI Insights), and Team Roles (Built-in roles, Custom roles, Permissions). Each section builds on existing components and adds full functionality.

**Dependencies:** Phase 1 (Navigation structure) must be completed first.

---

## Objectives

### CRM Section

1. **Contacts Management** — Full CRUD, import/export, segmentation
2. **Companies Management** — Company profiles, deal associations
3. **Deals Pipeline** — Kanban board, deal stages, values
4. **AI Lead Scoring** — Automatic lead scoring with reasons
5. **AI Nurturing** — Auto-generate follow-up sequences

### Support System

1. **Ticket Management** — Full CRUD, threading, priorities
2. **AI Triage** — Auto-categorize and route tickets
3. **Escalation Flow** — Human escalation from AI
4. **Knowledge Base** — FAQ and help articles
5. **SLA Tracking** — Response time metrics

### Analytics Dashboard

1. **Live KPIs** — Real-time metric cards
2. **Charts** — Recharts with ADS styling (Line, Bar, Area, Funnel)
3. **Funnel Views** — Conversion funnel visualization
4. **AI Insights** — Automated insight generation
5. **Export** — CSV/PDF export options

### Team Roles

1. **Built-in Roles** — Super Admin, Admin, Manager, Member, Viewer
2. **Custom Roles** — Create custom roles with specific permissions
3. **Permission Matrix** — Granular permission controls
4. **AI Suggestions** — AI suggests role configurations
5. **User Role Assignment** — Assign roles to users

---

## Implementation Steps

### Part A: CRM Implementation

#### Step A1: Create Contacts Page

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/crm/contacts/page.tsx`

**Requirements:**

- Table view with columns: Name, Email, Company, Status, Score, Created
- Search and filter
- Import contacts (CSV)
- Export contacts (CSV)
- Quick actions: View, Edit, Delete

#### Step A2: Create Companies Page

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/crm/companies/page.tsx`

**Requirements:**

- Card grid view of companies
- Company detail view with associated contacts and deals
- Add/edit company form

#### Step A3: Create Deals Pipeline Page

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/crm/deals/page.tsx`

**Requirements:**

- Kanban board with stages: Lead → Qualified → Proposal → Negotiation → Closed Won/Lost
- Drag-and-drop deals between stages
- Deal value and probability
- Deal detail sidebar
- AI scoring overlay

```tsx
export function DealsPipeline() {
  const stages = [
    'LEAD',
    'QUALIFIED',
    'PROPOSAL',
    'NEGOTIATION',
    'CLOSED_WON',
    'CLOSED_LOST',
  ];

  return (
    <div className="flex gap-4 overflow-x-auto">
      {stages.map((stage) => (
        <div key={stage} className="w-80 shrink-0">
          <StageColumn stage={stage} />
        </div>
      ))}
    </div>
  );
}
```

#### Step A4: Create AI Lead Scoring API

**File:** `apps/admin-dashboard/src/app/api/crm/score-lead/route.ts`

**Requirements:**

- Accept lead/contact ID
- Analyze data points
- Return score (0-100) with reasoning
- Log scoring action

#### Step A5: Create AI Nurturing API

**File:** `apps/admin-dashboard/src/app/api/crm/generate-follow-up/route.ts`

**Requirements:**

- Accept lead ID
- Generate personalized follow-up email/content
- Return draft for review

---

### Part B: Support System Implementation

#### Step B1: Create Tickets List Page

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/support/tickets/page.tsx`

**Requirements:**

- Table view with columns: ID, Subject, Requester, Priority, Status, Assigned, Created
- Filter by status, priority, assigned agent
- Search by subject or ID
- Quick actions: View, Edit, Assign

#### Step B2: Create Ticket Detail Page

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/support/tickets/[ticketId]/page.tsx`

**Requirements:**

- Thread view of messages
- Reply composer
- Internal notes (not visible to requester)
- Priority and status controls
- Assignment controls
- AI triage panel

```tsx
export function TicketDetailPage({ params }: { params: { ticketId: string } }) {
  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <TicketThread ticketId={params.ticketId} />
        <ReplyComposer ticketId={params.ticketId} />
      </div>
      <div className="w-80">
        <TicketSidebar ticketId={params.ticketId} />
        <AITriagePanel ticketId={params.ticketId} />
      </div>
    </div>
  );
}
```

#### Step B3: Create AI Triage API

**File:** `apps/admin-dashboard/src/app/api/support/triage/route.ts`

**Requirements:**

- Analyze ticket content
- Suggest category, priority, and assignee
- Return triage recommendation

#### Step B4: Create Knowledge Base Page

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/support/knowledge-base/page.tsx`

**Requirements:**

- Article list with search
- Article editor
- Category management
- AI-generated article suggestions

---

### Part C: Analytics Dashboard Implementation

#### Step C1: Create Analytics Dashboard Page

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/analytics/dashboard/page.tsx`

**Requirements:**

- KPI cards row: Total Scans, Active Users, Revenue, Conversion Rate
- Time range selector: Today, 7 Days, 30 Days, 90 Days, Custom
- Charts grid
- AI Insights panel

```tsx
export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black uppercase">Analytics Dashboard</h1>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <KPICards timeRange={timeRange} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScanTrendChart timeRange={timeRange} />
        <ConversionFunnelChart timeRange={timeRange} />
        <SourceDistributionChart timeRange={timeRange} />
        <TopGatesChart timeRange={timeRange} />
      </div>

      <AIInsightsPanel timeRange={timeRange} />
    </div>
  );
}
```

#### Step C2: Create Recharts Components

**File:** `apps/admin-dashboard/src/components/analytics/charts.tsx`

**Requirements:**

- ScanTrendChart (Area chart)
- ConversionFunnelChart (Funnel visualization)
- SourceDistributionChart (Pie/Donut)
- TopGatesChart (Horizontal bar)
- All use ADS tokens for styling

```tsx
// Example: ADS-styled AreaChart
<AreaChart
  data={data}
  style={{
    backgroundColor: token('ds.background.default'),
    axisColor: token('ds.border'),
    textColor: token('ds.text.subtler'),
  }}
>
  <defs>
    <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
      <stop
        offset="5%"
        stopColor={token('ds.background.brand.bold')}
        stopOpacity={0.3}
      />
      <stop
        offset="95%"
        stopColor={token('ds.background.brand.bold')}
        stopOpacity={0}
      />
    </linearGradient>
  </defs>
  <XAxis tick={{ fill: token('ds.text.subtler'), fontSize: 10 }} />
  <YAxis tick={{ fill: token('ds.text.subtler'), fontSize: 10 }} />
  <Tooltip contentStyle={{ backgroundColor: token('ds.background.neutral') }} />
  <Area
    type="monotone"
    stroke={token('ds.background.brand.bold')}
    fill="url(#colorPrimary)"
  />
</AreaChart>
```

#### Step C3: Create AI Insights API

**File:** `apps/admin-dashboard/src/app/api/analytics/insights/route.ts`

**Requirements:**

- Analyze metrics data
- Generate 3-5 automated insights
- Include actionable recommendations
- Return insights with severity

---

### Part D: Team Roles Implementation

#### Step D1: Create Roles List Page

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/team-roles/page.tsx`

**Requirements:**

- List of all roles (built-in and custom)
- Built-in roles: Super Admin, Admin, Manager, Member, Viewer
- Create custom role button
- Edit/Delete custom roles
- Permission matrix view

#### Step D2: Create Role Editor

**File:** `apps/admin-dashboard/src/app/[locale]/(dashboard)/team-roles/[roleId]/page.tsx`

**Requirements:**

- Role name and description
- Permission toggles grouped by module:
  - Organizations: view, create, edit, delete
  - Users: view, create, edit, delete
  - Projects: view, create, edit, delete
  - Gates: view, create, edit, delete
  - CMS: view, create, edit, delete, publish
  - CRM: view, create, edit, delete, export
  - Support: view, create, edit, delete, escalate
  - Analytics: view, export
  - Team: view, manage_roles

```tsx
// Permission structure
const permissionGroups = {
  organizations: ['view', 'create', 'edit', 'delete'],
  users: ['view', 'create', 'edit', 'delete'],
  projects: ['view', 'create', 'edit', 'delete'],
  gates: ['view', 'create', 'edit', 'delete'],
  cms: ['view', 'create', 'edit', 'delete', 'publish'],
  crm: ['view', 'create', 'edit', 'delete', 'export'],
  support: ['view', 'create', 'edit', 'delete', 'escalate'],
  analytics: ['view', 'export'],
  team: ['view', 'manage_roles'],
};
```

#### Step D3: Create Role Assignment UI

**File:** `apps/admin-dashboard/src/components/team/role-assignment.tsx`

**Requirements:**

- Select user dropdown
- Current role display
- Role change confirmation
- Audit log of role changes

#### Step D4: Create AI Role Suggestions API

**File:** `apps/admin-dashboard/src/app/api/team/roles/suggest/route.ts`

**Requirements:**

- Analyze user activity
- Suggest appropriate role
- Return recommendation with reasoning

---

## API Requirements

### CRM

**Endpoints:**

- `GET /api/crm/contacts` — List contacts
- `POST /api/crm/contacts` — Create contact
- `PATCH /api/crm/contacts/[id]` — Update contact
- `DELETE /api/crm/contacts/[id]` — Delete contact
- `GET /api/crm/companies` — List companies
- `GET /api/crm/deals` — List deals
- `POST /api/crm/deals` — Create deal
- `PATCH /api/crm/deals/[id]` — Update deal
- `POST /api/crm/score-lead` — AI score lead

### Support

**Endpoints:**

- `GET /api/support/tickets` — List tickets
- `POST /api/support/tickets` — Create ticket
- `GET /api/support/tickets/[id]` — Get ticket detail
- `POST /api/support/tickets/[id]/reply` — Reply to ticket
- `POST /api/support/triage` — AI triage ticket

### Analytics

**Endpoints:**

- `GET /api/analytics/kpis` — Get KPI data
- `GET /api/analytics/charts/[chartType]` — Get chart data
- `POST /api/analytics/insights` — Get AI insights

### Team Roles

**Endpoints:**

- `GET /api/team/roles` — List roles
- `POST /api/team/roles` — Create role
- `PATCH /api/team/roles/[id]` — Update role
- `DELETE /api/team/roles/[id]` — Delete role
- `GET /api/team/users/[userId]/role` — Get user role
- `PATCH /api/team/users/[userId]/role` — Assign role

---

## Design System Enforcement (ADS)

All analytics charts use ADS tokens:

```tsx
// ✅ CORRECT
<AreaChart
  style={{
    backgroundColor: token('ds.background.default'),
  }}
>
  <XAxis
    tick={{
      fill: token('ds.text.subtler'),
      fontSize: 10,
      fontWeight: token('ds.font-weight.bold'),
    }}
  />
</AreaChart>

// ❌ WRONG
<AreaChart style={{ backgroundColor: '#fff' }}>
```

---

## Multi-Language (EN + AR RTL)

All sections support both languages:

- CRM labels translated
- Support ticket UI RTL-aware
- Analytics charts support RTL data labels
- Team role names translated

---

## Acceptance Criteria

### CRM

- [ ] Contacts CRUD works
- [ ] Companies CRUD works
- [ ] Deals pipeline works with drag-drop
- [ ] AI lead scoring returns scores
- [ ] AI nurturing generates drafts

### Support

- [ ] Tickets CRUD works
- [ ] Thread view shows messages
- [ ] AI triage returns suggestions
- [ ] Knowledge base articles work

### Analytics

- [ ] KPI cards show live data
- [ ] Charts render with ADS styling
- [ ] Time range filters work
- [ ] AI insights generate

### Team Roles

- [ ] Built-in roles display
- [ ] Custom roles CRUD works
- [ ] Permission matrix works
- [ ] Role assignment works

### Preflight

- [ ] `pnpm preflight` passes
- [ ] No TypeScript errors
- [ ] No lint errors

---

## File Inventory

### New Files to Create

- `apps/admin-dashboard/src/app/[locale]/(dashboard)/crm/contacts/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/crm/companies/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/crm/deals/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/support/tickets/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/support/tickets/[ticketId]/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/support/knowledge-base/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/analytics/dashboard/page.tsx`
- `apps/admin-dashboard/src/components/analytics/charts.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/team-roles/page.tsx`
- `apps/admin-dashboard/src/app/[locale]/(dashboard)/team-roles/[roleId]/page.tsx`
- `apps/admin-dashboard/src/components/team/role-assignment.tsx`
- `apps/admin-dashboard/src/app/api/crm/contacts/route.ts`
- `apps/admin-dashboard/src/app/api/crm/companies/route.ts`
- `apps/admin-dashboard/src/app/api/crm/deals/route.ts`
- `apps/admin-dashboard/src/app/api/crm/score-lead/route.ts`
- `apps/admin-dashboard/src/app/api/support/tickets/route.ts`
- `apps/admin-dashboard/src/app/api/support/triage/route.ts`
- `apps/admin-dashboard/src/app/api/analytics/kpis/route.ts`
- `apps/admin-dashboard/src/app/api/analytics/charts/[chartType]/route.ts`
- `apps/admin-dashboard/src/app/api/analytics/insights/route.ts`
- `apps/admin-dashboard/src/app/api/team/roles/route.ts`
- `apps/admin-dashboard/src/app/api/team/users/[userId]/role/route.ts`

### Files to Leverage

- `apps/admin-dashboard/src/components/crm/crm-dashboard.tsx` → Already exists, enhance
- `apps/admin-dashboard/src/components/analytics/` → Existing charts

---

## Estimated Effort

**Complexity:** Very High  
**Files:** ~25  
**Key Challenge:** Implementing all four sections with full CRUD, AI features, and proper ADS styling

---

## Next Phase

**Phase 9: AI Polish, Review Workflows, Multi-Language & Final Testing**

This final phase focuses on polishing AI features, implementing comprehensive review workflows, completing multi-language support, and running final QA testing.
