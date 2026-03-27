# Commit Message Template

Conventional Commits for GateFlow. Use with `/github` or manual commits.

## Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

## Types

| Type | Use for |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `refactor` | Code change, no feature/fix |
| `test` | Adding/updating tests |
| `chore` | Build, deps, config |
| `perf` | Performance improvement |
| `style` | Formatting, no logic change |

## Scope (optional)

- `auth`, `api`, `db`, `ui`, `scanner`, `resident`, `i18n`, `deps`, etc.

## Examples

```
feat(gates): add gate location field (phase 2)
fix(auth): handle expired refresh token
docs: update MCP_SETUP.md
refactor(api): extract validation to shared schema
test(gates): add unit tests for GET /api/gates
chore(deps): bump prisma to 5.x
```

## Phase commits (for /run)

```
feat(resident): Unit management UI (phase 2)
fix(scanner): offline queue dedup
```
