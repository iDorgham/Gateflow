---
name: Project Architecture
description: Monorepo structure, apps, packages, ports, tech stack
type: project
---

# Project Architecture

## Stack

- **Frontend:** _(e.g. Next.js 15, React 18)_
- **Mobile:** _(e.g. Expo SDK 54)_
- **Backend:** _(e.g. Next.js API routes, Prisma 5)_
- **Database:** _(e.g. PostgreSQL 15)_
- **Auth:** _(e.g. NextAuth, JWT)_
- **Package manager:** pnpm (monorepo via Turborepo)

## Apps

| App         | Port | Purpose |
| ----------- | ---- | ------- |
| _(fill in)_ |      |         |

## Packages

| Package     | Alias | Purpose |
| ----------- | ----- | ------- |
| _(fill in)_ |       |         |

## Core Mandates

1. Every DB query must be scoped to `organizationId`
2. Soft deletes only — never hard-delete (`deletedAt: null` always)
3. Auth tokens via secure HttpOnly cookies
4. All external payloads signed (HMAC-SHA256)
5. Full RTL/i18n support on all UI

## How to apply

Use this when starting any task to understand monorepo structure and avoid
re-scanning package.json files.
