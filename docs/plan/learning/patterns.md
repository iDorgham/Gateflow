# Docs & Planning Patterns (v2)

This file captures recurring patterns and best practices discovered while executing plans.

- For legacy patterns, see `docs/archive/plan-legacy/learning/patterns.md`.
- New entries should reference:
  - The initiative (e.g. `docs_v2_refresh`, `core_security_v6`).
  - The phase or PR where the pattern was observed.
  - A short description of the pattern and when to apply it.

---

## Seed Patterns

### Pattern 1 — Single Canonical Spec, Archived History

- **Initiative:** `docs_v2_refresh`
- **Context:** Phase 1 (baseline & archive cleanup)
- **Description:** Keep one canonical PRD (`docs/PRD_v6.0.md`) and archive older versions/specs under `docs/archive/**`. Only ever update the canonical spec going forward.
- **When to apply:** Whenever introducing a new major version of a spec; never keep multiple competing “current” PRD files.

