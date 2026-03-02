# GateFlow Agents

**Purpose:** Personas and scenarios for the main Cursor agent to improve workflow and results. Use to adopt a role or scenario when tackling specific tasks.

## Agent vs Subagent

| | **Agent** (this folder) | **Subagent** (`.cursor/subagents/`) |
|---|-------------------------|-------------------------------------|
| **What** | Main AI adopts a persona | Spawned helper for narrow task |
| **Use** | Paste role prompt or say "act as Security" | Invoke explore/shell/browser-use |
| **Scope** | Broad (full implementation in that domain) | Narrow (trace code, run cmd, verify UI) |

## Agents

### Role agents (match phase domain)

| Agent | When to use | File |
|-------|-------------|------|
| **Planning** | Create plan, break down phases | `roles/planning.md` |
| **Architecture** | Cross-app, conventions, refactors | `roles/architecture.md` |
| **Security** | Auth, RBAC, QR, sensitive data | `roles/security.md` |
| **Backend-Database** | Schema, migrations, queries | `roles/backend-database.md` |
| **Backend-API** | API routes | `roles/backend-api.md` |
| **Frontend** | UI, components, pages | `roles/frontend.md` |
| **Mobile** | Scanner, resident-mobile, offline | `roles/mobile.md` |
| **QA** | Tests, verification | `roles/qa.md` |
| **i18n** | AR/EN, RTL, locale | `roles/i18n.md` |
| **DevOps** | Build, migrate, preflight | `roles/devops.md` |
| **Explore** | Discovery before implementation | `roles/explore.md` |

### Scenario agents

| Agent | When to use | File |
|-------|-------------|------|
| **Code Review** | Review PR or changes | `scenarios/code-review.md` |
| **Security Audit** | Full security pass | `scenarios/security-audit.md` |
| **Refactor Lead** | Large refactor, preserve invariants | `scenarios/refactor.md` |

### Orchestrator

| File | Purpose |
|------|---------|
| `orchestrator.md` | When to invoke subagents, MCP, CLIs; decision rules |

## Usage

1. **Adopt role:** Paste the role prompt from `roles/<role>.md` when starting a phase or task in that domain.
2. **Scenario:** Use `scenarios/<scenario>.md` for one-off passes (review, audit).
3. **Orchestrator:** Reference when deciding whether to use subagents, MCP, or multi-CLI.

**Example:** "Adopt the Security agent" → paste contents of `roles/security.md` or @ mention it.
