# Tool & CLI Reference — When to Use Which

This document is the **canonical reference** for choosing **Cursor IDE**, **Claude CLI**, **Gemini CLI**, **Opencode CLI**, **Kiro CLI**, **Kilo CLI**, or **Qwen CLI** so the workspace guide (`/guide`, gf-guide) and phase prompts can suggest the right tool for each task and get the best results.

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

## 5. Kiro CLI

### Power / Strengths

- **qwen3-coder-next (free)** — Sparse MoE (3B active params); 262K token context; strong on agentic coding and error recovery.
- **Speed and cost** — Low cost ($0.07/1M input, $0.30/1M output); efficient for long sessions.
- **MCP support** — Native Model Context Protocol for tool integration.
- **Terminal coding agent** — Lightning-fast CLI; context management and agent steering; custom agents with tool permissions.
- **Best for** — Free-tier agentic coding, large-context terminal tasks, multi-step tool calling, error detection and recovery.

### Weaknesses / Limitations

- **Terminal-only** — No IDE; no inline completions or visual diffs.
- **Model** — Tied to qwen3-coder-next (and any others Kiro adds); not multi-provider like some CLIs.
- **Not ideal for** — Deep security/architecture prose; when you need Claude-level reasoning for audits.

### Best used for

- Free agentic coding from the terminal with large context.
- Terminal-only workflows when you want to avoid paid CLI quotas.
- Agentic coding: multi-step tool calling, error recovery, long development sessions.

**Install:** `curl -fsSL https://cli.kiro.dev/install | bash`

---

## 6. Kilo CLI (Kilo Code)

### Power / Strengths

- **MiniMax M2.5 (free tier)** — 10B active params; strong SWE-bench (e.g. 80.2% Verified); fast (100 tok/s).
- **Open-source** — Terminal AI coding agent; bring your own API keys or use at no markup.
- **Cost-effective** — $0.3/M input, blended cost with cache; good for always-on agents.
- **Optimized for agentic workflows** — Planning and execution; production-level coding tasks.
- **Best for** — Free terminal tasks, fast iteration, cost-effective terminal prompting.

### Weaknesses / Limitations

- **Terminal-only** — No IDE integration.
- **Model availability** — Depends on Kilo’s model list (MiniMax M2.5 and others).
- **Not ideal for** — When you need the highest first-pass correctness for security/architecture audits (prefer Claude).

### Best used for

- Free terminal AI workflows and quick prompts.
- Fast, cost-effective iteration from the terminal.
- Agentic coding tasks when you want a strong free-tier option.

**Install:** `npm i -g @kilocode/cli`

---

## 7. Qwen CLI (Qwen Code)

### Power / Strengths

- **Qwen3 Coder 480B (free tier)** — 256K native context, expandable to 1M with YaRN; 35B active params.
- **Agentic and tool-use** — Strong on agentic coding, browser-use, multi-turn reasoning; comparable to Claude Sonnet 4 on many benchmarks.
- **DashScope API** — OpenAI-compatible; configurable for Alibaba Cloud.
- **CLI capabilities** — Shell scripts, API tests, DevOps automation, error debugging, agentic multi-turn.
- **Best for** — Free agentic CLI work, very large context, tool-use and terminal automation.

### Weaknesses / Limitations

- **Terminal-only** — No IDE; requires Node.js 20+ for CLI.
- **API dependency** — Uses DashScope (or self-hosted); not fully offline unless using vLLM/LM Studio/Ollama.
- **Not ideal for** — When you need Claude for security/audit depth or Gemini’s multimodal in one place.

### Best used for

- Free agentic terminal coding with very large context.
- Tool-use and multi-step reasoning from the terminal.
- When you want a strong free-tier alternative to Claude/Gemini for code.

**Install:** `npm i -g @qwen-code/qwen-code`

---

## 8. User tools & plans (reference for /guide)

Use this table so the guide can tailor suggestions to the tools and plans you actually use. Update the “Plan” column to match your setup.

| Tool | Default model / plan | Notes |
|------|----------------------|--------|
| **Cursor IDE** | $20 plan | Primary IDE; /plan, /dev, /ship, subagents. |
| **Claude CLI** | $20 plan | Security, architecture, complex refactors, CI. |
| **Gemini CLI** (Antigravity) | $20 plan | Large context, speed, multimodal. |
| **Opencode CLI** | free | TDD, refactors, docs-from-code, batch code gen. |
| **Kiro CLI** | qwen3-coder-next (free) | Agentic terminal coding, 262K context, MCP. |
| **Kilo CLI** | MiniMax M2.5 (free tier) | Terminal agent, SWE-bench strong, cost-effective. |
| **Qwen CLI** | Qwen3 Coder 480B (free tier) | Agentic CLI, 256K–1M context, tool-use. |

---

## 9. Task-to-tool matrix (for the Guide)

Use this table when suggesting which tool to use. **Primary** = best default; **Also good** = valid alternative when constraints differ (e.g. speed vs correctness, cost, or context size).

