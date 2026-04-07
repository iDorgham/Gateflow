# Pro Prompt — Phase 8 (design-system-redesign)

**Plan reference:** `PLAN_design-system-redesign.md`
**Tasks reference:** `TASKS_design-system-redesign.md`
**Session Memory:** `SESSION_MEMORY.md`

---

## Phase 8: Final Polish & Certification

### Primary role

QA / ARCHITECTURE

### Tool Selection

|            | Tool       | Why                                                              |
| ---------- | ---------- | ---------------------------------------------------------------- |
| **Tool 1** | Gemini CLI | Efficient for large-scale documentation audits and WCAG mapping. |
| **Tool 2** | Kilo CLI   | Optimized for pre-deployment preflights and performance metrics. |

### Skills to load

- [x] `verification-before-completion` — final audit loop
- [x] `systematic-debugging` — for any drift corrections
- [x] `ui-ux-pro-max` — for visual consistency checks
- [x] `architecture` — for PRD alignment and lock-in

### GCP / MCP to use

- `cursor-ide-browser` — for live WCAG contrast checks
- `google-search` — for latest accessibility standards validation

### Goal

Perform final accessibility audit (WCAG 2.1 AA), performance profiling (LCP/CLS/GPU), and ensure 100% Design System alignment with `docs/PRD.md`.

### Scope (in)

- Full-site accessibility audit (Focus on Satin-Charcoal contrast).
- Performance baseline for mobile and web apps.
- Enforcer script validation (ensure zero drift).
- Design System versioning and PRD sync.

### Steps (ordered)

1. **Accessibility Review**: Use `cursor-ide-browser` to scan core pages (`/login`, `/dashboard`, `/scanner`) for WCAG 2.1 AA failures. Focus on Kimchi accents on Satin-Charcoal.
2. **Performance Audit**: Run `pnpm lighthouse` or a similar tool to measure LCP and CLS on the Dashboard and Mobile apps.
3. **Drift Enforcement**: Run `scripts/enforce-ads-design.js` across the entire monorepo. Fix any remaining hardcoded values.
4. **PRD Alignment**: Review `docs/PRD.md` and ensure all "New Era" design mandates are reflected in the codebase and documentation.
5. **Final Commit**: Lock the design system versioning and push to `master`.

### Acceptance criteria

- [ ] 0 WCAG 2.1 AA Contrast Failures on primary journeys.
- [ ] LCP < 2.5s and CLS < 0.1 for operational dashboards.
- [ ] `scripts/enforce-ads-design.js` returns GREEN (0 violations).
- [ ] `docs/PRD.md` updated to reflect the new Satin-Charcoal design system v1.0.

### Files likely touched

- `docs/PRD.md`
- `scripts/enforce-ads-design.js`
- `packages/tokens/version.json` (or similar)
- `apps/*/app/(tabs)/_layout.tsx` (for performance tweaks)
