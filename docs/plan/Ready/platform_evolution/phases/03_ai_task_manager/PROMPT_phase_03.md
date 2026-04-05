# PROMPT: Phase 3 — AI Task Manager & Rule-Based Automation Bots

**Mission**: Build a central, RBAC-gated **Task Hub** in the Admin Dashboard for all GateFlow internal departments (Sales, Marketing, Dev, Support). Features: department-scoped boards, AI task generation, rule-based automation bots with HiTL safeguards, and CRM/CMS cross-linking.

> **Depends on:** Platform Evolution Phase 1 (org routing, AiActionLog). Phase 2 (CRM — for cross-linking Leads/Deals to Tasks).

---

## 🔑 Departmental RBAC for Task Manager

| Role               | Own Tasks | Department Board     | All Boards | Bot Management           | Admin Settings |
| :----------------- | :-------- | :------------------- | :--------- | :----------------------- | :------------- |
| `SUPER_ADMIN`      | Full      | Full                 | Full       | Full                     | Full           |
| `SALES_REP`        | CRUD own  | View Sales board     | None       | None                     | None           |
| `SALES_MANAGER`    | CRUD own  | CRUD Sales board     | View-only  | Configure Sales bots     | None           |
| `MARKETING_EDITOR` | CRUD own  | CRUD Marketing board | View-only  | Configure Marketing bots | None           |
| `DEV_ADMIN`        | CRUD own  | CRUD Dev board       | View-only  | Configure Dev bots       | None           |
| `SUPPORT_AGENT`    | CRUD own  | CRUD Support board   | View-only  | None                     | None           |

Enforce via middleware: `/api/tasks/**` routes verify department membership before returning board data.

---

## 🏛️ Strategic Goals

1. **Department-Scoped Boards**: Each GateFlow department (Sales, Marketing, Dev, Support) has its own Kanban + Calendar board. Cross-department visibility is read-only.
2. **Rule-Based AI Bots (HiTL)**: Automation bots that trigger task creation from events (e.g., "Lead reaches score > 80" → create Sales follow-up task). All bot actions require HiTL confirmation or auto-execute only after admin enables "auto-run" per rule.
3. **CRM/CMS Cross-Linking**: Tasks can reference `Lead`, `Deal`, `BlogPost`, or `LandingPage` via polymorphic relations. Opening a task shows the linked entity in a side panel.
4. **AI Task Generation**: Natural language → structured task list (via Vercel AI SDK v6). "Plan the compound launch" → 8 tasks with assignees, dates, and priorities.
5. **MENA Calendar**: Arabic calendar views use Friday-Saturday weekend standard. MENA public holidays (Saudi, UAE, Egypt) are annotatable.

---

## 🛠️ Step-by-Step Implementation

### Step 1: Task Schema & Bot Rule Engine (BACKEND)

- Load `gateflow-database` and `gateflow-security`.
- Update `prisma/schema.prisma`:

```prisma
enum Department {
  SALES
  MARKETING
  DEV
  SUPPORT
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  IN_REVIEW
  DONE
  BLOCKED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

model TaskBoard {
  id           String     @id @default(cuid())
  name         String
  department   Department
  tasks        Task[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}

model Task {
  id           String       @id @default(cuid())
  title        String
  description  String?      @db.Text
  status       TaskStatus   @default(TODO)
  priority     TaskPriority @default(MEDIUM)
  department   Department
  boardId      String
  board        TaskBoard    @relation(fields: [boardId], references: [id])
  assigneeId   String?
  dueDate      DateTime?
  // Polymorphic linking to CRM/CMS entities
  linkedType   String?      // 'LEAD' | 'DEAL' | 'BLOG_POST' | 'LANDING_PAGE'
  linkedId     String?
  createdById  String
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  deletedAt    DateTime?
}

model TaskBotRule {
  id            String     @id @default(cuid())
  name          String
  department    Department
  enabled       Boolean    @default(false)
  autoExecute   Boolean    @default(false)  // false = HiTL required
  triggerEvent  String     // e.g. 'LEAD_SCORE_ABOVE_80', 'DEAL_STAGE_CHANGED', 'BLOG_PUBLISHED'
  conditions    Json       // { field: 'score', operator: 'gt', value: 80 }
  actionTemplate Json      // { title: 'Follow up with {{lead.company}}', department: 'SALES', priority: 'HIGH' }
  createdById   String
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}
```

- Run `npx prisma migrate dev --name add_task_hub_and_bots`.

### Step 2: AI Task Generation & Bot Reactor (AI/FULLSTACK)

- Load `gf-api` and `gf-ai-ux-patterns`.
- Create `apps/admin-dashboard/src/app/api/tasks/generate/route.ts`:
  - Use **Vercel AI SDK v6** to parse natural language → structured task array.
  - Input: `"Plan the Al Rimal compound launch"` → Output: `[{ title, description, department, priority, dueDate, assignee suggestion }]`
  - All generated tasks are created with `status: TODO` and logged in `AiActionLog` as `TASK_AI_GENERATED`.
