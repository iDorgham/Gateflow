# Planning Log — Platform Evolution

**Purpose:** Record key architectural decisions and scope clarifications made during planning. Append new entries at the top.

---

## 2026-04-05 — Phase 3, 4, 7 Rewrite (Quality Parity)

**Attendees:** Product Owner + AI Strategist  
**Status:** Planning — phases raised to 9/10 quality

### Trigger

Readiness audit scored Phases 3, 4, 7 at 4-5/10 versus Phases 1, 2, 5, 6 at 9/10. Three weak prompts were rewritten from scratch.

### Phase 3 (Task Manager) — Changes

| Before                      | After                                                                                  |
| :-------------------------- | :------------------------------------------------------------------------------------- |
| No RBAC                     | Full 6-role department-scoped RBAC table                                               |
| "AiTaskBot" in one sentence | Full `TaskBotRule` schema with conditions JSON, action templates, `autoExecute` toggle |
| Hardcoded `#3b82f6`         | Removed — ADS tokens only                                                              |
| No HiTL for bots            | Bot tasks require approval unless `autoExecute` explicitly enabled                     |
| No rate limiting            | Max 10 bot tasks/rule/hour; auto-disable on exceed                                     |
| No notifications            | In-app notification bell with 4 trigger types                                          |
| No MENA calendar            | Friday-Saturday weekend, Hijri calendar option                                         |
| No CRM cross-linking spec   | Polymorphic `linkedType`/`linkedId` FK design                                          |

### Phase 4 (Style Hub) — Changes

| Before                                  | After                                                        |
| :-------------------------------------- | :----------------------------------------------------------- |
| No `@gateflow/tokens` reference         | Full whitelist of overridable tokens from `@gateflow/tokens` |
| "Iframe preview" unspecified            | PostMessage protocol with origin validation                  |
| "Glassmorphism" as acceptance criterion | Replaced with measurable WCAG contrast checks                |
| No asset storage                        | Vercel Blob Storage with 2MB limit                           |
| No rollback                             | `BrandingSnapshot` table with one-click restore              |
| No RBAC                                 | `DEV_ADMIN` / `SUPER_ADMIN` only                             |
| No WCAG spec                            | WCAG 2.1 AA (4.5:1) — block save on violation                |

### Phase 7 (Ops Hub) — Changes

| Before                          | After                                                               |
| :------------------------------ | :------------------------------------------------------------------ |
| 3 unrelated systems in 53 lines | 4 discrete sub-modules (A-D) in 200+ lines                          |
| No support schema               | Full `SupportTicket` + `SupportMessage` Prisma models               |
| No audit trail viewer           | Searchable UI with filters, detail panel, CSV/XLSX export           |
| No AI cost tracking             | `AiUsageLog` table + interceptor + department breakdown chart       |
| No notification for escalation  | Escalation creates linked Task + in-app notification                |
| No rate limiting spec           | Per-route-group sliders with Edge middleware via @upstash/ratelimit |

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
