# Shell Subagent

**Purpose:** Run pnpm/turbo commands, git operations, Prisma migrations, and build operations.

## When to Use

- Preflight checks before committing
- Running database migrations
- Running tests and builds
- Git operations (branch, commit, push)

## Prompt Templates

### Preflight check
```
Run pnpm preflight and report any failure with file:line. Fix the first error and re-run.
```

### Database migration
```
From packages/db: run prisma migrate dev --name [name], then pnpm turbo build from root.
```

### Build check
```
Run pnpm turbo build and report any workspace that fails with the first actionable error.
```

### Test run
```
Run pnpm turbo test --filter=client-dashboard and list failing tests with stack traces.
```

### Git operations
```
Create a new branch feat/[feature-name], commit with conventional message, and push to remote.
```

## Examples

- "Run pnpm turbo lint --filter=client-dashboard"
- "Run prisma generate from packages/db"
- "Check git status and stage all changes"
- "Run pnpm typecheck to verify types"
