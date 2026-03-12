# @gate-access/types

<p align="center">
  <img src="https://img.shields.io/badge/Status-Stable-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Types-TypeScript-blue" alt="TypeScript">
</p>

Shared TypeScript interfaces, types, and enums for GateFlow applications.

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

## Exports

### User Types (`./user.ts`)

| Export              | Type      | Description                                         |
| ------------------- | --------- | --------------------------------------------------- |
| `UserRole`          | Enum      | ADMIN, TENANT_ADMIN, TENANT_USER, VISITOR, RESIDENT |
| `User`              | Interface | User entity                                         |
| `UserWithRelations` | Interface | User with org and roles                             |

### Organization Types (`./organization.ts`)

| Export                 | Type      | Description           |
| ---------------------- | --------- | --------------------- |
| `Organization`         | Interface | Organization entity   |
| `Plan`                 | Enum      | FREE, PRO, ENTERPRISE |
| `OrganizationSettings` | Interface | Org configuration     |

### Gate Types (`./gate.ts`)

| Export       | Type      | Description                   |
| ------------ | --------- | ----------------------------- |
| `Gate`       | Interface | Gate entity                   |
| `GateStatus` | Enum      | ACTIVE, INACTIVE, MAINTENANCE |

### QR Code Types (`./qr.ts`)

| Export         | Type      | Description                    |
| -------------- | --------- | ------------------------------ |
| `QRCode`       | Interface | QR code entity                 |
| `QRCodeType`   | Enum      | SINGLE, RECURRING, PERMANENT   |
| `QRCodeStatus` | Enum      | ACTIVE, EXPIRED, REVOKED, USED |

### Scan Log Types (`./scan-log.ts`)

| Export          | Type      | Description                                 |
| --------------- | --------- | ------------------------------------------- |
| `ScanLog`       | Interface | Scan log entity                             |
| `ScanStatus`    | Enum      | SUCCESS, FAILED, EXPIRED, INVALID, OVERRIDE |
| `ScanDirection` | Enum      | ENTRY, EXIT                                 |

### Scan Event Types (`./scan-event.ts`)

| Export          | Type      | Description          |
| --------------- | --------- | -------------------- |
| `ScanEvent`     | Interface | Real-time scan event |
| `ScanEventType` | Enum      | Scan event type      |

### QR Payload Types (`./qr-payload.ts`)

| Export          | Type      | Description               |
| --------------- | --------- | ------------------------- |
| `QRPayload`     | Interface | QR code payload structure |
| `QRPayloadData` | Interface | QR data content           |

### QR Signing Types (`./qr-signing.ts`)

| Export                 | Type      | Description         |
| ---------------------- | --------- | ------------------- |
| `QRSignedPayload`      | Interface | Signed QR payload   |
| `SignQRPayloadOptions` | Interface | Options for signing |

### QR Validation Types (`./qr-validate.ts`)

| Export               | Type      | Description            |
| -------------------- | --------- | ---------------------- |
| `QRValidationResult` | Interface | QR validation result   |
| `ValidateQROptions`  | Interface | Options for validation |

### Auth Types (`./auth.ts`)

| Export                | Type      | Description           |
| --------------------- | --------- | --------------------- |
| `JWTPayload`          | Interface | JWT token payload     |
| `RefreshTokenPayload` | Interface | Refresh token payload |
| `AuthResult`          | Interface | Authentication result |
| `ApiScope`            | Enum      | API key scopes        |

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
  // ...
};
```

### Scan Logging

```typescript
import { ScanLog, ScanStatus, ScanDirection } from '@gate-access/types';

const log: ScanLog = {
  id: 'scan_123',
  status: ScanStatus.SUCCESS,
  direction: ScanDirection.ENTRY,
  // ...
};
```

## Dependencies

- `typescript` — TypeScript compiler

## Related Documentation

- [CLAUDE.md: Database Schema](../../CLAUDE.md#database-schema)
- [Security Overview](../../docs/guides/SECURITY_OVERVIEW.md)
