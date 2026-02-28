# Tool & CLI Reference — When to Use Which

This document is the **canonical reference** for choosing **Cursor IDE**, **Claude CLI**, **Gemini CLI**, or **Opencode CLI** so the workspace guide (`/guide`, gf-guide) and phase prompts can suggest the right tool for each task and get the best results.

**Used by:** `.cursor/skills/gf-guide/SKILL.md` — when recommending next steps or suggesting a CLI, the guide should check this reference for accurate task-to-tool mapping.

---

## 1. Cursor IDE

### Power / Strengths

- **Real-time inline completions** — sub-100ms predictions while typing; flow-state coding without leaving the editor.
- **Visual iteration** — live diffs and checkpoints; review and accept/reject changes in place.
- **Multi-model** — Claude, GPT, Gemini, and others in one place; switch by task.
- **Familiar UX** — VS Code fork; zero migration for existing workflows.
- **Background agents** — work in parallel (explore, shell, browser-use) while you keep coding.
- **Best for** — Quick inline edits (Cmd+K), new components with visual iteration, exploring unfamiliar codebases with navigation, interactive multi-file edits when you want to stay in the editor.

### Weaknesses / Limitations

- **Context and quotas** — large context can be truncated in practice; usage limits apply per plan.
- **Not ideal for** — Fully autonomous multi-file refactors (10+ files), CI/CD or headless automation, or when you need repeatable scripted runs without the IDE.

### Best used for

- Day-to-day coding with inline edits and immediate feedback.
- Exploring the codebase and making small-to-medium, reviewable changes.
- Running `/plan`, `/dev`, `/ship` and phase-based workflows with subagents.
- When the task benefits from visual diffs, checkpoints, and staying in one IDE.

---

## 2. Claude CLI (Claude Code)

### Power / Strengths

- **Code quality and reasoning** — very high first-pass correctness; strong at multi-file refactoring and deep codebase understanding across many files.
- **Complex, autonomous tasks** — multi-file edits, agentic workflows, governed execution with manifests and subagents.
- **CI/CD and scripting** — integrates into shell scripts, pipelines, and headless runs; MCP and hooks for automation.
- **Token efficiency** — often uses fewer tokens than IDE-based flows for equivalent refactors; good for large codebases within its context window (~200K tokens).
- **Best for** — Security and architecture reviews, detailed audits, multi-step planning, bug-fixing accuracy, and tasks where correctness matters more than speed.

### Weaknesses / Limitations

- **Terminal-only** — no inline autocomplete, no visual diffs; all interaction via CLI.
- **Model lock-in** — Anthropic models only (Opus, Sonnet, Haiku).
- **Usage caps** — daily operation limits on Pro (e.g. 50–190 CLI ops/day depending on plan); resets apply.
- **Not ideal for** — Quick, interactive tweaks; tasks that need real-time visual feedback or very large single-context windows (e.g. 1M+ tokens).

### Best used for

- Security reviews, architecture reviews, and compliance-style audits.
- Complex multi-file refactors and codebase-wide changes.
- CI/CD automation, pre-commit hooks, and repeatable scripted tasks.
- When you need the highest code correctness and deep reasoning over speed.

---

## 3. Gemini CLI

### Power / Strengths

- **Large context** — up to 1M token context window; can reason over big monorepos or long docs without chunking.
- **Speed** — fast iteration and responses; good for quick structural checks and snippets.
- **Multimodal** — images, PDFs, video, audio; useful for docs, diagrams, or UI references.
- **Google ecosystem** — search grounding, Google Cloud integrations when configured.
- **Cost and openness** — generous free tier (e.g. 1,000 req/day); open-source (Apache 2.0); good for high-volume, lower-cost usage.
- **Best for** — Schema/DB work, Prisma and query design, quick structural analysis, and when you want a second opinion fast.

### Weaknesses / Limitations

- **Code correctness** — generally high but can be less consistent than Claude on complex reasoning and bug-fixing.
- **Rate limits** — 429s when exceeding quotas; free tier and Code Assist share quota.
- **Platform** — Windows has limitations on Unix-style commands without compatibility layers.
- **Not ideal for** — Tasks that require the highest first-pass correctness or very long, nuanced security/architecture write-ups.

### Best used for

