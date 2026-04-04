# Phase 5: Rush Hour Algorithm & Traffic Simulation

> **Checklist (mandatory):** `docs/plan/Complete/advanced_seeding_emulation_v3/SCHEMA_TO_SEEDER_CONTRACT_CHECKLIST.md`

> **Plan:** `docs/plan/Complete/advanced_seeding_emulation_v3/PLAN_advanced_seeding_emulation_v3.md`

### Primary role

**BACKEND**

### Tool selection

|               | Tool       | Why                |
| ------------- | ---------- | ------------------ |
| **Preferred** | **Cursor** | Algorithm + tests  |
| **Fallback**  | Multi-CLI  | Statistical review |

### Skills to load

1. `.antigravity/skills/gf-security/SKILL.md`
2. `.antigravity/skills/gf-ads/SKILL.md`
3. `.antigravity/rules/00-gateflow-core.mdc`, `.antigravity/contracts/CONTRACTS.md`

**Detail:** `docs/Pasted_Text_1774974939864.txt` + IDEA v3 — **weighted rush periods + Gaussian peaks + baseline non-rush** for scan times; scenario hooks must include: `luxury-compound`, `nightclub`, `private-school`, `wedding-venue`.

### Context

- **Depends on:** Phases 1–4 (gates/units/contacts exist or stub gates for test org).
- **Objective:** Generate **ordered timestamps** for `ScanLog` creation that cluster per scenario without violating gate ordering sanity.

### Goal

`sampleScanTimestamps({ count, scenario, windowStart, windowEnd, seed })` returning ISO timestamps suitable for Phase 6 insert, with Friday/Saturday behavior configurable for MENA weekend patterns.

### Scope (in)

- `packages/db/src/lib/rush-hour.ts` — mixture model: baseline uniform + weighted Gaussian bumps.
- Scenario registry aligned with reference: `luxury-compound`, `nightclub`, `private-school`, `wedding-venue`.
- Statistical tests: peak z-score or binned chi-square vs uniform.

### Scope (out)

- Persisting ScanLog rows (done in Phase 6) unless small integration test needs insert.

### Steps (ordered)

1. Implement RNG-driven time sampler inside `[windowStart, windowEnd]`.
2. Add Gaussian peaks parameters per scenario (mean hour, sigma).
3. Sort and enforce minimum inter-scan gap if product requires (configurable).
4. Unit tests + snapshot of histogram counts per bin.
5. `pnpm turbo lint typecheck test --filter=@gate-access/db`
6. Commit: `feat(seeding): phase 5 — rush hour traffic simulation`

### Security checklist

- [ ] Timestamps are UTC; no user-controlled injection without Zod in API phase

### Acceptance criteria

- [ ] **Functional:** Scenarios produce visibly different distributions (test asserts bin ratios).
- [ ] **Data integrity:** Output count matches requested; monotonic optional mode if specified.
- [ ] **Quality:** Lint, typecheck, tests pass.

### Files likely touched

- `packages/db/src/lib/rush-hour.ts`

### Handoff to Phase 6

Timestamp stream ready for `ScanLog` + QR chain.
