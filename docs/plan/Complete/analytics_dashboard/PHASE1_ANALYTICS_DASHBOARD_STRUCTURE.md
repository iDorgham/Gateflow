# Phase 1 Analytics Dashboard — Component Tree & File Structure

**Plan:** `PLAN_analytics_dashboard`  
**Phase:** 1 — Core Dashboard Shell  
**Reference:** `PROMPT_analytics_dashboard_phase_1.md`

---

## 1. Directory & File Tree

```
apps/client-dashboard/src/
├── app/
│   └── [locale]/
│       └── dashboard/
│           ├── analytics/
│           │   ├── page.tsx                    # Refactored: server layout shell + client wrapper
│           │   ├── analytics-client.tsx        # NEW: Client root (layout, filters, charts)
│           │   ├── analytics-charts.tsx        # Existing; may receive filter props
│           │   └── print-button.tsx            # Existing
│           └── residents/
│               ├── contacts/
│               │   └── page.tsx                # ADD: "Open in Analytics" button
│               └── units/
│                   └── page.tsx                # ADD: "Open in Analytics" button
├── components/
│   └── dashboard/
│       └── analytics/
│           ├── AnalyticsFilterBar.tsx          # NEW
│           ├── AnalyticsModeToggle.tsx         # NEW
│           ├── AnalyticsKPICards.tsx           # NEW (wraps 4–6 KPI cards)
│           ├── AnalyticsKPICard.tsx            # NEW (single card with value, trend, sparkline)
│           ├── AnalyticsChartPlaceholder.tsx   # NEW (heatmap/funnel placeholder)
│           ├── AnalyticsApplyFiltersButton.tsx # NEW ("Apply to Contacts/Units")
│           └── index.ts                        # Barrel exports
├── lib/
│   └── analytics/
│       ├── use-analytics-filters.ts            # NEW: URL sync hook
│       ├── analytics-filters.ts                # NEW: types, defaults, URL parser
│       └── index.ts                            # Barrel
└── messages/
    └── (dashboard.json or equivalent)          # ADD: analytics mode, filter, KPI, button i18n keys
```

---

## 2. Component Hierarchy (Visual)

```
AnalyticsPage (page.tsx)
├── Server: fetch initial data (optional for Phase 1)
└── AnalyticsClient (client root)
    ├── HeaderRow
    │   ├── ProjectSwitcher (existing from layout)
    │   ├── AnalyticsModeToggle
    │   └── UserMenu (from shell)
    ├── AnalyticsFilterBar
    │   ├── DateRangePicker (7d | 30d | custom)
    │   ├── ProjectSelect
    │   ├── GateSelect (optional)
    │   ├── UnitTypeSelect
    │   ├── SearchInput (optional)
    │   └── TagsSelect (stubbed/hidden)
    ├── AnalyticsKPICards
    │   ├── AnalyticsKPICard (Total Visits)
    │   ├── AnalyticsKPICard (Pass Rate)
    │   ├── AnalyticsKPICard (Peak Hour)
    │   ├── AnalyticsKPICard (Unique Visitors)
    │   ├── AnalyticsKPICard (Denied Scans)
    │   └── AnalyticsKPICard (Attributed Scans)
    ├── MainChartsRow (12-col grid, 60/40 split)
    │   ├── PrimaryChart (left 60%)
    │   │   └── AnalyticsChartPlaceholder
    │   │       └── mode=Security ? "Heatmap placeholder" : "Funnel placeholder"
    │   └── SecondaryChart (right 40%)
    │       └── AnalyticsChartPlaceholder (smaller)
    ├── BottomPanels (collapsible)
    │   ├── TopUnitsPanel (placeholder)
    │   ├── TopTagsPanel (placeholder)
    │   └── OperatorsPanel (placeholder)
    └── AnalyticsApplyFiltersButton
        └── Links to Contacts | Units with current filters
```

---

