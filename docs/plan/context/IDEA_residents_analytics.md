# IDEA: Residents & Analytics Hub

**Slug:** `residents_analytics`  
**Source:** RMS specs — Qwen_markdown_20260228_aba6wr6wl (Analytics), cml96jxxe (Contacts), trajyav6c (Units)  
**Status:** Active

---

## Goal

Unify three initiatives into one executable plan:

1. **Dual-Mode Analytics Dashboard** — Security view (operations, heatmap, operators) ↔ Marketing view (ROI, attribution, personas). Filter inheritance from Contacts/Units. KPIs, Recharts, Redis caching, WebSocket readiness.
2. **Contacts Page Enhancement** — Advanced filtering (date range, tags, unitType), table customization (reorder/hide columns, save views), Tag/ContactTag model, "View Units" row action, "Visualize Selection" → Analytics.
3. **Units Page Enhancement** — Terminology "Unit Name" → "Unit ID" in UI; date-range aggregates (visitsInRange, passesInRange, lastVisit, vacancy flag); table customization; "View Contacts" row action; inter-page URL sync (unitId, contactId).

---

## Constraints

- Next.js 14 App Router; Prisma; shadcn/ui; Tailwind; React Query; React Table (TanStack).
- Multi-tenancy (`organizationId`), soft deletes (`deletedAt: null`), RBAC.
- RTL/Arabic support for all new UI.
- Caching: follow CACHE_STRATEGY.md (Redis TTLs); document if created.

---

## Key Deliverables (Consolidated)

| Area | Deliverables |
|------|--------------|
| Schema | Tag, ContactTag; User.preferences (tableViews) |
| APIs | /api/contacts, /api/units extended (dateFrom, dateTo, tagIds, unitType, search, sort); aggregates visitsInRange, passesInRange; /api/tags CRUD |
| Analytics | Mode toggle, filter bar, KPI cards, heatmap, operator leaderboard; Apply to Contacts/Units; Marketing placeholders |
| Contacts | ResidentsFilterBar, React Table, tag column + bulk tag, table customizer, View Units modal |
| Units | Same filter bar; React Table; "Unit ID" label; visits/passes columns; table customizer; View Contacts modal; tag summary per unit |
| Inter-page | URL params unitId, contactId; filter sync between Contacts, Units, Analytics |

---

## References

- `docs/RMS/Qwen_markdown_20260228_aba6wr6wl.md` — Analytics Dashboard spec
- `docs/RMS/Qwen_markdown_20260228_cml96jxxe.md` — Contacts enhancement spec
- `docs/RMS/Qwen_markdown_20260228_trajyav6c.md` — Units enhancement spec
- `docs/plan/execution/PLAN_analytics_dashboard.md` — Existing analytics plan (partially implemented)
- `packages/db/prisma/schema.prisma` — Contact, Unit, ContactUnit, ScanLog, QRCode, VisitorQR
