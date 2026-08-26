# GateFlow Workflow v2

Workflow v2 develops and certifies one pilot application at a time:

1. `apps/client-dashboard`
2. `apps/resident-portal`
3. `apps/scanner-app`
4. integrated residential-compound certification

State lives at `.ai/workflow-v2/state.json`. Inspect it with:

```bash
pnpm workflow:v2 status --json
```

Render the workspace-aware control-center response with:

```bash
pnpm workflow:v2:guide
pnpm workflow:v2:guide status --json
pnpm workflow:v2:guide next --json
pnpm workflow:v2:guide prompt
pnpm workflow:v2:guide delivery --json
```

| Subcommand         | Purpose                                                   |
| ------------------ | --------------------------------------------------------- |
| `status` (default) | Full guide snapshot and response contract                 |
| `next`             | First-incomplete-gate selector (`nextCommand` only)       |
| `prompt`           | Registry-validated tagged prompt for the next agent/CLI   |
| `delivery`         | Local Git plus optional GitHub PR/check evidence for HEAD |

The guide reads live local state, routes, plan/evidence metadata, scores,
pilot-flow coverage, and Git status. It emits a restrained status table, one
safe next command, and a complete prompt for the next agent or CLI. JSON is
available with `--json` on each subcommand. Optional app-state pointers
(`pageScoresFile`, `pilotFlowCoverage`, `selection`, `delivery`) live on
`.ai/workflow-v2/state.json` — never invent a second store under `.gateflow/`.

The legal app stages are:

`parked → focused → audited → planned → developing → checking → pilot-ready → certified`

Only the state CLI writes focus/stage. Certification requires fresh evidence and
creates a write-once hash-bound receipt. `/next-app` recommends the fixed
successor and requires confirmation before changing focus.

## Command groups

- Focus and evidence: `/focus`, `/audit`, `/progress`, `/page-map`, `/page`,
  `/components`, `/usability`
- Delivery: `/plan`, `/dev`, `/check`, `/design`, `/api`, `/database`,
  `/security`, `/test`, `/observe`
- Operations: `/github`, `/vercel`, `/release`
- Pilot gates: `/pilot`, `/certify`, `/next-app`, `/guide`

## Deterministic tools

```bash
pnpm workflow:v2:check
node scripts/workflow-v2/support-cli.js routes client-dashboard --json
node scripts/workflow-v2/support-cli.js scope-diff client-dashboard --json
node scripts/workflow-v2/operations-cli.js verify client-dashboard
node scripts/workflow-v2/operations-cli.js env-check client-dashboard --json
pnpm proof:plan
pnpm pr:ready
pnpm check:workspace-ai
```

These tools are local-only by default. Environment checks report variable names,
never values. Verification prints its plan unless `--run` is explicitly passed.
GitHub, Vercel, deployment, migration, release, and remote mutations require
separate authorization.

`pnpm check:workspace-ai` validates the live command registry, workflow-agent
frontmatter and parent graph, unique skill metadata, referenced workflow files,
and generated-artifact hygiene before orchestration starts. When the local,
gitignored `.agents` source is absent, CI validates the tracked routing registry
instead of silently skipping. Versioning the full canonical AI source remains
Phase 0 of `workspace_ai_surface_hardening_2026`.

### Automated runtime-proof planning

`pnpm proof:plan` reads the current focused diff (including untracked files)
and deterministically lists required browser, device, API, database, and
access-flow proof. `pnpm pr:ready` compares the branch with `origin/master` and
prints a copy-ready PR checklist bound to the current HEAD.

Store collected evidence locally in `.ai/runtime-proof.json`:

```json
{
  "entries": [
    {
      "requirement": "browser-flow",
      "artifact": "artifacts/e2e/client-dashboard.json",
      "artifactSha256": "SHA256_OF_ARTIFACT",
      "owner": "owned-browser-session-id",
      "environment": "preview",
      "assertions": ["authorized flow passed", "denial flow passed"],
      "capturedAt": "2026-08-20T10:00:00Z",
      "commit": "CURRENT_FULL_HEAD_SHA"
    }
  ]
}
```

Then run `pnpm proof:check`. Every required category must have an in-repository
artifact and matching SHA-256, owner/session, environment, assertions, a
timestamp no older than 24 hours, and the exact HEAD SHA. The receipt contains
references, not secrets or fabricated evidence. GitHub Actions runs the same
classifier at the exact PR head. When proof is required,
`.ai/runtime-proof.json` and every referenced artifact must be committed,
fresh, hashed, and head-bound; otherwise `CI OK` fails. Runtime manifests,
native assets/configuration, app dependency manifests, shared UI runtime code,
root lockfile changes, deletions, and both sides of renames are classified.

## Bounded development loops

Use `/dev loop` for an approved plan phase or task contract:

```text
/dev loop start <plan-slug> --phase=1 --delivery=local
/dev loop start <plan-slug> --all --delivery=draft-pr
/dev loop task draft <task-slug> --from <contract-input.json>
/dev loop task approve <task-slug>
/dev loop start task:<task-slug> --delivery=local
```

`/pilot loop` delegates to the same controller with the pilot profile, retaining
page-score, flow-coverage, certification, and fixed app-sequence gates.

Each run records an atomic checkpoint under `.ai/workflow-v2/loops/`. A batch
contains at most three tasks and a distinct failure receives at most three
automatic repairs. Pause/stop releases the workdir lock; resume revalidates the
focus and approved target hash.

Delivery authorization is cumulative but narrow:

- `local`: branch/worktree only; `/dev loop ship-phase` is required before
  staging or committing loop-owned files.
- `draft-pr`: focused commits, feature-branch push, draft PR, inspection, and
  bounded fixes.
- `approve-merge`: current PR number and head SHA only.
- `approve-release`: release-plan ID and target commit only.
- Deployment, promotion, and database migration are always separate commands.

### Unified Loop Taxonomy

- **`/dev loop`**: Bounded writer loop for phase/task implementation (local or draft-pr).
- **`/pilot loop`**: Same bounded execution controller + strict pilot certification gates.
- **`/ralph <slug>`**: Compatibility alias routing to `/dev loop` (legacy mutation paths removed).
- **`pnpm ralph`**: Local developer telemetry & metrics dashboard only; never executes migrations or git mutations.
- **Cursor `/loop`**: IDE session keep-alive mechanism; independent of GateFlow workflow state.

Controller help:

```bash
pnpm dev:loop --help
pnpm workflow:v2:delivery --help
```

## Result contract

Every task returns artifacts, fresh verification, risks/blockers, and exactly
one handoff. Static review is labeled `static-review-only`; it cannot substitute
for browser, E2E, visual, or device evidence.
