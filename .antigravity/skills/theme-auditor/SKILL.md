---
name: theme-auditor
description: Specialized workflows and patterns for theme-auditor.
---

# GateFlow Theme Auditor Skill (gf-theme-auditor)

This skill provides a systematic approach to auditing, fixing, and memorizing light/dark mode consistency and accessibility across the GateFlow monorepo. It ensures that the design system's premium aesthetic (satin, glass, subtle gradients) is correctly implemented in both themes.

## 🎨 Core Mandates

1.  **Subtle Transitions**: Avoid high-contrast transitions (like pure black to pure white borders). Use semantic tokens instead of hardcoded colors.
2.  **Satin Dark Mode**: Dark mode should feel like satin/charcoal, not pure black (#000). Use the `oklch(L% C H)` color space for perceptually uniform lightness.
3.  **Contrast Compliance**: Ensure text-to-background contrast ratios meet WCAG 2.1 Level AA (4.5:1 for normal text).
4.  **Token First**: Every color modification MUST be done via the token system (`packages/tokens/css/tokens.css`) to ensure synchronization across all apps.

## 🔍 Audit Workflow (RALPH Cycle)

When asked to audit or fix theme issues, follow these steps:

1.  **Scan**: Identify hardcoded slate, grey, black, or white classes (e.g., `bg-white`, `dark:bg-slate-800`).
2.  **Measure**: Use the browser subagent to inspect the actual rendered colors and contrast ratios.
3.  **Map**: Replace hardcoded classes with the appropriate semantic tokens:
    - `bg-[var(--ds-surface)]`
    - `bg-[var(--ds-surface-raised)]`
    - `border-[var(--ds-border-subtle)]`
    - `text-[var(--ds-text)]`
4.  **Synchronize**: Update the corresponding token definitions in `tokens.css` if the global palette needs refinement.
5.  **Verify**: Use the browser subagent in both Light and Dark modes to capture comparison screenshots.

## 🧠 Theme Memory

Record persistent theme findings, recurring pitfalls, and approved aesthetic deviations in the `.ai-memory/theme_patterns.md` file.

- **Bad Pattern**: Using `border-slate-200` for light mode components.
- **Good Pattern**: Using `border-[var(--ds-border-subtle)]` which resolves to a more balanced, theme-aware shade.
- **Pitfall**: Inconsistent `popover` backgrounds when using third-party libraries (Radix, HeadlessUI). Always wrap or theme these components explicitly.

## 🛠 Usage Examples

### `/theme-audit <app>`

Use this command to trigger a full theme audit of a specific application.

- `ralph theme-audit design-system`

### `/theme-fix <issue>`

Use this command to implement a specific theme fix across all apps.

- `ralph theme-fix "dropdown borders too bright in dark mode"`
