# Comprehensive Claude Prompt: Implement Project Filtering across GateFlow

**Context:** We have already implemented the basic Multi-Project infrastructure (Migration, Seed, Project Switcher UI, API, and Cookie Helpers). Now we need to implement the actual filtering logic across different dashboard modules.

**Objective:** Implement project-aware filtering for QR Codes, Gates, and Scans, and consolidate project state management.

---

## Part 1: Shared Project Context

**Target:** apps/client-dashboard/src/
**File to Create:** `apps/client-dashboard/src/context/ProjectFilterContext.tsx`

1. Create a React context to manage:
   - Current project ID (read from `selected-project` cookie).
   - List of all projects available to the user.
   - Helper functions to check if "All Projects" is selected.
2. Provide this context in `shell.tsx` or the root layout to ensure consistency across the dashboard.

---

## Part 2: QR Code Filtering

**Target:** apps/client-dashboard/src/app/dashboard/qrcodes/
**Files to Update:** `page.tsx`, `actions.ts`

1. **Filtering:**
   - Use the project ID from the cookie/context to filter QR Code queries.
   - If a specific project is selected, only show QRs for that project.
   - Support an "All Projects" option (if `projectId` is null or a specific "all" value).
2. **Creation:**
   - When creating a new QR Code, automatically assign it to the currently selected project.
   - In the creation form, display the target project (read-only or defaulted).
3. **UI Updates:**
   - Display the project name in the QR list table.
   - Add a project filter dropdown in the list toolbar.

---

## Part 3: Gate Filtering

**Target:** apps/client-dashboard/src/app/dashboard/gates/
**Files to Update:** `page.tsx`, `gate-client.tsx`

1. **Filtering:**
   - Filter Gates by `projectId` based on the active project.
   - Include "All Projects" support.
2. **Creation:**
   - Auto-assign new Gates to the current project.
3. **UI Updates:**
   - Show a project badge on each gate card.
   - Add a project filter dropdown to the page toolbar.

---

## Part 4: Scan Filtering

**Target:** apps/client-dashboard/src/app/dashboard/scans/
**Files to Update:** `page.tsx`

1. **Filtering:**
   - Scans are linked to QRs. Join through `QRCode` to filter scans by `projectId`.
   - Support "All Projects".
2. **UI Updates:**
   - Show the project name in the scan results table.
   - Ensure CSV/Excel export includes the project information.

---

## Instructions for Implementation

- Ensure all database queries use Prisma's `where` clause with the `projectId`.
- Maintain a consistent UI for the filter dropdowns across all pages.
- Handle edge cases where `projectId` might be missing (use the default "Main" project or "All Projects" logic).
- Verify that switching projects in the sidebar automatically refreshes the data on these pages.
