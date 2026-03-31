# Phase 02: Layout shell & shared primitives

### Primary role

**FRONTEND**

### Tool selection

|            | Tool     | Why                                                 |
| ---------- | -------- | --------------------------------------------------- |
| **Tool 1** | Cursor   | Layout + component integration                      |
| **Tool 2** | Kiro CLI | Free agentic pass on repetitive className refactors |

### Skills to load

- `design-guide`, `shadcn-ads`, `ads-spacing`, `ads-typography`, `i18n`
- `verification-before-completion`

### MCP

- **cursor-ide-browser** — optional spot-check EN/AR homepage after edits

### Context

- `CONTEXT_marketing_rebuild_dashboard_parity.md`
- `ARCH_NOTES.md` from Phase 01

### Goal

Refactor marketing **shell** (layout, nav, footer, providers) to use **dashboard-aligned** semantic tokens and `@gate-access/ui` primitives (`Button`, `Card`, etc.) where it reduces drift without turning the site into app chrome.

### Scope (in)

- `apps/marketing/app/[locale]/layout.tsx`, `app/providers.tsx`
- `apps/marketing/components/nav.tsx`, `footer.tsx`
- Theme toggle / language switcher styling parity

### Scope (out)

- Inner marketing sections (Phase 03)
- Blog MDX layout (only if required for shell consistency)

### Steps

1. Load Phase 01 outcomes from ARCH_NOTES
2. Replace ad-hoc colors with semantic `var(--ds-*)` / Tailwind token classes per aligned theme
3. Import shared components from `@gate-access/ui`; avoid duplicating `cn` helpers
4. Verify `next-themes` + RTL `dir` on `<html>` or wrapper
5. `pnpm --filter marketing lint` + manual EN + `ar-EG` smoke

### Acceptance criteria

- [ ] Nav + footer use aligned tokens; no obvious color mismatch vs dashboard primary/surface
- [ ] Dark/light toggle still works
- [ ] `pnpm --filter marketing lint` passes
- [ ] Arabic layout: nav/order sensible (i18n skill checklist)

### Files likely touched

- `apps/marketing/app/[locale]/layout.tsx`
- `apps/marketing/app/providers.tsx`
- `apps/marketing/components/nav.tsx`
- `apps/marketing/components/footer.tsx`
- `apps/marketing/components/theme-toggle.tsx`, `language-switcher.tsx` (if needed)

### Handoff

Shell stable for section-by-section refactors in Phase 03.
