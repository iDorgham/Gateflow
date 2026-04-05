# MODULE MAP — Platform Evolution Admin Dashboard

**Visual map of all modules, their target audiences, and publishing targets.**

---

## Admin Dashboard Module Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                                  │
│              (GateFlow Internal Team Only)                          │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Phase 1: Org Hierarchy & Context Switcher                   │  │
│  │  • Multi-org nested routing: /organizations/[orgId]/...      │  │
│  │  • Premium OrgSwitcher (Cmd+K)                               │  │
│  │  • Middleware: auth + org scoping                            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────┐  ┌──────────────────────────────────┐ │
│  │  Phase 2: GateFlow CRM  │  │  Phase 3: Task Manager           │ │
│  │  ► GateFlow Sales team  │  │  ► GateFlow all depts            │ │
│  │  ► Leads from gateflow  │  │  ► Kanban + Calendar + AI Bots   │ │
│  │    .site visitors       │  │  ► Sales / Marketing / Dev /     │ │
│  │  ► AI Lead Scoring      │  │    Support task boards           │ │
│  │  ► HiTL email drafts    │  └──────────────────────────────────┘ │
│  └─────────────────────────┘                                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Phase 4: Style Hub & Live Theming                          │   │
│  │  ► GateFlow Dev/Design team                                 │   │
│  │  ► White-labeling: branding per client org                  │   │
│  │  ► PUBLISHES TO: apps/client-dashboard (per org CSS vars)   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────┐  ┌──────────────────────────────────┐ │
│  │  Phase 5: Landing Pages │  │  Phase 6: Blog CMS               │ │
│  │  ► GateFlow Marketing   │  │  ► GateFlow Content team         │ │
│  │  PUBLISHES TO:          │  │  PUBLISHES TO:                   │ │
│  │  gateflow.site/en/[slug]│  │  gateflow.site/en/blog/[slug]   │ │
│  │  gateflow.site/ar/[slug]│  │  gateflow.site/ar/blog/[slug]   │ │
│  └─────────────────────────┘  └──────────────────────────────────┘ │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Phase 7: Support Hub + Ops Dashboard + Resilience          │   │
│  │  ► GateFlow Support + Dev/Ops teams                         │   │
│  │  ► Ticket queue, AI triage, performance dials               │   │
│  │  ► Platform-wide Recharts analytics                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## External Systems & Targets

```
  Admin Dashboard CMS
       │
       ├──► www.gateflow.site/en/blog/[slug]     (BlogPost EN)
       ├──► www.gateflow.site/ar/blog/[slug]     (BlogPost AR)
       ├──► www.gateflow.site/en/[slug]          (LandingPage EN)
       └──► www.gateflow.site/ar/[slug]          (LandingPage AR)

  Admin Dashboard Style Hub
       │
       └──► apps/client-dashboard                (CSS token overrides per org)

  Admin Dashboard GateFlow CRM
       │
       └──► Internal DB (no public-facing routes)
            └── Leads sourced from gateflow.site contact/demo forms
```

---

## What Clients See vs What GateFlow Sees

```
CLIENT-FACING:
  gateflow.site            ← Marketing site (built by GateFlow Marketing via CMS)
  client-dashboard         ← Client's own dashboard (built by org_types_dashboard plan)
  scanner-app              ← Gate scanning app
  resident-mobile          ← Resident mobile app

GATEFLOW-INTERNAL:
  admin-dashboard          ← THIS PLAN — GateFlow team's internal OS
```