- Create `apps/admin-dashboard/src/lib/task-bot-reactor.ts`:
  - Event-driven hook system. When CRM/CMS events fire (Lead score update, Deal stage change, Blog publish):
    1. Query `TaskBotRule` for matching `triggerEvent` + `conditions`.
    2. If `autoExecute = false`: create task with `status: TODO` and `AiActionLog` status `PENDING_CONFIRMATION`. The assignee sees a "Bot created this — Approve?" banner.
    3. If `autoExecute = true`: create task directly. Still log to `AiActionLog` with `CONFIRMED` status.
  - **Rate limit**: Max 10 bot-created tasks per rule per hour. If exceeded, disable rule and notify admin.

### Step 3: Multi-View Task Dashboard (FRONTEND)

- Load `gf-ads-data-density` and `ui-ux-pro-max`.
- Build `TaskHub.tsx` (accessible per RBAC table above):
  - **Board Selector**: Tabs for each department the user has access to. `SUPER_ADMIN` sees all.
  - **Kanban View**: Drag-and-drop columns (TODO → IN_PROGRESS → IN_REVIEW → DONE). Cards show priority badge, assignee avatar, due date, linked entity chip.
  - **Calendar View**: Week/month calendar with task cards. **MENA mode**: Friday-Saturday weekend highlighted. Option to annotate Saudi/UAE/Egypt public holidays.
  - **List View**: Sortable/filterable table. Bulk actions (assign, change priority, delete).
  - **AI Task Drafter**: Input field at top — "Describe what you need done" → AI generates task list → user reviews/edits/confirms.
  - **Linked Entity Panel**: Clicking a task with `linkedType: 'LEAD'` opens a side panel showing the Lead's details from CRM.
- Build `BotManager.tsx` (accessible to `*_MANAGER` / `SUPER_ADMIN` / `DEV_ADMIN`):
  - List of all bot rules per department.
  - Create/edit modal: trigger event dropdown, condition builder (field/operator/value), action template with `{{variable}}` placeholders, `autoExecute` toggle.
  - Activity log: last 50 bot-created tasks with timestamps and approval status.
  - **HiTL**: If `autoExecute` is toggled on, show a warning: "Tasks will be created without human review. Are you sure?"
- **MENA/RTL**: All task statuses translated (مهام، قيد التنفيذ، مراجعة، مكتمل). Calendar direction reversed. Due date picker supports Hijri calendar option.

### Step 4: Notification System (FULLSTACK)

- Create `apps/admin-dashboard/src/lib/notifications.ts`:
  - In-app notification bell in admin header.
  - Events that trigger notifications:
    - Task assigned to you
    - Bot created a task requiring your approval
    - Task due date within 24 hours
    - Task status changed on a task you created
  - Store in `Notification` table (simple: `userId`, `type`, `message`, `read`, `linkedTaskId`).
  - Future: email/Slack webhook (out of scope for this phase, but schema supports it).

---

## ✅ Acceptance Criteria (Definition of Done)

- [ ] **RBAC**: Sales rep can only see Sales board. Dev admin cannot edit Marketing tasks. `SUPER_ADMIN` sees all.
- [ ] **AI Utility**: AI generates a structured 5+ task list from "Plan the compound launch" in < 10 seconds.
- [ ] **Kanban**: Drag-and-drop updates `Task.status` in DB and reflects instantly.
- [ ] **Bot Engine**: A rule "Lead score > 80 → create Sales follow-up" correctly fires when CRM updates a lead's score.
- [ ] **HiTL**: Bot-created tasks with `autoExecute: false` show "Pending Approval" banner. Task is not assigned until human clicks "Approve".
- [ ] **Rate Limit**: Creating > 10 bot tasks/hour from one rule auto-disables the rule and notifies admin.
- [ ] **Cross-linking**: Opening a task linked to a Lead shows the Lead's CRM card in a side panel.
- [ ] **Calendar (MENA)**: Arabic calendar shows Friday-Saturday as weekend. Hijri date option available.
- [ ] **Notifications**: Assigned user sees in-app notification within 5 seconds of task creation.
- [ ] **ADS Compliance**: Zero hardcoded colors. All surfaces use `@gateflow/tokens` or ADS semantic variables.
- [ ] **RTL**: Arabic task statuses, calendar, and bot rule labels are native and correctly aligned.
- [ ] **Pre-flight**: `pnpm turbo build --filter=admin-dashboard` passes.

### Files likely touched

- `packages/db/prisma/schema.prisma`
- `apps/admin-dashboard/src/app/api/tasks/generate/route.ts`
- `apps/admin-dashboard/src/lib/task-bot-reactor.ts`
- `apps/admin-dashboard/src/lib/notifications.ts`
- `apps/admin-dashboard/src/components/tasks/TaskHub.tsx`
- `apps/admin-dashboard/src/components/tasks/BotManager.tsx`
- `apps/admin-dashboard/src/components/tasks/CalendarView.tsx`
- `apps/admin-dashboard/src/middleware.ts` (RBAC for /api/tasks/\*\*)
