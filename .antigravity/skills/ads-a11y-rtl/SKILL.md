---
name: ads-a11y-rtl
description: Accessibility (WCAG 2.2 AA) and Arabic RTL/Bidi localization rules for GateFlow web and mobile interfaces in the MENA region.
---

# ADS Accessibility & RTL / Localization

Guidelines for WCAG 2.2 AA compliance, keyboard navigation, high-contrast states, and bidirectional Arabic (Egypt/UAE) layout.

## Rules

- **Color Contrast**: Minimum 4.5:1 for normal text; 3:1 for large text and active UI elements.
- **RTL & Logical Properties**: Use CSS logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`).
- **Numbers in RTL**: Phone numbers, timestamps, and codes maintain LTR direction (`dir="ltr"`).
- **Icons**: Directional icons (arrows, chevrons) flip in RTL; non-directional icons (search, settings) do not flip.
- **Keyboard Navigation**: All interactive components must provide visible focus rings (`focus-visible`) and full keyboard operability.
