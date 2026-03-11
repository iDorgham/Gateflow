# TASKS: AI Assistant v2

**Plan**: [PLAN_ai_assistant_v2.md](PLAN_ai_assistant_v2.md)
**Status**: Ready

## Phases

- [x] **Phase 1: Header Notifications + AI Panel Refine**
  - [x] NotificationDropdown component (bell icon + expired QR list)
  - [x] Bell in header replaces side panel notifications tab
  - [x] Side panel renders AI chat directly (no tabs yet)
  - [x] AI assistant UI polish (whitespace-pre-wrap, Gemini badge, clear icon)
  - [x] Lint passes

- [x] **Phase 2: Expanded AI Tools**
  - [x] `createQR` — real QR signing + Prisma create, supports count (QR sets)
  - [x] `getOrgStats` — real Prisma counts (replaces stub)
  - [x] `listProjects`, `listGates`, `listContacts`, `listRecentScans`, `listUnits`
  - [x] System prompt updated with all tools
  - [x] Typecheck passes

- [x] **Phase 3: Tasks Tab**
  - [x] Task model + TaskStatus enum in schema (prisma db push)
  - [x] GET/POST/PATCH/DELETE /api/tasks
  - [x] tasks-panel.tsx with filter + list + checkbox toggle + add form
  - [x] createTask AI tool
  - [x] Side panel: AI | Tasks tabs
  - [x] Typecheck and tests pass

- [ ] **Phase 4: Team Chat Tab**
  - [ ] ChatMessage model in schema (prisma db push)
  - [ ] GET/POST /api/chat
  - [ ] team-chat.tsx with bubble UI + 10s polling + send form
  - [ ] Side panel: AI | Tasks | Chat tabs
  - [ ] Typecheck and lint pass

---
*Created: 2026-03-11*
