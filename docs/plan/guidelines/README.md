# GateFlow Guidelines

<div align="center">

**Reusable templates and guides for GateFlow AI workflows**

_Fill placeholders and save outputs to their target locations_

</div>

---

## Start Here

- **[KIRO_GUIDE.md](./KIRO_GUIDE.md)** — Complete Kiro workflow reference

---

## Templates

| Template                         | Purpose                           | Output location                                  |
| :------------------------------- | :-------------------------------- | :----------------------------------------------- |
| `TEMPLATE_PROMPT_phase.md`       | Phase pro prompt                  | `docs/plan/Complete/PROMPT_<plan>_phase_<N>.md` |
| `TEMPLATE_API_route.md`          | API route scaffold                | `apps/*/src/app/api/<resource>/route.ts`         |
| `TEMPLATE_API_test.md`           | API route test scaffold           | `*/*.route.test.ts` next to route                |
| `TEMPLATE_commit_message.md`     | Conventional commit format        | — (reference for `/github`)                      |
| `TEMPLATE_PR_description.md`     | PR description with checklist     | — (paste into GitHub)                            |
| `TEMPLATE_definition_of_done.md` | Phase/PR completion checklist     | — (reference)                                    |
| `TEMPLATE_E2E_flow.md`           | E2E flow spec for browser-use/MCP | — (spec for verification)                        |
| `TEMPLATE_E2E_playwright.md`     | Playwright test scaffold          | `apps/*/e2e/*.spec.ts`                           |
| `subagents/*.md`                 | Subagent prompt library           | — (copy-paste)                                   |

---

## Agents

`.cursor/agents/` — Role personas (planning, security, backend-api, frontend, etc.) and scenarios (code-review, security-audit, refactor).

### When to Use

| Task            | Agent                    |
| :-------------- | :----------------------- |
| Security review | `roles/security`         |
| Database schema | `roles/backend-database` |
| API routes      | `roles/backend-api`      |
| UI components   | `roles/frontend`         |
| Code review     | `scenarios/code-review`  |

---

## Contracts

`.cursor/contracts/` — Invariants that all code must satisfy:

| Contract           | Rule                                     |
| :----------------- | :--------------------------------------- |
| Multi-tenant scope | `organizationId` required on all queries |
| Soft deletes       | Always filter `deletedAt: null`          |
| QR security        | HMAC-SHA256 signing required             |
| Auth               | JWT tokens with 15-min expiry            |
| Validation         | Zod schemas on all inputs                |

See `.cursor/contracts/CONTRACTS.md` for full details.

---

## Usage

| Task               | Action                                                                  |
| :----------------- | :---------------------------------------------------------------------- |
| Capture initiative | Use `/idea` → creates `context/IDEA_<slug>.md`                          |
| Create plan        | Use `/plan` → creates `planning/<slug>/`                                |
| Execute phase      | Use `/dev <slug> <N>` → uses `PROMPT_<slug>_phase_<N>.md`               |
| New API route      | Copy `TEMPLATE_API_route.md`; add test from `TEMPLATE_API_test.md`      |
| E2E verification   | Fill `TEMPLATE_E2E_flow.md`; use `TEMPLATE_E2E_playwright.md`           |
| Subagent prompts   | Copy from `subagents/` library                                          |
| Commit             | Use `TEMPLATE_commit_message.md` format                                 |
| PR                 | Fill `TEMPLATE_PR_description.md`; use `TEMPLATE_definition_of_done.md` |

---

## Reference

| Resource        | Location                                              |
| :-------------- | :---------------------------------------------------- |
| Contracts       | `.cursor/contracts/CONTRACTS.md`                      |
| Phased workflow | `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` |
| Planning skill  | `.cursor/skills/gf-planner/SKILL.md`                  |

---

<div align="center">

[Return to Plan Root](../README.md)

</div>
