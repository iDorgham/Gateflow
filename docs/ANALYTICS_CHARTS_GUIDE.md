# Analytics Charts Guide

GateFlow's analytics engine provides real-time visibility into physical access activity using **Recharts**. This guide documents the technical requirements, data structures, and API expectations for each chart.

---

## 🏗️ Common Architecture

All charts follow a standard "Connected Component" pattern:
1. **API Endpoint**: Fetches data scoped by `organizationId`.
2. **Filters**: Accepts `dateFrom`, `dateTo`, and optional `projectId`/`gateId`.
3. **Data Type**: Standardized interfaces defined in `lib/analytics/types.ts`.
4. **Visuals**: Consistent color palette from `lib/analytics/chart-colors.ts`.

---

## 📱 Client Dashboard Charts

### 1. Total Visits Over Time
- **Component**: `TotalVisitsChart.tsx`
- **Data Pattern**: Time-Series (Area Chart)
- **Required Data**:  
  `interface VisitsOverTimePoint { date: string; count: number; }`
- **Logic**: Aggregates all `ScanLog` entries by date for the selected period.

### 2. Scan Outcome Breakdown
- **Component**: `ScanOutcomeChart.tsx`
- **Data Pattern**: Categorical (Horizontal Bar Chart)
- **Required Data**:  
  `interface ScanOutcomeRow { status: string; count: number; }`
- **Status Types**: `SUCCESS`, `DENIED`, `FAILED`, `EXPIRED`, `MAX_USES_REACHED`.
- **Logic**: Counts scan attempts grouped by their final status code.

### 3. Top Gates by Traffic
- **Component**: `TopGatesChart.tsx`
- **Data Pattern**: Categorical (Horizontal Bar Chart)
- **Required Data**:  
  `interface TopGatesRow { gateId: string; gateName: string; count: number; }`
- **Logic**: Identifies the most active physical entrances/exits.

### 4. New vs. Returning Visitors
- **Component**: `NewVsReturningChart.tsx`
- **Data Pattern**: Stacked Time-Series (Area Chart)
- **Required Data**:  
  `interface NewVsReturningPoint { date: string; newCount: number; returningCount: number; }`
- **Logic**: Differentiates between first-time visitors and repeat entries based on contact identity.

### 5. Top Active Units
- **Component**: `TopUnitsChart.tsx`
- **Data Pattern**: Categorical (Horizontal Bar Chart)
- **Required Data**:  
  `interface TopUnitsRow { unitId: string; unitName: string; count: number; }`
- **Logic**: Ranks residential units by the number of visitor passes they generate.

---

## 🛡️ Admin Dashboard Charts

### 1. Organization Growth
- **Component**: `OrgGrowthChart.tsx`
- **Data Pattern**: Trend (Line Chart)
- **Required Data**:  
  `interface DataPoint { label: string; total: number; }`
- **Logic**: Accumulative count of organizations over time.

### 2. Global Scan Trends
- **Component**: `ScanTrendChart.tsx`
- **Data Pattern**: Trend (Area Chart)
- **Required Data**:  
  `interface DataPoint { label: string; count: number; }`
- **Logic**: Platform-wide scan activity monitoring.

### 3. Plan Distribution
- **Component**: `PlanDistributionChart.tsx`
- **Data Pattern**: Composition (Pie Chart)
- **Logic**: Breakdowns of Organizations by subscription tier (`FREE`, `PRO`, `ENTERPRISE`).

---

## 🎨 Theme & Styling

All charts use established design tokens for UI consistency:
- **Primary Color**: `CHART_PRIMARY` (Indigo/Blue #3b82f6)
- **Success Color**: `CHART_SUCCESS` (Emerald #10b981)
- **Failure Color**: `CHART_DESTRUCTIVE` (Rose #f43f5e)
- **Cartesian Grid**: Always set to `strokeDasharray="3 3"` with a muted border color.

---

## 🛠️ Implementation References

| Resource | Path |
|----------|------|
| **Shared Types** | `apps/client-dashboard/src/lib/analytics/types.ts` |
| **Color Tokens** | `apps/client-dashboard/src/lib/analytics/chart-colors.ts` |
| **Base Component** | `apps/client-dashboard/src/components/dashboard/analytics/AnalyticsChartCard.tsx` |
