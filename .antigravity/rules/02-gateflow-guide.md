---
description: GateFlow Guide — pre-flight before tasks, post-task summary, and /guide trigger. Invokes gf-guide for "what should I do now" and optional before/after checks.
globs: *
alwaysApply: true
---

# GateFlow Guide Rule

**Skill:** `.cursor/skills/gf-guide/SKILL.md` — load when applying this rule.

## Before executing a user task

1. Check **pre-flight** (see gf-guide skill): git state, failing tests/lint/typecheck, blocking plan phase, security-sensitive area.
2. If something should be done **first**, say so in 1–2 sentences and offer:
   - **1 — Proceed:** Continue with the user’s request.
   - **2 — Do suggestions first:** Do the suggested steps, then the user’s request.
3. Do not block; if the user chooses "proceed", continue.

## When the user says /guide or "what should I do now"

- Invoke the **gf-guide** skill fully: load context (GATEFLOW_CONFIG, docs, plan), assess state (git, preflight, active plan), then report **Must do**, **Recommended**, **Critical**, **Improvements** in the skill’s output format.

## After completing a task (optional)

- **When finishing a phase:** Update `docs/plan/execution/TASKS_<plan>.md` in the same pass as the commit (tick items, set Status: Done). Do this automatically so /guide and /dev stay accurate.
- Give a **short** guide summary: one line each for must-do next, recommended, critical (if any), and 1–2 improvements. Omit if the user asked for a minimal response.
