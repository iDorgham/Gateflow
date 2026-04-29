# TASKS: Organization Types — Client Dashboard

**Slug:** `org_types_dashboard`  
**Plan:** `PLAN_org_types_dashboard.md`

## Phase 1: Backend foundation

- [x] Prisma `OrganizationType` + `Organization.type` + migration (default `REAL_ESTATE`)
- [x] Seeds: at least one org per type
- [x] APIs / session expose `type`; JWT optional per plan
- [x] `pnpm turbo lint` / `pnpm turbo typecheck` (affected); tests updated if claims change
- [x] `phase_logs/PHASE_LOG_phase_01.md` updated (errors, commands, fixes)

## Phase 2: Organization context & feature config

- [x] `ORGANIZATION_FEATURES` + provider + `useOrganizationFeatures()`
- [x] Unit tests for config resolution
- [x] `phase_logs/PHASE_LOG_phase_02.md` updated

## Phase 3: Dynamic sidebar & layout

- [x] Config-driven sidebar (desktop + mobile)
- [x] Tests for `buildSidebarNav` (or equivalent)
- [x] `phase_logs/PHASE_LOG_phase_03.md` updated

## Phase 4: Dashboard home adaptation

- [x] KPI/chart order + empty states from config
- [x] `phase_logs/PHASE_LOG_phase_04.md` updated

## Phase 5: Contextual modules

- [x] Units/QR/contacts/maintenance UX per type
- [x] `phase_logs/PHASE_LOG_phase_05.md` updated

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
