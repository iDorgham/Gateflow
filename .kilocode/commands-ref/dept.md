# Dept

Subagent hierarchy — role assignment for phases. Company-style departments.

## Roles

PLANNING | ARCHITECTURE | SECURITY | BACKEND-Database | BACKEND-API | FRONTEND | MOBILE | QA | i18n | DEVOPS | EXPLORE

## When to use

- Assign primary role to each phase (from `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`).
- **Adopt agent:** Paste role prompt from `.antigravity/agents/roles/<role>.md` when starting phase.
- Use role prefix when invoking CLIs for consistent output.
- Match role to phase domain: schema → BACKEND-Database, UI → FRONTEND.