| Task or goal | Primary tool | Also good | Prefer CLI when |
|--------------|--------------|-----------|------------------|
| Inline edit, quick fix, new component | **Cursor IDE** | — | — |
| Explore codebase, navigate, small edits | **Cursor IDE** | Gemini CLI, Kiro CLI, Qwen CLI (large repo) | Need huge context in terminal |
| Security review / audit | **Claude CLI** | Cursor (with gf-security) | You want highest correctness, audit trail |
| Architecture review / design | **Claude CLI** | Cursor | Deep reasoning in terminal |
| Prisma / schema / DB queries | **Gemini CLI** | Cursor, Claude CLI, Kilo CLI | Fast iteration, large schema in one context |
| Multi-file refactor (many files) | **Claude CLI** or **Opencode CLI** | Cursor, Kiro CLI, Qwen CLI | Autonomous, repeatable, or CI |
| TDD: implement from failing tests | **Opencode CLI** | Cursor, Kilo CLI | Terminal-first, batch |
| Docs sync with code / API docs | **Opencode CLI** | Cursor | Automated, project-wide |
| Quick structural check / second opinion | **Gemini CLI** | Cursor, Kilo CLI, Kiro CLI | Speed and cost matter |
| CI/CD, pre-commit, headless automation | **Claude CLI** | Opencode CLI | Scripted, no IDE |
| Batch code gen / scaffolds | **Opencode CLI** | Claude CLI, Kiro CLI, Qwen CLI | Terminal, many files |
| Planning phases, prompts, /plan | **Cursor IDE** | Claude CLI | Using Cursor commands and skills |
| Free-tier agentic coding, large context (terminal) | **Kiro CLI** or **Qwen CLI** | Kilo CLI | Free; agentic; 262K–1M context |
| Free terminal tasks, fast iteration | **Kilo CLI** or **Kiro CLI** | Qwen CLI | Free tier; no paid CLI quota |

---

## 9.1 CLI teams (run via `/clis team`)

**Cursor is master:** Cursor decides when to run a team; CLI outputs are proposals until Cursor applies and verifies. Predefined teams (see **`docs/plan/learning/CLI_TEAMS.md`**):

| Team | Command | CLIs | Purpose |
|------|---------|------|---------|
| **SEO / Content** | `/clis team seo` | Kiro, Gemini, Opencode, Qwen | Draft → 2 improvers → curator → humanize. |
| **Code / Refactor** | `/clis team refactor` | Opencode, Gemini, Kilo | Refactor lead → second opinion → fast verify. |
| **Review / Audit** | `/clis team audit` | Gemini, Opencode, Claude (escalation only) | Broad pass → code pass → escalate to Claude for hardest. |

Respect the **80% rule** before running a team; prefer tool choice from **`CLI_TOOL_MEMORY.md`** when present; **Claude is escalation-only** and excluded from competition scoring.

---

## 10. Quick reference for the Guide (gf-guide)

When recommending a tool or CLI:

0. **Cursor is master; tool memory** — Cursor decides. When suggesting a CLI, consult **`docs/plan/learning/CLI_TOOL_MEMORY.md`** when present; prefer the recommended tool for that task type. Respect 80% rule; **Claude is escalation-only** and excluded from competition scoring.
1. **Load this file** — `docs/guides/TOOL_AND_CLI_REFERENCE.md` — when suggesting “use X for this task.”
2. **Match the task** — Use Section 9 (task-to-tool matrix) for the primary and “also good” options.
3. **Phrase the suggestion** — e.g. “For [task], use [Primary tool]; for [reason]. Alternatively, [Also good] if [condition].”
4. **Security / architecture** — Prefer suggesting **Claude CLI** (and loading gf-security in Cursor when staying in IDE).
5. **Schema / DB / Prisma / large context** — Prefer **Gemini CLI** for speed and context; suggest Cursor or Claude when correctness is paramount.
6. **Refactor / TDD / batch code / docs-from-code** — Prefer **Opencode CLI**; suggest Claude CLI for the most complex refactors.
7. **Daily coding, phases, /dev, /ship** — Prefer **Cursor IDE** with subagents and phase prompts.
8. **Free-tier agentic / large context (terminal)** — Suggest **Kiro CLI** (qwen3-coder-next, 262K) or **Qwen CLI** (480B, 256K–1M); **Kilo CLI** (MiniMax M2.5) for fast free terminal tasks.
9. **User’s tools** — If the user has listed preferred CLIs (e.g. in `GUIDE_PREFERENCES.md` or “My tools”), prefer suggesting those when they match the task (Section 8).

10. **Limits awareness** — Before suggesting or using any CLI, load **gf-cli-limits** skill. If a CLI is at **80%+ of its limit** (per `CLI_LIMITS_TRACKING.md` or `GUIDE_PREFERENCES.md`), **do not use or suggest it** without the user's explicit permission. If "near limit" or "prefer free today", prefer **free-tier** CLIs (Kiro, Kilo, Qwen, Opencode) or Cursor when the matrix allows.
11. **Record results** — After a task completed with any CLI, append one entry to **`docs/plan/learning/CLI_USAGE_AND_RESULTS.md`** (date, CLI, task/phrase, outcome, notes). This supports better future decisions and analysis of which CLI works best for which task type.

---

## 11. Recording results and limits (for agents and /guide)

- **Recording:** After any task or phase executed **with a CLI**, add one row to the log table in `docs/plan/learning/CLI_USAGE_AND_RESULTS.md`: Date | CLI | Task/phase | Outcome (success/partial/fail) | Notes. Keep entries short. This enables future dissection and better tool choice.
- **Limits:** Load **`.cursor/skills/gf-cli-limits/SKILL.md`** when suggesting or using a CLI. **80% rule:** If a CLI has reached **80% or more** of its limit, **agents and commands must NOT use that CLI** without the user's explicit permission. If "near limit" or "prefer free today", suggest **Kiro CLI**, **Kilo CLI**, **Qwen CLI**, or **Opencode CLI** (or Cursor) instead when the matrix allows.

---

*Sources: Anthropic Claude Code docs, Google Gemini CLI docs, OpenCode docs, Kiro CLI docs, Kilo Code docs, Qwen Code docs, and third-party comparisons (Cursor vs Claude Code, Gemini CLI vs Claude CLI, terminal AI assistants 2024–2026). Update this doc when tool capabilities or team preferences change.*
