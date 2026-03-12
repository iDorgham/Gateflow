# @gate-access/config

<p align="center">
  <img src="https://img.shields.io/badge/Status-Stable-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/ESLint-8.x-blue" alt="ESLint">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3.x-green" alt="Tailwind">
</p>

Shared configuration presets for ESLint, TypeScript, and Tailwind CSS.

## Installation

```bash
# Auto-installed by pnpm workspace
# No manual installation needed
```

## Usage

### ESLint Configuration

```javascript
// In your app's eslintrc.cjs or .eslintrc.json
extends: ['@gate-access/config/eslint']
```

Or reference directly:

```javascript
// eslint.config.mjs
import gateAccessConfig from '@gate-access/config/eslint';

export default [
  ...gateAccessConfig,
  // Your overrides here
];
```

### TypeScript Configuration

```json
// In your app's tsconfig.json
{
  "extends": "@gate-access/config/tsconfig",
  "compilerOptions": {
    // Your overrides
  }
}
```

### Tailwind Configuration

```typescript
// In your app's tailwind.config.ts
import baseConfig from '@gate-access/config/tailwind';

export default {
  ...baseConfig,
  // Your overrides
  content: [
    ...baseConfig.content,
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
};
```

## Exports

The package exports three main configurations:

| Export                         | File                 | Description                     |
| ------------------------------ | -------------------- | ------------------------------- |
| `@gate-access/config`          | `eslintrc.cjs`       | ESLint configuration            |
| `@gate-access/config/eslint`   | `eslintrc.cjs`       | ESLint configuration (explicit) |
| `@gate-access/config/tsconfig` | `tsconfig.json`      | TypeScript base config          |
| `@gate-access/config/tailwind` | `tailwind.config.ts` | Tailwind base config            |

## Configuration Details

### ESLint (`eslintrc.cjs`)

Includes:

- TypeScript ESLint plugin
- Next.js ESLint config
- Prettier integration
- React hooks rules
- Import sorting rules

### TypeScript (`tsconfig.json`)

Base settings:

- `strict: true`
- `target: ES2020`
- `module: ESNext`
- `moduleResolution: bundler`
- `jsx: preserve`
- `paths` for workspace packages

### Tailwind (`tailwind.config.ts`)

Includes:

- Custom design tokens
- Color palette
- Typography scale
- Spacing scale
- Border radius
- Shadows
- Animations

## Workspace Package Paths

The base TypeScript config sets up these path aliases:

```json
{
  "@gate-access/ui": "packages/ui/src",
  "@gate-access/types": "packages/types/src",
  "@gate-access/api-client": "packages/api-client/src",
  "@gate-access/db": "packages/db/src",
  "@gate-access/i18n": "packages/i18n/src",
  "@gate-access/config": "packages/config/src"
}
```

## Dependencies

### Production

- `eslint` — Linter
- `@typescript-eslint/eslint-plugin` — TypeScript ESLint plugin
- `@typescript-eslint/parser` — TypeScript parser for ESLint
- `eslint-config-next` — Next.js ESLint config
- `eslint-config-prettier` — Disable conflicting Prettier rules

### Development

- `prettier` — Code formatter
- `typescript` — TypeScript compiler

## Related Documentation

- [Development Guide](../../docs/guides/DEVELOPMENT_GUIDE.md)
- [Code Conventions](../../CLAUDE.md#code-conventions)
- [UI Design Guide](../../docs/guides/UI_DESIGN_GUIDE.md)
