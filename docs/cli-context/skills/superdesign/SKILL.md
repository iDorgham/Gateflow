---
name: superdesign
description: >
  Superdesign is a design agent specialized in frontend UI/UX design and infinite-canvas design drafts. Use this skill before implementing or refactoring any UI that requires design thinking, visual alignment with an existing design system, or exploration of alternative design directions. Trigger when the user mentions SuperDesign, superdesign CLI commands, design drafts, design iterations, or improving the design of specific pages, flows, or components.
---

# SuperDesign

SuperDesign helps the agent (1) find design inspirations/styles and (2) generate or iterate design drafts on an infinite canvas, then translate those drafts into high-quality frontend implementations.

## Metadata

- **author**: superdesign
- **version**: 0.0.1

## When to Use This Skill

Use this skill whenever:

- The user asks to **design**, **redesign**, or **improve** the UI/UX of a page, flow, or component.
- The user mentions **SuperDesign**, **superdesign**, or any of the following commands:
  - `superdesign create-project`
  - `superdesign create-design-draft`
  - `superdesign iterate-design-draft`
  - `superdesign execute-flow-pages`
  - `superdesign init`
- You need **design explorations** (e.g., "dark theme", "minimal", "dashboard layout") before writing or changing UI code.
- You need to **faithfully reproduce** an existing screen or implement a design variation based on current code.

If you are about to implement or significantly change a UI and no relevant SuperDesign project/draft exists yet, prefer using this skill first to shape the design direction.

**gateflow-planner integration:** When executing phased plans, phases that add or redesign UI should run SuperDesign (create-design-draft or iterate-design-draft) *before* implementation. See `.cursor/skills/gateflow-planner/SKILL.md` for pro prompt template.

---

## Core Scenarios (What This Skill Handles)

1. **`superdesign init`** — Analyze the repo and build UI context under `.superdesign/init/`.
2. **“Help me design X”** — Create or iterate a design draft for a feature, page, or flow.
3. **Set or evolve the design system** — Colors, typography, spacing, components, and patterns.
4. **“Help me improve design of X”** — Use existing code and SuperDesign drafts to refine layouts and visuals.

This skill orchestrates:

- Setting up and maintaining SuperDesign **project and init context**.
- Ensuring the **CLI is installed and logged in** before any SuperDesign command.
- Selecting and passing the right **context files and line ranges** to SuperDesign.
- Mapping resulting design decisions back into the Next.js/React codebase.

---

## SuperDesign CLI – Mandatory Pre-Checks

Before running **any** `superdesign` CLI command, always:

1. **Check if the CLI is installed**

   Use the shell tool:

   ```bash
   superdesign --version
   ```

   - If this succeeds (prints a version), **do not reinstall**. Continue to login check.
   - If it fails with “command not found” or similar, install globally:

   ```bash
   npm install -g @superdesign/cli@latest
   ```

2. **Check login status**

   Run a harmless CLI command, for example:

   ```bash
   superdesign --help
   ```

   - If output indicates you are **not authenticated** or must log in, run:

   ```bash
   superdesign login
   ```

   - Wait for login to complete successfully (follow the interactive flow in the browser or terminal).

3. **Only after a successful login**, proceed to run the intended SuperDesign command (e.g. `create-project`, `create-design-draft`, `iterate-design-draft`, `execute-flow-pages`, `init`).

> **Never assume the CLI is installed or that the user is logged in.** Always verify installation and login first as described above.

---

## Init: Repo Analysis and Context (.superdesign/init)

### When to Run Init

- If the `.superdesign/init/` directory **does not exist** or is **empty**, you MUST:
  1. Create the directory.
  2. Fetch the **INIT instructions**.
  3. Analyze the repo and write init context files.

Do **not** ask the user to run `superdesign init` or create the directory manually; orchestrate everything via tools.

### Fetch INIT Instructions (Mandatory)

Before performing repo analysis for init, you MUST fetch a fresh copy of the INIT specification:

```text
https://raw.githubusercontent.com/superdesigndev/superdesign-skill/main/skills/superdesign/INIT.md
```

Use the `WebFetch` tool to retrieve this document. Then follow its instructions **step by step** to:

- Discover components, layouts, pages, and theme information.
- Write summarized context into `.superdesign/init/`.

