---
name: Common Errors & Gotchas
description: Known mistakes, recurring bugs, non-obvious behaviours
type: feedback
---

# Common Errors & Gotchas

## Database

- Always filter `deletedAt: null` (soft deletes everywhere)
- Import enums from `@project/db`, not `@prisma/client`

## TypeScript

- Test files need `export {}` at top to avoid TS2451 errors

## Auth

- Never use client-supplied org ID — always use session value

_(Add more as you discover them)_
