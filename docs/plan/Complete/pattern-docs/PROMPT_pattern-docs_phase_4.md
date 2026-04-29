# Phase 4: Final Certification & Hardening

### Primary role

QA

### Tool Selection

|                            | Tool         | Why                                |
| -------------------------- | ------------ | ---------------------------------- |
| **Tool 1** (best quality)  | Cursor       | Final audit and metadata hardening |
| **Tool 2** (free fallback) | OpenCode CLI | Build verification and lint checks |

### Skills to load

- [x] `using-superpowers`
- [x] `verification-before-completion`
- [x] `gateflow-testing`

### Goal

Ensure all new pattern documentation pages are build-stable, accessible, and correctly metadata-hardened.

### Scope (in)

- Audit of `analytics`, `ai-ui`, and `entity-management` pattern pages.
- Metadata verification (Titles, Descriptions for SEO).
- Final `pnpm preflight` and monorepo sync.
- Plan transition from `Active/` to `Complete/`.

### Steps

1. Verify `'use client';` and metadata in all three pattern pages.
2. Run `pnpm turbo build --filter=@gateflow/design-system`.
3. Audit all three pages for hydration mismatches.
4. Move initiative folder from `Active/` to `Complete/`.
5. Update `ALL_TASKS_BACKLOG.md` to `Completed`.

### Acceptance criteria

- [ ] 100% build success.
- [ ] SEO Metadata is correctly implemented for all pattern pages.
- [ ] No hydration mismatches.