### Required Init Files

After init completes, `.superdesign/init/` should contain these files at minimum:

- `components.md` — Shared UI primitives with full or representative source code.
- `layouts.md` — Shared layout components (nav, sidebar, header, footer, shells).
- `routes.md` — Page/route mapping across the app(s).
- `theme.md` — Design tokens, CSS variables, Tailwind configuration, typography, spacing.
- `pages.md` — Page component dependency trees (which files each page depends on).

If `.superdesign/init/` exists and contains these files, you MUST read **all of them** before any design task.

---

## SUPERDESIGN Guidelines (Mandatory)

Before using SuperDesign for any design-related task, you MUST fetch the up-to-date SuperDesign guidelines:

```text
https://raw.githubusercontent.com/superdesigndev/superdesign-skill/main/skills/superdesign/SUPERDESIGN.md
```

Use the `WebFetch` tool to retrieve this document.

- Always fetch a **fresh** copy (do not rely on stale or cached content).
- Follow the instructions in `SUPERDESIGN.md` precisely when:
  - Creating projects.
  - Creating or iterating design drafts.
  - Executing flows or pages.
  - Mapping SuperDesign outputs back into code.

If `SUPERDESIGN.md` and `INIT.md` ever conflict, prefer **SUPERDESIGN.md** for design behavior, while using `INIT.md` specifically for init and context-building processes.

---

## Context Files and Line Ranges

SuperDesign commands support context files and optional line ranges via:

- `--context-file path/to/file.tsx`
- `--context-file path/to/file.tsx:startLine:endLine`

When deciding context:

- Prefer **complete components/files** for high-level design exploration.
- Use **line ranges** when you want SuperDesign to focus on a particular component or section within a file.

### Page-Specific Design Tasks

When designing or improving an **existing page**:

1. Look up the page in `.superdesign/init/pages.md` to get its **complete dependency tree**.
2. For every file in that dependency tree, add a corresponding:
   - `--context-file path/to/file` or
   - `--context-file path/to/file:startLine:endLine`
3. Additionally include:
   - `globals.css` (or equivalent global stylesheet),
   - `tailwind.config.*` (e.g. `tailwind.config.ts`),
   - Any `design-system.md` or similar documentation discovered in init.

These files ensure SuperDesign understands the component library, layout primitives, and design tokens.

---

## Core Commands and How to Use Them

All commands assume the CLI is installed and logged in (see **SuperDesign CLI – Mandatory Pre-Checks**).

### 1. `superdesign create-project` — Create/Select Project

Use this when starting a new design initiative or when the user asks to “help me design X” and no relevant project exists yet.

Example:

```bash
superdesign create-project --title "GateFlow Client Dashboard"
```

Guidelines:

- Name projects at the **feature/app level** (e.g. “Admin Dashboard Analytics”, “Resident Portal Onboarding”).
- Associate new design drafts with the most relevant project rather than creating a new project for every small change.

### 2. `superdesign create-design-draft` — Faithful Reproduction or New Draft

Use this to create a new design draft, especially when:

- You want a **faithful reproduction** of an existing UI (from code).
- You want an initial concept for a new page or flow.

Example (faithful reproduction from a component):

```bash
superdesign create-design-draft \
  --project-id <projectId> \
  --title "Current UI – Dashboard Overview" \
  -p "Faithfully reproduce the current UI from this code, matching layout, spacing, and hierarchy as closely as possible." \
  --context-file apps/client-dashboard/src/app/[locale]/dashboard/page.tsx
```

You may pass multiple `--context-file` flags to cover the full layout and key components.

### 3. `superdesign iterate-design-draft` — Variations and Improvements

Use this to explore **variations** on an existing draft, such as themes, layouts, or density changes.

Example (branching for a dark, minimal theme):

```bash
superdesign iterate-design-draft \
  --draft-id <draftId> \
  -p "Apply a dark theme optimized for contrast and accessibility." \
  -p "Make the layout minimal, with reduced chrome and clear visual hierarchy." \
  --mode branch \
  --context-file apps/client-dashboard/src/app/[locale]/dashboard/page.tsx
```

Guidelines:

