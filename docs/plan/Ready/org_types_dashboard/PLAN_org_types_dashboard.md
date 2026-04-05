# PLAN: Organization Types — Client Dashboard Experience

**Slug:** `org_types_dashboard`  
**Status:** Planned — canonical layout: `TASKS_*.md`, `CONTEXT_*.md`, `context/`, `phase_logs/`, `phases/NN_*/PROMPT_phase_NN.md` (see `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`).  
**Primary app:** `apps/client-dashboard`  
**Supporting:** `packages/db`, `packages/types`, `packages/i18n`, seeds

---

## Summary — seven phases

| Phase | Title                                 | Primary role                                           | Outcome                                                                                                      |
| ----- | ------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| **1** | Backend foundation                    | **BACKEND** (+ **SECURITY** for auth/session surfaces) | `OrganizationType` in DB, migration, seeds, `type` on org in APIs and session/token claims where appropriate |
| **2** | Organization context & feature config | **FRONTEND** / **ARCHITECTURE**                        | Canonical `ORGANIZATION_FEATURES` module + `useOrganizationFeatures()` + provider wired from loaded org      |
| **3** | Dynamic sidebar & layout              | **FRONTEND**                                           | Sidebar/nav groups driven entirely by config for all five types                                              |
| **4** | Dashboard home adaptation             | **FRONTEND**                                           | Type-specific KPIs, chart priority, widgets, empty states (REAL_ESTATE first-class)                          |
| **5** | Contextual modules                    | **FRONTEND**                                           | Units/Students/Members/VIPs labeling & visibility; QR flows; Contacts/Guests; maintenance (REAL_ESTATE)      |
| **6** | Settings page integration             | **FRONTEND**                                           | Advanced Settings (v6) tabs/sections contextual per type                                                     |
| **7** | Arabic i18n & RTL                     | **FRONTEND** + **i18n**                                | All new copy in `en` + `ar-EG`, RTL verified per type                                                        |

---

## Product goal

Deliver a **single client-dashboard codebase** where **`Organization.type`** selects a **professional, MENA-aware experience** (terminology, navigation density, KPI emphasis, and module labels). **REAL_ESTATE** (gated compounds) is the reference quality bar.

**Supported types:** `REAL_ESTATE`, `SCHOOL`, `CLUB`, `NIGHTCLUB`, `EVENT_ORGANISER`.

---

## Context sources (loaded for planning)

| Document / area              | Path / note                                                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| PRD v7.0                     | `docs/archive/legacy/PRD.md` (canonical in repo; no `docs/PRD.md` at root)                                              |
| Settings v6 idea             | `docs/development/initiatives/IDEA_settings_v6.md`                                                                      |
| Analytics charts             | `docs/guides/ANALYTICS_CHARTS_GUIDE.md`                                                                                 |
| Advanced seeding idea        | `docs/development/initiatives/IDEA_advanced_seeding_v2.md`                                                              |
| i18n package                 | `packages/i18n/src/locales/en.json`, `ar-EG.json`                                                                       |
| Core rules                   | `.cursor/rules/00-gateflow-core.mdc`                                                                                    |
| Contracts                    | `.antigravity/contracts/CONTRACTS.md` (mirror: workspace may also reference `.cursor/contracts/CONTRACTS.md` if synced) |
| Current dashboard nav        | `apps/client-dashboard/src/components/dashboard/dashboard-layout.tsx` (static nav items today)                          |
| Current `Organization` model | `packages/db/prisma/schema.prisma` — **no `type` field yet**                                                            |

---

## Canonical config: `ORGANIZATION_FEATURES` (single source of truth)

**Implement as one typed module** exported for the client dashboard (and optionally re-exported from `@gate-access/types` if other apps need it later). Suggested path (decide in Phase 2, document in plan tasks): `packages/types/src/organization-features.ts` **or** `apps/client-dashboard/src/config/organization-features.ts` — preference: **`@gate-access/types`** if scanner/resident apps will read labels/flags later; otherwise keep in client-dashboard until needed.

