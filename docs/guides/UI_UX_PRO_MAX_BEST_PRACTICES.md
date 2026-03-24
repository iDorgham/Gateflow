# UI/UX Pro Max — Optimized Prompting & Best Practices

This guide provides high-performance prompts and best practices for leveraging the **UI/UX Pro Max** skill within the GateFlow workspace.

## Core Directives

When working on UI/UX, follow these mandates to ensure premium quality:

1. **Never use emojis as icons**. Always use SVGs (Lucide, Heroicons).
2. **Interactive Feedback**. Every clickable element MUST have `cursor-pointer` and a hover state transition (`duration-200`).
3. **Contrast & Hierarchy**. Adhere to Atlassian Design System (ADS) tokens but enhance with UI/UX Pro Max palettes for "wow" factor.
4. **RTL Compliance**. All components must be tested for Arabic layout mirroring.

## Optimized Mastery Prompts

Use these prompts in your AI chat or when generating phase prompts to get the best results from the skill.

### 1. The "Ultimate SaaS Dashboard" Prompt

> "Build a premium SaaS analytics dashboard for [Domain] using Next.js 14 and ADS tokens. Apply the 'glassmorphism' style from UI/UX Pro Max. Ensure high data density with consistent cell padding and accessible typography pairing (Heading: Inter, Body: Roboto). Focus on real-time data visualization with Recharts."

### 2. High-Conversion Landing Page

> "Create a high-conversion landing page for [Product]. Use a 'hero-centric' layout from the landing domain. Palette: 'Deep Sea' (Professional Blue). Typography: 'Modern Tech' (Archivo). Include social proof sections, pricing tiers with clear CTAs, and a sticky floating navbar with subtle shadow elevation."

### 3. Accessible RTL-First Component

> "Build a [Component Name] that supports full RTL mirroring. Use Lucide icons. Ensure all interactive elements have 150ms transitions. Validate contrast ratios for both Light and Dark modes against WCAG AAA standards. Use 'slate-900' for primary text in light mode for maximum legibility."

## Automation Workflow

The GateFlow workspace now automates the usage of this skill via:

- **`/plan`**: Automatically runs design system generation for UI-tagged initiatives.
- **`/dev`**: Enforces the `ui-ux-pro-max` checklist during the Ralph Loop execution.
- **`TEMPLATE_PROMPT_phase.md`**: Includes a mandatory UI/UX Design Intelligence section.

## Verification Checklist

Before considering a UI task "Done", run these checks:

- [ ] No emojis in UI.
- [ ] `cursor-pointer` added to all interactive cards/buttons.
- [ ] Hover states provide visual feedback (opacity/color change).
- [ ] RTL layout doesn't break alignment or icon direction.
- [ ] Responsive at 375px (Mobile) and 1440px (Desktop).
- [ ] `prefers-reduced-motion` is respected in animations.

---

_Derived from UI/UX Pro Max Skill v1.0.0_
