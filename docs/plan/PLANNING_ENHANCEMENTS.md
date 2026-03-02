# Planning & Development Workflow Enhancements

Research and improvements inspired by **BMad Method**, **AI-Driven Development (ADD)**, **Kiro IDE**, and **Spec-Driven Development**.

---

## 1. What We Learned

### BMad Method (Quick Flow)

- **quick-spec**: Understand → Investigate → Generate → Review (conversational)
- **Output**: tech-spec with ordered tasks, file paths, **Given/When/Then** acceptance criteria
- **quick-dev**: Executes tasks, runs self-check, then **adversarial code review** before wrap-up
- **Escalation**: Detects scope creep → recommends full BMad or quick-spec

### AI-Driven Development (ADD)

- **Specify** → Generate → **Evaluate** → Integrate
- Human checkpoints: spec approval, evaluation of AI output, integration gate
- AI = collaborator; human = direction + quality control

### Kiro IDE

- **Specs**: Requirements (EARS format) → Design (architecture) → Tasks (with dependencies)
- **Agent hooks**: Event-driven automation (on save/create/delete)
- **Steering files**: Project context for large codebases

### GateFlow Remix

We combine:

- **Lifecycle** (planning → planned → in-progress → done) — already implemented
- **Richer phase prompts** — MCP, skills, agents, commands explicitly in each phase
- **Given/When/Then** — Optional precise acceptance criteria
- **Context-aware /guide** — Suggest tools, MCP, subagents based on plan state
- **Escalation** — When scope is bigger than one phase, recommend breakdown

---

## 2. Enhanced Phase Prompt Structure

Each phase prompt now includes (when relevant):

| Section | Purpose |
|---------|---------|
| **Primary role** | Which agent persona (SECURITY, FRONTEND, etc.) |
| **Skills to load** | e.g. `gf-security`, `gf-database`, `gf-api` |
| **MCP to use** | Prisma-Local, Context7, cursor-ide-browser |
| **Subagents** | explore, shell, browser-use with concrete prompts |
| **Commands** | /ready, /github, /clis team audit |
| **Acceptance criteria** | Checklist + optional Given/When/Then |

---

## 3. Planning Workflow (Understand → Investigate → Generate)

**Lightweight Bmad-style flow** for `/plan`:

1. **Understand** — User describes goal. Agent scans IDEA, backlog, codebase; asks clarifying questions.
2. **Investigate** (optional) — For complex plans: invoke **explore** subagent to map flows, file patterns, dependencies.
3. **Generate** — Create PLAN + phase prompts with Primary role, skills, MCP, subagents per phase.
4. **Review** — Present plan for sign-off; user can refine before `/plan ready`.

Not every plan needs step 2. Simple features skip to Generate.

---

## 4. /guide Enhancements

| Plan state | /guide suggests |
|------------|-----------------|
| **Planning** | Run explore subagent if scope unclear; load gf-planner |
| **Planned** | Run `/dev` or `/plan ready` if still in planning |
| **In progress** | Next phase prompt; MCP (Prisma if schema); skills for phase role |
| **Blocked** | Escalation: break into smaller phases, or quick-spec first |
| **Post-phase** | Adversarial review (optional); update TASKS; /github |

---

## 5. Escalation Triggers

When `/dev` or planning detects:

- Multi-component or system-level scope
- Uncertainty about approach
- Security-critical without explicit SECURITY phase

→ Suggest: break into smaller phases, add INVESTIGATE step, or run security review.

---

## 6. Quick Flow vs Full Plan

| Use Quick Flow (minimal) | Use Full Plan |
|-------------------------|---------------|
| Single file/focused change | Multi-file, multi-package |
| Bug fix, patch | New feature, redesign |
| Refactor with clear scope | Architecture decisions |
| Prototype | Production feature |

GateFlow: `/plan` can produce a **minimal plan** (1–2 phases) for quick-flow cases, or **full phased plan** for complex work.
