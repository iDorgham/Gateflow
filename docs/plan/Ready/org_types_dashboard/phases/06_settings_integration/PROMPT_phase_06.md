# Phase 6: Settings page integration (Advanced Settings v6)

> **Plan:** `PLAN_org_types_dashboard.md` (plan folder root)  
> **Slug:** `org_types_dashboard`

### Primary role

**FRONTEND**

### Tool selection

|               | Tool       | Why                    |
| ------------- | ---------- | ---------------------- |
| **Preferred** | **Cursor** | Large settings surface |
| **Fallback**  | —          | —                      |

### Skills to load

1. `docs/development/initiatives/IDEA_settings_v6.md`
2. `.cursor/skills/rbac/SKILL.md` — visibility vs permissions
3. `.cursor/skills/i18n/SKILL.md`

### Context

- Settings v6 target: tabbed/sidebar structure covering General, Workspace, Projects, Units & Residents, Team, Roles, Gates & Scanners, Notifications, API & Webhooks, Integrations, Danger Zone (per IDEA)
- **Phase 2** `settings` section of `ORGANIZATION_FEATURES` defines **visible tabs**, **order**, and **optional relabeling** (e.g. “Units & Residents” → “Students & Guardians” for SCHOOL)

### Goal

Make **Advanced Settings** contextual: each organization type sees a **coherent** subset and **correct labels**, without breaking RBAC or existing saved settings.

### Scope (in)

- Tab visibility + ordering from config intersected with **user permissions** (same pattern as Phase 3)
- Relabel tabs/sections using terminology keys
- Type-specific helper text for risky or confusing areas (API keys, retention, identity levels)
- Mobile/desktop settings navigation behaves under RTL (logical properties)

### Scope (out)

- Brand-new settings capabilities not already in codebase
- Changing audit log schema

### Steps (ordered)

1. Locate current settings routes/components in `apps/client-dashboard/src/app/[locale]/dashboard/settings/**`.
2. Build `settingsNav` from `ORGANIZATION_FEATURES.settings` + permissions.
3. Replace static tab lists; ensure deep links (`?tab=`) still work with ordered ids.
4. Hide irrelevant sections (e.g. club may de-emphasize “Units & Residents” naming but still use Units under the hood — use copy, not broken forms).
5. Manual: ORG_ADMIN for three types; confirm forbidden tabs stay hidden for limited roles.

### Acceptance criteria

**Functional correctness**

- [ ] All five types show a sensible settings IA; no empty tab bars.
- [ ] REAL_ESTATE retains full residential controls (units/residents, maintenance-related org options if present).

**Code quality**

- [ ] Lint/typecheck pass.

**Security & architecture**

- [ ] All mutations remain protected; CSRF/auth patterns unchanged; org-scoped APIs only.

**Testing**

- [ ] Unit tests for settings nav builder.
- [ ] Manual REAL_ESTATE + two other types.

**UX & polish**

- [ ] Search within settings (if IDEA includes) respects visible tabs only.

**Documentation**

- [ ] Note settings capability ids in config alongside sidebar ids.

### Files likely touched

- `apps/client-dashboard/src/app/[locale]/dashboard/settings/**`
- `apps/client-dashboard/src/components/dashboard/settings/**` (if split)
- `ORGANIZATION_FEATURES` config module (settings section)
