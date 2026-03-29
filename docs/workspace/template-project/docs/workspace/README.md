# Workspace

The workspace operating system — installation docs, catalog, automation, and systems.

---

## Structure

```
docs/workspace/
├── installation/     # How to install and apply this template
├── catalog/          # Inventory of agents, rules, skills, scripts, commands
├── automation/       # CI, GitHub Actions, Ralph Loop
├── systems/          # Plan system, cache layer, memory layer
├── templates/        # Reusable file templates (SESSION_MEMORY, etc.)
├── bootstrap/        # Portability — bring this workspace to a new project
├── contracts/        # Shared contracts and interfaces
├── PRD.md            # Product Requirements Document (fill this first)
├── QUICKSTART.md     # Fastest path to get started
├── POST_INSTALL_CHECKLIST.md
├── INSTALL_PROMPT.md       # Full 12-step AI installer prompt
├── INSTALL_PROMPT_SHORT.md # Fast 6-step installer prompt
└── TEMPLATE_VERSION.md
```

---

## Where to start

1. **New project** → read `QUICKSTART.md`
2. **Fill requirements** → edit `PRD.md`
3. **Check what's installed** → `catalog/`
4. **Understand the AI context system** → `systems/MEMORY_LAYER.md` + `systems/CACHE_LAYER.md`
5. **Understand planning** → `systems/PLAN_SYSTEM.md`
6. **After setup** → complete `POST_INSTALL_CHECKLIST.md`

---

## Source of Truth Map

| What                | Source                                                |
| ------------------- | ----------------------------------------------------- |
| Rules               | `ops-core/cursor/rules/` + `ops-core/claude/rules/`   |
| Agents              | `ops-core/cursor/agents/` + `ops-core/claude/agents/` |
| Workflows           | `ops-core/antigravity/workflows/`                     |
| Commands (Gemini)   | `ops-core/gemini/commands/`                           |
| Commands (OpenCode) | `ops-core/opencode/commands/`                         |
| Cache               | `docs/system/cache/`                                  |
| Memory              | `docs/system/memory/`                                 |
| Learning            | `docs/system/learning/`                               |
| Plans               | `plan/`                                               |
| Scripts             | `scripts/`                                            |
