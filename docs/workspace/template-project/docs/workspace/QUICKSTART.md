# Quickstart

Get a new project set up in 5 steps.

---

## 1 — Copy the template

```bash
cp -r path/to/template-project/ ./
cd template-project && pnpm install
```

---

## 2 — Fill in your PRD

Edit `docs/workspace/PRD.md`:

- Product name and description
- Target users
- Core features
- MVP scope (3 phases minimum)

---

## 3 — Run the installer

```bash
pnpm workspace:install
```

Prompts for: project name, slug, default branch.
Creates: plan folders, workspace docs, AI folders from `ops-core/`, baseline files (`.gitignore`, `.env.example`, CI workflow).

---

## 4 — Initialize context layer

```bash
pnpm cache:build    # scans project → WORKSPACE_INDEX.md
pnpm memory:init    # creates docs/system/memory/ starter files
pnpm docs:index     # generates docs/README.md
```

---

## 5 — Validate and start

```bash
pnpm template:validate   # confirm structure is correct
/plan <slug>             # create your first plan
```

---

## Result

- `docs/` organized with auto-generated index
- AI folders installed: `.cursor` `.claude` `.antigravity` `.gemini` `.opencode`
- Cache and memory initialized under `docs/system/`
- CI configured at `.github/workflows/ci.yml`
- First plan ready in `plan/planned/<slug>/`

---

Complete `docs/workspace/POST_INSTALL_CHECKLIST.md` before starting implementation.
