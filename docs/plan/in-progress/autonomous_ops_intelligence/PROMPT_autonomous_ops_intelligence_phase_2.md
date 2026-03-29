# Phase 2: High-Density UI & Diagnostics (Frontend)

## Primary role: FRONTEND

## Tool Selection

| Priority | Tool   | Why                                     |
| :------- | :----- | :-------------------------------------- |
| Tool 1   | Cursor | UI implementation and component design. |
| Tool 2   | Gemini | Generating accessibility and RTL tests. |

### Skills to load

- [x] `using-superpowers`
- [x] `design-guide`
- [x] `ui-ux-pro-max`
- [x] `creative-animation`
- [x] `performance`
- [x] `i18n`

### Context

- **Project**: GateFlow — Zero-Trust platform (Turborepo, pnpm)
- **Goal**: Build a high-density "Agentic HUB" to monitor autonomous maintenance and perimeter health.
- **Rules**: ADS density tokens; RTL Support; responsive; high performance (virtualization).

### Goal

Implement the UI for monitoring autonomous operations, specifically the `Agentic Hub`
and the `Scanner Diagnostics` overlay.

### Scope (in)

- `apps/client-dashboard/src/app/[locale]/(dashboard)/ai-hub/page.tsx`: Main Hub.
- `apps/client-dashboard/src/components/ai/maintenance-hub-table.tsx`: High-density table.
- `apps/client-dashboard/src/components/ai/failure-analytics-chart.tsx`: Failure trends.
- `apps/scanner-app/src/components/diagnostics-overlay.tsx`: Hardware health.

### Scope (out)

- Real-time SSE integration (handled in Phase 3).
- WhatsApp registration (handled in Phase 4).

### Steps (ordered)

1. **Agentic Hub Scaffold**: Create the `/ai-hub` page with a two-column layout
   (Analytics + High-density Table).
2. **Maintenance Table**: Implementation of the `MaintenanceHubTable` using
   `@tanstack/react-table` with ADS density optimization (compact rows).
3. **Failure Visualization**: Add `FailureAnalyticsChart` using `recharts`
   showing `SCAN_FAILURE` vs `SCAN_SUCCESS` over time.
4. **Scanner Diagnostics**: Implement `DiagnosticsOverlay` in the scanner app
   to show live health stats (mocked for now).
5. **RTL/Arabic**: Ensure all labels and layouts are localized and aligned correctly for RTL.
6. **Preflight**: Run turbo lint, typecheck, and test.

### Acceptance criteria

- [ ] `Agentic Hub` is accessible and high-performing (virtualized if needed).
- [ ] Failure trends accurately reflect `SCAN_FAILURE` events.
- [ ] Scanner Diagnostics provide visibility into hardware health.
- [ ] Arabic UI is pixel-perfect and RTL-compliant.
