## Phase 5: Header layout & settings split (User vs GateFlow system)

### Primary role

ARCHITECTURE / FRONTEND

Use this role when implementing in Cursor or when invoking CLIs for this phase.

### Skills to load

- [ ] react — layout and shared components  
- [ ] gf-architecture — navigation & settings structure  
- [ ] gf-design-guide — header, density, visual hierarchy  
- [ ] gf-i18n — RTL header behavior  
- [ ] gf-testing — smoke tests for navigation

### MCP to use

| MCP              | When                  |
|------------------|-----------------------|
| Context7         | Next.js routing docs  |
| cursor-ide-browser | Click-through testing |

### Preferred tool

- [x] Cursor (default)

### Context

- Current settings tabs blend user-level concepts (profile, workspace, billing) with system-level GateFlow configuration.
- Header currently contains avatar and theme controls in a less prominent way.
- The goal is to:
  - Move avatar to the top-right with a visible light/dark switch.
  - Split settings into **User settings** (profile, workspace, billing, security) and **GateFlow system** settings (workspace/org, retention, projects, gates, etc.).

### Goal

Refine the header and settings architecture so:
- Avatar and theme switch live clearly at the top-right.  
- Avatar menu leads to a **user-centric** settings area.  
- `/dashboard/settings` is clearly the **system/GateFlow** configuration area, with tabs focused on organization-level settings.

### Scope (in)

- Header:
  - Move avatar to the far right of the header.
  - Add or reposition a light/dark mode switch next to the avatar (re-using existing theme logic).
  - Confirm behavior in LTR and RTL.
- Avatar menu:
  - Entries for:
    - Profile
    - Workspace
    - Billing
    - (Optional) Security
  - Wire these to the appropriate routes/pages.
- Settings split:
  - **User settings** (via avatar menu):
    - Profile page improved with:
      - Name, email, phone, company, website, social media handles, and bio.
    - Optionally, user-specific preferences (timezone, UI language, etc.) if not already covered.
  - **GateFlow system settings** (`/dashboard/settings`):
    - Focus tabs on organization-level items (workspace/org config, data retention/privacy, projects, gates, etc.).
    - Remove or relocate any purely user-level settings from these tabs.
- Copy and icons:
  - Ensure labels make it obvious:
    - “Profile” is about the current user.
    - “Workspace”/“GateFlow system” is about the org/node.

### Scope (out)

- No changes to auth, sessions, or billing integrations.
- No major redesign of settings content beyond navigation, grouping, and small copy tweaks.

### Steps (ordered)

1. Load `gf-architecture`, `gf-design-guide`, `react`, and `gf-i18n`; review the current header component and settings routes.
2. Define routes and components for:
   - User Profile page (if not already present in a suitable form).
   - Any dedicated “User settings” layout you want to use.
3. Update header:
   - Place avatar at the right-most side with an accessible menu.
   - Place a light/dark mode toggle next to it (or inside the menu if space is tight), ensuring it uses existing `useTheme` hooks.
4. Implement avatar menu:
   - Add items for Profile, Workspace, Billing, and Security (if desired).
   - Wire each to appropriate routes.
5. Update `/dashboard/settings` tabs:
   - Remove or relocate purely personal settings entries (profile, workspace, billing) so this page reads as GateFlow/system-centric.
   - Ensure existing tabs (Workspace, Projects, etc.) remain accessible and coherent.
6. Implement an enhanced Profile page:
   - Add fields for phone, company, website, social media, bio.
   - Reuse card-based layout from `GeneralTab` / `WorkspaceTab` for visual consistency.
   - For this phase, persist as much as is already supported by backend; otherwise, store what’s safe and future-proof the UI for later backend extensions.
7. Run:
   - `pnpm turbo lint --filter=client-dashboard`
   - `pnpm turbo typecheck --filter=client-dashboard`
   - `pnpm turbo test --filter=client-dashboard`

### SuperDesign (optional)

- Use SuperDesign to quickly explore:
  - A unified header with avatar + theme toggle.
  - User vs system settings navigation layouts.

### Subagents (optional)

| Subagent      | When | Prompt |
|---------------|------|--------|
| **browser-use** | Verify UX | "Login to client-dashboard, switch theme, open avatar menu, visit Profile and system Settings, and confirm navigation feels consistent in both EN and AR." |

### Commands (when to run)

- `/ready` if there are unrelated changes or pending checks.
- `/github` once the header and settings split are implemented and tests pass.

### Acceptance criteria

- [ ] Avatar is at the top-right with a visible theme toggle; works in RTL.
- [ ] Avatar menu shows Profile, Workspace, Billing (and Security if added) and routes correctly.
- [ ] `/dashboard/settings` focuses on GateFlow/system configuration; no obviously personal-only tabs left there.
- [ ] Profile page supports email, phone, company, website, social links, and bio with a layout consistent with other dashboard pages.
- [ ] `pnpm turbo lint --filter=client-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=client-dashboard` passes.
- [ ] `pnpm turbo test --filter=client-dashboard` passes (or no regressions).

