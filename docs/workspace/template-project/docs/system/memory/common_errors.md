---
name: Common Errors & Gotchas
description: Known mistakes, recurring bugs, and non-obvious behaviours
type: feedback
---

# Common Errors & Gotchas

## Database

- **Prisma accessor casing:** model `QRCode` → accessor `prisma.qRCode` (camelCase, not `qrCode`)
- **Enum imports:** always from `@project/db`, never from `@prisma/client` directly
- **Missing soft-delete filter:** forgetting `deletedAt: null` returns deleted records — always add it

## TypeScript

- **Test files:** need `export {}` at top to avoid TS2451 duplicate-identifier errors across Jest files
- **`any` in boundaries:** avoid `as any` — use type guards at system boundaries instead

## Auth

- **Client-supplied org ID:** never use it directly — always validate against `session.user.organizationId`
- **Cookie vs header auth:** use HttpOnly cookies for web, Authorization header for mobile/API

## UI

- **Dialog rendering:** use `{open && <Dialog>}` conditional, not `<Dialog open={open}>` — avoids mount/unmount issues
- **RTL layout:** every new UI component must support both LTR and RTL — use `dir` prop, not `text-right`

---

> **How to add entries:**
> When you hit a bug or non-obvious behavior, add it here in the relevant section.
> Format: short problem description → correct behavior or fix.
