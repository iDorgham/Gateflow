# PROMPT: gateflow_v9_autonomy Phase 4 (Orchestration & Autopilot)

## Request

Implement the **Autopilot** infrastructure and optimize **Multi-CLI** orchestration to allow the Ralph Loop to transition between phases seamlessly.

## Primary Role

ARCHITECTURE

## Preferred Tool

Cursor (Implementation), Multi-CLI (Verify limits & status)

## Steps

1. **Autopilot Logic**:
   - [x] Update `PLAN_gateflow_v9_autonomy.md` roadmap.
   - [ ] Modify `.antigravity/workflows/dev.md` Step 7 to include the **Autopilot Request** (offering to start the next phase).
2. **Status Reporting**:
   - [ ] Add `status` command to `scripts/ralph-git.js`.
   - `node scripts/ralph-git.js status <slug>` -> Reports current branch, last tag, and next suggested phase.
3. **Orchestration Tuning**:
   - [ ] Add an "Autopilot" section to `PHASED_DEVELOPMENT_WORKFLOW.md` (or similar) detailing the hands-off flow.
4. **Verification**:
   - Run the Ralph Loop enforcers.
   - Demonstrate the Autopilot transition by offering Phase 5.

## Acceptance Criteria

- [ ] `ralph-git.js status` works.
- [ ] `dev.md` includes autopilot hooks.
- [ ] Final walkthrough demonstrates the proactive phase transition.
