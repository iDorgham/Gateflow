# GateFlow — reference docs

Stable **product**, **workspace**, and **architecture** references. Prefer these over duplicating context in chat.

## Layout

| Subfolder            | Contents                                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **`workspace/`**     | `CLAUDE.md`, `GATEFLOW_CONFIG.md`, `PROJECT_PROGRESS_DASHBOARD.md`                                                      |
| **`product/`**       | `PRD.md` (v12.1), `UPCOMING.md`, `FEATURE_LOG.md`, `MARKETING_SUITE.md`                                                 |
| **`architecture/`**  | System design, structure, quality/performance audit                                                                     |
| **`cache/`**         | API route maps, cache policy, schema snapshots, Context7 index (regenerate as needed)                                   |
| **`apps/`**          | App-specific deep references (design system, marketing, client dashboard, admin, other developments)                    |
| **`knowledge-base`** | [`GATEFLOW_MASTER_AI_KNOWLEDGE_BASE.md`](./GATEFLOW_MASTER_AI_KNOWLEDGE_BASE.md) (Context for Grok, NotebookLM, Claude) |

## Symlinks (repo convention)

From `docs/`:

- `CLAUDE.md` → `reference/workspace/CLAUDE.md`
- `PRD.md` → `reference/product/PRD.md`

---

[Documentation hub](../README.md) · [Guides](../guides/) · [Development workflow](../development/README.md)
