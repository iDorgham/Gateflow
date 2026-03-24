# SKILL: Atlassian Design System (ADS) Typography Scale

## Purpose
Define the typographic hierarchy and font standards for GateFlow v9.0, ensuring perfect legibility in both English and Arabic (MENA market).

## Core Principles
1.  **Standardized Scale**: Use ADS heading and body tokens exclusively.
2.  **MENA Localization**: Ensure Arabic font stacks (e.g., Cairo, IBM Plex Sans Arabic) align with English line-heights.
3.  **Readability**: Maintain generous line-heights (`1.5` for body, `1.2` for headings).

## Implementation Rules
- **Headings**:
  - `Large`: `font.heading.large` (24px/30px)
  - `Medium`: `font.heading.medium` (20px/24px)
  - `Small`: `font.heading.small` (16px/20px)
- **Body**:
  - `Default`: `font.body.medium` (14px/20px)
  - `Small`: `font.body.small` (12px/16px)
- **Font Stack**: Use `Inter` for English and `IBM Plex Sans Arabic` for Arabic.

## Anti-Patterns
- Using `font-size: 13px` or other off-scale values.
- Over-using `font-bold` for body text (use `medium` weights).
- Decreasing line-height to fit text in tight spaces (breaks RTL legibility).

## Code Examples

### CSS Typographic Class
```css
.h1 {
  font-size: var(--ds-font-heading-xlarge-size);
  line-height: var(--ds-font-heading-xlarge-lineHeight);
  font-weight: var(--ds-font-heading-xlarge-fontWeight);
}

.body-rtl {
  font-family: 'IBM Plex Sans Arabic', sans-serif;
  line-height: 1.6; /* Slight increase for Arabic characters */
}
```

### Component Implementation
```tsx
export const SectionHeader = ({ title, subtitle }) => (
  <header className="mb-200">
    <h2 className="text-large font-semibold text-accent">{title}</h2>
    {subtitle && <p className="text-small text-subtle">{subtitle}</p>}
  </header>
);
```
