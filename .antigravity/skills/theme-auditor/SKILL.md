---
name: theme-auditor
description: Systematic theme auditing, WCAG 2.2 AA contrast verification, Impeccable heuristic scoring, and anti-AI-slop inspection for GateFlow apps and design systems.
---

# Impeccable Theme & UI Auditor (gf-theme-auditor)

Provides systematic auditing, heuristic evaluation, and automated contrast/quality checks across Light and Dark modes for the GateFlow monorepo using `/impeccable` commands.

---

## 🔍 1. Impeccable Audit Commands

<<<<<<< Updated upstream
| Command | Action | Output / Goal |
| :--- | :--- | :--- |
| `/impeccable audit [target]` | Full automated technical check | WCAG contrast ratio table, CLS metrics, responsive breakpoints. |
| `/impeccable critique [target]` | Heuristic UX evaluation | 30 UX laws score, cognitive load rating, density assessment. |
| `/impeccable polish [target]` | Visual refinement cycle | Sub-pixel alignment, border contrast, focus ring states. |
| `/impeccable live` | Visual variant inspection | Browser-based interactive theme & layout verification. |
=======
| Command                         | Action                         | Output / Goal                                                   |
| :------------------------------ | :----------------------------- | :-------------------------------------------------------------- |
| `/impeccable audit [target]`    | Full automated technical check | WCAG contrast ratio table, CLS metrics, responsive breakpoints. |
| `/impeccable critique [target]` | Heuristic UX evaluation        | 30 UX laws score, cognitive load rating, density assessment.    |
| `/impeccable polish [target]`   | Visual refinement cycle        | Sub-pixel alignment, border contrast, focus ring states.        |
| `/impeccable live`              | Visual variant inspection      | Browser-based interactive theme & layout verification.          |
>>>>>>> Stashed changes

---

## 📋 2. The 5-Point Heuristic Audit Checklist

When auditing any application screen or component in `apps/design-system` or consumer apps, verify:

### 1. Dual-Mode Contrast & Luminance
<<<<<<< Updated upstream
- **Normal Text**: Contrast ratio $\ge 4.5:1$ against surface background.
- **Large Text / Headings**: Contrast ratio $\ge 3:1$.
- **UI Components / Borders**: Contrast ratio $\ge 3:1$ for interactive controls and active focus rings.
- **Dark Mode Surfaces**: Satin depth progression (`#0b0d11` → `#12151c` → `#191d26` → `#212633`).

### 2. Anti-AI-Slop Gate (Pass Required)
- Zero `border-left` colored card accents.
- Zero decorative gradient text in console/dashboard UI.
- Zero glassmorphism used as default card styling.
- Zero unconstrained layout property animations.
- Zero pure `#000000` or `#ffffff` body backgrounds.

### 3. Spatial Rhythm & Optical Alignment
- Strict 8pt spatial grid with 4pt baseline intervals.
- Consistent container padding (`space-150`, `space-200`, `space-300`).
- Text line length constrained to $65\text{--}75\text{ch}$ for optimal reading comfort.

### 4. Arabic RTL & Bidirectional Symmetry
- Logical spacing properties only (`ms-*`, `me-*`, `ps-*`, `pe-*`).
- Correct optical alignment for chevron indicators, badges, and avatars in RTL mode.
- Cairo / Tajawal font rendering without vertical text clipping.

### 5. Micro-interactions & Accessible Focus
- Visible, high-contrast focus rings (`ring-2 ring-primary ring-offset-2`).
- Smooth cubic-bezier ease-out transitions (`transform` and `opacity` only).
- Strict adherence to `prefers-reduced-motion`.

---

## 📝 3. Theme Audit Report Template

When generating an audit report, use this structured format:

=======

- **Normal Text**: Contrast ratio $\ge 4.5:1$ against surface background.
- **Large Text / Headings**: Contrast ratio $\ge 3:1$.
- **UI Components / Borders**: Contrast ratio $\ge 3:1$ for interactive controls and active focus rings.
- **Dark Mode Surfaces**: Satin depth progression (`#0b0d11` → `#12151c` → `#191d26` → `#212633`).

### 2. Anti-AI-Slop Gate (Pass Required)

- Zero `border-left` colored card accents.
- Zero decorative gradient text in console/dashboard UI.
- Zero glassmorphism used as default card styling.
- Zero unconstrained layout property animations.
- Zero pure `#000000` or `#ffffff` body backgrounds.

### 3. Spatial Rhythm & Optical Alignment

- Strict 8pt spatial grid with 4pt baseline intervals.
- Consistent container padding (`space-150`, `space-200`, `space-300`).
- Text line length constrained to $65\text{--}75\text{ch}$ for optimal reading comfort.

### 4. Arabic RTL & Bidirectional Symmetry

- Logical spacing properties only (`ms-*`, `me-*`, `ps-*`, `pe-*`).
- Correct optical alignment for chevron indicators, badges, and avatars in RTL mode.
- Cairo / Tajawal font rendering without vertical text clipping.

### 5. Micro-interactions & Accessible Focus

- Visible, high-contrast focus rings (`ring-2 ring-primary ring-offset-2`).
- Smooth cubic-bezier ease-out transitions (`transform` and `opacity` only).
- Strict adherence to `prefers-reduced-motion`.

---

## 📝 3. Theme Audit Report Template

When generating an audit report, use this structured format:

>>>>>>> Stashed changes
```markdown
## Impeccable UI/UX & Theme Audit Report — [Target App/Component]

**Status**: [✅ PASS (Score: 100/100) | ⚠️ ISSUES DETECTED (Score: X/100)]

### Heuristic Evaluation Summary
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
- **Color & Contrast (WCAG 2.2 AA)**: [PASS / FAIL - Details]
- **Dual-Mode Elevation Depth**: [PASS / FAIL - Details]
- **Anti-AI-Slop Compliance**: [PASS / FAIL - Details]
- **Arabic RTL Localization**: [PASS / FAIL - Details]
- **Touch Targets & Responsiveness**: [PASS / FAIL - Details]

### Actionable Fixes Required
<<<<<<< Updated upstream
1. `[file_path]`: [Specific issue and proposed token/className fix]

### Verdict
=======

1. `[file_path]`: [Specific issue and proposed token/className fix]

### Verdict

>>>>>>> Stashed changes
[APPROVED for Production / REQUIRES ITERATION in packages/ui]
```