- Prisma schema design, migrations, and DB query suggestions.
- Quick codebase structure checks and “second opinion” snippets.
- Large-repo analysis and exploration when context size matters.
- Fast, cost-effective iteration when perfect first-pass accuracy is not critical.

---

## 4. Opencode CLI

### Power / Strengths

- **Code-focused agent** — built for terminal-based code generation, refactors, and scaffolds.
- **Context-aware** — understands project structure and patterns; good at TDD (read test failures, fix code) and doc-update tasks.
- **Modes** — “build” (full file operations) vs “plan” (analysis only); supports interactive TUI, one-off commands, and headless/server.
- **MCP and automation** — integrates with external tools (DB, APIs); can run in CI and scripts.
- **Best for** — Refactoring and restructuring (e.g. splitting files, updating imports), test-driven implementation, doc maintenance from code, and batch code generation without the IDE.

### Weaknesses / Limitations

- **Terminal-only** — no IDE integration; no inline completions or visual diffs.
- **Less emphasis on** — Deep security/architecture prose or very long-form reasoning compared to Claude.
- **Not ideal for** — Interactive flow-state editing or when you want to stay inside Cursor with real-time feedback.

### Best used for

- Multi-file refactors and code restructuring (e.g. splitting modules, fixing imports).
- TDD: implement features by reading test failures and modifying code.
- Documentation updates driven by actual code (e.g. syncing README/API docs).
- Batch code generation, scaffolds, and terminal-only code workflows.

---

## 5. Task-to-tool matrix (for the Guide)

Use this table when suggesting which tool to use. **Primary** = best default; **Also good** = valid alternative when constraints differ (e.g. speed vs correctness, cost, or context size).

| Task or goal | Primary tool | Also good | Prefer CLI when |
|--------------|--------------|-----------|------------------|
| Inline edit, quick fix, new component | **Cursor IDE** | — | — |
| Explore codebase, navigate, small edits | **Cursor IDE** | Gemini CLI (large repo) | Need huge context in terminal |
| Security review / audit | **Claude CLI** | Cursor (with gf-security) | You want highest correctness, audit trail |
| Architecture review / design | **Claude CLI** | Cursor | Deep reasoning in terminal |
| Prisma / schema / DB queries | **Gemini CLI** | Cursor, Claude CLI | Fast iteration, large schema in one context |
| Multi-file refactor (many files) | **Claude CLI** or **Opencode CLI** | Cursor | Autonomous, repeatable, or CI |
| TDD: implement from failing tests | **Opencode CLI** | Cursor | Terminal-first, batch |
| Docs sync with code / API docs | **Opencode CLI** | Cursor | Automated, project-wide |
| Quick structural check / second opinion | **Gemini CLI** | Cursor | Speed and cost matter |
| CI/CD, pre-commit, headless automation | **Claude CLI** | Opencode CLI | Scripted, no IDE |
| Batch code gen / scaffolds | **Opencode CLI** | Claude CLI | Terminal, many files |
| Planning phases, prompts, /plan | **Cursor IDE** | Claude CLI | Using Cursor commands and skills |

---

## 6. Quick reference for the Guide (gf-guide)

When recommending a tool or CLI:

1. **Load this file** — `docs/guides/TOOL_AND_CLI_REFERENCE.md` — when suggesting “use X for this task.”
2. **Match the task** — Use Section 5 (task-to-tool matrix) for the primary and “also good” options.
3. **Phrase the suggestion** — e.g. “For [task], use [Primary tool]; for [reason]. Alternatively, [Also good] if [condition].”
4. **Security / architecture** — Prefer suggesting **Claude CLI** (and loading gf-security in Cursor when staying in IDE).
5. **Schema / DB / Prisma / large context** — Prefer **Gemini CLI** for speed and context; suggest Cursor or Claude when correctness is paramount.
6. **Refactor / TDD / batch code / docs-from-code** — Prefer **Opencode CLI**; suggest Claude CLI for the most complex refactors.
7. **Daily coding, phases, /dev, /ship** — Prefer **Cursor IDE** with subagents and phase prompts.

---

*Sources: Anthropic Claude Code docs, Google Gemini CLI docs, OpenCode docs, and third-party comparisons (Cursor vs Claude Code, Gemini CLI vs Claude CLI, terminal AI assistants 2024–2026). Update this doc when tool capabilities or team preferences change.*
