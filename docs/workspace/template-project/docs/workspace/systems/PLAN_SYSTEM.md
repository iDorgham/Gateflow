# Plan System

## Structure

```
plan/
├── planned/       # Approved — ready to start
├── in-progress/   # Active work
└── done/          # Completed
```

## Files per initiative (`<slug>`)

```
plan/in-progress/<slug>/
├── PLAN_<slug>.md              # Phase table + scope
├── TASKS_<slug>.md             # Execution checklist
├── SESSION_MEMORY.md           # Cross-session AI state
└── phases/
    └── 01_<title>/
        └── PROMPT_phase_01.md  # Acceptance criteria + steps
```

## Lifecycle

Move the `<slug>/` folder as work progresses:

```
plan/planned/<slug>/  →  plan/in-progress/<slug>/  →  plan/done/<slug>/
```

## Phase Prompt Standards

Each `PROMPT_phase_N.md` must include:

- **Role** — who is executing (architect, engineer, etc.)
- **Goal** — one-sentence outcome
- **Steps** — ordered implementation steps
- **Acceptance criteria** — lint ✓ · typecheck ✓ · tests ✓

## Rules

- One source of truth: plan table + TASKS file.
- Never mark a phase done without evidence (acceptance criteria passed).
- Update `SESSION_MEMORY.md` after every phase — it survives context resets.

## Related Folders

| Folder                      | Purpose                                    |
| --------------------------- | ------------------------------------------ |
| `docs/ideas/`               | IDEA\_<slug>.md brainstorm files           |
| `docs/learning/`            | CLI memory, patterns, decisions, incidents |
| `docs/workspace/templates/` | Reusable plan/session templates            |
