# IDEA: Workspace Guide (pre-flight, post-task, “what should I do now”)

**Status:** Implemented  
**Created:** From /create-agent-skill + /create-skill + /create-rule request  
**References:** `GATEFLOW_CONFIG.md` §6, `.cursor/skills/gf-guide/SKILL.md`, `.cursor/rules/02-gateflow-guide.mdc`, `.cursor/commands/guide.md`

---

## 1. Goal

Provide a **workspace guide** that:

- Understands how the repo is built: Skills, Agents, Subagents, Rules, Commands, Templates, Automations, Contracts, and `GATEFLOW_CONFIG.md`.
- Understands the project (`docs/`, PRD v6, plan, progress) and other AI tools the user can use.
- After each task (or on demand) tells the user what they **must do next**, what’s **recommended**, what’s **critical**, and suggests **improvements**.
- Can be invoked via **“/guide what should I do now”**.
- Has **super powers**: can work instead of the user, follow the plan, use the hierarchy (Team Agents, Subagents, Skills, Commands) and CLI tools in Cursor terminals.
- **Always checks** automations, tests, app performance, and code quality and confirms everything is working.
- **Before** starting a prompt task: checks if the user should do something else first and offers **1 — Proceed** or **2 — Do the suggestions first**.
- Can be wired into **commands, workflows, and automations**.

---

## 2. Best practice: Skill vs Agent vs Command

| Option | Role | Recommendation |
|--------|------|----------------|
| **Skill** | Teaches the AI *how* to be the guide (workspace map, pre-flight, post-task, “what should I do now”, super-power mode, quality checks). | **Use.** Single source of truth for guide behavior; reusable from rule and command. |
| **Agent** | A dedicated “Guide” persona (e.g. in `.cursor/agents/roles/guide.md`). | Optional. The guide is a *mode* (invoked by rule/command) rather than a separate persona; the skill is enough. Add an agent only if you want a distinct voice/persona. |
| **Command** | `/guide` — explicit “run the guide” entry point. | **Use.** Gives the user a clear slash command and a place to document usage (e.g. “/guide what should I do now”, super-power mode). |
| **Rule** | Always-on rule that runs pre-flight before tasks and (optionally) post-task summary; triggers full guide when user says /guide or “what should I do now”. | **Use.** Makes “before/after prompt” behavior part of the default flow without a separate agent. |

**Conclusion:** Implement as **Skill + Rule + Command**. No separate agent required unless you later want a dedicated Guide persona.

---

## 3. In-chat workflow (before/after prompt)

- **Before prompt:** The **rule** `02-gateflow-guide.mdc` (always-on) instructs the AI to run **pre-flight** from the gf-guide skill. If something should be done first, the AI offers “1 — Proceed” or “2 — Do suggestions first”. So the guide runs **automatically** before executing the user’s task, within the same chat turn.
- **After prompt:** The same rule asks for an **optional short guide summary** after completing a task (must do, recommended, critical, improvements). So the guide runs **automatically** after the task, again in chat.
- **Explicit ask:** When the user says `/guide` or “what should I do now”, the rule tells the AI to invoke the **gf-guide** skill **fully** (full context load, state assessment, report, optional super-power mode).

Cursor does not expose literal “before every prompt” / “after every prompt” hooks; the **always-on rule** is the way to get that behavior in chat.

---

## 4. Implemented pieces

| Piece | Path | Purpose |
|-------|------|---------|
| **Skill** | `.cursor/skills/gf-guide/SKILL.md` | Workspace map, pre-flight, post-task, “what should I do now”, super-power mode, quality checks. |
| **Rule** | `.cursor/rules/02-gateflow-guide.mdc` | Pre-flight before tasks (with “proceed” vs “do first”); full guide on /guide or “what should I do now”; optional post-task summary. |
| **Command** | `.cursor/commands/guide.md` | `/guide` — full guide pass and optional super-power mode. |
| **Config** | `GATEFLOW_CONFIG.md` §1 and §6 | Documents `/guide` in master commands and adds “Workspace Guide” section. |
| **Workflow rule** | `.cursor/rules/01-gateflow-ai-workflow.mdc` | Adds `/guide` to the master slash-command table. |

---

## 5. Integration with commands and automations

- **Pre-flight** and **post-task** logic live in the **gf-guide** skill; the rule and command reference that skill. Internal flows (e.g. in `.cursor/commands-ref/`) or docs can say: “Before running phase work, consider pre-flight per gf-guide” and “After phase, give guide summary per gf-guide.”
- **/dev** and **/ship** already run `/ready` (preflight) and phase prompts; the guide does not replace them but can **suggest** running `/ready` or the next phase when the user asks “what should I do now”.
- **Super-power mode**: When the user asks the guide to “do it for me” or “follow the plan”, the AI uses the skill to run phases (via phase prompts), subagents, and shell commands (`pnpm preflight`, etc.) as described in the skill.
