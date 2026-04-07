# Phase 4: Monorepo Enforcement & Migration

**Slug:** design-system-redesign  
**Phase:** 4  
**Role:** Architecture / Security  
**Primary Tool:** Kiro (or current agent)

## 🎯 Goals

1.  **Enforce ADS Logic**: Update `scripts/check/enforce-ads-design.js` to block primitive `--gf-*` tokens in component files, forcing the use of semantic `--ds-*` tokens.
2.  **Standardize UI Packages**: Audit and migrate `packages/ui` and `packages/components` to use semantic tokens exclusively.
3.  **Metrics & Preflight**: Integrate the design system enforcement into `pnpm preflight`.

## 🛠️ Tasks

### 1. Enforcement Script Update

- [ ] Add regex to `scripts/check/enforce-ads-design.js` to catch `--gf-color-` and `--gf-space-` primitives.
- [ ] Exclude the `packages/tokens` directory and `tailwind.config.ts` from this check.
- [ ] Improve report formatting to show "Semantic vs Primitive" advice.

### 2. UI Migration (`packages/ui`)

- [ ] Scan `packages/ui/src` for hex, rgba, and primitive tokens.
- [ ] Replace with appropriate `--ds-*` semantic tokens.
- [ ] Focus on: `Button`, `Input`, `Badge`, `Card`, `ScrollArea`.

### 3. Components Migration (`packages/components`)

- [ ] Scan `packages/components` for violations.
- [ ] Replace with semantic tokens.
- [ ] Ensure `PageHeader` (a core component) is 100% compliant.

### 4. CI Integration

- [ ] Add `pnpm check:ads` script to root `package.json`.
- [ ] Ensure `pnpm preflight` runs this check.

## 🏁 Acceptance Criteria

- `node scripts/check/enforce-ads-design.js` passes for `packages/ui` and `packages/components`.
- No `--gf-` tokens appear in component logic (except in the actual token definitions).
- `pnpm preflight` includes the ADS check.
