# Shell Subagent — Prompt Library

Copy-paste prompts for terminal commands. Use with **shell** subagent.

---

## Preflight & quality

**Preflight (full)**
```
Run pnpm preflight and report any failure with file:line. Fix the first error and re-run until pass.
```

**Affected workspaces only**
```
Run pnpm turbo lint --filter=...[main] && pnpm turbo typecheck --filter=...[main] && pnpm turbo test --filter=...[main]. Report failures.
```

**Single app**
```
Run pnpm turbo lint --filter=client-dashboard, pnpm turbo typecheck --filter=client-dashboard, pnpm turbo test --filter=client-dashboard. Report failures with file:line.
```

---

## Database

**Migration**
```
From repo root: cd packages/db && npx prisma migrate dev --name [migration_name]. Then run pnpm turbo build from root.
```

**Migration create-only**
```
cd packages/db && npx prisma migrate dev --create-only --name [name]. Do not apply.
```

**Prisma generate**
```
Run pnpm db:generate, then pnpm turbo build. Report if any workspace fails.
```

**Seed**
```
cd packages/db && npx prisma db seed. Report output and any errors.
```

---

## Build & test

**Build all**
```
Run pnpm turbo build and report the first workspace that fails with the actionable error.
```

**Test single workspace**
```
Run pnpm turbo test --filter=client-dashboard and list failing tests with stack traces. Fix the first failure and re-run.
```

**Test watch**
```
cd apps/client-dashboard && pnpm test --watch. Run until green.
```

**Coverage**
```
Run pnpm turbo test -- --coverage --filter=client-dashboard. Report coverage summary.
```

---

## Git

**Status check**
```
Run git status. Report branch, uncommitted files, and if behind origin.
```

**Pre-push**
```
Run git fetch origin && git status. Report if rebase is needed (behind main).
```
