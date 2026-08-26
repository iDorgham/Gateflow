---
name: property-domain
description: Specialized workflows and patterns for property-domain.
---

# SKILL: Real Estate & Property Domain Knowledge (MENA)

## Purpose

Codify the domain-specific logic, KPIs, and terminology used in the MENA real estate market to ensure GateFlow v9.0 aligns with industry standards.

## Core Principles

1.  **KPI Mastery**: Focus on metrics that matter to property managers: Uptime, Throughput, Guest Satisfaction, and Security Integrity.
2.  **Regional Terminology**: Use terms like "Compound", "Villa No.", "Gatehouse", and "Shift Relief" correctly in the UI.
3.  **Compliance Understanding**: High-level awareness of local community association rules and security mandates.

## Implementation Rules

- **Data Formatting**:
  - Currency: EGP, SAR, AED.
  - Measurement: Square Meters (m²).
- **Visualization**:
  - Heatmaps for gate traffic.
  - Peak-hour distribution charts for security planning.

## Anti-Patterns

- Using generic "Company/Employee" terms instead of "Property/Resident" context.
- Confusing "Tenant" (renter) with "Owner" (member) in the permission model.
- Over-complicating unit addresses (use a simple `Building-Unit` format common in the region).

## Code Examples

### Domain-Specific KPI Component

```tsx
export const SecurityKPI = ({ value, trend }) => (
  <div className="p-200 bg-neutral rounded-medium">
    <h4 className="text-xtiny uppercase text-subtle">
      Security Integrity Score
    </h4>
    <div className="flex items-baseline gap-100">
      <span className="text-xlarge font-bold">{value}%</span>
      <span
        className={cn('text-tiny', trend > 0 ? 'text-success' : 'text-danger')}
      >
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
      </span>
    </div>
  </div>
);
```

### Regional Address Formatter

```typescript
export const formatUnit = (building: string, unit: string) => {
  return `Bldg ${building} - Unit ${unit}`;
};
```
