# Phase 4 — App Integration + Verification

**Primary role:** FRONTEND
**Preferred tool:** Cursor
**Scope:** All apps, `apps/design-system` color showcase
**Goal:** Propagate the fixed dark mode config across all apps, verify visually, and update the design-system color page.

---

## Steps

### Step 1 — Verify tailwind configs (all apps)

Confirm Phase 1's `darkMode` change is in all 5 apps. If any still have `['class']`, update to:

```ts
darkMode: ['selector', '[data-color-mode="dark"]'],
```

Apps to check:

- `apps/client-dashboard/tailwind.config.ts`
- `apps/admin-dashboard/tailwind.config.ts`
- `apps/resident-portal/tailwind.config.ts`
- `apps/marketing/tailwind.config.ts`
- `apps/design-system/tailwind.config.ts`

### Step 2 — Update design-system color showcase page

File: `apps/design-system/src/app/(docs)/foundations/color/page.tsx`

Add a live token swatch grid showing all the new tokens:

```tsx
const palette = [
  { name: 'Brand 50', var: '--gf-color-brand-50' },
  { name: 'Brand 300', var: '--gf-color-brand-300' },
  { name: 'Brand 500 (Kimchi)', var: '--gf-color-brand-500' },
  { name: 'Brand 700', var: '--gf-color-brand-700' },
  { name: 'BG Page', var: '--gf-color-bg-page' },
  { name: 'BG Subtle', var: '--gf-color-bg-subtle' },
  { name: 'BG Default (Card)', var: '--gf-color-bg-default' },
  { name: 'BG Raised', var: '--gf-color-bg-raised' },
  { name: 'BG Overlay', var: '--gf-color-bg-overlay' },
  { name: 'Text', var: '--gf-color-text' },
  { name: 'Text Subtle', var: '--gf-color-text-subtle' },
  { name: 'Border', var: '--gf-color-border' },
  { name: 'Success', var: '--gf-color-success' },
  { name: 'Warning', var: '--gf-color-warning' },
  { name: 'Danger', var: '--gf-color-danger' },
  { name: 'Info', var: '--gf-color-info' },
];
```

Each swatch: `background-color: var(--gf-color-brand-500)` + token name + var name label.

### Step 3 — Fix any hardcoded colors in dashboards

Search for these patterns across `apps/client-dashboard/src` and `apps/admin-dashboard/src`:

- `bg-gray-*`, `bg-zinc-*`, `bg-slate-*` → replace with `bg-background`, `bg-muted`, `bg-surface-*`
- `text-gray-*` → `text-foreground`, `text-muted-foreground`
- Hardcoded hex values like `#1a1a1a`, `#f5f5f5` → replace with token vars

Focus on layout files: `layout.tsx`, `sidebar`, `navigation` components.

### Step 4 — Test dark mode toggle in each app

Open each app locally and verify:

1. Toggle dark mode via the UI theme switcher
2. All surfaces switch (page bg, cards, sidebar, dropdowns, modals)
3. Text remains readable
4. Brand buttons stay orange (Kimchi)
5. Borders are visible but subtle

**Subagent (shell):**

```
Run: pnpm turbo build --filter=client-dashboard --filter=admin-dashboard --filter=@gateflow/design-system
Report any build errors with file:line.
```

---

## Acceptance Criteria

- [ ] All 5 apps build successfully
- [ ] Dark mode toggle works visually in client-dashboard and design-system
- [ ] design-system `/foundations/color` page shows all new palette swatches
- [ ] No `bg-gray-*`/`text-gray-*` Tailwind classes in layout/nav files (use semantic tokens)
- [ ] `pnpm turbo typecheck` passes
- [ ] `pnpm preflight` passes
