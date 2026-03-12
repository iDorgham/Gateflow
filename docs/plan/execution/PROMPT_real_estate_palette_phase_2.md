# Pro Prompt — Phase 2: Login Shell & Particles

Copy this prompt when running `/dev` for Phase 2 of the real estate palette plan.

---

## Phase 2: Login Shell & Particles

### Primary role

**FRONTEND** — Use gf-design-guide and gf-creative-ui-animation context. From `docs/plan/guidelines/SUBAGENT_HIERARCHY.md`.

### Preferred tool

- [x] Cursor (default)
- [ ] Claude CLI
- [ ] Gemini CLI
- [ ] OpenCode CLI
- [ ] Multi-CLI

### Context

- **Project**: GateFlow — Zero-Trust digital gate platform (Turborepo, pnpm)
- **Packages**: `@gate-access/ui` (login-shell, login-particles)
- **Rules**: pnpm only; semantic tokens only; respect `prefers-reduced-motion`
- **Refs**: `docs/plan/context/IDEA_real_estate_palette.md`, `docs/guides/MOTION_AND_ANIMATION.md`, `packages/ui/src/components/auth/login-shell.tsx`, `packages/ui/src/components/auth/login-particles.tsx`

### Goal

Apply the real estate palette tokens to the login shell and refine particles for a professional, serious, modern feel. Particles should be subtle and restrained — no playful or distracting motion.

### Scope (in)

- `packages/ui/src/components/auth/login-shell.tsx`
- `packages/ui/src/components/auth/login-particles.tsx`
- Keyframe animation in `tailwind.config.ts` or `globals.css` for particle float (if needed)

### Scope (out)

- Client/admin login page components (they consume LoginShell)
- Dashboard interiors (Phase 3)
- Marketing layout

### Steps (ordered)

1. **Login shell** — Audit `login-shell.tsx` for any hardcoded colors (e.g. `bg-[#ff6602]`, `text-[#424242]`). Replace with semantic tokens (`bg-primary`, `text-foreground`, `text-muted-foreground`, etc.). Ensure the right-panel accent uses `--login-accent` (or `bg-[hsl(var(--login-accent))]`).

2. **Particles** — Refine `login-particles.tsx`:
   - Use Kimchi/Midnight Blue tint at very low opacity (e.g. `bg-primary/[0.06]` or `bg-foreground/[0.04]`).
   - Keep slow, subtle drift (current `particle-float` keyframes are fine; ensure duration 16–23s).
   - Add `prefers-reduced-motion` support: when `reduce` is preferred, either hide particles or set `animation: none` and keep static dots at lower opacity.

3. **RTL** — Verify login shell and particles work correctly with `dir="rtl"` (logo and form alignment).

4. Run `pnpm turbo lint --filter=@gate-access/ui` and `pnpm turbo typecheck --filter=@gate-access/ui`. Fix any issues.

### Subagents (optional)

| Subagent | When | Prompt |
|----------|------|--------|
| **browser-use** | After implementation | "Login at localhost:3001/en/login and localhost:3002/en/login. Verify palette, particle subtlety, and RTL toggle." |

### Acceptance criteria

- [ ] Login shell uses only semantic tokens; no hardcoded hex.
- [ ] Particles are subtle and professional; no distracting motion.
- [ ] `prefers-reduced-motion` respected (particles reduced or hidden).
- [ ] RTL layout correct.
- [ ] `pnpm turbo lint --filter=@gate-access/ui` passes.
- [ ] `pnpm turbo typecheck --filter=@gate-access/ui` passes.

### Files likely touched

- `packages/ui/src/components/auth/login-shell.tsx`
- `packages/ui/src/components/auth/login-particles.tsx`
- `packages/ui/tailwind.config.ts` or app `globals.css` (if particle keyframes live there)
