# Plan Move (Lifecycle Transitions)

Internal flow for moving plans between lifecycle folders. Used by `/plan ready`, `/dev`, and `/ship`.

## Resolve plan location (lookup order)

To find where a plan `<slug>` lives, check in order:

1. `docs/plan/in-progress/<slug>/PLAN_<slug>.md`
2. `docs/plan/planned/<slug>/PLAN_<slug>.md`
3. `docs/plan/planning/<slug>/PLAN_<slug>.md`
4. `docs/plan/execution/PLAN_<slug>.md` (legacy flat structure)

Return the first path that exists. Legacy plans stay in `execution/` until migrated.

## Transitions

### planning → planned (`/plan ready <slug>`)

```bash
# Move planning/<slug>/ → planned/<slug>/
mkdir -p docs/plan/planned/<slug>
mv docs/plan/planning/<slug>/* docs/plan/planned/<slug>/
rmdir docs/plan/planning/<slug>  # if empty
```

Or equivalent file operations: copy all files, then delete originals.

### planned → in-progress (when `/dev` starts)

When `/dev` is about to execute a phase and the plan is in `planned/`:

```bash
mkdir -p docs/plan/in-progress/<slug>
mv docs/plan/planned/<slug>/* docs/plan/in-progress/<slug>/
rmdir docs/plan/planned/<slug>
```

### in-progress → done (when last phase completes)

When `/dev` completes the **last** phase (all phases in PLAN have acceptance criteria met):

```bash
mkdir -p docs/plan/done/<slug>
mv docs/plan/in-progress/<slug>/* docs/plan/done/<slug>/
rmdir docs/plan/in-progress/<slug>
```

### Legacy (execution/)

Plans in `docs/plan/execution/` are not auto-moved. To adopt lifecycle:
- Manually create `planned/<slug>/` or `in-progress/<slug>/` and copy PLAN, PROMPT_*, TASKS_* there.
- Or leave in execution/; lookup still finds them.
