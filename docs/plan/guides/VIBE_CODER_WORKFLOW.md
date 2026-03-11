# Vibe Coder Workflow — GateFlow Remix

A **low-friction development flow** for vibe coders, remixing [BMad Method](https://github.com/bmad-code-org/BMAD-METHOD) Quick Flow and [Kiro](https://kiro.dev/docs/specs/feature-specs/) Requirements-First / Design-First.

**Goal:** Keep the fun of vibe coding, add structure only when it helps — so you build *viable* code without ceremony overload.

---

## 1. What We Borrow

### From BMad Method

- **Quick Flow** — Two commands: quick-spec (plan) and quick-dev (build). Skip PRD/Architecture for small work.
- **Scale-adaptive** — Automatically adjusts: bug fix = no plan; multi-file feature = minimal spec.
- **`/bmad-help`** — "What's next?" anytime. GateFlow: `/guide` does this.
- **Adversarial review** — Optional code review before wrap-up for high-risk changes.
- **Escalation** — When scope creeps, recommend full plan.

### From Kiro

- **Requirements-First** — Start with behavior → requirements (EARS) → design → tasks. Best when you know *what* you want.
- **Design-First** — Start with architecture → derive requirements → tasks. Best when you know *how* it should work.
- **EARS notation** — `WHEN [condition] THE SYSTEM SHALL [behavior]` for clear, testable requirements.
- **Spec-driven** — Natural prompt → structured spec → executable tasks.
- **"Vibe coding to viable code"** — Structure when needed, flow when not.

---

## 2. Vibe Coder Modes

| Mode | When | Flow |
|------|------|------|
| **Pure vibe** | Bug fix, tiny tweak, single file | Chat → code → `/github`. No plan. |
| **Quick spec** | Small feature, refactor with clear scope | Describe → minimal spec (1–2 phases) → `/dev` |
| **Requirements-first** | You know the behavior | Requirements (EARS) → Design → Phases → `/dev` |
| **Design-first** | You have architecture in mind | Design → Requirements → Phases → `/dev` |
| **Full plan** | Complex feature, multi-team | `/idea` → `/plan` → `/plan ready` → `/dev` |

---

## 3. Commands & Flow

### `/vibe` or `/quick` (proposed)

Lightweight entry for vibe coders:

```
/vibe "add a dark mode toggle to settings"
```

**Behavior:**
1. Assess scope (single file? multi-component?).
2. If tiny → suggest direct implementation (no plan).
3. If small → generate **minimal spec** (1–2 phases) in `planning/quick-<slug>/`.
4. If complex → suggest `/plan` with full workflow.

**Output:** Either "Go ahead and implement" or a minimal `PLAN_quick_<slug>.md` + 1–2 phase prompts.

### Requirements-First (like Kiro)

When you know *what* the system should do:

1. **Describe behavior** — "Users should be able to export scans as CSV with date range filter."
2. **Requirements (EARS)** — Agent generates:
   ```
   WHEN a user selects date range and clicks Export
   THE SYSTEM SHALL download a CSV of scan logs for that range
   WHEN no scans exist for the range
   THE SYSTEM SHALL return an empty file with headers
   ```
3. **Minimal design** — Key components, API, file paths.
4. **Tasks** — 1–3 phases; save to `planning/<slug>/`.
5. **/dev** — Execute.

### Design-First (like Kiro)

When you know *how* it should work:

1. **Describe architecture** — "Use the existing scans API, add export endpoint, streaming response."
2. **Design** — Agent formalizes into `design.md` (components, flow).
3. **Derive requirements** — What behaviors does this design support?
4. **Tasks** — 1–3 phases.
5. **/dev** — Execute.

---

## 4. EARS Notation (from Kiro)

Use when writing requirements for clarity and testability:

```
WHEN [trigger/condition]
THE SYSTEM SHALL [expected behavior]
```

**Example:**
```
WHEN a user submits invalid QR data
THE SYSTEM SHALL display validation errors next to the relevant fields
```

**Benefits:** Unambiguous, testable, traceable.

---

## 5. Integration with Existing Commands

| Command | Vibe coder use |
|---------|----------------|
| `/guide` | "What's next?" — suggests vibe vs full plan based on context |
| `/plan` | Add `--quick` flag for minimal 1–2 phase plan |
| `/dev` | Works with minimal plans from `planning/quick-*` |
| `/idea` | Skip for quick work; use for complex initiatives |

---

## 6. Proposed Implementation

1. **Add `/vibe` command** — Scope assessment + minimal spec generation.
2. **Add `--quick` to `/plan`** — Produce 1–2 phases, skip IDEA for simple cases.
3. **EARS template** — `TEMPLATE_REQUIREMENTS_EARS.md` for requirements-first flows.
4. **Update `/guide`** — Suggest "vibe" vs "full" based on git state, last action, open files.
5. **GUIDE_PREFERENCES** — Add "I prefer vibe coder flow" to bias suggestions.

---

## 7. References

- [BMad Method](https://github.com/bmad-code-org/BMAD-METHOD) — Quick Flow, agents, scale-adaptive
- [Kiro Feature Specs](https://kiro.dev/docs/specs/feature-specs/) — Requirements-First, Design-First
- [Kiro Requirements-First](https://kiro.dev/docs/specs/feature-specs/requirements-first/) — Flow details
- [Kiro Design-First](https://kiro.dev/docs/specs/feature-specs/tech-design-first/) — Flow details
