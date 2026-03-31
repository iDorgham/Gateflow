# Phase 01: Token & Tailwind alignment

### Primary role

**ARCHITECTURE** (with FRONTEND token work)

### Tool selection

|            | Tool         | Why                                                    |
| ---------- | ------------ | ------------------------------------------------------ |
| **Tool 1** | Cursor       | Monorepo edits across `packages/ui` + `apps/marketing` |
| **Tool 2** | OpenCode CLI | Free fallback for mechanical Tailwind diff work        |

### Skills to load

- `architecture`, `tokens-design`, `tailwind`, `ads-core-tokens`, `ads-color-tokens`, `design-guide`
- `verification-before-completion` before claiming done

### MCP

- **Context7** — Next.js / Tailwind import patterns if needed

### Context

- `docs/plan/planned/marketing_rebuild_dashboard_parity/CONTEXT_marketing_rebuild_dashboard_parity.md`
- `docs/plan/context/IDEA_marketing_rebuild_dashboard_parity.md`

### Goal

Establish a **single mechanical source of truth** for design tokens used by marketing, aligned with `packages/ui`, and update `apps/marketing/tailwind.config.ts` so utilities map to the same semantic CSS variables as the dashboard.

### Scope (in)

- Diff `apps/marketing/app/globals.css` vs `packages/ui/src/globals.css`
- Implement chosen strategy (e.g. re-export/import shared layer; documented exceptions only)
- Record decisions in `assets/ARCH_NOTES.md`
- Align Tailwind theme in marketing with UI package conventions

### Scope (out)

- No copy rewrite; no new pages
- No changes to contact API or Partytown setup

### Steps

1. Read CONTEXT + ARCH_NOTES template; fill strategy after analysis
2. Implement CSS/Tailwind alignment with minimal duplication
3. Run `pnpm --filter marketing lint`
4. If `packages/ui` touched: `pnpm preflight`
5. Commit with message `feat(marketing): align tokens with @gate-access/ui (phase 01)`

### Acceptance criteria

- [ ] ARCH_NOTES documents token strategy + font decision
- [ ] No unexplained full duplicate of `packages/ui` token block in marketing
- [ ] `pnpm --filter marketing lint` passes
- [ ] `pnpm preflight` passes when `packages/ui` is modified

### Files likely touched

- `apps/marketing/app/globals.css`
- `apps/marketing/tailwind.config.ts`
- `packages/ui/package.json` or exports (only if needed for shared CSS entry)
- `docs/plan/planned/marketing_rebuild_dashboard_parity/assets/ARCH_NOTES.md`

### Handoff

Next phase assumes stable CSS variables and Tailwind maps for layout work.
