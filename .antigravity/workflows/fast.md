---
name: fast
description: Fast-path autopilot — take a feature concept, synthesize spec, implement code and tests, verify preflight, and commit in 1 single loop.
---

# /fast `<feature-description>`

Execute a complete feature or bugfix from concept to clean commit in a single, high-velocity autonomous run.

---

## Workflow Steps

1. **Synthesize Spec**:
   - Parse requirements, affected apps/packages, and security invariants.
   - Load required skill bundles (e.g. `bundle-backend`, `bundle-frontend`).

2. **Execute via Fast-Dev Swarm**:
   - Implement database/API logic with tenant isolation.
   - Implement frontend/mobile UI with ADS design tokens and Cairo RTL.
   - Write comprehensive unit/integration test suites.

3. **Verify & Self-Heal**:
   - Run `pnpm turbo lint typecheck test --filter=<target_app>`.
   - If any errors occur, apply targeted fixes automatically.

4. **Clean Commit**:
   - Run `pnpm docs:changelog:check`.
   - Stage and commit with standard conventional format (`feat(...)` or `fix(...)`).
