# Phase 3: Entity & Composition Documentation

### Primary role

FRONTEND

### Tool Selection

|                            | Tool         | Why                                     |
| -------------------------- | ------------ | --------------------------------------- |
| **Tool 1** (best quality)  | Cursor       | High-fidelity UI component assembly     |
| **Tool 2** (free fallback) | OpenCode CLI | Reliable for documentation and snippets |

### Skills to load

- [x] `using-superpowers`
- [x] `ui-ux-pro-max`
- [x] `gf-ads-data-density`
- [x] `verification-before-completion`

### Goal

Implement high-fidelity, interactive documentation for the "Entity & Composition" patterns in the design system.

### Scope (in)

- Interactive `ManagementLab` in `apps/design-system/src/app/(docs)/patterns/entity-management/page.tsx`.
- Documentation for `EntityCard`, `FilterBar`, and `Standard List Page` composition.
- Showcasing the combination of `StatGrid` with lists.
- Hardened `'use client';` implementation.

### Steps

1. Create directory `apps/design-system/src/app/(docs)/patterns/entity-management/`.
2. Create `page.tsx` with professional documentation layout.
3. Implement `ManagementLab.tsx` showcasing a realistic "Resident List" or "Project View".
4. Add copy-pasteable snippets for "The Standard List Pattern".
5. Verify build stability.

### Acceptance criteria

- [ ] `ManagementLab` is interactive (Filter/Search simulation).
- [ ] Documentation explains "Data Density" vs "Information Clarity".
- [ ] `pnpm turbo build --filter=@gateflow/design-system` passes.
