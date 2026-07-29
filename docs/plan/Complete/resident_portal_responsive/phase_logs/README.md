# Phase logs — `resident_portal_responsive`

After **each** phase completes (or if it fails mid-flight), write or append **`PHASE_LOG_phase_NN.md`** (two-digit phase).

## What to capture

- Failing commands (exact stderr) and the fix
- Flaky tests / ordering issues
- Security or tenancy edge cases discovered
- Decisions that differ from the phase prompt (and why)
- Files that were surprisingly coupled

## Purpose

Reduce repeated mistakes on the **next** phase or the **next** plan. For repo-wide patterns, also add a short note under `docs/development/learning/`.

## Files

| Phase | Log file                |
| ----- | ----------------------- |
| 1     | `PHASE_LOG_phase_01.md` |
| 2     | `PHASE_LOG_phase_02.md` |
| 3     | `PHASE_LOG_phase_03.md` |
| 4     | `PHASE_LOG_phase_04.md` |
| 5     | `PHASE_LOG_phase_05.md` |

Create the file even if the phase was smooth (one line: “No incidents.”).
