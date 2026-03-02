# Antigravity Prompt Writer — Write Phase or CLI Prompts

Copy this prompt into Antigravity (or any CLI) to generate /plan, /dev, or CLI prompts from a short description. Wire it as a macro or command if your IDE supports it.

---

## Copy-paste prompt

```text
**Command:** Prompt writer

**Request:** Write a pro prompt for GateFlow from the user's short description below. Output one of:
- A **phase prompt** (for /plan or /dev) — use `.cursor/templates/TEMPLATE_PROMPT_phase.md` structure.
- A **CLI prompt** (for Claude/Gemini/Opencode/Kiro/Kilo/Qwen) — include the correct role prefix from `docs/guides/PROMPT_ENGINEERING.md`.

**Context to load:**
- `docs/guides/PROMPT_ENGINEERING.md`
- `.cursor/templates/TEMPLATE_PROMPT_phase.md`
- `docs/archive/plan-legacy/guidelines/SUBAGENT_HIERARCHY.md`

**User description (replace with your input):**
[E.g. "Add pagination to the scans table" or "Security review for the gates API route" or "Design a new onboarding step for resident portal"]

**Include:** Primary role, Preferred tool, Goal, Scope (in/out), Steps, Acceptance criteria. For CLI: role prefix + GateFlow context snippet.
```

---

## Usage

1. Replace `[E.g....]` with your actual task description.
2. Copy the full block and paste into Antigravity chat or any CLI.
3. Use the generated prompt in Cursor (/plan, /dev) or paste into a CLI terminal.
