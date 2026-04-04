# GateFlow — `docs/plan/`

This directory holds **only** phased plan **lifecycle** folders and the **backlog**. Everything else (guidelines, templates, CLI learning, initiative IDEA files) lives under **`docs/development/`** and **`docs/development/initiatives/`**.

## Lifecycle folders (canonical)

| Folder          | Meaning                                                                |
| --------------- | ---------------------------------------------------------------------- |
| **`Draft/`**    | Plans being written or refined (`PLAN_*`, `phases/`, `context/`, etc.) |
| **`Ready/`**    | Approved plans queued for `/dev`                                       |
| **`Active/`**   | Plan currently being executed                                          |
| **`Complete/`** | Shipped or archived plans                                              |

Transitions and folder shape: **`docs/development/PLAN_LIFECYCLE.md`** and **`docs/development/plan-templates/PLAN_FOLDER_STRUCTURE.md`**.

## Backlog

| Path           | Role                                   |
| -------------- | -------------------------------------- |
| **`backlog/`** | `ALL_TASKS_BACKLOG.md`, quick captures |

## Related docs (outside `docs/plan/`)

| Path                                   | Role                                                      |
| -------------------------------------- | --------------------------------------------------------- |
| **`docs/development/initiatives/`**    | `IDEA_<slug>.md` from `/idea`                             |
| **`docs/development/guidelines/`**     | Subagent hierarchy, phased workflow, AI rules             |
| **`docs/development/plan-templates/`** | Plan folder templates, phase log, session memory          |
| **`docs/development/plan-guides/`**    | Lighter procedural notes (One Man, planning enhancements) |
| **`docs/development/learning/`**       | CLI logs, patterns, incidents, guide preferences          |
| **`docs/development/brainstorming/`**  | Strategy and roadmap notes                                |

Index: **`docs/development/README.md`**.

## Slash commands (Cursor)

| Command              | Purpose                                                               |
| -------------------- | --------------------------------------------------------------------- |
| `/draft <slug>`      | Raw notes under `Draft/<slug>/`                                       |
| `/prompt <slug>`     | `FOR_PLAN_PROMPT.md` for `/plan`                                      |
| `/plan <slug>`       | Full phased plan + `PLAN_FEEDBACK.md`                                 |
| `/plan ready <slug>` | `Draft/<slug>/` → `Ready/<slug>/`                                     |
| `/dev`               | One phase; moves **Ready → Active**, last phase **Active → Complete** |

---

[Docs root](../README.md) · [Development workflow hub](../development/README.md) · [Development guide](../guides/DEVELOPMENT_GUIDE.md)
