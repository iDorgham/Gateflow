# GateFlow Workspace — Skills Guide

Index of skills under **`.agents/skills/`** (synced via **`pnpm sync`**). Each skill is a directory with `SKILL.md` and YAML frontmatter (`name`, `description`).

**Count:** 94 skills (auto-indexed from disk; re-run sync after adding skills).

For commands see [COMMAND_GUIDE.md](./COMMAND_GUIDE.md). For `/guide` behavior see **`gf-guide`**.

---

## How skills work

1. Agents match tasks to skill **descriptions** in frontmatter.
2. Matched skill instructions load into context (patterns, checklists, templates).
3. **`source-command-*`** skills wrap slash workflows — pair with `.agents/workflows/<name>.md`.

Discovery helpers: `find-skills`, domain grep under `.agents/skills/`.

---

## Tier 1 — Workflow & safety (load often)

| Folder                     | Description                                                        |
| -------------------------- | ------------------------------------------------------------------ |
| **`gf-guide`**             | Workspace guide — pre-flight, coach format, “what should I do now” |
| **`source-command-guide`** | `/guide` workflow entry                                            |
| **`source-command-dev`**   | `/dev` — one phase end-to-end                                      |
| **`source-command-ship`**  | `/ship` — full plan execution                                      |
| **`cli-limits`**           | 80% CLI quota rule; prefer free-tier when near limit               |
| **`one-man`**              | `/man` — seven-domain orchestrator                                 |
| **`security`**             | Auth, RBAC, QR, data protection                                    |
| **`api`**                  | Next.js App Router API patterns                                    |
| **`database`**             | Prisma, migrations, multi-tenancy                                  |
| **`testing`**              | Jest / test patterns                                               |
| **`gf-strategist`**        | Roadmap and strategic planning                                     |

---

## Tier 2 — `source-command-*` (slash workflow helpers)

| Folder                      | Command       |
| --------------------------- | ------------- |
| `source-command-brainstorm` | `/brainstorm` |
| `source-command-creative`   | `/creative`   |
| `source-command-deploy`     | `/deploy`     |
| `source-command-docs`       | `/docs`       |
| `source-command-draft`      | `/draft`      |
| `source-command-man`        | `/man`        |
| `source-command-organize`   | `/organize`   |
| `source-command-prompt`     | `/prompt`     |
| `source-command-version`    | `/version`    |
| `source-command-clis-team`  | `/clis-team`  |

_(Add `source-command-plan` / `source-command-idea` when created — workflows exist at `.agents/workflows/plan.md` and `idea.md`.)_

---

## Tier 3 — Design & UI (ADS)

| Folder                  | Focus                |
| ----------------------- | -------------------- |
| `ads-ui-styling`        | Core ADS styling     |
| `ads-typography`        | Type scale           |
| `ads-spacing`           | Spacing tokens       |
| `ads-color-tokens`      | Color tokens         |
| `ads-dynamic-tables`    | Data grids           |
| `ads-accessibility-rtl` | RTL / a11y           |
| `uiux-animator`         | Motion patterns      |
| `framer-motion`         | Framer Motion        |
| `responsive-design`     | Breakpoints / layout |
| `shadcn-ads`            | shadcn + ADS         |

---

## Tier 4 — Backend, mobile, ops

| Folder                         | Focus             |
| ------------------------------ | ----------------- |
| `api-gateway`                  | Rate limits, CORS |
| `rbac`                         | Permissions       |
| `qr-crypto`                    | QR signing        |
| `prisma-performance`           | Query tuning      |
| `mobile` / `expo-offline-sync` | Expo / offline    |
| `github-ci-cd`                 | CI/CD             |
| `deploy` / `vercel`            | Deployment        |
| `redis`                        | Cache patterns    |
| `observability`                | Logging / metrics |

---

## Tier 5 — Content, SEO, specialty

| Folder                                    | Focus                |
| ----------------------------------------- | -------------------- |
| `seo-content`, `seo-core`, `seo-planning` | SEO                  |
| `creative-director`, `content-creation`   | Brand / content      |
| `i18n`                                    | Arabic / English     |
| `pdf-analytics`, `excel-spreadsheets`     | Documents            |
| `gemini`, `mcp-guide`                     | Tool-specific guides |

---

## Compliance checklist (any skill)

- [ ] Tenant queries use **`organizationId`** and **`deletedAt: null`**
- [ ] QR payloads **HMAC-SHA256** signed
- [ ] No secrets committed; **pnpm** only
- [ ] **`pnpm preflight`** green before ship when code changed

---

## Adding a skill

1. Create `.agents/skills/<folder>/SKILL.md` with `name` and `description` frontmatter.
2. Run **`pnpm sync`**.
3. Optionally add a row to this guide (or regenerate from frontmatter).

---

> **`/guide`** loads **`gf-guide`** for workspace-aware recommendations. Preferences: `docs/development/learning/GUIDE_PREFERENCES.md`.
