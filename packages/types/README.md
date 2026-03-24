# @gate-access/types

<div align="center">

**Shared TypeScript interfaces, types, and enums for GateFlow applications**

_Universal type definitions across all packages and apps_

[![Status](https://img.shields.io/badge/Status-Stable-success?style=for-the-badge)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](#)
[![Zod](https://img.shields.io/badge/Zod-Validation-blue?style=for-the-badge)](#)

</div>

---

## Overview

Shared TypeScript interfaces, types, and enums for GateFlow applications. Provides type safety across all packages and apps.

### Key Exports

| Category               | Files                                                       |
| :--------------------- | :---------------------------------------------------------- |
| **User Types**         | `user.ts`                                                   |
| **Organization Types** | `organization.ts`                                           |
| **Gate Types**         | `gate.ts`                                                   |
| **QR Code Types**      | `qr.ts`, `qr-payload.ts`, `qr-signing.ts`, `qr-validate.ts` |
| **Scan Log Types**     | `scan-log.ts`, `scan-event.ts`                              |
| **Auth Types**         | `auth.ts`                                                   |

---

## Installation

```bash
# Auto-installed by pnpm workspace
# No manual installation needed
```

## Usage

```typescript
import {
  UserRole,
  Organization,
  Gate,
  QRCode,
  ScanLog,
} from '@gate-access/types';

// Use types directly
const userRole: UserRole = 'TENANT_ADMIN';
const org: Organization = { id: 'org_123', name: 'Acme Corp' };
```

---

## User Types (`./user.ts`)

| Export              | Type      | Description                                         |
| :------------------ | :-------- | :-------------------------------------------------- |
| `UserRole`          | Enum      | ADMIN, TENANT_ADMIN, TENANT_USER, VISITOR, RESIDENT |
| `User`              | Interface | User entity                                         |
| `UserWithRelations` | Interface | User with org and roles                             |

## Organization Types (`./organization.ts`)

| Export                 | Type      | Description           |
| :--------------------- | :-------- | :-------------------- |
| `Organization`         | Interface | Organization entity   |
| `Plan`                 | Enum      | FREE, PRO, ENTERPRISE |
| `OrganizationSettings` | Interface | Org configuration     |

## Gate Types (`./gate.ts`)

| Export       | Type      | Description                   |
| :----------- | :-------- | :---------------------------- |
| `Gate`       | Interface | Gate entity                   |
| `GateStatus` | Enum      | ACTIVE, INACTIVE, MAINTENANCE |

## QR Code Types (`./qr.ts`)

| Export         | Type      | Description                    |
| :------------- | :-------- | :----------------------------- |
| `QRCode`       | Interface | QR code entity                 |
| `QRCodeType`   | Enum      | SINGLE, RECURRING, PERMANENT   |
| `QRCodeStatus` | Enum      | ACTIVE, EXPIRED, REVOKED, USED |

## Scan Log Types (`./scan-log.ts`)

| Export          | Type      | Description                                 |
| :-------------- | :-------- | :------------------------------------------ |
| `ScanLog`       | Interface | Scan log entity                             |
| `ScanStatus`    | Enum      | SUCCESS, FAILED, EXPIRED, INVALID, OVERRIDE |
| `ScanDirection` | Enum      | ENTRY, EXIT                                 |

## Auth Types (`./auth.ts`)

| Export                | Type      | Description           |
| :-------------------- | :-------- | :-------------------- |
| `JWTPayload`          | Interface | JWT token payload     |
| `RefreshTokenPayload` | Interface | Refresh token payload |
| `AuthResult`          | Interface | Authentication result |
| `ApiScope`            | Enum      | API key scopes        |

---

## Common Use Cases

### Multi-Tenant Queries

```typescript
import { Organization, User } from '@gate-access/types';

function getOrgUsers(org: Organization): User[] {
  // Filter by org.id
}
```

### QR Code Operations

```typescript
import { QRCode, QRCodeType, QRPayload } from '@gate-access/types';

const qr: QRCode = {
  id: 'qr_123',
  type: QRCodeType.SINGLE,
  status: 'ACTIVE',
};
```

### Scan Logging

```typescript
import { ScanLog, ScanStatus, ScanDirection } from '@gate-access/types';

const log: ScanLog = {
  id: 'scan_123',
  status: ScanStatus.SUCCESS,
  direction: ScanDirection.ENTRY,
};
```

---

## Related Documentation

| Document                                                    | Description               |
| :---------------------------------------------------------- | :------------------------ |
| [CLAUDE.md](../../CLAUDE.md)                                | Database schema reference |
| [Security Overview](../../docs/guides/SECURITY_OVERVIEW.md) | Type safety in security   |
