# IDEA_analytics_dashboard — Analytics Dashboard (Dual-Mode)

**Status:** Ready for planning  
**Created from:** User-provided Analytics Dashboard specification

---

## Vision

One central place where property managers, security heads, marketing leads and admins understand **what is really happening** in the compound — actionable insight with context, trends, anomalies and ROI signals.

## Key Principles

- Persona-driven default views (Security vs Marketing) — same data, different lenses
- Filter once, visualize anywhere — filters from Contacts/Units pages flow into dashboard
- No page reloads — instant chart updates on filter change
- Progressive disclosure — start simple (KPIs + 2–3 charts), expand to full dashboard builder later
- Mobile-first — works well on phones/tablets
- RTL + Arabic-ready from day one

## Technical Foundation

- Dual-mode toggle (Security ↔ Marketing)
- Contacts + Units pages as data foundation (with filtering, tagging when available)
- UTM persistence & attribution pipeline (schema extension if needed)
- Consent management (per PRD)
- Recharts visualizations
- Performance & caching strategy (Redis when available)

## Phases (High-Level)

1. **Core Dashboard Shell** — Layout, mode toggle, filter bar, KPI row, chart placeholders, filter inheritance
2. **Security View Depth** — Full heatmap, threat/anomaly cards, operator leaderboard, short-polling KPIs
3. **Marketing View Depth** — Attribution funnel, campaign bar, persona/tag pie, ROI widget, audience export
4. **Polish & Real-time** — WebSocket, export/share, mobile optimizations, caching tuning

## Plan

See `docs/plan/execution/PLAN_analytics_dashboard.md`.
