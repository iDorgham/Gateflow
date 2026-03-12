and # Cursor Templates

Reusable templates for GateFlow AI workflows. Fill placeholders and save outputs to their target locations.

## Templates

| Template | Purpose | Output location |
|----------|---------|-----------------|
| `TEMPLATE_PROMPT_phase.md` | Phase pro prompt | `docs/plan/execution/PROMPT_<plan>_phase_<N>.md` |
| `TEMPLATE_API_route.md` | API route scaffold (auth, org scope, Zod) | `apps/client-dashboard/src/app/api/<resource>/route.ts` |
| `TEMPLATE_API_test.md` | API route test scaffold | `*/*.route.test.ts` next to route |
| `TEMPLATE_commit_message.md` | Conventional commit format | — (reference for `/github`) |
| `TEMPLATE_PR_description.md` | PR description with checklist | — (paste into GitHub) |
| `TEMPLATE_definition_of_done.md` | Phase/PR completion checklist | — (reference) |
| `TEMPLATE_E2E_flow.md` | E2E flow spec for browser-use/MCP | — (spec for verification) |
| `TEMPLATE_E2E_playwright.md` | Playwright test scaffold | `apps/*/e2e/*.spec.ts` |
| `subagents/*.md` | Subagent prompt library | — (copy-paste) |

## Agents

`.cursor/agents/` — Role personas (planning, security, backend-api, frontend, etc.) and scenarios (code-review, security-audit, refactor). Adopt when starting a phase or task. Orchestrator: when to use subagents/MCP/CLI.

## Contracts

`.cursor/contracts/` — Invariants that all code must satisfy:
- Multi-tenant scope (`organizationId`)
- Soft deletes (`deletedAt: null`)
- QR security (HMAC-SHA256)
- Auth, validation, secrets

See `.cursor/contracts/CONTRACTS.md` for full details.

## Usage

- **`/idea`** — Capture/refine initiatives into `docs/plan/context/IDEA_<slug>.md` and add/update backlog entries.
- **`/plan`** — Create or refine `PLAN_<slug>.md` and phase prompts using `TEMPLATE_PROMPT_phase.md`.
- **`/dev`** — Execute a single phase using `PROMPT_<slug>_phase_<N>.md` (implement → test → git).
- **`/ship`** — Run all remaining phases for a plan (internally looping over the same prompts).
- **New API route** — Copy `TEMPLATE_API_route.md` pattern; add test from `TEMPLATE_API_test.md`
- **E2E verification** — Fill `TEMPLATE_E2E_flow.md` for browser-use/MCP; use `TEMPLATE_E2E_playwright.md` when adding Playwright
- **Subagent prompts** — Copy from `subagents/` library (explore-library, shell-library, browser-library)
- **Commit** — Use `TEMPLATE_commit_message.md` format
- **PR** — Fill `TEMPLATE_PR_description.md`; use `TEMPLATE_definition_of_done.md` for checklist

## Reference

- `.cursor/contracts/` — Code invariants
- `docs/plan/guidelines/PHASED_DEVELOPMENT_WORKFLOW.md` — Phased flow
- `.cursor/skills/gf-planner/SKILL.md` — Planning skill
