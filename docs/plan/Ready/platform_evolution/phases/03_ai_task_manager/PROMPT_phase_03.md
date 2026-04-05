# PROMPT: Phase 3 — Advanced Task Manager with AI Bots & Automation

**Mission**: Build a central, department-specific **Task Hub** in the Admin Dashboard for Sales, Marketing, Dev, and Support. Features: AI-driven bots for task automation, Kanban/Calendar views, and CRM/CMS cross-linking.

---

## 🏛️ Strategic Goals

1.  **Kanban & Calendar Views**: Department-scoped boards (e.g., "Developer Backlog", "Marketing Content Calendar").
2.  **Rule-Based AI Bots**: Automatically create tasks based on events (e.g., "New Lead in Phase 2" triggers "Sales Follow-up Task").
3.  **CRM/CMS Linkage**: Link tasks directly to Organizations, Leads, Deals, or Blog drafting workflows.
4.  **Task Automation via Vercel AI SDK**: "Ask AI to generate a task list" for a new building launch.

---

## 🛠️ Step-by-Step Implementation

### Step 1: Task Schema (BACKEND)

- Load `gateflow-database`.
- Update `prisma/schema.prisma`:
  - Create `Task` and `TaskBoard` tables with `status`, `priority`, `dueDate`, and `department` (Enum).
  - Link `Task` to `Organization` and `User` (Assignee).
  - Add `AiTaskBot` configuration to define rule-based triggers.
- Run `npx prisma migrate dev`.

### Step 2: AI Task Creation & Bot Logic (AI/FULLSTACK)

- Load `gf-api` and `gf-ai-ux-patterns`.
- Create `apps/admin-dashboard/src/app/api/tasks/generate/route.ts`:
  - Use **Vercel AI SDK v6** to parse natural language task descriptions into structured task objects.
  - Implement a `scheduleTask` tool that handles due dates and assignees based on availability.
- Develop the "Bot Reactor" (Hook-based logic) to automatically create tasks when custom events occur (e.g., lead scoring above 80).

### Step 3: Multi-View Task Dashboard (FRONTEND)

- Load `gf-ads-data-density` and `ui-ux-pro-max`.
- Build `TaskHub.tsx`:
  - Features: Toggle between **Kanban** (Drag-and-drop), **List**, and **Calendar** (Reversed for RTL).
  - Components: "AI Task Drafter" input, "Bot Management" settings tab.
  - Style: Premium dark-mode (accent: `#3b82f6` or `primary-500`).
- **MENA/RTL**: Calendar days and headers reversed for Arabic (Sun-Sat or Sat-Fri). Ensure Arabic translations for Task states (To Do, In Progress, Done).

---

## ✅ Acceptance Criteria (Definition of Done)

- [ ] **AI Utility**: AI can create a multi-step task list for a "Compound Launch" from a single text prompt.
- [ ] **Interactivity**: Drag-and-drop in Kanban works and updates the DB state.
- [ ] **Automation**: An AI bot correctly generates a task when a lead enters the "Negotiation" stage.
- [ ] **Aesthetics**: High-density UI with professional transitions between Kanban/Calendar views.
- [ ] **RTL**: Arabic task states and calendar layout are native and correctly rendered.
- [ ] **Pre-flight**: `pnpm turbo build` passes for the admin app.
