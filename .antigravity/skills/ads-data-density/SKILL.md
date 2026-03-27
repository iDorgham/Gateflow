---
name: gf-ads-data-density
description: Patterns for high-density enterprise UI, focusing on tables, charts, and dashboards in GateFlow.
---

# ADS Data Density & Dashboarding

## Purpose
GateFlow handles thousands of scans and incidents. This skill provides the layout logic for presenting large datasets clearly without overwhelming the user, maintaining the Atlassian "High Density" standard.

## Core Principles
1. **Information Hierarchy**: Primary data (Scan Status) must be visible at a glance; secondary data (metadata) should be deferred or in drawers.
2. **Compact but Readable**: Use reduced padding (`space-050` or `space-100`) in tables while maintaining line-height.
3. **Visual Cues**: Use high-contrast status badges (ADS lozenges) to guide the eye to anomalies.

## Implementation Rules
- **Tables**: Use `DynamicTable` (Skill 4) with `density="compact"`.
- **Charts**: Recharts must be responsive and follow the layout constraints of the `DashboardGrid`.
- **Filtering**: Always place "Sticky" filters at the top using ADS `TableControls`.
- **Pagination**: Server-side only (Skill 13) to prevent DOM bloat.

## Anti-Patterns
- Large, airy layouts in data-heavy views like `GlobalScansTable`.
- Infinite scroll for scan logs (causes performance degradation).
- Hiding critical columns (e.g., Status) to save space.

## Code Example
```tsx
// High-density table cell pattern
const ScanStatusCell = ({ status }: { status: string }) => (
  <Badge 
    appearance={status === "GRANTED" ? "success" : "danger"} 
    isBold 
    className="py-0 px-1 text-[10px]" // Compact density override
  >
    {status}
  </Badge>
);

// Dashboard Grid Layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-200">
  <StatCard label="Total Scans" value="12.4k" trend="+5%" />
  {/* ... more cards */}
</div>
```
