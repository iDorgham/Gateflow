# Planning Log — Platform Evolution

**Purpose:** Record key architectural decisions and scope clarifications made during planning. Append new entries at the top.

---

## 2026-04-05 — Architecture Clarification Session

**Attendees:** Product Owner + AI Strategist  
**Status:** Planning

### Decisions Made

#### D-001: Admin Dashboard is GateFlow-internal only

- The Admin Dashboard is a **pure internal OS for the GateFlow company team**.
- Clients (compound managers, school admins, etc.) do **not** have access to Admin Dashboard tools.
- Client-facing tools are in `apps/client-dashboard`.

#### D-002: Blog and Landing Pages use Headless CMS architecture

- Admin Dashboard is the **authoring back-office**.
- `apps/marketing` is the **rendering front-end** consumer.
- Blog posts publish to: `www.gateflow.site/en/blog/[slug]` and `www.gateflow.site/ar/blog/[slug]`.
- Landing pages publish to: `www.gateflow.site/en/[slug]` and `www.gateflow.site/ar/[slug]`.
- ISR (Incremental Static Regeneration) revalidation required on publish.
- **Reference doc:** `context/HEADLESS_CMS_ARCHITECTURE.md`.

#### D-003: Two distinct CRM systems

1. **GateFlow Lead CRM** (Admin Dashboard, Phase 2): GateFlow's own sales pipeline tracking companies wanting to buy GateFlow.
2. **Client CRM** (Client Dashboard, future phase): Each client tracks their own org-specific contacts (tenants, members, students, etc.).

- The Client CRM is **not in scope for this plan**. It belongs to `org_types_dashboard` Phase 5+.
- **Reference doc:** `context/CRM_SCOPE.md`.

#### D-004: Task Manager is GateFlow-internal only

- The Task Manager (Phase 3) is for GateFlow's own team departments: Sales, Marketing, Dev, Support.
- Clients do not have task management tools via the admin dashboard.

#### D-005: Style Hub targets client-dashboard

- The Live Theming Hub (Phase 4) controls branding per client org.
- Changes made by GateFlow's team propagate to `apps/client-dashboard` via CSS token overrides.

### Risks Identified

| Risk                                                                            | Severity | Mitigation                                                    |
| :------------------------------------------------------------------------------ | :------- | :------------------------------------------------------------ |
| `org_types_dashboard` P1 and `platform_evolution` P1 both touch `schema.prisma` | HIGH     | Sequential execution — org_types P1 must push migration first |
| Phase 5-6 require `apps/marketing` changes                                      | MEDIUM   | Add marketing app to pre-flight checks for these phases       |
| Client CRM scope creep into Admin CRM                                           | LOW      | CRM_SCOPE.md boundary doc; enforce during code review         |

### Approved Feature Suggestions (added to backlog)

- **Feature Flags UI** — Dev team controls module rollout per org
- **Audit Trail Viewer** — View `AiActionLog` entries with search/filter
- **Org Health Score** — Customer Success monitors client activity

---

## Template for Future Entries

```
## YYYY-MM-DD — [Session Title]

**Attendees:** ...
**Status:** Planning | In Progress | Done

### Decisions Made

#### D-XXX: [Decision title]
- Context: ...
- Decision: ...
- Rationale: ...

### Risks Identified
...
```
