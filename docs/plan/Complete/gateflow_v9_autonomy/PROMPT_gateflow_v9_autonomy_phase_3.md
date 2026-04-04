# PROMPT: gateflow_v9_autonomy Phase 3 (Skill Intelligence)

## Request

Implement the infrastructure for **Adversarial Review** and prove it by refining the `ralph-git.js` script with a new feature, while surviving a cross-model challenge.

## Primary Role

ARCHITECTURE

## Preferred Tool

Multi-CLI (Cursor for implementation, Gemini/Claude for Adversarial Review)

## Steps

1. **Infrastructure**:
   - [x] Update `TEMPLATE_PROMPT_phase.md` with Adversarial Review section.
   - [x] Create `.antigravity/rules/03-adversarial-review.mdc`.
2. **Feature Addition**:
   - Add `tag` support to `scripts/ralph-git.js` (to tag releases/phases).
   - `node scripts/ralph-git.js tag <slug> <N> <tag_name>`
3. **Adversarial Review**:
   - **Self-Review**: Look for race conditions in git tags.
   - **Cross-Model**: Use a separate CLI (Claude/Gemini) with the `/adversary` command to review the new `tag` logic.
4. **The Ralph Loop**:
   - Run all enforcers (`node scripts/enforce-*`).
   - Fix any violations or adversarial findings.
5. **Git Completion**:
   - Use `node scripts/ralph-git.js commit gateflow_v9_autonomy 3` and `merge gateflow_v9_autonomy 3`.

## Acceptance Criteria

- [ ] `scripts/ralph-git.js` supports tags.
- [ ] Phase walkthrough includes "Adversarial Notes" (what the second model found).
- [ ] Ralph Loop is green.
