# SKILL: Atlassian Design System (ADS) Elevation & Shadows

## Purpose
Define visual depth and hierarchy using ADS elevation tokens, distinguishing between surface levels in the GateFlow v9.0 UI.

## Core Principles
1.  **Z-Axis Hierarchy**: Use shadows to imply component "closeness" to the user.
2.  **Subtle Realism**: Avoid harsh, "dirty" shadows; use ADS layered shadow tokens.
3.  **Dark Mode Adaptation**: Shadows must soften and shift in dark mode to preserve contrast without glowing edges.

## Implementation Rules
- **Levels**:
  - `Flat`: Default surface (no shadow).
  - `Raised`: Cards, sidebars (`elevation.raised`).
  - `Overlay`: Modals, dropdowns (`elevation.overlay`).
- **Surface Colors**: Shadows work best when paired with `color.background.sunken` or `color.background.neutral`.

## Anti-Patterns
- Using `shadow-xl` from Tailwind default (too harsh for ADS).
- Applying shadows to every component (creates visual noise).
- Using pure black `#000` for shadows in dark mode surfaces.

## Code Examples

### CSS Token Usage
```css
.card-raised {
  background-color: var(--ds-background-neutral);
  box-shadow: var(--ds-shadow-raised);
}

.modal-content {
  background-color: var(--ds-background-neutral);
  box-shadow: var(--ds-shadow-overlay);
  z-index: var(--ds-zindex-modal);
}
```

### Tailwind Custom Utilities
```tsx
// tailwind.config.ts
theme: {
  extend: {
    boxShadow: {
      'ads-raised': 'var(--ds-shadow-raised)',
      'ads-overlay': 'var(--ds-shadow-overlay)',
    }
  }
}

// In component
<div className="bg-neutral shadow-ads-raised rounded-medium p-300">
  Mission Dashboard
</div>
```
