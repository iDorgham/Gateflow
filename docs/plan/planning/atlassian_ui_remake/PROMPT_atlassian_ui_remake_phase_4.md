# Pro Prompt: Atlassian Remake — Phase 4 (Feature Modules)

## Phase 4: Feature Modules — Tables, Forms & Interactions

### Primary role

FRONTEND

### Preferred tool

- [x] Cursor (default)
- [x] browser_subagent (for component examples)

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform
- **Apps**: client-dashboard (3001), admin-dashboard (3002)
- **Design Inspiration**: [Dynamic Table](https://atlassian.design/components/dynamic-table/examples), [Pagination](https://atlassian.design/components/pagination/examples), [DateTime Picker](https://atlassian.design/components/datetime-picker/examples), [Button](https://atlassian.design/components/button/examples).
- **Previous Phase**: Phase 3 established the "Shell" (Navigation, Header, Breadcrumbs).

### Goal

Refactor the core feature screens (tables, forms, wizards) across both dashboards to follow Atlassian's data-dense aesthetics. Implement premium data handling via dynamic tables, pagination, and precise input controls.

### Scope (in)

- **Dynamic Table**: Implement [Atlassian Dynamic Table](https://atlassian.design/components/dynamic-table/examples) for Scans, QR Logs, and Residents.
- **Pagination**: Integrate official [Atlassian Pagination](https://atlassian.design/components/pagination/examples) for all list views.
- **DateTime Picker**: Use [Atlassian DateTime Picker](https://atlassian.design/components/datetime-picker/examples) for scheduling and log filtering.
- **Buttons & Inputs**: Standardize using [Atlassian Button](https://atlassian.design/components/button/examples) variants (Primary, Subtlest, Link).
- **Motion**: Add subtle loading skeletons and transition animations per Atlassian specs.

### Scope (out)

- Shell refactoring (Phase 3 complete).
- Backend logic/API changes.

### Steps (ordered)

1. **Table System overhaul**:
    - Implement a `DynamicTable` component in `packages/ui` that handles sorting, selection, and empty states per Atlassian patterns.
    - Implement a `Pagination` component in `packages/ui`.
    - Refactor `qrcodes` and `scans` modules to use these new components.

2. **Form Controls update**:
    - Update `DateTime Picker` to match Atlassian's ergonomic design.
    - Refine `Button` and `Input` component paddings/borders to match Atlassian Foundations (Phase 1).

3. **Feature-specific refactor**:
    - Update the QR Create Wizard to use Atlassian "Progress Indicator" if applicable.
    - Ensure PageHeader actions match Atlassian's spacing and visual weight.

4. **Verify**:
    - Manual check: Data sorting, pagination flow, date selection ergonomics.
    - `pnpm turbo build` across apps.

### Acceptance criteria

- [ ] All tables use the `DynamicTable` pattern with functional `Pagination`.
- [ ] Filters use the `DateTime Picker` for range selection.
- [ ] Buttons are visually consistent with Atlassian (e.g., specific Blue/Neutral shades).
- [ ] App interactions feel premium due to consistent motion and spacing.

### Files likely touched

- `packages/ui/src/components/` (Table, Pagination, DatePicker, Button)
- `apps/*/src/app/dashboard/`
