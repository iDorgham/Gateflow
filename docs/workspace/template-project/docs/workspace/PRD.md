# Product Requirements Document (Installation-First Template)

Use this PRD as the primary source for installing and tailoring the workspace operating system before implementation starts.

## 1) Product and Project Overview

- **Project name:**
- **Project slug:**
- **Problem statement:**
- **Target users/personas:**
- **Primary outcomes (business + user):**

## 2) Scope Definition

### In Scope (MVP)

- Core user journeys required for MVP launch.
- Critical backend and frontend capabilities.
- Security and tenancy requirements.
- Required automation and release gates.

### Out of Scope (Post-MVP)

- Explicitly list deferred capabilities.

## 3) Functional Requirements

List requirements as `FR-<N>` with acceptance criteria.

Example:

- **FR-1:** Users can create and manage records.
- Acceptance: CRUD endpoints exist, validated, and tenant scoped.
- **FR-2:** Dashboard shows live status.
- Acceptance: UI loads within target budget and updates predictably.

## 4) Non-Functional Requirements

- Security requirements
- Performance requirements
- Reliability requirements
- Observability requirements
- Localization/accessibility requirements

## 5) AI Workspace Installation Mapping

Translate PRD needs into required workspace assets before coding.

### Recommended Rules (from PRD)

- Core workflow rules
- Security rules
- Quality and release rules

### Recommended Agents (from PRD)

- Planning role
- Security role
- Backend/API role
- Frontend role

### Recommended Subagents (from PRD)

- Explore
- Shell
- Browser-use

### Recommended Skills (from PRD)

- Architecture
- Security
- API
- Database
- Testing
- i18n/responsive/design (as needed by product)

## 6) PRD-First Execution Order (Mandatory)

If this PRD exists, follow this sequence:

1. Improve and finalize this PRD.
2. Install recommended rules/agents/subagents/skills derived from PRD.
3. Run onboarding setup:

- initialize GitHub repository
- choose branching workflow (`main` + feature branches or trunk-based)
- wire base automation (CI/security/release checks)

4. Build MVP roadmap:

- define phases
- define deliverables per phase
- define acceptance criteria per phase

5. Create planning artifacts:

- `PLAN_<slug>.md`
- `PROMPT_<slug>_phase_<N>.md` for each phase
- `TASKS_<slug>.md`

6. Create workspace readiness docs:

- docs index and workspace docs
- templates and contracts
- implementation start checklist

## 7) MVP Roadmap Template

| Phase | Objective     | Deliverables                      | Exit Criteria                    |
| ----- | ------------- | --------------------------------- | -------------------------------- |
| 1     | Foundation    | Repo setup, CI, security baseline | Checks pass, structure ready     |
| 2     | Core backend  | Models, services, APIs            | Tested APIs and contracts        |
| 3     | Core frontend | Primary UX flows                  | UX paths complete                |
| 4     | Hardening     | Perf/security/edge cases          | Quality gates green              |
| 5     | Launch prep   | Docs, release checklist           | Ready for implementation handoff |

## 8) Implementation Readiness Checklist

- [ ] PRD validated with stakeholders
- [ ] Recommended workspace assets installed
- [ ] GitHub repo and branching workflow configured
- [ ] Automation baseline enabled
- [ ] MVP roadmap defined
- [ ] Plan + prompts created
- [ ] Templates + contracts prepared
- [ ] Team can start implementation immediately
