# Docs

> Auto-generated index. Run `pnpm docs:index` to refresh.
> Last updated: 2026-03-28

---

## Index

| Category                         | Purpose                                               | Contents     |
| -------------------------------- | ----------------------------------------------------- | ------------ |
| ⚙️ [**System**](./system/)       | AI context layer — cache, memory, learning, ideas     | 4 subfolders |
| 🧠 [**Workspace**](./workspace/) | AI operating system — rules, agents, skills, commands | 7 files      |
| 📋 [**Product**](./product/)     | PRD, specs, roadmap, requirements                     | empty        |
| 🏗️ [**Arch**](./arch/)           | Architecture decisions and system design              | empty        |
| 🔌 [**API**](./api/)             | API reference and integration docs                    | empty        |
| 📖 [**Guides**](./guides/)       | How-to guides and runbooks                            | empty        |
| ⚖️ [**Decisions**](./decisions/) | Architecture Decision Records (ADRs)                  | empty        |

---

## Folder Guide

```
docs/
├── system/      # ⚙️  AI context — cache, memory, learning, ideas
├── workspace/   # 🧠  Workspace OS — rules, agents, skills, commands
├── product/     # 📋  PRD, specs, roadmap
├── arch/        # 🏗️  Architecture and system design
├── api/         # 🔌  API reference
├── guides/      # 📖  How-to guides and runbooks
└── decisions/   # ⚖️  Architecture Decision Records
```

## Conventions

- Every folder has a `README.md` — first heading = folder title
- Run `pnpm docs:index` after adding a new doc folder to update this index
- Files in `system/` are AI context — don't edit manually, use scripts:
  - `pnpm cache:build` — rebuild workspace cache
  - `pnpm memory:init` — initialize memory files
