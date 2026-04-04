# Phase 3: Rich Contact Generation with Nationality Weighting

> **Checklist (mandatory):** `docs/plan/Complete/advanced_seeding_emulation_v3/SCHEMA_TO_SEEDER_CONTRACT_CHECKLIST.md`

> **Plan:** `docs/plan/Complete/advanced_seeding_emulation_v3/PLAN_advanced_seeding_emulation_v3.md`

### Primary role

**BACKEND**

### Tool selection

|               | Tool       | Why                          |
| ------------- | ---------- | ---------------------------- |
| **Preferred** | **Cursor** | Service integration          |
| **Fallback**  | Multi-CLI  | Review distribution fairness |

### Skills to load

1. `.antigravity/skills/gf-security/SKILL.md`
2. `.antigravity/skills/gf-ads/SKILL.md`
3. `.antigravity/rules/00-gateflow-core.mdc`, `.antigravity/contracts/CONTRACTS.md`
4. Optionally `.antigravity/skills/gf-design/SKILL.md` for naming consistency only (no UI)

**Refs:** `docs/reference/architecture/ARCHITECTURE.md`, `docs/archive/old-prds/PRD_v8.0.md`, `docs/Pasted_Text_1774974939864.txt`.  
**Seeding weights:** use IDEA v3 baseline (Egyptian ~45%, German ~17%, Russian ~15%, +11 nationalities), then keep constants centralized so they can be tuned from the pasted reference without refactors.

### Context

- **Depends on:** Phases 1–2.
- **Objective:** `generateRichContact({ organizationId, seed, nationalityWeights })` producing names, plausible phone/email, `nationality` field, respecting uniqueness registry.
- **Client-dashboard contract:** seed `Contact.firstName`, `Contact.lastName`, `Contact.email`, `Contact.phone`, `Contact.jobTitle`, `Contact.company` to match CRM `ContactTable` columns.

### Goal

Weighted nationality sampler with **≥14 nationalities** and tests proving distribution within **±2%** on large N (fixed seed).

### Scope (in)

- `packages/db/src/lib/rich-contact.ts` or under `advanced-seed-service.ts` module split.
- Weight table + deterministic PRNG (`mulberry32` / seedrandom pattern).
- Integration with `validateUniqueness` from Phase 1.
- Tests: Chi-square or fixed N=10_000 bucket check.

### Scope (out)

- Unit hierarchy geometry, rush hour, QRs.

### Steps (ordered)

1. Define nationality codes + display names + weight map (normalized to 1.0).
2. Implement `sampleNationality(rng, weights)`.
3. Implement `generateRichContact` — phone/email unique per org; normalize E.164 or repo standard.
4. Run distribution test with seed `42`.
5. `pnpm turbo lint typecheck test --filter=@gate-access/db`
6. Commit: `feat(seeding): phase 3 — rich contacts with nationality weighting`

### Security checklist

- [ ] No real PII; synthetic data only; emails use `@example.com` or test domain per convention
- [ ] `organizationId` passed through for all created rows

### Acceptance criteria

- [ ] **Functional:** Contacts generated with correct schema fields and org scope.
- [ ] **Data integrity:** No duplicate phone/email per org in batch tests.
- [ ] **Data:** Nationality distribution within ±2% of targets at N≥10k (document N and seed).
- [ ] **Quality:** Lint, typecheck, tests pass for `@gate-access/db`.

### Files likely touched

- `packages/db/src/lib/rich-contact.ts`
- `packages/db/src/advanced-seed-service.ts` (partial wire-up if file exists or created in later phase)

### Handoff to Phase 4

Contact factory ready to attach as unit owners and visitors.
