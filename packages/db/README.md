# @gate-access/db

<p align="center">
  <img src="https://img.shields.io/badge/Status-Stable-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Prisma-5.x-blue" alt="Prisma">
</p>

Prisma database client, schema, and database utilities for GateFlow.

## Overview

This package provides the database layer for all GateFlow applications. It includes the Prisma client, schema definitions, multi-tenant context management, and quota helpers.

## Installation

```bash
# Auto-installed by pnpm workspace
# No manual installation needed
```

## Usage

```typescript
import { prisma, db } from '@gate-access/db';
import { setOrganizationContext } from '@gate-access/db';

// Basic query
const users = await prisma.user.findMany();

// Multi-tenant query
await setOrganizationContext(orgId);
const gates = await prisma.gate.findMany({
  where: { organizationId: orgId },
});
```

## Exports

### Client

- `prisma` — Default Prisma client instance
- `db` — Alias for prisma
- `prismaClient` — Default export

### Tenant Context

- `setOrganizationContext(orgId)` — Set current organization context
- `getOrganizationContext()` — Get current organization ID
- `clearOrganizationContext()` — Clear organization context
- `OrganizationContext` — Type for organization context
- `DbClient` — Type for database client

### Quota

- `quota` — Quota management utilities (exported from `./quota`)

### Access

- `access` — Access control utilities (exported from `./access`)

## Schema

The Prisma schema is located at `prisma/schema.prisma`.

### Core Models

| Model          | Purpose                      |
| -------------- | ---------------------------- |
| `Organization` | Multi-tenant root entity     |
| `Project`      | Sub-grouping within org      |
| `User`         | Authenticated users          |
| `Gate`         | Physical access points       |
| `QRCode`       | Generated access codes       |
| `ScanLog`      | Immutable scan audit records |
| `RefreshToken` | JWT refresh tokens           |
| `Webhook`      | Event notifications          |
| `ApiKey`       | Programmatic API access      |

## Database Commands

Run from `packages/db`:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Create migration
npx prisma migrate dev

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

## Dependencies

- `@prisma/client` — Prisma ORM
- `prisma` — CLI

## Related Documentation

- [Security Overview](../../docs/guides/SECURITY_OVERVIEW.md)
- [Environment Variables](../../docs/guides/ENVIRONMENT_VARIABLES.md)
- [CLAUDE.md: Database Schema](../../CLAUDE.md#database-schema)
