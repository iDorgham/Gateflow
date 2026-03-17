## Phase 4: Project edit UX, gates & team assignment

### Primary role

FRONTEND / BACKEND-API

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

- [ ] react — component composition and state  
- [ ] gf-architecture — routing, data flow  
- [ ] gf-api — API routes for projects/gates/assignments  
- [ ] gf-design-guide — panel layout and hierarchy  
- [ ] gf-testing — integration tests around project edit flows

### MCP to use

| MCP      | When                           |
|----------|--------------------------------|
| Context7 | Next.js + API handler patterns |

### Preferred tool

- [x] **Cursor (default)** — project edit UX, gates & team UI (per GUIDE_PREFERENCES.md)
- [ ] Claude CLI — use for API/assignment endpoints if doing backend first; Cursor does UI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

**Tool note:** Backend/API parts: prefer Claude CLI; UI: Cursor. Cursor applies and verifies all changes.

### Context

- The project dashboard and edit panel already exist (`ProjectDetailContent`, `ProjectDetailActions`, `GatesCardWithEdit`, `EditPanel`).
- `TASKS_project_dashboard.md` documents earlier phases that added gate assignments and edit flows.
- Phase 1 has added backend fields for:
  - Project advanced data (gallery, external URL, gate mode).
  - Any extra gate/team fields needed.

### Goal

Turn the project edit experience into a **project CRM hub**, where admins can:
- Edit advanced project metadata (logos, covers, gallery, URLs).  
- Import project-scoped units/contacts via CSV.  
- Configure gate topology (single vs multi gate) and assign team members to gates from within the project context.

### Scope (in)

- Project edit (inside the existing EditPanel or equivalent):
  - Surface advanced fields for:
    - Location, website, external URL.
    - Logo, cover, gallery (multiple images with previews or simple list).
  - Add an “Advanced data” section that:
    - Explains how CSV for units/contacts works (re-using existing `/api/contacts` and `/api/units` CSV logic but scoped in UI copy to this project).
    - Optionally allows selecting a project when uploading CSV, if the backend supports it, or at least clearly indicates how CSV’d data is associated.
- Gates & gate mode:
  - Expose a simple control to mark project as **single-gate** or **multi-gate**.
    - Single-gate: treat the project’s primary gate as “Gate” in UI (no need for custom names in most surfaces).
    - Multi-gate: show a main gate and use `+` to add more gates with distinct names; keep underlying data model untouched.
- Team assignment:
  - Within the project edit or detail panel, show which users are assigned to each gate.
  - Provide simple assign/unassign controls (e.g. multi-select of users or short list with toggles), reusing existing `/dashboard/team/gate-assignments` semantics and APIs.

### Scope (out)

- No changes to scanner-app policies or QR validation logic.
- No new permission model; enforce existing permissions (e.g. `gates:manage`, `projects:manage`).

### Steps (ordered)

1. Load `react`, `gf-architecture`, `gf-api`, and `gf-design-guide`; review current `ProjectDetailActions`, `ProjectDetailContent`, `GatesCardWithEdit`, and `EditPanel`.
2. For any **API or gate-assignment changes**, run **Claude CLI** with this phase prompt to propose and review the backend changes (routes, payloads, validation, org scope) before you apply them in Cursor. Keep Cursor as the place where you actually edit files and run preflight.
3. Design the **project edit panel layout**:
   - Group sections for “Basics”, “Branding & Media” (logo, cover, gallery), “Advanced data (CSV imports)”, and “Gates & team”.
4. Implement advanced project fields:
   - Wire existing `logoUrl`, `coverUrl`, `website`, `location`, and new `gallery`/`externalUrl` fields into the edit UI.
   - Ensure PATCH requests to `/api/projects/[id]` are updated to accept and validate these fields.
5. Enhance CSV flows in the project context:
   - Add UI in the project panel to:
     - Link to existing CSV import for contacts/units with clear scoping copy, or
     - Provide upload controls that reuse existing endpoints while passing project info where supported.
   - Make sure user feedback (toasts, counts) reflects that imports are **project-related**.
6. Implement gate mode toggle:
   - Add a simple control to set project gate mode (single vs multi).
   - In the UI:
     - Single-gate: emphasize a single gate row; treat label as “Gate” and hide unnecessary name fields where safe.
     - Multi-gate: allow adding/removing gate rows with names, reusing existing gate creation/edit actions.
   - Ensure changes are persisted via project or gate APIs without breaking prior behavior.
7. Integrate team assignments:
   - Reuse `gateAssignments` data already loaded in `projects/[projectId]/page.tsx`.
   - Build a per-gate list of assigned users with the ability to add/remove assignments, reusing the gate-assignment API (no new security rules).
8. Add minimal integration or component tests:
   - Save flow for project edit with new fields.
   - Assign/unassign team members to gates and confirm UI reflects changes.
9. Run:
   - `pnpm turbo lint --filter=client-dashboard`
   - `pnpm turbo typecheck --filter=client-dashboard`
   - `pnpm turbo test --filter=client-dashboard`

### SuperDesign (optional)

- If the edit panel becomes visually dense, run a SuperDesign draft focusing on:
  - Grouped sections for project CRM (branding, advanced data, gates & team).

### Subagents (optional)

| Subagent      | When | Prompt |
|---------------|------|--------|
| **browser-use** | Verify flows | "Login to client-dashboard, open a project dashboard, edit the project, change gate mode, adjust advanced fields, and assign/unassign team members to gates. Confirm changes persist and the UI remains coherent in both locales." |

### Commands (when to run)

- `/ready` before making large UI + API changes if the branch is messy.
- `/github` after all acceptance criteria and checks are satisfied.

### Acceptance criteria

- [ ] Project edit panel exposes advanced fields (branding, gallery, external URL) and saves them successfully.
- [ ] CSV imports for units/contacts can be launched from the project context with clear scoping; no regressions to existing CSV endpoints.
- [ ] Gate mode (single vs multi) is persisted and reflected in gate UI without breaking scanner behavior.
- [ ] Team assignments per gate can be managed from the project context and reflect correctly in both project detail and team views.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.
- [ ] `pnpm turbo test --filter=client-dashboard` passes (or no regressions).

