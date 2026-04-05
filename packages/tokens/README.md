# @gateflow/tokens

GateFlow's canonical OKLCH-based design tokens package. Designed to bridge primitive Atlassian-inspired enterprise colors with shadcn-friendly semantic variables and Tailwind v4 themes.

## Usage

### 1. Global CSS Import (Tailwind v3 or raw CSS consumers)

Import the CSS variables directly at the top of your global CSS:

```css
@import '@gateflow/tokens/tokens.css';
```

### 2. Tailwind v4 Integration

Tailwind v4 fully supports css variables defined outside of tailwind, but we provide a dedicated `@theme` block file mapping these to `--color-*` utility properties:

```css
@import '@gateflow/tokens/theme.css';
@import 'tailwindcss';
```

### 3. Usage within Code / Next.js Routing Layout

While standard variable use works (`var(--gf-color-background)`), you can leverage the type-safe token helper for styling or runtime config:

```tsx
import { token } from '@gateflow/tokens';

const style = { backgroundColor: token('color.primary') };
```

## Dark Mode

Our tokens look for a standard structural data attribute: `[data-color-mode="dark"]`. If this token is set on `<html>` or `<body>`, dark mode inverted components engage.

```tsx
<html data-color-mode="dark">
```
