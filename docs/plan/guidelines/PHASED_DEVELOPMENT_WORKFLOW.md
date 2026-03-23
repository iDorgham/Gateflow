# GateFlow — Phased Development Workflow (v3.0)

**Purpose:** Comprehensive framework for phased development, featuring the **Ralph Loop** for self-correction, **Recursive Autopilot** (/dev ralph) for hands-off execution, and **Full-Cycle Automation** (Auto-Sync, PR Orchestration, Backlog Sync).

---

## 1. The Ralph Loop (Self-Correction)

Every phase execution follows the Ralph Loop to ensure zero-violation code:
1. **IMPLEMENT**: Write code following the phase prompt.
2. **ENFORCE**: Run `node scripts/enforce-ads-design.js` and `node scripts/enforce-security-invariants.js`.
3. **SELF-CORRECT**: If violations are found, refactor immediately. Repeat until GREEN.
4. **VERIFY**: Run `pnpm preflight` (lint, typecheck, test).

---

## 2. Recursive Autopilot (/dev ralph)

The `/dev ralph` command triggers a continuous execution loop:

### Execution Logic:
- **Phase 1..N**: Perform the **Ralph Loop** for the current phase.
- **Auto-Versioning**: On success, run `node scripts/ralph-git.js commit <slug> <N>` and `node scripts/ralph-git.js merge <slug> <N>`.
- **Recursion Check**:
  - Look for `PROMPT_<slug>_phase_<N+1>.md`.
  - **If found**: Log "Autopilot: Starting Phase N+1" and immediately proceed to implement it.
  - **If not found**: Check `PLAN_<slug>.md` for missing prompts. If all phases are done, tag the release and finalize.

### Hard Gates for Recursion:
- No recursion if `pnpm preflight` fails.
- No recursion if security enforcers are RED.
- No recursion if `organizationId` or `deletedAt` invariants are violated.

---

## 3. Usage Reference

| Command | Behavior |
|---------|----------|
| `/dev` | Implement next incomplete phase; stop for feedback. |
| `/dev ralph` | Implement next incomplete phase; **auto-start** next phase if prompts exist. |
| `/ship` | Execute entire plan end-to-end (similar to ralph, but for pre-existing plans). |

---

## 4. Exit Conditions (EC)

- **EC-Phase (Done)**: GREEN enforcers + GREEN tests + Merged to master.
- **EC-Plan (Final)**: All phases satisfied EC-Phase + Release tagged via `ralph-git.js tag`.
