# AI Workspace and Delivery Automation Audit — 2026-08-20

## Scope

Read-only inventory and structural review of agents, subagents, skills,
commands, communication contracts, CLI teams, loops, harnesses, scripts,
GitHub Actions, PR review, runtime proof, CI, deployment, and release guidance.

| Surface             | Count |
| ------------------- | ----: |
| Commands            |    36 |
| Workflow v2 agents  |    50 |
| All agent documents |    71 |
| Skills              |   164 |
| Workflows           |    36 |
| Repository scripts  |    80 |
| GitHub workflows    |    10 |

## Implemented fast path

- Diff-aware runtime-proof planning and fresh, hashed, head-bound receipt checks.
- Automatic PR runtime-proof summary plus reviewer checklist.
- AI workspace graph validator for commands, agents, parent links, skills, and hygiene.
- Live Guide discovery with a tracked routing fallback for CI checkouts.
- Pre-push-compatible `feat/loop-*` worktree branches.
- Exact dependency-cache hits now skip five redundant CI installs.
- Required CI status text distinguishes advisory performance correctly.
- DevOps and deployment agents now use pnpm, explicit mutation authorization,
  focused checks, runtime proof, head binding, and one-writer handoffs.

## Remaining prioritized work

### Phase 2 — Make AI configuration reviewable

1. Establish one tracked canonical AI source under
   `docs/workspace/template-project/.agents/`.
2. Generate local `.agents` / `.antigravity` and tool adapters from that source.
3. Vendor the sync implementation; remove the historical network fallback.
4. Add sync `--check` and content-hash parity validation in CI.
5. Normalize frontmatter for the 44 legacy skills and remove seven generated
   `.DS_Store` / Python cache artifacts.

### Phase 3 — Enforce the harness

1. Add a versioned result-packet schema with run ID, status, head SHA,
   timestamps, artifact hashes, and exactly one handoff.
2. Derive loop ownership from the actual worktree diff; checkpoint JSON must not
   self-assert `phase-green`.
3. Add exclusive lockfiles, revisions/CAS, unique temp files, and stale-lock recovery.
4. Make JSON schemas authoritative and add temp-repository integration tests.
5. Compile agent manifests into a DAG: parallel read-only reviewers, one writer,
   deterministic fan-in, bounded retries, and resumable receipts.

### Phase 4 — Faster affected CI and PR intelligence

1. Replace duplicated change detection with one `change-plan` job consumed by
   runtime proof, Turbo filters, labels, reviewers, and PR summaries.
2. Keep full-tree default-branch/scheduled gates; use affected checks for PR feedback.
3. Move expensive advisory performance work off the required PR critical path.
4. Pin every third-party action to a full SHA and remove the unpinned Bun installer.
5. Add job timeouts and a sticky, deduplicated PR intelligence comment.

### Phase 5 — Release and certification integrity

1. Bind certification to verified artifacts, owned sessions, exact commit, app,
   environment, scenarios, and expiry—not a user-authored `valid: true`.
2. Validate integrated pilot receipts against every app certification receipt.
3. Normalize GitHub reviews/checks for the current PR head and supersede stale reviews.
4. Cache local pre-push receipts by HEAD and tooling/lockfile hash without
   weakening the full preflight and security gates.

## Guardrails

- One primary writer per phase; parallel agents are reviewers or investigators.
- No remote mutation from readiness or review commands.
- Static checks and deployment success never substitute for runtime proof.
- Existing scanner changes remain outside this workspace-automation ownership slice.
