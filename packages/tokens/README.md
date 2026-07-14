# @gateflow/tokens

Foundational design tokens for the GateFlow Design System. Built with OKLCH color theory and CSS relative color syntax.

## Installation

```bash
npm install @gateflow/tokens
```

## Usage

### CSS

Include the tokens in your global CSS:

```css
@import '@gateflow/tokens/tokens.css';
@import '@gateflow/tokens/theme.css';
```

### Tailwind CSS (v4)

```css
@import 'tailwindcss';
@import '@gateflow/tokens/tokens.css';
@theme {
  @import '@gateflow/tokens/tokens.css';
}
```

### TypeScript

```typescript
import { token } from '@gateflow/tokens';

const color = token('color.background.default');
```

## Features

- **OKLCH Colors**: Perceptually uniform color spaces.
- **RTL Support**: Semantic spacing tokens for MENA regional consistency.
- **Light/Dark Mode**: Adaptive tokens for seamless theme transitions.
