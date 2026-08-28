# Plan Feedback — security_hotfix_v1

## Why this plan is split into 3 phases

- Phase 1 isolates API authorization and tenant scoping risk.
- Phase 2 isolates cryptography migration risk.
- Phase 3 isolates configuration/security-header risk.

## Improvement Notes

- If `crypto-js` appears in additional transitive paths during execution, split Phase 2 into parts `part_a` (utils + migration) and `part_b` (dependency cleanup + compatibility).
- If CSP introduces breakage, keep strict defaults and explicitly enumerate allowed analytics origins rather than broad wildcard relaxations.

## Agent/Skill Guidance

- Security posture: prioritize security review and invariants over feature velocity.
- Verification: keep phase-level checks plus mandatory `pnpm preflight`.
- Logging: every phase must write an explicit phase log entry with failure cases and remediation.