## 3. Data Flow

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│ URL searchParams │────▶│ useAnalyticsFilters() │────▶│ Filter state +  │
│ (dateFrom, etc.) │     │ - read on mount       │     │ setSearchParams │
└─────────────────┘     │ - write on change     │     └────────┬────────┘
        ▲                └──────────────────────┘              │
        │                              │                        │
        │                              ▼                        ▼
        │                ┌──────────────────────┐     ┌─────────────────┐
        │                │ AnalyticsFilterBar    │     │ KPICards,       │
        │                │ (user changes)       │     │ ChartPlaceholder │
        └────────────────│ → updates URL         │     │ (consume filters)│
                         └──────────────────────┘     └─────────────────┘

Contacts/Units page:
  "Open in Analytics" ──▶ builds URL with current filters ──▶ navigate to /analytics?...

Dashboard:
  "Apply to Contacts" ──▶ reads filters from URL ──▶ navigate to /contacts?...
  "Apply to Units"    ──▶ reads filters from URL ──▶ navigate to /units?...
```

---

## 4. Key Types & Hooks

### AnalyticsFilters (lib/analytics/analytics-filters.ts)

```ts
export interface AnalyticsFilters {
  dateFrom: string; // ISO date
  dateTo: string; // ISO date
  range?: '7d' | '30d' | 'custom';
  projectId?: string;
  gateId?: string;
  unitType?: string; // UnitType enum
  tagIds?: string[]; // stub
  search?: string;
  mode: 'security' | 'marketing';
}
```

### useAnalyticsFilters()

- Input: `locale`, router
- Reads: `searchParams` via `useSearchParams()`
- Writes: `router.push` / `replace` with new params
- Returns: `{ filters, setFilters, updateFilter }`

---

## 5. URL Param Mapping

| Param       | Type   | Default    | Example                 |
| ----------- | ------ | ---------- | ----------------------- |
| `range`     | string | `7d`       | `7d`, `30d`, `custom`   |
| `from`      | string | —          | `2025-02-01`            |
| `to`        | string | —          | `2025-02-28`            |
| `projectId` | string | —          | `cuid`                  |
| `gateId`    | string | —          | `cuid`                  |
| `unitType`  | string | —          | `STUDIO`, `ONE_BR`, …   |
| `search`    | string | —          | free text               |
| `mode`      | string | `security` | `security`, `marketing` |

---

## 6. Contacts/Units Integration

**Contacts page** (`residents/contacts/page.tsx`):

- Existing filters: `page`, `pageSize`, `search`, `unitType`, `dateFrom`, `dateTo` (if present)
- Add button: "Open in Analytics Dashboard"
- On click: `router.push(`/${locale}/dashboard/analytics?${buildAnalyticsParams(currentFilters)}`)`

**Units page** (`residents/units/page.tsx`):

- Same pattern; ensure param keys match `AnalyticsFilters`

**Shared helper** (optional):

- `lib/analytics/build-analytics-url.ts`: `buildAnalyticsUrl(locale, filters)`, `buildContactsUrl(locale, filters)`, `buildUnitsUrl(locale, filters)`

---

## 7. Layout Grid (Tailwind)

```
Desktop (≥1024px):
  - Container: grid grid-cols-12 gap-4
  - Filter bar: col-span-12
  - KPI row: col-span-12, flex gap-4 overflow-x-auto
  - Main left: col-span-7 (60%)
  - Main right: col-span-5 (40%)
  - Bottom: col-span-12, grid grid-cols-3 gap-4

Mobile (<1024px):
  - Stack: flex flex-col gap-4
  - Filter bar: collapsible (accordion or Sheet)
  - KPI: overflow-x-auto flex gap-3 (horizontal scroll)
  - Charts: w-full stacked
```

---

## 8. Dependencies

- **Existing:** `@gate-access/ui` (Card, Button, Select, Input), `next/navigation` (useSearchParams, useRouter), `@/lib/i18n`
- **New:** None required; Recharts already in analytics-charts for Phase 2
- **Optional:** `use-debounce` if filter updates need debouncing to avoid URL thrash
