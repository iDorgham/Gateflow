# SKILL: Atlassian Design System (ADS) Dynamic Tables

## Purpose
Standardize high-density, high-performance data table implementation for GateFlow dashboards, strictly following ADS patterns.

## Core Principles
1.  **High Density**: Prioritize information density while maintaining legibility (use `dense` mode for large datasets).
2.  **Server-Side First**: Tables must support server-side pagination, sorting, and filtering.
3.  **Predictable States**: Define Loading, Empty, and Error states clearly.

## Implementation Rules
- **Columns**:
  - Sticky first column for IDs/Names.
  - Alignment: Numbers (right), Status (center), Text (left).
- **Interactions**:
  - Row Hover: Use `color.background.neutral-subtle-hovered`.
  - Selection: Use `color.background.selected`.
- **Formatting**:
  - Dates: Relative (`2h ago`) or Standard MENA (`DD/MM/YYYY`).
  - Status: Use ADS Lozenges (Success, Danger, Warning).

## Anti-Patterns
- Client-side sorting on datasets > 50 rows.
- Horizontal scrolling without sticky columns.
- Using raw table borders instead of ADS `color.border.neutral-subtle`.

## Code Examples

### ADS Table Structure (Tailwind)
```tsx
<table className="w-full border-collapse">
  <thead className="bg-sunken border-b border-subtle">
    <tr>
      <th className="px-200 py-150 text-left text-small font-semibold">Mission Code</th>
      <th className="px-200 py-150 text-left text-small font-semibold">Priority</th>
      <th className="px-200 py-150 text-right text-small font-semibold">Last Contact</th>
    </tr>
  </thead>
  <tbody>
    <tr className="hover:bg-neutral-hovered transition-colors">
      <td className="px-200 py-150 border-b border-subtle">G-4458</td>
      <td className="px-200 py-150 border-b border-subtle"><Lozenge variant="danger">Critical</Lozenge></td>
      <td className="px-200 py-150 border-b border-subtle text-right">14:02 Egypt</td>
    </tr>
  </tbody>
</table>
```
