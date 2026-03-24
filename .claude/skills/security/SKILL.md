---
name: gateflow-security
description: Security architecture, auth, RBAC, and data protection for GateFlow. Use when implementing auth, handling sensitive data, adding APIs, or reviewing security-critical code.
---

# GateFlow Security

## Auth Stack

| Component | Implementation |
|-----------|----------------|
| JWT | HS256, access 15 min, refresh 30 days |
| Password | Argon2id (t=3, m=65536, p=4) |
| Storage | httpOnly cookies (web), SecureStore (mobile) |
| Claims | sub, email, role, orgId |

## RBAC Roles

`ADMIN` | `TENANT_ADMIN` | `TENANT_USER` | `VISITOR` | `RESIDENT`

## API Route Checklist

For every new endpoint:

1. `requireAuth(request)` — validate JWT
2. Check role/permissions
3. Scope by `organizationId`
4. Validate input (Zod)
5. Rate limit (user-facing)
6. CSRF for POST/PUT/DELETE
7. Filter `deletedAt: null`

## Critical Patterns

### Protected route

```typescript
import { requireAuth } from '@/lib/require-auth';

const auth = await requireAuth(request);
if (auth instanceof NextResponse) return auth; // 401
const { orgId, role } = auth;

const data = await prisma.model.findMany({
  where: { organizationId: orgId, deletedAt: null },
});
```

### Multi-tenant query (required)

```typescript
// ✅ Correct
where: { organizationId: auth.orgId, deletedAt: null }

// ❌ Wrong
where: { deletedAt: null }
```

### Soft delete

```typescript
await prisma.gate.update({
  where: { id },
  data: { deletedAt: new Date() },
});
```

## Security Utilities

| Utility | Path | Use |
|---------|------|-----|
| Auth | `@/lib/require-auth` | JWT verification |
| CSRF | `@/lib/csrf` | Double-submit cookie |
| Rate limit | `@/lib/rate-limit` | Upstash Redis |
| Encryption | `@/lib/encryption` | AES-256 for webhook secrets |
| API key | `@/lib/api-key-auth` | Programmatic access |

## QR Security

- HMAC-SHA256 signing (`QR_SIGNING_SECRET`)
- Never generate unsigned QRs
- Preserve `scanUuid` dedup for scanner sync

## Mobile Security

- Tokens in SecureStore (never AsyncStorage for tokens)
- Offline queue: AES-256 + PBKDF2 key derivation
- Never store tokens in localStorage

## Secrets

- Never commit `.env` or `.env.local`
- Use `.env.example` with placeholders
- Fail-closed for security-critical env vars

**Reference:** `docs/SECURITY_OVERVIEW.md`, `apps/client-dashboard/src/lib/auth.ts`
