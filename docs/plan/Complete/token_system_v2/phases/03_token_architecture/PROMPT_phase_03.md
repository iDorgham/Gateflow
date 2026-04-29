# Phase 3 — Unify Token Architecture

**Primary role:** FRONTEND
**Preferred tool:** Cursor
**Scope:** `packages/ui/src/globals.css`, `packages/ui/src/tokens.ts`
**Goal:** Remove redundancy. All `--ds-*` and Tailwind color aliases must resolve from `--gf-*`. No more dual-definition.

---

## Steps

### Step 1 — Clean up `packages/ui/src/globals.css`

Replace the current mapping layer with a minimal, clean version that only adds things not already in `tokens.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import '../../tokens/css/tokens.css';

@layer base {
  :root {
    /* Typography */
    --ds-font-family-sans: var(
      --font-sans,
      var(--font-inter, ui-sans-serif, system-ui)
    );
    --ds-font-family-heading: var(--font-heading, var(--ds-font-family-sans));
    --ds-font-family-mono: var(--font-mono, monospace);

    /* Radius */
    --ds-border-radius: 0.5rem;
    --ds-radius-xsmall: 0.125rem;
    --ds-radius-small: 0.25rem;
    --ds-radius-medium: 0.5rem;
    --ds-radius-large: 0.75rem;
    --ds-radius-xlarge: 1rem;
    --ds-radius-circle: 50%;

    /* DS Background aliases → gf tokens */
    --ds-background-default: var(--gf-color-bg-page);
    --ds-background-neutral-subtle: var(--gf-color-bg-subtle);
    --ds-background-neutral: var(--gf-color-neutral-200);
    --ds-background-neutral-hovered: var(--gf-color-neutral-300);
    --ds-background-neutral-pressed: var(--gf-color-neutral-400);
    --ds-background-brand-bold: var(--gf-color-primary);
    --ds-background-brand-bold-hovered: var(--gf-color-primary-hover);
    --ds-background-brand-subtle: var(--gf-color-primary-subtle);
    --ds-background-selected: var(--gf-color-primary-subtle);
    --ds-background-selected-hovered: var(--gf-color-brand-100);
    --ds-background-danger-bold: var(--gf-color-danger);
    --ds-background-danger-subtle: var(--gf-color-danger-subtle);
    --ds-background-warning-bold: var(--gf-color-warning);
    --ds-background-success-bold: var(--gf-color-success);
    --ds-background-information-bold: var(--gf-color-info);

    /* DS Text aliases */
    --ds-text: var(--gf-color-text);
    --ds-text-subtle: var(--gf-color-text-subtle);
    --ds-text-subtlest: var(--gf-color-text-subtlest);
    --ds-text-inverse: var(--gf-color-text-inverse);
    --ds-text-selected: var(--gf-color-text-brand);
    --ds-text-brand: var(--gf-color-text-brand);
    --ds-text-danger: var(--gf-color-text-danger);

    /* DS Border aliases */
    --ds-border: var(--gf-color-border);
    --ds-border-subtle: var(--gf-color-border-subtle);
    --ds-border-bold: var(--gf-color-border-bold);
    --ds-border-focused: var(--gf-color-border-focused);
    --ds-border-brand: var(--gf-color-primary);

    /* DS Shadow */
    --ds-shadow-raised: var(--gf-shadow-sm);
  }

  * {
    @apply border-border;
  }

  body {
    @apply antialiased bg-background text-foreground;
    font-family: var(--ds-font-family-sans);
  }
}

@layer utilities {
  .ds-elevation-sunken {
    background: var(--gf-color-bg-subtle);
  }
  .ds-elevation-default {
    background: var(--gf-color-bg-page);
  }
  .ds-elevation-raised {
    background: var(--gf-color-bg-default);
    box-shadow: var(--gf-shadow-sm);
  }
  .ds-elevation-overlay {
    background: var(--gf-color-bg-overlay);
    box-shadow: var(--gf-shadow-md);
  }
}
```

### Step 2 — Update `packages/ui/src/tokens.ts` (Tailwind color map)