### Prisma / TS enum (align names exactly)

```ts
// Values must match Prisma enum OrganizationType
type OrganizationType =
  | 'REAL_ESTATE'
  | 'SCHOOL'
  | 'CLUB'
  | 'NIGHTCLUB'
  | 'EVENT_ORGANISER';
```

### MENA-forward terminology (English keys; Arabic in Phase 7)

| Type                | Org label vibe             | “Units” concept                                                                                    | “Contacts” concept                 | Notes                                                                               |
| ------------------- | -------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------- |
| **REAL_ESTATE**     | Compound / gated community | Units & residents                                                                                  | Visitors & household contacts      | Maid/driver/nanny recurring passes, family access, maintenance, rush-hour analytics |
| **SCHOOL**          | School / campus            | Classes / student roster (map to **Units** model as “groups” or keep Units as “homerooms”)         | Students, staff, parents/guardians | Daily passes, attendance-oriented KPIs, safety incidents                            |
| **CLUB**            | Club / beach / sports      | Membership tiers / zones (use **Projects** or **Units** as facility zones per existing data model) | Members & guests                   | Day passes, capacity                                                                |
| **NIGHTCLUB**       | Venue / nightlife          | VIP tables / sections (map to **Projects** or **Units** as sections)                               | Guest list & VIPs                  | Fast entry, capacity, live analytics                                                |
| **EVENT_ORGANISER** | Event / venue operator     | Events → **Projects**                                                                              | Guests & vendors                   | Bulk lists, campaign attribution                                                    |

> **Implementation note:** The underlying Prisma models remain shared (`Unit`, `Contact`, `Project`, etc.). Organization type changes **labels, visibility, ordering, and which KPIs/charts surface** — not the schema per type (unless a later phase introduces optional columns; **out of scope** for this plan).

### Config shape (minimum fields)

Define a single `ORGANIZATION_FEATURES: Record<OrganizationType, OrganizationFeatures>` where `OrganizationFeatures` includes, at minimum:

- **`meta`:** `type`, optional `iconKey`, `defaultLocaleHints` (documentation only).
- **`terminology`:** i18n key prefixes or explicit keys for: organization noun, unit entity, contact entity, visitor, member, student, guest, VIP, staff, parent/guardian, project/event.
- **`sidebar`:** ordered list of **route capabilities** (e.g. `overview`, `projects`, `qr`, `units`, `contacts`, `analytics`, `maintenance`, `settings`, …) with `visible`, `order`, `badge`, and **group** (`main`, `platform`, `residents`, `access`, …).
- **`dashboard`:** ordered `kpiIds`, ordered `chartIds` (align with `ANALYTICS_CHARTS_GUIDE.md` components), `quickActions`, `emptyStateScenario` ids.
- **`qrFlows`:** which creation paths are emphasized (single, bulk, recurring, visitor, open QR) — flags only; no duplicate QR logic.
- **`settings`:** which Settings v6 tabs are visible/reordered; optional “advanced” sections.
- **`flags`:** booleans such as `maintenanceModule`, `rushHourAnalytics`, `vipListEmphasis`, `marketingAttribution`, `capacityWidgets`, `attendanceKpis`, `incidentEmphasis`, etc.

**REAL_ESTATE** must enable: maintenance, rush-hour / peak analytics, residential wording, family/recurring pass emphasis. **SCHOOL** emphasizes safety/incidents + attendance-friendly KPIs. **NIGHTCLUB** emphasizes capacity + guest list + real-time. **EVENT_ORGANISER** emphasizes projects-as-events + bulk guests + attribution. **CLUB** emphasizes membership + zones + day passes + capacity.

---

## Cross-phase acceptance criteria (refined)

Every phase must satisfy:

