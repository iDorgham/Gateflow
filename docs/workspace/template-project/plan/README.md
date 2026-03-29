# Plan

Three-stage lifecycle for all development initiatives.

```
plan/
├── planned/       # Approved plans ready to start
├── in-progress/   # Active work
└── done/          # Completed initiatives
```

## Files per initiative (`<slug>`)

```
plan/in-progress/<slug>/
├── PLAN_<slug>.md              # Phase table + scope
├── TASKS_<slug>.md             # Execution checklist
├── SESSION_MEMORY.md           # Cross-session AI state (updated by /dev)
└── phases/
    └── 01_<title>/
        └── PROMPT_phase_01.md  # Phase prompt with acceptance criteria
```

## Lifecycle

```
planned/ → in-progress/ → done/
```

Move the `<slug>/` folder between stages as work progresses.

## Related

- Ideas & brainstorms → `docs/ideas/`
- Reusable templates → `docs/workspace/templates/`
- Learning & CLI memory → `docs/learning/`
