# IDEA: Team Page with Integrated Chat (v1.0)

## 1. Overview
Introduce a centralized **Team Management** hub within the Client Dashboard, featuring a real-time **Team Chat** component integrated into the left navigation/sidebar context. This facilitates instant operational communication between property managers and security teams without leaving the SaaS portal.

## 2. Goals
- **Unified Team Hub:** A single page to view, invite, and manage team members and their roles (RBAC).
- **In-Context Communication:** A side-menu chat interface that allows users to communicate with team members while browsing other dashboard sections (or specifically within the Team page).
- **Real-Time Synergy:** Leverage existing SSE (Server-Sent Events) or a lightweight WebSocket bridge for instant message delivery and presence.
- **ADS Alignment:** 100% adherence to Atlassian Design System (ADS) patterns for messaging (avatars, message bubbles, high-density threads).

## 3. Constraints & Prerequisites
- **Multi-Tenancy:** All messages must be strictly scoped to `organizationId`.
- **Soft Deletes:** Messages and team memberships follow the `deletedAt: null` contract.
- **RTL Support:** Full support for Arabic messaging and mirrored sidebar layout.
- **Infrastructure:** Reuse the `EventLog` or create a specific `ChatMessage` model in Prisma.

## 4. Proposed High-Level Architecture
- **Database:** New `ChatMessage` model connected to `User` and `Organization`.
- **API:**
  - `GET /api/team/messages`: Fetch message history.
  - `POST /api/team/messages`: Send a new message (triggers SSE broadcast).
- **UI Components:**
  - `TeamSidebarChat`: A high-density chat list and thread view for the sidebar.
  - `TeamPage`: Member management table with role editing.
  - `TeamPresence`: Real-time "Online" badges.

## 5. Success Criteria
- [ ] Users can send and receive messages in real-time.
- [ ] New messages trigger a notification/badge in the sidebar.
- [ ] Team members can be invited/managed on the main page.
- [ ] 0 hex codes: 100% ADS token usage.
