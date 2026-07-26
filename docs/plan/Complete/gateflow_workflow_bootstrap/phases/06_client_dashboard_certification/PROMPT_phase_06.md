# Phase 06: Client Dashboard certification

## Primary role

QA / DEVOPS (Client Dashboard Certification)

## Tool Selection

| Tool            | Role this phase                                                    |
| --------------- | ------------------------------------------------------------------ |
| **Cursor**      | Primary writer for certification receipt and test verification     |
| **Antigravity** | Workspace execution, plan verification, and certification emission |
| **Claude CLI**  | Read-only compliance & receipt verification                        |

## Skills to load

- `pilot-certification`
- `app-audit`
- `verification-before-completion`
- `workflow-v2-contract`

## Scope

App: `apps/client-dashboard`
Scope: Perform full empirical verification across linting, TypeScript validation, Jest test suites, security guards, and emit immutable certification receipt `CLIENT_DASHBOARD_CERTIFICATION_RECEIPT.md`.

## Steps

1. Confirm focus is `client-dashboard` via `node scripts/workflow-v2/cli.js focus status`.
2. Run `pnpm --filter client-dashboard lint` and verify 0 errors.
3. Run `pnpm --filter client-dashboard typecheck` and verify clean build.
4. Run `pnpm --filter client-dashboard test` and verify 75/75 Jest test suites pass.
5. Run `pnpm workflow:v2:check` and verify 58/58 contract tests pass.
6. Create immutable evidence receipt `docs/plan/Active/gateflow_workflow_bootstrap/evidence/CLIENT_DASHBOARD_CERTIFICATION_RECEIPT.md`.
7. Execute certification: `node scripts/workflow-v2/cli.js certify --evidence docs/plan/Active/gateflow_workflow_bootstrap/evidence/CLIENT_DASHBOARD_CERTIFICATION_RECEIPT.md`.

## Acceptance criteria

- [ ] ESLint clean (0 errors, ≤261 warnings)
- [ ] TypeScript typecheck clean
- [ ] 75/75 Jest test suites green (422/422 tests)
- [ ] 58/58 Workflow v2 contract tests green
- [ ] Certification receipt `CLIENT_DASHBOARD_CERTIFICATION_RECEIPT.md` emitted
- [ ] Workflow v2 stage transitioned to `certified`

## Exit

```text
/dev gateflow_workflow_bootstrap 7
```
