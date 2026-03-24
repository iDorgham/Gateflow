# SKILL: Atlassian Design System (ADS) Tagging & Lozenges

## Purpose
Codify the implementation of "Lozenges" and "Tags" as defined by ADS for status representation and entity categorization in GateFlow v9.0.

## Core Principles
1.  **Status vs. Category**: Use *Lozenges* for statuses (immutable states like "Paid", "Critical") and *Tags* for user-defined categories.
2.  **Color Semantics**: Color choice must match status urgency (Success = Green, Danger = Red).
3.  **Conciseness**: Keep labels short; truncate long tags with tooltips.

## Implementation Rules
- **Lozenges types**:
  - `bold`: For primary status awareness.
  - `subtle`: For secondary/inline status (default).
- **Tag styles**:
  - Always includes X for removal if editable.
  - Pair with specific brand colors for Mission Folders.

## Anti-Patterns
- Using primary buttons as tags.
- Creating rainbow-colored Lozenges without semantic meaning.
- Excessive Lozenge usage (max 1-2 per list item row).

## Code Examples

### Styled Lozenge (CSS/React)
```tsx
const Lozenge = ({ children, variant = "default", isBold = false }) => {
  const base = "px-100 py-050 rounded-small font-semibold text-xtiny uppercase tracking-wider";
  const styles = {
    default: isBold ? "bg-neutral-bold text-inverse" : "bg-neutral text-default",
    success: isBold ? "bg-success-bold text-inverse" : "bg-success text-success",
    danger: isBold ? "bg-danger-bold text-inverse" : "bg-danger text-danger",
  };

  return <span className={cn(base, styles[variant])}>{children}</span>;
}
```

### Dynamic Asset Tags
```tsx
<div className="flex gap-050 flex-wrap">
  <div className="bg-accent-subtle border border-accent rounded-full px-150 py-050 text-tiny flex items-center gap-050">
    <span>Shift Briefing</span>
    <button className="hover:text-danger"><X size={12} /></button>
  </div>
</div>
```
