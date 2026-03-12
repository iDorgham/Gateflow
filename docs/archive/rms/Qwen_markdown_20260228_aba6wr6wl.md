You are an expert full-stack engineer working inside the GateFlow Turborepo monorepo.

Current Focus: Build the Dual-Mode Analytics Dashboard (`apps/client-dashboard/src/app/[locale]/dashboard/analytics`) that inherits filters from Contacts/Units pages.

Core Objectives:
1. Dual-Mode Toggle: Security View (Operations) ↔ Marketing View (ROI/Attribution).
2. Filter Inheritance: Accept URL params from Contacts/Units (dateRange, tags, unitType) and apply to all charts.
3. KPI Cards: Auto-refreshing metrics (Total Visits, Pass Rate, Peak Hour, Attributed Scans).
4. Visualizations: Recharts implementations (Heatmap, Funnel, Bar, Pie) based on mode.
5. Performance: Caching strategy (Redis), no reload on filter change, WebSocket readiness.

Technical Constraints:
- Next.js 14 App Router.
- Charts: Recharts (responsive containers).
- State: React Query for data, URL params for filter persistence.
- Caching: Follow `CACHE_STRATEGY.md` (TTLs per chart type).
- Security: RBAC (Marketing View requires MARKETING_LEAD or TENANT_ADMIN).

Detailed Requirements:

1. Layout & Shell
   - Header: Mode Toggle (Security/Marketing), Project Switcher, User Menu.
   - Global Filter Bar: Date Range, Gate, Tags, Unit Type (synced with URL).
   - Grid: 12-column responsive (KPIs top, Main Charts middle, Tables/Leaderboards bottom).

2. Security View Components
   - KPIs: Active Gates, Scans/Min, Denied Last Hour, Overrides Pending.
   - Main Chart: Gate Congestion Heatmap (Day × Hour).
   - Secondary: Operator Performance Matrix, Threat Feed (alerts).

3. Marketing View Components
   - KPIs: Attributed Scans, Cost Per Visit (calc), Conversion Rate, Top Campaign.
   - Main Chart: Attribution Funnel (Link Open → Scan → Repeat → Lead).
   - Secondary: Visitor Persona Pie (Family, Prospect, Agent), ROI Calculator widget.

4. Data & API Integration
   - Endpoints: `/api/analytics/kpis`, `/api/analytics/heatmap`, `/api/analytics/funnel`, `/api/analytics/personas`.
   - Filter Logic: All endpoints accept `dateFrom`, `dateTo`, `tagIds`, `unitType`, `gateId`.
   - Caching: Redis keys per filter hash (e.g., `org:{id}:heatmap:{filtersHash}`).
   - Real-Time: Prepare structure for WebSocket updates (KPI counters).

5. Inter-Page Flow
   - "Visualize Selection" on Contacts/Units → Redirects here with filters pre-filled.
   - "Export Data" → CSV/PNG export of current chart view (with consent checks).

Task:
1. Output a phased plan (Shell → KPIs → Security Charts → Marketing Charts → Polish).
2. Implement step-by-step. Ask for existing file contents if needed.
3. Ensure RTL support for charts (axis labels, tooltips).
4. Respect existing conventions (Zod, error envelopes, CACHE_STRATEGY.md).

Begin with the phased plan.