# IDEA_project_dashboard — Unified Real Estate Project Page

**Owner:** Product + Frontend  
**Created:** 2026-03-02  
**Status:** Draft (Idea captured)  
**Depends on:** Real estate palette (client dashboard UI refine)  

---

## 1. Problem & Motivation

Today, projects, gates, and gate assignments are spread across separate pages:

- **`/dashboard/projects`** — Card grid of projects (name, gates count, QR count, etc.)
- **`/dashboard/gates`** — Flat list of all gates (optionally filtered by project)
- **`/dashboard/team/gate-assignments`** — Assign users to gates

Users (property managers, compound admins) want a **single, rich project page** that presents each real estate project as a cohesive unit: hero imagery, location, description, KPIs from our data (contacts, unit types, QR/access metrics), gates, team assignments, and gate logs — all in one place.

---

## 2. Goals

1. **Combine project + gates + gate assignments** into one navigation model: navigate to a project and see everything about it.
2. **New route:** `/[locale]/dashboard/projects/[projectId]` — Real estate project detail page.
3. **Rich presentation:** Images (cover, logo), title, location, description, plus database-derived info:
   - **Contacts** — unique contacts count
   - **Unit types** — count or list
   - **QR metrics** — avg daily/weekly/monthly QR code usage (scans per QR or created QRs)
   - **Access metrics** — avg daily/weekly/monthly scans (access events)
   - **Team** — users assigned to gates in this project (from GateAssignment)
   - **Gates** — list of gates in the project, status, last activity
   - **Gate logs** — recent scan logs for gates in this project
   - **Security shift countdown** — placeholder or stub for guard shift status (no Shift model yet; can show "on duty" or similar)
4. **Navigation:** Sidebar/overview link to Projects; clicking a project opens this detail page instead of a generic list.
5. **Projects settings tab** — The **only** place to create the first project. Combined with gates: when creating a project, add gates in the same flow (project + gates wizard). After the first project exists, new projects can be added from the projects list or settings.
6. **Gate assignments** — Manage assignments from the project page (assign users to gates) or keep a shortcut to the existing gate-assignments page filtered by project.
7. **Team tab — gate + time** — Assign team members to gates **with time** (e.g. shift window, schedule). Support assigning user + gate + time range (or day/time slot).
8. **Edit Panel (shared)** — A reusable slide-from-right panel that:
   - Slides in from the right (left in RTL)
   - Dims the rest of the page and blocks interaction until save/quit
   - Used across project page, contacts page, units page, gates, gate assignments, watchlist, and more
   - From project page: **Edit project**, **Add contact**, **Add unit**, **Add gate**, **Manage gate assignments**, **Add/Edit watchlist entry**
   - **Search** — Find contacts, units, QRs, gates, watchlist entries; opening a result loads it in the edit panel
   - **Gate** — Edit existing gate or add new gate (name, location, projectId, isActive)
   - **Gate assignments** — Assign users to gates; manage who can scan at which gate
   - **Watchlist** (blocklist) — Add or edit watchlist entries (name, idNumber, phone, notes); security deny-list for scans

---

## 3. Scope

### 3.1 In scope

- `apps/client-dashboard/src/app/[locale]/dashboard/projects/[projectId]/page.tsx` (new)
- `apps/client-dashboard/src/app/[locale]/dashboard/projects/` — update list to link to `[projectId]` detail
- API or server-side data fetching for project aggregates (contacts, unit types, QR/access metrics, gates, assignments, scan logs)
- Real estate presentation: hero/cover image, title, location, description, KPI cards, gates section, team section, logs section
- **Edit Panel** — Shared component (slide from right, dim overlay, block interaction); edit project, add contact, add unit, add/edit gate, manage gate assignments, add/edit watchlist entry; search contacts/units/QRs/gates/watchlist
- **Projects settings tab** — Sole entry for first-project creation; project + gates combined wizard
- **Gate assignments with time** — Assign user to gate with time/schedule (shift window, day/time slot)
- Semantic tokens (real estate palette) for all new UI

### 3.2 Out of scope

- Admin dashboard, marketing, scanner app
- New Shift/scheduling model (security shift countdown = placeholder or simple "next shift" stub)
- Resident portal, resident-mobile

---

## 4. Data Model (existing)

- **Project:** name, description, logoUrl, coverUrl, website, location, organizationId; relations: gates, qrCodes, units
- **Gate:** name, location, projectId, isActive, lastAccessedAt; relations: gateAssignments, scanLogs, qrCodes
- **GateAssignment:** userId, gateId, organizationId; extend with startTime?, endTime? or shift reference for time-scoped assignments
- **ScanLog:** gateId, qrCodeId, scannedAt, status
- **Unit:** projectId, type (UnitType), organizationId
- **Contact:** via ContactUnit → Unit
- **WatchlistEntry:** organizationId, name, idNumber?, phone?, notes? — person blocklist for scan denial

---

## 5. Constraints

- **Multi-tenant:** All queries scoped by `organizationId`.
- **Soft deletes:** Filter `deletedAt: null`.
- **pnpm only:** No npm/yarn.
- **Semantic tokens:** No hardcoded hex; use real estate palette.
- **RTL:** Support AR/EN, RTL layout.

---

## 6. Reference

| Resource | Path |
|----------|------|
| Prisma schema | `packages/db/prisma/schema.prisma` |
| Projects page | `apps/client-dashboard/src/app/[locale]/dashboard/projects/page.tsx` |
| Gates page | `apps/client-dashboard/src/app/[locale]/dashboard/gates/page.tsx` |
| Gate assignments | `apps/client-dashboard/src/app/[locale]/dashboard/team/gate-assignments/` |
| Watchlist | `apps/client-dashboard/src/app/[locale]/dashboard/team/watchlist/` |
| UI Design Guide | `docs/guides/UI_DESIGN_GUIDE.md` |
