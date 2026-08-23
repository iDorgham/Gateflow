## Summary

## <!-- What does this PR do? 1–3 bullets -->

## Type of change

- [ ] `feat` — New feature
- [ ] `fix` — Bug fix
- [ ] `perf` — Performance improvement
- [ ] `refactor` — Code refactor (no behaviour change)
- [ ] `chore` — Tooling, deps, CI
- [ ] `docs` — Documentation only
- [ ] `security` — Security fix

## Plan reference

<!-- Link to the plan this PR implements, if any -->

Plan: `docs/plan/Active/<slug>/` or `done/<slug>/`
Phase: <!-- e.g. Phase 3 of 7 -->

## Checklist

### Code

- [ ] Follows conventional commit format (`feat(scope): description`)
- [ ] No hardcoded secrets, API keys, or credentials
- [ ] No `console.log` left in production code
- [ ] RTL / Arabic locale tested (if UI changes)

### Tests

- [ ] New tests added for new behaviour
- [ ] All existing tests pass (`pnpm preflight`)
- [ ] No test snapshots blindly updated

### Runtime proof

- [ ] `pnpm pr:ready` reviewed for this exact HEAD
- [ ] Required browser/device/API/database/access-flow artifacts are fresh
- [ ] `.ai/runtime-proof.json` passes `pnpm proof:check`, or no runtime proof is required
- [ ] Static checks, deployments, and manual checkboxes were not used as runtime proof

### Database

- [ ] If `schema.prisma` changed → `pnpm prisma db push` run locally
- [ ] No breaking migration without a rollback plan

### Env & Config

- [ ] New env vars added to `scripts/check-env.js` manifest
- [ ] New env vars documented in `.env.example`

### Release

- [ ] CHANGELOG updated (auto via post-commit hook, or `pnpm docs:changelog add`)
- [ ] Breaking changes noted below (if any)

## Breaking changes

<!-- Delete if none -->

None

## Screenshots / recordings

<!-- Delete if not a UI change -->
