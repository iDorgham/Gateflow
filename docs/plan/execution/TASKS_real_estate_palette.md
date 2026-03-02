# TASKS_real_estate_palette

**Plan:** `PLAN_real_estate_palette.md`  
**Status:** In progress  

---

## Phase 1 — Design Tokens & CSS Variables

**Status:** Done  
**Completed:** 2026-03-02  

- [x] Map palette hex → HSL for `:root` and `.dark`
- [x] `--primary` = Kimchi (#ED4B00)
- [x] `--background` = Anti-Flash White; `--foreground` = Midnight Blue
- [x] `--muted` = Lace Cap; `--muted-foreground` = Dark Royalty
- [x] `--login-accent` = Kimchi
- [x] Dark-mode variants (Midnight Blue as bg)
- [x] Document palette in `UI_DESIGN_GUIDE.md`
- [x] `pnpm turbo build` passes for client-dashboard, admin-dashboard, marketing
- [x] `pnpm turbo lint` passes (client-dashboard: no errors)

**Files changed:**
- `apps/client-dashboard/src/app/globals.css`
- `apps/admin-dashboard/src/app/globals.css`
- `apps/marketing/app/globals.css`
- `packages/ui/src/globals.css`
- `docs/guides/UI_DESIGN_GUIDE.md`
- `apps/client-dashboard/.../residents/contacts/page.tsx` (pre-existing fix: variable order, Set iteration)

---

## Phase 2 — Login Shell & Particles

**Status:** Done  
**Completed:** 2026-03-02  

- [x] Login shell: replaced `bg-[#ff6602]` → `bg-primary`, `text-[#424242]` → `text-muted-foreground`
- [x] Right-panel accent: fallback updated to Kimchi HSL
- [x] Particles: `bg-foreground/[0.04]` (light), `bg-foreground/[0.03]` (dark)
- [x] `prefers-reduced-motion`: static dots, no animation, lower opacity (0.02/0.015)
- [x] RTL: existing dir handling preserved
- [x] `pnpm turbo lint --filter=@gate-access/ui` passes
- [x] `pnpm turbo typecheck --filter=@gate-access/ui` passes

**Files changed:**
- `packages/ui/src/components/auth/login-shell.tsx`
- `packages/ui/src/components/auth/login-particles.tsx`

---

## Phase 3 — Dashboard & Marketing Consistency

**Status:** Done  
**Completed:** 2026-03-02  

- [x] Client-dashboard login: Submit button `bg-primary`, Forgot/Contact links `text-muted-foreground`
- [x] Sidebar: active indicator glow → `shadow-[0_0_10px_hsl(var(--primary)/0.6)]`, icon `text-primary`, nav `text-muted-foreground`
- [x] Added `--primary-rgb: 237, 75, 0` to marketing, client-dashboard, admin-dashboard globals
- [x] `pnpm preflight` passes

**Files changed:**
- `apps/client-dashboard/src/app/[locale]/login/page.tsx`
- `apps/client-dashboard/src/components/dashboard/sidebar.tsx`
- `apps/client-dashboard/src/app/globals.css`
- `apps/admin-dashboard/src/app/globals.css`
- `apps/marketing/app/globals.css`  
