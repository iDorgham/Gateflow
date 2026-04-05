# Design — platform_evolution

## Token System

- **Primary**: `@gateflow/tokens` (OKLCH semantic tokens) — depends on `gateflow_design_system` P1-2.
- **Fallback**: `@gate-access/ui` current tokens until design system ships.
- **Rule**: Zero hardcoded hex values. All colors via CSS variables.
- **Dark mode**: `data-color-mode` attribute. Both light and dark must look premium.

## Admin Dashboard Aesthetic

- **Colors**: Main bg `#111112`, sidmenu/header/cards `#191a1c`, borders `#2f2f33`, inner elements `#1e1f21`.
- **Font**: Match client dashboard typography (Inter/Outfit family).
- **Visual parity**: Admin and Client dashboards must be indistinguishable in visual quality.
- **Premium feel**: No generic colors. Curated, harmonious palettes. Smooth gradients.

## Motion Policy

- **Default**: CSS/Tailwind transitions via `creative-animation` skill.
- **Framer Motion**: Only when a phase prompt explicitly requires it (e.g., layout morphs).
- **`prefers-reduced-motion`**: Always respected. Animations degrade gracefully.
- No drive-by `package.json` motion lib additions.

## Component Patterns

- **Side panels**: Slide-in from right (RTL: from left) for detail views.
- **Modals**: Centered overlay for confirmations and small forms.
- **Data tables**: `gf-ads-data-density` skill for high-density layouts.
- **Charts**: Recharts with ADS token colors. RTL label mirroring.
- **Kanban**: Drag-and-drop cards with priority badges and assignee avatars.

## RTL / MENA

- Every UI feature supports English and Arabic with correct RTL layout.
- Logical CSS properties (`margin-inline-start`, not `margin-left`).
- Calendar: Friday-Saturday weekend standard for MENA.
- Arabic fonts: Cairo, Almarai, or Tajawal.
- Date format: `dd/MM/yyyy` (not US format).

## Skills to load per phase

- Always: `gf-ads-core-tokens`, `gf-design-guide`
- Data tables: `gf-ads-data-density`
- Charts: `gf-data-viz-chat`
- AI UI: `gf-ai-ux-patterns`, `gf-safety-interaction`
- Forms: `gf-shadcn-composable-patterns`
- Motion: `gf-creative-ui-animation`
