# Phase 10: npm — publish `@gateflow/*` design libraries (five packages)

> **Plan:** `PLAN_gateflow_design_system.md` (plan folder root)  
> **Depends on:** Phases **1–9** (all publishable libs + docs site green)

### Primary role

**DevOps** + **FRONTEND** (package manifests, build outputs)

### Tool selection

|               | Tool              | Why                         |
| ------------- | ----------------- | --------------------------- |
| **Preferred** | **Cursor**        | CI + package.json hardening |
| **Fallback**  | npm web / Actions | org tokens, 2FA             |

### Skills to load

**Note:** Phases **1–9** follow **Production skills** in `PLAN_gateflow_design_system.md` (plan folder root); this phase is **publish/CI only** (no UI bundle requirement).

1. `.agents/skills/github-ci-cd/SKILL.md` — release workflow
2. `.agents/skills/vercel/SKILL.md` — only if versioning ties to deploy docs

### Context

- **Goal:** External developers run **`npm install @gateflow/tokens`** (and theme, ui, **components**, **ai**) without cloning the monorepo. Scoped packages under npm org **`@gateflow`** (create org, maintainers, **Granular Access Token** for CI).
- **Published (5):** `@gateflow/tokens`, `@gateflow/theme`, `@gateflow/ui`, **`@gateflow/components`**, **`@gateflow/ai`**.
- **Not published:** `apps/design-system` (`@gateflow/design-system`) — Vercel-only.
- **Dependencies between published packages:** Semver ranges (e.g. `@gateflow/components` → `ui`, `theme`, `tokens`). Monorepo uses `workspace:*` until release; Changesets rewrites for publish.
- **Artifacts:** Each package: `exports`, `files`, `publishConfig.access: public`; CSS + `dist` as needed; **optional peer** docs for `@gateflow/ai` (`ai`, `@ai-sdk/react`).

### Goal

CI (or documented manual) path: publish **five** packages → npm **proves** install → README + **design.gateflow.site** `/packages` lists matching versions.

### Scope (in)

- `package.json` for each publishable package: `repository`, `license`, `publishConfig`, `files`, peerDeps.
- `.github/workflows/publish-gateflow.yml` (optional): `NPM_TOKEN` secret.
- **Changesets** (recommended) or filtered `pnpm publish`.
- Smoke test: **fresh Next app** + install all five + import CSS + one component each from `ui`, `components`, `ai`.

### Scope (out)

- `@gate-access/*` backend packages on npm.

### Steps (ordered)

1. Confirm npm org **`@gateflow`**; reserve names.
2. Audit **entry points** (ESM/CJS) per package; `pnpm pack` dry run × 5.
3. Wire Changesets / release docs; version **0.x** or **1.0.0** per policy.
4. GitHub Actions publish on tag or `workflow_dispatch`.
5. Smoke test external repo.
6. Root `CHANGELOG.md` — Workspace: npm availability for all five.
7. Commit: `ci(publish): npm release for @gateflow tokens theme ui components ai`

### Acceptance criteria

- [ ] **`npm view`** for all five packages returns metadata post-publish.
- [ ] **Clean external install**; TypeScript resolves where advertised.
- [ ] **Site:** `/packages` comprehensive table matches published names + versions.
- [ ] **Security:** `NPM_TOKEN` only in CI secrets.

### Files likely touched

- `packages/{tokens,theme,ui,components,ai}/package.json`
- `.changeset/config.json`
- `.github/workflows/*`
