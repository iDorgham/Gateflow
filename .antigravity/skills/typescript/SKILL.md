---
name: typescript
description: TypeScript patterns for strict typing, interfaces, and type safety. Use when writing TS code, defining types, or resolving type errors.
---

# TypeScript

## GateFlow config

- **Strict:** `strict: true` in tsconfig
- **Target:** ES2020
- **Module:** bundler resolution

## Patterns

- **Avoid `any`** — Use `unknown` or proper types
- **Interfaces** — For object shapes; prefer `interface` for extendability
- **Generics** — When types depend on parameters
- **Union types** — For discriminated unions (`type: 'a' | 'b'`)

## Shared types

- `@gate-access/types` — Auth, QR, scan-log, user, etc.
- `@gate-access/db` — Prisma exports (`Prisma.*`, model types)

## API responses

```ts
// Prefer explicit response types
type ApiResponse<T> = { success: true; data: T } | { success: false; message: string };
```

## Null/undefined

- Use optional chaining (`?.`), nullish coalescing (`??`)
- Prefer `undefined` over `null` for optional params (unless DB/API uses null)