Update the JS token map to use the new `--gf-*` variables:

```ts
export const tokens = {
  colors: {
    border: 'var(--gf-color-border)',
    input: 'var(--gf-color-border)',
    ring: 'var(--gf-color-primary)',
    background: 'var(--gf-color-bg-page)',
    foreground: 'var(--gf-color-text)',

    primary: {
      DEFAULT: 'var(--gf-color-primary)',
      foreground: 'var(--gf-color-primary-foreground)',
      subtle: 'var(--gf-color-primary-subtle)',
    },
    secondary: {
      DEFAULT: 'var(--gf-color-bg-raised)',
      foreground: 'var(--gf-color-text)',
    },
    destructive: {
      DEFAULT: 'var(--gf-color-danger)',
      foreground: 'var(--gf-color-neutral-0)',
    },
    muted: {
      DEFAULT: 'var(--gf-color-muted)',
      foreground: 'var(--gf-color-muted-foreground)',
    },
    accent: {
      DEFAULT: 'var(--gf-color-bg-raised)',
      foreground: 'var(--gf-color-text)',
    },
    popover: {
      DEFAULT: 'var(--gf-color-bg-raised)',
      foreground: 'var(--gf-color-text)',
    },
    card: {
      DEFAULT: 'var(--gf-color-bg-default)',
      foreground: 'var(--gf-color-text)',
    },
    // Semantic surface levels
    surface: {
      page: 'var(--gf-color-bg-page)',
      subtle: 'var(--gf-color-bg-subtle)',
      default: 'var(--gf-color-bg-default)',
      raised: 'var(--gf-color-bg-raised)',
      overlay: 'var(--gf-color-bg-overlay)',
    },
    // Status
    success: {
      DEFAULT: 'var(--gf-color-success)',
      subtle: 'var(--gf-color-success-subtle)',
      bold: 'var(--gf-color-success-bold)',
    },
    warning: {
      DEFAULT: 'var(--gf-color-warning)',
      subtle: 'var(--gf-color-warning-subtle)',
      bold: 'var(--gf-color-warning-bold)',
    },
    danger: {
      DEFAULT: 'var(--gf-color-danger)',
      subtle: 'var(--gf-color-danger-subtle)',
      bold: 'var(--gf-color-danger-bold)',
    },
    info: {
      DEFAULT: 'var(--gf-color-info)',
      subtle: 'var(--gf-color-info-subtle)',
      bold: 'var(--gf-color-info-bold)',
    },
    // DS namespace (for components using ds.background.x etc.)
    ds: {
      background: {
        default: 'var(--ds-background-default)',
        subtle: 'var(--ds-background-neutral-subtle)',
        neutral: 'var(--ds-background-neutral)',
        'neutral-subtle': 'var(--ds-background-neutral-subtle)',
        'neutral-hovered': 'var(--ds-background-neutral-hovered)',
        brand: {
          bold: 'var(--ds-background-brand-bold)',
          subtle: 'var(--ds-background-brand-subtle)',
        },
      },
      text: {
        DEFAULT: 'var(--ds-text)',
        subtle: 'var(--ds-text-subtle)',
        subtlest: 'var(--ds-text-subtlest)',
        brand: 'var(--ds-text-brand)',
        selected: 'var(--ds-text-selected)',
        danger: 'var(--ds-text-danger)',
        inverse: 'var(--ds-text-inverse)',
      },
      border: {
        DEFAULT: 'var(--ds-border)',
        subtle: 'var(--ds-border-subtle)',
        bold: 'var(--ds-border-bold)',
        brand: 'var(--ds-border-brand)',
      },
    },
  },
  // ... keep spacing, borderRadius, typography, screens unchanged
} as const;
```

---

## Acceptance Criteria

- [ ] No HSL hard-coded values remain in `globals.css`
- [ ] All `--ds-*` aliases in components still resolve (check AtlassianNavigation, SideNavigation)
- [ ] `pnpm turbo typecheck` passes across all packages
- [ ] `pnpm turbo build --filter=@gateflow/ui` passes