1. **Functional correctness** — All five types behave via config; REAL_ESTATE is polished; existing orgs default safely (**`REAL_ESTATE`** recommended default in migration).
2. **Code quality** — `pnpm turbo lint` and `pnpm turbo typecheck` pass for affected workspaces; prefer `pnpm preflight` before marking phase done when practical.
3. **Security & contracts** — All tenant queries: `organizationId` + `deletedAt: null` where applicable; Zod on API inputs; no secrets in client bundles; comply with `.antigravity/contracts/CONTRACTS.md`.
4. **Testing** — Automated tests updated/added where valuable; **manual verification**: REAL_ESTATE + **at least two** other types (e.g. SCHOOL + NIGHTCLUB).
5. **UX** — Consistent UI; logical defaults; empty states not broken for any type.
6. **Documentation** — Translation keys namespaced (e.g. `orgType.*`, `sidebar.*`, `dashboard.*`); short note in PR or `docs/` only if behavior/setup changes (keep minimal per user preference).

---

## Phase prompts (`phases/NN_<slug>/PROMPT_phase_NN.md`)

| Phase | Folder                            | Prompt               |
| ----- | --------------------------------- | -------------------- |
| 1     | `phases/01_backend_foundation/`   | `PROMPT_phase_01.md` |
| 2     | `phases/02_org_features_config/`  | `PROMPT_phase_02.md` |
| 3     | `phases/03_sidebar_layout/`       | `PROMPT_phase_03.md` |
| 4     | `phases/04_dashboard_home/`       | `PROMPT_phase_04.md` |
| 5     | `phases/05_contextual_modules/`   | `PROMPT_phase_05.md` |
| 6     | `phases/06_settings_integration/` | `PROMPT_phase_06.md` |
| 7     | `phases/07_arabic_i18n_rtl/`      | `PROMPT_phase_07.md` |

Supporting artifacts: `TASKS_org_types_dashboard.md`, `CONTEXT_org_types_dashboard.md`, `context/`, `phase_logs/`, `assets/` — see `docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`.

---

## Recommended execution order

Execute **1 → 7 sequentially**. Phases 3–6 can be parallelized in theory, but **2 must land before 3–6**, and **7 should follow** feature-complete English UI to avoid duplicate translation churn.

---

## Trade-offs & open questions

1. **JWT size vs. DB fetch:** Adding `orgType` to access-token claims avoids extra reads in RSC/layout; changing type requires refresh/re-login unless you add a lightweight `/api/org/profile` poll. **Recommendation:** include `orgType` in claims **and** return it from the existing session/me path; refresh tokens on org update if the product already does so for other org fields.
2. **SCHOOL “units”:** Today the schema uses `Unit` for residential units. For schools, UX may say “Classes” or “Homerooms” while still using `Unit`. **Prefer terminology + empty-state copy** over new tables in this plan.
3. **CLUB / NIGHTCLUB “zones”:** Map to **Projects** or **Units** with config-driven labels; avoid schema fork until a dedicated epic exists.
4. **Admin dashboard:** Out of scope unless needed to **set** organization type at provisioning; if only DB seed sets type, document for internal testers.
5. **Marketing suite / partial features:** Config should **hide or de-emphasize** incomplete modules per type rather than exposing broken links.

---

## After each phase

- Append or update **`phase_logs/PHASE_LOG_phase_NN.md`** (template: `docs/development/plan-templates/PHASE_LOG_template.md`).
- Tick **`TASKS_org_types_dashboard.md`** in the same pass as the phase commit.

## Confirmation

- **All five organization types** are fully supported via **`ORGANIZATION_FEATURES`** and **Phase 7** delivers **Arabic + RTL** for all new strings and layouts touched in Phases 3–6.
- This plan **respects multi-tenancy and soft-delete invariants** and treats **auth-first API design** as mandatory for any new or touched endpoints.

---

## Security & multi-tenancy statement

All work in this plan assumes **strict tenant scoping**, **soft deletes**, **signed QRs unchanged**, and **no token storage in `localStorage`**. Any API that returns or mutates organization type must **verify the user belongs to that `organizationId`** and **enforce RBAC** for sensitive settings.
