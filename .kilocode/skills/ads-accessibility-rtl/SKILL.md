# SKILL: Atlassian Design System (ADS) Accessibility & RTL

## Purpose
Ensure GateFlow v9.0 is fully accessible (WCAG 2.1 AA) and provides a first-class Right-to-Left (RTL) experience for the MENA market.

## Core Principles
1.  **Logical Properties**: Use `inline-start` instead of `left` to handle LTR/RTL automatically.
2.  **Keyboard Operability**: Every actionable element must be focusable and reachable via `Tab`.
3.  **Semantic Landmarks**: Use `<header>`, `<main>`, `<nav>`, and `aria-labels` correctly.

## Implementation Rules
- **RTL Support**:
  - Use `margin-inline-start` (`ms-4` in Tailwind) instead of `ml-4`.
  - Mirror layout structure (sidebar moves to right, text aligns right).
- **Focus States**: High-contrast rings on all interactive elements.
- **Labels**: Every input icon must have an `aria-label` or hidden `<span>`.

## Anti-Patterns
- Hardcoding `text-left` or `pl-10` which breaks in RTL.
- Using `div` with an `onClick` instead of a properly styled `button`.
- Low-contrast text tokens that fail accessibility checks.

## Code Examples

### Logical Properties (CSS)
```css
.card-header {
  padding-inline-start: var(--ds-space-200); /* Left in LTR, Right in RTL */
  border-inline-end: 2px solid var(--ds-border-neutral);
  text-align: start;
}
```

### RTL Mirroring Component (Tailwind)
```tsx
const Sidebar = () => (
  <nav className="fixed top-0 bottom-0 start-0 w-[240px] border-ie bg-neutral rtl:border-is">
    <div className="p-300">
      <h1 className="text-xl font-bold rtl:text-right">بوابة المرور</h1>
      <p className="text-subtle rtl:text-right">نظام التحكم الشامل</p>
    </div>
  </nav>
);
```
