# Shell Subagent — GateFlow Prompts

Copy one of these prompts when invoking the **shell** subagent.

---

## Pre-PR checks

```
Run pnpm preflight and report any failure with file:line. Fix the first error and re-run.
```

---

## Affected workspaces

```
Run lint + typecheck + tests for only the affected workspaces: [filters]. Return failures with file:line.
```

---

## Build sanity

```
Run pnpm turbo build and report any workspace that fails with the first actionable error.
```

---

## Migration

```
From packages/db: run prisma migrate dev --name [name], then pnpm turbo build from root.
```

---

## Test failures

```
Run pnpm turbo test --filter=[workspace] and list failing tests with stack traces.
```

---

## Prisma generate

```
Run pnpm db:generate, then pnpm turbo build.
```
