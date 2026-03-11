# Phase 9: Danger Zone & Final Verification

## Primary role
QA

## Preferred tool
- [x] Multi-CLI (Claude + OpenCode) — high-risk/complexity

## Context
- **Project**: GateFlow
- **Apps**: client-dashboard
- **Rules**: 30-second cooldown on destructive buttons; irreversible actions.
- **Refs**: `docs/archive/plan-legacy/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` Section: Exit Conditions.

## Goal
Implement high-risk actions in the Danger Zone and conduct final E2E verification of the settings suite.

## Scope (in)
- Data export request flow (Full Workspace Export).
- Bulk deletion of historical scan/incident data.
- Workspace deletion flow with 2FA and multi-step confirmation.
- 30-second logic-based cooldown timers for all danger buttons.
- Final E2E test suite for all 11 settings tabs.

## Scope (out)
- Production-environment deletion (verification only in staging/local).

## Steps (ordered)
1. Implement the Danger Zone tab with card-based high-risk actions.
2. Build the bulk deletion forms with confirmation modals.
3. Implement the Workspace Deletion flow (requires organization name re-entry + 2FA check).
4. Apply the `CooldownButton` pattern for all destructive actions.
5. Write and run Playwright E2E tests covering: Layout, Role editing, Quota updates, and Danger Zone confirmations.
6. Ensure all actions are logged in the organization's audit trail.
7. Run `pnpm turbo build` for the complete monorepo.
8. After verification: `/github` — commit as `feat(settings): danger zone and final verification pass (phase 9)`.

## Subagents
**Subagent (browser-use):**
"Login at localhost:3001, navigate to the Danger Zone, initiate a bulk deletion request, verify that the cooldown timer works and that the deletion requires a multi-step confirmation."

**Subagent (shell):**
"Run pnpm turbo build from the root and verify that all workspaces build successfully after the settings refactor."

## Acceptance criteria
- [ ] High-risk actions correctly trigger multi-step confirmation.
- [ ] Cooldown timers prevent accidental clicks.
- [ ] All settings changes are verified via E2E tests.
- [ ] Full monorepo build succeeds.
- [ ] All organization data cleanup logic is confirmed.
