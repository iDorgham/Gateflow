---
name: responsive-design
description: Specialized workflows and patterns for responsive-design.
---

# SKILL: Responsive Multi-App Design System

## Purpose

Enforce a comprehensive responsive strategy across all 6 GateFlow apps, ensuring a premium experience on desktop, tablet, and mobile.

## Core Principles

1.  **Mobile-First Breakpoints**: Start with mobile styles and layer on complexity for larger screens.
2.  **Adaptive Density**: UI density should increase with screen size (e.g., compact tables on mobile, expanded analytics on desktop).
3.  **Touch Targets**: Minimum interactive area of 44x44px for all mobile-accessible components.

## Implementation Rules

- **Breakpoints**:
  - `Mobile`: `< 640px` (Single column, hidden sidebars).
  - `Tablet`: `640px - 1024px` (Collapsible sidebar, two columns).
  - `Desktop`: `> 1024px` (Permanent sidebar, multi-column grid).
- **Table Transformation**: On mobile, hide non-essential columns or transform the table into card stacks.
- **Typography**: Scale font sizing using `clamp()`.

## Anti-Patterns

- Using `hidden` to hide heavy desktop components on mobile (use dynamic rendering/conditional components).
- Horizontal scrolling on mobile screens (the primary layout must verticalize).
- Fixed-width containers that don't respect the parent viewport.

## Code Examples

### Responsive Grid (Tailwind)

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-200">
  <KpiCard title="Active Gates" value={12} />
  <KpiCard title="Pending Guest" value={45} />
  <KpiCard title="Alerts" value={2} variant="danger" />
  <KpiCard title="Uptime" value="99.9%" />
</div>
```

### Table to Card Stack (CSS)

```css
@media (max-width: 640px) {
  .responsive-table thead {
    display: none;
  }
  .responsive-table tr {
    display: block;
    margin-bottom: var(--ds-space-200);
    border-radius: var(--ds-border-radius);
    background: var(--ds-background-neutral);
  }
  .responsive-table td {
    display: flex;
    justify-content: space-between;
    padding: var(--ds-space-100) var(--ds-space-200);
  }
}
```
