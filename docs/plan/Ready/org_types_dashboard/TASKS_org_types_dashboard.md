# TASKS: Organization Types — Client Dashboard

**Slug:** `org_types_dashboard`  
**Plan:** `PLAN_org_types_dashboard.md`

## Phase 1: Backend foundation

- [ ] Prisma `OrganizationType` + `Organization.type` + migration (default `REAL_ESTATE`)
- [ ] Seeds: at least one org per type
- [ ] APIs / session expose `type`; JWT optional per plan
- [ ] `pnpm turbo lint` / `pnpm turbo typecheck` (affected); tests updated if claims change
- [ ] `phase_logs/PHASE_LOG_phase_01.md` updated (errors, commands, fixes)

## Phase 2: Organization context & feature config

- [ ] `ORGANIZATION_FEATURES` + provider + `useOrganizationFeatures()`
- [ ] Unit tests for config resolution
- [ ] `phase_logs/PHASE_LOG_phase_02.md` updated

## Phase 3: Dynamic sidebar & layout

- [ ] Config-driven sidebar (desktop + mobile)
- [ ] Tests for `buildSidebarNav` (or equivalent)
- [ ] `phase_logs/PHASE_LOG_phase_03.md` updated

## Phase 4: Dashboard home adaptation

- [ ] KPI/chart order + empty states from config
- [ ] `phase_logs/PHASE_LOG_phase_04.md` updated

## Phase 5: Contextual modules

- [ ] Units/QR/contacts/maintenance UX per type
- [ ] `phase_logs/PHASE_LOG_phase_05.md` updated

## Phase 6: Settings integration

- [ ] Settings nav/tabs per type + permissions
- [ ] `phase_logs/PHASE_LOG_phase_06.md` updated

## Phase 7: Arabic i18n & RTL

- [ ] `en` + `ar-EG` parity for new keys; RTL fixes
- [ ] `phase_logs/PHASE_LOG_phase_07.md` updated

## Final

- [ ] All phases green; `pnpm preflight` where applicable
- [ ] `CONTEXT_org_types_dashboard.md` refreshed if schema/API changed
- [ ] `docs/plan/backlog/ALL_TASKS_BACKLOG.md` updated
