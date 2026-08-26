---
name: pdf-tables
description: Specialized workflows and patterns for pdf-tables.
---

# SKILL: High-Fidelity PDF Tables Export

## Purpose

Standardize the export of high-density data tables to PDF format, ensuring clarity, pagination, and multi-page header persistence in GateFlow v9.0.

## Core Principles

1.  **Row Integrity**: Content within a row must not be split across two pages.
2.  **Persistent Headers**: Table headers must repeat at the top of every new page.
3.  **Density Triage**: Automatically adjust font size (down to 8pt) to fit complex tables within the page width.

## Implementation Rules

- **Formatting**:
  - Zebra Striping: Use `var(--ds-background-sunken)` alternates for row legibility.
  - Borders: `0.5pt` solid `var(--ds-border-neutral)` for cleanliness.
- **Arabic Alignment**: Right-align all columns for RTL reports.
- **Pagination**: Use `break-inside: avoid` on table rows.

## Anti-Patterns

- Scaling the entire table to fit (renders text unreadable).
- Missing headers on subsequent pages.
- Large images inside table cells (breaks layout).

## Code Examples

### React-PDF Table Row

```tsx
const TableRow = ({ data }) => (
  <View style={styles.row} wrap={false}>
    <View style={styles.cell}>
      <Text>{data.id}</Text>
    </View>
    <View style={styles.cell}>
      <Text>{data.status}</Text>
    </View>
    <View style={styles.cell}>
      <Text>{data.timestamp}</Text>
    </View>
  </View>
);
```

### Table Header Repeat (CSS Strategy)

```css
thead {
  display: table-header-group;
}
tr {
  page-break-inside: avoid;
}
```
