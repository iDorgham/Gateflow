# Pro Prompt: GateFlow AI Redesign Phase 2 — Core Component Factory

## Goal
Build the "Body" of GateFlow Command: Create specialized ADS-compliant components in the shared UI package.

### Primary role
FRONTEND (with SuperDesign)

### Preferred tool
Cursor

### Context
- **Source of Truth**: [atlassian.design](https://atlassian.design/)
- **Target directory**: `packages/ui/src/components/command/`
- **Mandatory Skills**: `gf-ads-core-tokens`, `gf-shadcn-ads-adapter`, `gf-ads-data-density`.

### Scope (in)
- **NEW FILES** in `packages/ui/src/components/command/`:
    - `CommandShell.tsx`: Grid-based layout container.
    - `MissionFolderTree.tsx`: Vertical tree navigation.
    - `ActionChipBar.tsx`: Dynamic pill layout.
    - `AlertBadge.tsx`: Pulsing visual indicator.
    - **Tagging Components**: `TagLozenge.tsx` (using ADS Lozenge patterns), `TagInput.tsx` (autocomplete), `TagFilterBar.tsx`.
    - `AssetHubModal.tsx`: Dialog shell for the file manager.
- Strictly map all colors, elevations, and spacing to ADS semantic tokens.

### Scope (out)
- Motion/Animation (Phase 3).
- Predictive logic (Phase 5).

### Steps
1. Create the `packages/ui/src/components/command/` directory.
2. Draft the components using Radix/Shadcn primitives adapted to ADS.
3. Ensure `TagLozenge` supports ADS appearances (`bold`, `subtle`) and colors.
4. Export all components from the main UI index.
5. Apply skill: `gf-shadcn-ads-adapter`.

### Acceptance criteria
- [ ] Visual fidelity to ADS components (Lozenge, Button, etc.).
- [ ] Components are responsive and handle RTL correctly (tokens).
- [ ] All 7+ new components exist in the designated directory.
