# Plan Move (Lifecycle Transitions)

Internal flow for moving plans between lifecycle folders. Used by `/plan ready`, `/dev`, and `/ship`.

## Resolve plan location (lookup order)

To find where a plan `<slug>` lives, check in order:

1. `docs/plan/Active/<slug>/PLAN_<slug>.md`
2. `docs/plan/Ready/<slug>/PLAN_<slug>.md`
3. `docs/plan/Draft/<slug>/PLAN_<slug>.md`
4. `docs/plan/Complete/PLAN_<slug>.md` (legacy flat structure)

Return the first path that exists. Legacy plans stay in `execution/` until migrated.

## Transitions

### planning → planned (`/plan ready <slug>`)

```bash
# Move planning/<slug>/ → planned/<slug>/
mkdir -p docs/plan/Ready/<slug>
mv docs/plan/Draft/<slug>/* docs/plan/Ready/<slug>/
rmdir docs/plan/Draft/<slug>  # if empty
```

Or equivalent file operations: copy all files, then delete originals.

### planned → in-progress (when `/dev` starts)

When `/dev` is about to execute a phase and the plan is in `planned/`:

```bash
mkdir -p docs/plan/Active/<slug>
mv docs/plan/Ready/<slug>/* docs/plan/Active/<slug>/
rmdir docs/plan/Ready/<slug>
```

### in-progress → done (when last phase completes)

When `/dev` completes the **last** phase (all phases in PLAN have acceptance criteria met):

```bash
mkdir -p docs/plan/Complete/<slug>
mv docs/plan/Active/<slug>/* docs/plan/Complete/<slug>/
rmdir docs/plan/Active/<slug>
```

### Legacy (execution/)

Plans in `docs/plan/Complete/` are not auto-moved. To adopt lifecycle:
- Manually create `planned/<slug>/` or `in-progress/<slug>/` and copy PLAN, PROMPT_*, TASKS_* there.
- Or leave in execution/; lookup still finds them.