- Use multiple `-p` prompts for distinct constraints (e.g. “dark theme”, “minimal”, “mobile-first”, “enterprise-grade analytics”).
- Prefer `--mode branch` when you want to keep the original draft intact while exploring alternatives.

### 4. `superdesign execute-flow-pages` — Extending Across Pages/Flows

Use this to extend a design system or layout pattern across multiple pages in a flow.

Example:

```bash
superdesign execute-flow-pages \
  --draft-id <draftId> \
  --pages '[ "Dashboard", "Scans", "Gates", "Projects" ]' \
  --context-file apps/client-dashboard/src/app/[locale]/dashboard/layout.tsx
```

Guidelines:

- Choose `--pages` values that correspond to meaningful steps or sections (e.g. “Login”, “Onboarding Step 1”, “Billing Settings”).
- Always include the shared layout and top-level route component(s) as context files so SuperDesign sees navigation structure and shell patterns.

---

## Workflow Patterns

### A. First-Time Setup in a Repo

1. **Check CLI install and login**.
2. **Check `.superdesign/init/`**:
   - If missing or empty:
     - Create `.superdesign/init/`.
     - Fetch `INIT.md` via `WebFetch`.
     - Run the analysis steps from `INIT.md` to populate:
       - `components.md`
       - `layouts.md`
       - `routes.md`
       - `theme.md`
       - `pages.md`
3. Fetch `SUPERDESIGN.md` via `WebFetch` and skim to understand:
   - Design exploration patterns.
   - How SuperDesign expects context and prompts.
4. Create a project with `superdesign create-project` for the main app or feature area.

### B. Designing a New Feature/Page

1. Ensure init is done and `.superdesign/init/` is populated.
2. Fetch `SUPERDESIGN.md` and review any relevant guidance.
3. Identify:
   - The main page or route component.
   - Layouts/components from `pages.md` and `components.md`.
4. Run `superdesign create-design-draft` with:
   - `--project-id` for the correct project.
   - A clear `--title`.
   - Prompts that describe:
     - Purpose of the page/feature.
     - Target user and context.
     - Any constraints (branding, platform, responsiveness, accessibility).
   - One or more `--context-file` flags covering relevant code.

### C. Improving an Existing Design

1. Locate the relevant design draft and `draft-id`.
2. Review:
   - `.superdesign/init/pages.md` dependency tree.
   - Current code for the affected components.
3. Run `superdesign iterate-design-draft` with:
   - `--draft-id`.
   - Prompts capturing improvements (e.g. “simplify information hierarchy”, “optimize for small screens”, “reduce cognitive load”).
   - `--mode branch` unless explicitly overwriting.
   - Appropriate `--context-file` arguments.
4. Translate SuperDesign’s recommendations into code changes, aligning with:
   - Existing design tokens.
   - Shared UI components.
   - Accessibility and responsiveness expectations.

---

## Implementation Guidance After Designs Are Ready

When applying SuperDesign outputs back into the codebase:

- **Respect existing design tokens and themes** from:
  - `.superdesign/init/theme.md`
  - `tailwind.config.*`
  - `design-system.md` or equivalent.
- Prefer **shared UI primitives** (`components.md`) over one-off bespoke components:
  - Buttons, inputs, tables, cards, badges, layouts.
- Keep JSX/TSX components:
  - Small and focused.
  - Accessible (ARIA, semantics, keyboard navigation).
  - Responsive using established breakpoints and layout primitives.
- Avoid introducing new ad-hoc styling systems; extend the existing system when necessary.

If there is any ambiguity between SuperDesign’s suggestions and the current design system, bias toward **consistency with the existing system**, and, if needed, run another `iterate-design-draft` to harmonize.

---

## Summary

- **Always** ensure the SuperDesign CLI is installed and logged in before commands.
- **Always** run or verify init (`.superdesign/init/`) and read its files before design tasks.
- **Always** fetch fresh `INIT.md` and `SUPERDESIGN.md` via `WebFetch` and follow their instructions.
- Use `create-project`, `create-design-draft`, `iterate-design-draft`, and `execute-flow-pages` to structure design work, passing rich `--context-file` inputs and clear prompts.
- Map SuperDesign outputs back into the codebase using existing design systems, layouts, and components for consistent, high-quality UI/UX.

