# pnpm / Node runtime drift

**Owner:** platform  
**Last reviewed:** 2026-07-21  
**Related plan:** `audit_remediation_2026` Phase 3

## Canonical pins

| Surface         | Pin             | Source                                      |
| --------------- | --------------- | ------------------------------------------- |
| Package manager | **pnpm@8.15.0** | root `package.json` → `packageManager`      |
| CI pnpm         | **8.15.0**      | `.github/workflows/ci.yml` → `PNPM_VERSION` |
| CI Node         | **22**          | `.github/workflows/ci.yml` → `setup-node`   |
| Engines         | `node >= 20`    | root `package.json` → `engines`             |

## Observed local drift

Developers may run newer Node (e.g. 26.x via Homebrew/nvm) while CI stays on Node 22. That is **allowed** under `engines.node >= 20`, but:

- Prefer **Node 22 LTS** locally for parity with CI.
- Always use **Corepack** (or an exact pnpm 8.15.0 install) so the package manager matches `packageManager`.
- Do **not** bump `packageManager` / lockfile format casually — that churn is out of scope for scanner remediation and needs a dedicated dependency upgrade PR.

## Policy (Phase 3)

- Document drift; do not blind-upgrade pnpm or rewrite the lockfile in this phase.
- CI remains the source of truth for supported Node + pnpm versions.
- If local tooling refuses to run (engine strictness), align Node to 22 rather than raising `engines` without a plan.

## Verification

```bash
pnpm -v          # expect 8.15.0
node -v          # prefer v22.x; must be >= 20
corepack enable
corepack prepare pnpm@8.15.0 --activate
```
