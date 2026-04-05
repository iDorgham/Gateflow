# PLAN: Team Page with Integrated Chat (v1.0)

## 🎯 Objective
Implement a robust **Team Management** module in the Client Dashboard, complemented by a persistent, real-time **Team Chat** interface in the sidebar to streamline internal communication between property operators and security teams.

## 🏗 High-Level Architecture
- **Schema:** Introduce `ChatMessage` and refine `User`/`Organization` relations for team roles.
- **Backend:** Expand existing SSE (Server-Sent Events) to broadcast `TEAM_CHAT_MESSAGE` events.
- **Frontend:** Build a high-performance chat drawer in the sidebar and a high-density management table on the Team page.
- **Security:** Strict `organizationId` scoping via middleware and Prisma.

## 🛤 Implementation Phases

### Phase 1: Schema & API Foundation (Backend/Database)
- **Goal:** Establish the persistent storage and API contracts for team messaging and roles.
- **Scope:** Prisma schema updates, `GET/POST` message endpoints, and Role (RBAC) verification.
- **Acceptance:** Schema migrated, API tested for multi-tenant isolation.
- **Prompt:** `docs/plan/Complete/team_page/PROMPT_team_page_phase_1.md`

### Phase 2: Sidebar Integration: Persistent Chat Drawer (Frontend)
- **Goal:** Add the chat interface to the left sidebar for quick access from any page.
- **Scope:** `TeamSidebarChat` component, message threading, and high-density UI bubbles (ADS).
- **Acceptance:** Drawer opens/closes correctly, history loads, UI matches ADS tokens.
- **Prompt:** `docs/plan/Complete/team_page/PROMPT_team_page_phase_2.md`

### Phase 3: Team Page: Unified Member & RBAC Management (Frontend)
- **Goal:** Create the destination page for inviting and managing the team.
- **Scope:** New `/dashboard/team` route, `TeamMembersTable` with inline role editing, and "Invite" flow.
- **Acceptance:** Page accessible from sidebar, members list correctly, role updates persist.
- **Prompt:** `docs/plan/Complete/team_page/PROMPT_team_page_phase_3.md`

### Phase 4: Real-time & Polish (SSE/WS Presence & Polish)
- **Goal:** Enable live updates and final UI/UX refinements.
- **Scope:** SSE listener for chat events, "Online" presence indicators, and RTL/Arabic audit.
- **Acceptance:** Messages appear instantly without refresh, presence works, RTL layout is perfect.
- **Prompt:** `docs/plan/Complete/team_page/PROMPT_team_page_phase_4.md`

## 🛡 Security & Constraints
- **Multi-Tenancy:** 100% Prisma query isolation.
- **Performance:** Optimized `ChatMessage` indexing.
- **Design:** 0 raw hexes; use specified gray palette (#18191a / #1f1f21).
