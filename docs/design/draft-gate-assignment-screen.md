# Design draft: Gate–account assignment screen

**Phase:** core_security_v6 Phase 3  
**Purpose:** Guide layout and components for the dashboard gate-assignment management UI.

## Layout

- **Placement:** New page under Team: `/dashboard/team/gate-assignments`. Linked from sidebar when user has `gates:manage` permission.
- **Structure:** Single scrollable page with two main sections: (1) Assign form, (2) Current assignments table.

## Section 1 — Assign form

- **Header:** Short title and description (e.g. “Assign user to gates”, “Select a team member and one or more gates to allow scanning at those gates.”).
- **Controls:**
  - **User select:** Dropdown or combobox listing org users (from existing team/users API). Required.
  - **Gates multi-select:** Checkbox list or multi-select of org gates (from existing gates API). At least one gate required.
  - **Primary action:** “Assign” button. On success: toast, refresh assignments list, clear selection if desired.
- **Loading / errors:** Show loading state while fetching users and gates; show inline or toast error on assign failure.

## Section 2 — Current assignments table

- **Header:** “Current assignments” with optional short hint (e.g. “Users and the gates they can scan at.”).
- **Table columns:** User (name/email), Gates (comma-separated or badges), Actions (Unassign per row or per user–gate pair).
- **Data:** From Phase 2 `GET /api/gates/assignments`. Each row = one assignment (user + gate). Grouping by user for display is optional.
- **Unassign:** Button per row that calls `DELETE /api/gates/assignments` with `userId` and `gateId`; on success refresh list and toast.

## Design system

- Use existing dashboard shell and layout; reuse `@gate-access/ui` (Button, Card, Table, Select, etc.).
- Use design tokens and spacing consistent with Gates and Team/Settings (e.g. `space-y-6`, card padding).
- Loading: skeleton or spinner; errors: alert or toast.
- Permission: Page only accessible to users with `gates:manage`; redirect or show “Forbidden” if missing (same as Phase 2 API).

## Accessibility & i18n

- All copy via translation keys (dashboard namespace).
- Labels and buttons for screen readers; table semantics.
- RTL: layout works when locale is RTL (e.g. Arabic).
