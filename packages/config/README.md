# @gate-access/config

<div align="center">

**Shared configuration presets for ESLint, TypeScript, and Tailwind CSS**

_Consistent code quality across the entire monorepo_

[![Status](https://img.shields.io/badge/Status-Stable-success?style=for-the-badge)](#)
[![ESLint](https://img.shields.io/badge/ESLint-8.x-blue?style=for-the-badge&logo=eslint)](https://eslint.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](#)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=for-the-badge&logo=tailwindcss)](#)

</div>

---

## Overview

Shared configuration presets for ESLint, TypeScript, and Tailwind CSS. Ensures consistent code quality and styling across all apps and packages.

### What's Included

| Config         | Description                                            |
| :------------- | :----------------------------------------------------- |
| **ESLint**     | TypeScript rules, Next.js config, Prettier integration |
| **TypeScript** | Strict mode, workspace paths                           |
| **Tailwind**   | ADS tokens, color palette, RTL utilities               |

---

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

---

## Exports

| Export                         | File                 | Description          |
| :----------------------------- | :------------------- | :------------------- |
| `@gate-access/config`          | `eslintrc.cjs`       | ESLint configuration |
| `@gate-access/config/eslint`   | `eslintrc.cjs`       | ESLint (explicit)    |
| `@gate-access/config/tsconfig` | `tsconfig.json`      | TypeScript base      |
| `@gate-access/config/tailwind` | `tailwind.config.ts` | Tailwind base        |

---

## Configuration Details

### ESLint (`eslintrc.cjs`)

| Included                 | Description                  |
| :----------------------- | :--------------------------- |
| TypeScript ESLint plugin | TypeScript-specific rules    |
| Next.js ESLint config    | Next.js best practices       |
| Prettier integration     | Format-on-save compatibility |
| React hooks rules        | `exhaustive-deps` and others |
| Import sorting rules     | `simple-import-sort`         |

### TypeScript (`tsconfig.json`)

| Setting            | Value      |
| :----------------- | :--------- |
| `strict`           | `true`     |
| `target`           | `ES2020`   |
| `module`           | `ESNext`   |
| `moduleResolution` | `bundler`  |
| `jsx`              | `preserve` |

### Tailwind (`tailwind.config.ts`)

| Included             | Description            |
| :------------------- | :--------------------- |
| Custom design tokens | ADS color palette      |
| Typography scale     | Font sizes and weights |
| Spacing scale        | Consistent spacing     |
| Border radius        | Corner radius tokens   |
| Shadows              | Elevation system       |
| Animations           | Motion utilities       |

---

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

---

## Related Documentation

| Document                                                    | Description      |
| :---------------------------------------------------------- | :--------------- |
| [Development Guide](../../docs/guides/DEVELOPMENT_GUIDE.md) | Local setup      |
| [Code Conventions](../../CLAUDE.md)                         | Style guidelines |
| [UI Design Guide](../../docs/guides/UI_DESIGN_GUIDE.md)     | Design tokens    |
