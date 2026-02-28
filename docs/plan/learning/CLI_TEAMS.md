# CLI teams (predefined 2–4 CLIs per team)

**Purpose:** Fixed teams of CLIs with clear roles. Cursor is the **master**: it decides when to run a team, applies outputs, and verifies (tests/lint/typecheck). Run a team via **`/clis team <name>`** with `<name>` = `seo` | `refactor` | `audit`.

**Overlap:** Gemini and Opencode appear in more than one team. Claude is only in the Audit team and is **escalation-only** (hardest tasks; not in competition).

---

## Team ratings (why remix matters)

Teams are rated not only by **individual CLI power** but by **remix potential**: when 2–4 different models work in sequence (draft → improve → curate), the combination can produce something **different and new** even if no single CLI is the strongest. Cursor uses these ratings when suggesting which team to run.

| Team | Individual power (avg) | Remix / collaboration potential | Overall | Why |
|------|-------------------------|----------------------------------|---------|-----|
| **seo** | Medium (free + paid mix) | **High** | **High** | Four distinct roles (draft, 2× improve, curate, humanize); multiple perspectives merged by one curator → strong remix; good for content that benefits from variety. |
| **refactor** | Medium | **Medium–High** | **Medium–High** | Lead + second opinion + fast verify; different code styles and context sizes combine well; less “remix” than seo but strong for correctness and coverage. |
| **audit** | High (Claude escalation) | **Medium** | **High** | Broad + code-focused + escalation; remix is across depth (Gemini width, Opencode structure, Claude depth when needed); best for safety, not novelty. |

- **Individual power** — Rough aggregate of model strength per CLI in the team (for reference only).
- **Remix potential** — How much the **combination** of 2–3+ tools produces output that is different or better than any single tool (diversity of perspectives, merge/curate step, humanize).
- Prefer **seo** when you want creative/content remix; **refactor** when you want code quality from multiple angles; **audit** when you want coverage and escalation, not novelty.

---

## Team A — SEO / Content (`seo`)

**Rating:** Remix potential **High** — four roles and a curator merge; can produce something different and new even when no single CLI is the most powerful.

**Roster:** Kiro, Gemini, Opencode, Qwen (4 CLIs).

**Workflow:** Draft → two improvers → curator → humanize. Cursor applies final and verifies.

| Step | Role        | CLI     | Action |
|------|-------------|---------|--------|
| 1    | Drafter     | Kiro or Gemini | First draft from brief (Kiro: free, agentic; Gemini: fast, large context). |
| 2a   | Improver 1  | Opencode | Improve draft: structure, clarity, docs-style. |
| 2b   | Improver 2  | Gemini  | Second improvement pass: tone, structure. |
| 3    | Curator     | Qwen    | Receive draft + 2 improved versions; select best parts; produce single merged version. |
| 4    | Humanize    | Qwen or Gemini | Humanize the curated version (readability, tone). |
| 5    | Apply       | Cursor  | User/agent applies final; optional edits; log each CLI in `CLI_USAGE_AND_RESULTS.md`. |

**Run:** `/clis team seo` — agent runs steps 1–4 (prompts in separate terminals or sequence), then Cursor shows result for step 5.

---

## Team B — Code / Refactor (`refactor`)

**Rating:** Remix potential **Medium–High** — lead + second opinion + verifier; different code perspectives combine for better coverage and correctness.

**Roster:** Opencode, Gemini, Kilo (3 CLIs).

**Workflow:** Refactor/TDD lead → second opinion → fast verification. Cursor integrates.

| Step | Role           | CLI     | Action |
|------|----------------|---------|--------|
| 1    | Refactor lead  | Opencode | Primary refactor, TDD from failing tests, or batch code gen. |
| 2    | Second opinion | Gemini  | Large-context review; structural check; suggest improvements. |
| 3    | Fast verifier  | Kilo    | Quick sanity check or alternative snippet (free, fast). |
| 4    | Integrate      | Cursor  | Apply chosen changes; run preflight; log each CLI used. |

**Run:** `/clis team refactor` — agent runs 1–3, then Cursor integrates in step 4.

---

## Team C — Review / Audit (`audit`)

**Rating:** Remix potential **Medium** — breadth + structure + escalation; strength is coverage and safety, not novelty; Claude excluded from competition.

**Roster:** Gemini, Opencode, Claude (escalation-only).

**Workflow:** Broad pass → code-focused pass → escalate to Claude only for hardest issues.

| Step | Role              | CLI     | Action |
|------|-------------------|---------|--------|
| 1    | First pass (broad) | Gemini  | Large-context scan; wide review; list concerns. |
| 2    | Code-path check   | Opencode | Code structure, imports, patterns, refactor safety. |
| 3    | Escalation        | Claude  | **Only when needed:** security/architecture deep audit; hardest findings. |
| 4    | Apply             | Cursor  | Triage findings; apply fixes; run preflight; log each CLI. |

**Run:** `/clis team audit` — agent runs 1–2; if findings are hard enough, run 3 (Claude). Cursor does step 4.

---

## 80% rule and logging

- Before running any team, check `CLI_LIMITS_TRACKING.md` and `gf-cli-limits`: if a CLI is at **80%+**, do not use it without user permission; substitute or skip that step.
- After the team run, append one log entry **per CLI used** to `CLI_USAGE_AND_RESULTS.md`.
