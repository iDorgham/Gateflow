# @gate-access/db

<div align="center">

**Prisma database client, schema, and utilities for GateFlow**

_Multi-tenant context management, quota helpers, and access control_

[![Status](https://img.shields.io/badge/Status-Stable-success?style=for-the-badge)](#)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-blue?style=for-the-badge&logo=prisma)](https://prisma.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](#)

</div>

---

## Overview

This package provides the database layer for all GateFlow applications. It includes the Prisma client, schema definitions, multi-tenant context management, and quota helpers.

### Key Features

| Feature                    | Description                                    |
| :------------------------- | :--------------------------------------------- |
| **Multi-Tenant Isolation** | Hard-scoped queries with `organizationId`      |
| **Soft Deletes**           | All models support `deletedAt` for data safety |
| **Quota Management**       | Visitor quota calculations per unit type       |
| **Access Control**         | Gate access validation utilities               |

---

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

---

## Exports

### Client

| Export         | Type   | Description                    |
| :------------- | :----- | :----------------------------- |
| `prisma`       | Client | Default Prisma client instance |
| `db`           | Client | Alias for prisma               |
| `prismaClient` | Client | Default export                 |

### Tenant Context

| Export                          | Type     | Description                      |
| :------------------------------ | :------- | :------------------------------- |
| `setOrganizationContext(orgId)` | function | Set current organization context |
| `getOrganizationContext()`      | function | Get current organization ID      |
| `clearOrganizationContext()`    | function | Clear organization context       |
| `OrganizationContext`           | Type     | Type for organization context    |

### Quota & Access

| Export   | Type   | Description                |
| :------- | :----- | :------------------------- |
| `quota`  | object | Quota management utilities |
| `access` | object | Access control utilities   |

---

## Schema

The Prisma schema is located at `prisma/schema.prisma`.

### Core Models

| Model          | Purpose                      |
| :------------- | :--------------------------- |
| `Organization` | Multi-tenant root entity     |
| `Project`      | Sub-grouping within org      |
| `User`         | Authenticated users          |
| `Gate`         | Physical access points       |
| `QRCode`       | Generated access codes       |
| `ScanLog`      | Immutable scan audit records |
| `RefreshToken` | JWT refresh tokens           |
| `Webhook`      | Event notifications          |
| `ApiKey`       | Programmatic API access      |

---

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

---

## Related Documentation

| Document                                                            | Description                |
| :------------------------------------------------------------------ | :------------------------- |
| [Security Overview](../../docs/guides/SECURITY_OVERVIEW.md)         | Multi-tenancy and security |
| [Environment Variables](../../docs/guides/ENVIRONMENT_VARIABLES.md) | Database configuration     |
| [CLAUDE.md](../../CLAUDE.md)                                        | Database schema reference  |
