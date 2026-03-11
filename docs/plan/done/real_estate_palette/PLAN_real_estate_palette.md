# PLAN_real_estate_palette — Professional Real Estate Palette & UI Refresh

**Initiative:** Real estate–grade color palette and UI polish  
**Source idea:** `docs/plan/context/IDEA_real_estate_palette.md`  
**Primary reference:** `assets/Images/bbab71814a23880255d1be321d27b24f.jpg`  
**Status:** Not started  

---

## 1. Objectives

- Apply the **professional real estate palette** (Anti-Flash White, Lace Cap, Kimchi, Midnight Blue, Dark Royalty, Deep Sea) with documented contrast ratios.
- Use **Kimchi (#ED4B00)** as the accent color across CTAs, highlights, and the login experience.
- Add **subtle particles** to login and key surfaces — modern, restrained, serious.
- Ensure **less is more**: clean, minimal, professional for property management and gated communities.

---

## 2. High-Level Phases

1. **Phase 1 — Design Tokens & CSS Variables** — Map palette to semantic tokens; update globals.css across apps.
2. **Phase 2 — Login Shell & Particles** — Apply tokens to login shell; refine particles for real estate feel.
3. **Phase 3 — Dashboard & Marketing Consistency** — Verify and adjust client-dashboard, admin-dashboard, marketing for consistency.

Each phase is small enough to run as a single `/dev` execution.

---

## 3. Phase 1 — Design Tokens & CSS Variables

**Goal:** Define the real estate palette as CSS variables and ensure all apps consume them.

**Primary role:** FRONTEND (tokens-design, tailwind)

**Scope (in):**

- `apps/client-dashboard/src/app/globals.css`
- `apps/admin-dashboard/src/app/globals.css`
- `apps/marketing/app/globals.css`
- `packages/ui/src/globals.css` (shared base)
- `docs/guides/UI_DESIGN_GUIDE.md` — add palette reference

**Scope (out):**

- Scanner app, resident portal
- Component-level changes (Phase 2)

**Key tasks:**

- [ ] Map palette hex → HSL for CSS (`:root` and `.dark`).
- [ ] Set `--primary` = Kimchi (#ED4B00); `--primary-foreground` = white.
- [ ] Set `--background` = Anti-Flash White; `--foreground` = Midnight Blue.
- [ ] Set `--muted` = Lace Cap; `--muted-foreground` = Dark Royalty.
- [ ] Set `--login-accent` = Kimchi.
- [ ] Add dark-mode variants (Midnight Blue as bg, light text).
- [ ] Document palette and ratios in `UI_DESIGN_GUIDE.md`.

**Acceptance criteria:**

- All apps use semantic tokens; no hardcoded hex in globals.css except in variable definitions.
- Light and dark themes pass contrast checks (AA minimum).
- `pnpm turbo build` passes for affected workspaces.

---

## 4. Phase 2 — Login Shell & Particles

**Goal:** Apply the new palette to the login shell and refine particles for a professional real estate feel.

**Primary role:** FRONTEND (gf-design-guide, gf-creative-ui-animation)

**SuperDesign:** Optional — run `superdesign iterate-design-draft` for login layout if desired.

**Scope (in):**

- `packages/ui/src/components/auth/login-shell.tsx`
- `packages/ui/src/components/auth/login-particles.tsx`
- Login pages in client-dashboard and admin-dashboard (already use LoginShell)

**Scope (out):**

- Dashboard interiors (Phase 3)
- Marketing hero/layout changes

**Key tasks:**

- [ ] Replace any hardcoded colors in `login-shell.tsx` with semantic tokens.
- [ ] Ensure login right-panel accent uses `--login-accent` (Kimchi).
- [ ] Refine `login-particles.tsx`: subtle drift, Kimchi/Midnight Blue tint, very low opacity.
- [ ] Respect `prefers-reduced-motion` — reduce or disable particle animation.
- [ ] Verify RTL layout; logo and form align correctly.

**Acceptance criteria:**

- Login shell uses only semantic tokens.
- Particles feel professional (no playful or distracting motion).
- `prefers-reduced-motion` respected.
- `pnpm turbo lint --filter=@gate-access/ui` passes.

---

## 5. Phase 3 — Dashboard & Marketing Consistency

**Goal:** Ensure client-dashboard, admin-dashboard, and marketing consistently use the palette.

**Primary role:** FRONTEND

**Scope (in):**

- Client-dashboard sidebar, buttons, links
- Admin-dashboard sidebar, buttons
- Marketing hero, CTAs, footer

**Scope (out):**

- Scanner app, resident portal
- New page layouts or flows

**Key tasks:**

- [ ] Audit primary buttons, links, and accent usage across dashboards.
- [ ] Replace any stray hardcoded colors with tokens.
- [ ] Marketing: hero CTA, footer links use Kimchi or Midnight Blue per contrast.
- [ ] Run browser-use subagent: verify login, dashboard nav, and marketing key pages.

**Acceptance criteria:**

- No hardcoded hex for primary/accent colors in touched files.
- Visual pass: login → dashboard → marketing feels cohesive.
- `pnpm preflight` passes.

---

## 6. Dependencies & Risks

| Phase | Depends on | Risks |
|-------|------------|-------|
| 1 | — | None; token changes are isolated |
| 2 | 1 | Particles may need tuning for performance |
| 3 | 1, 2 | Broad scope; limit to high-visibility surfaces |

---

## 7. Execution

Run each phase via `/dev`:

```
/dev
```
Then paste the contents of `docs/plan/execution/PROMPT_real_estate_palette_phase_N.md` for the desired phase.

Or run the full plan:

```
/ship
```
(After configuring ship to use `PLAN_real_estate_palette.md`)
