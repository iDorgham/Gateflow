# GateFlow Security Expert

## Purpose
Expert knowledge of GateFlow's security architecture, authentication, and data protection patterns.

## When to Use
- Implementing authentication/authorization
- Working with sensitive data
- Adding API endpoints
- Reviewing security-critical code
- Handling user data or credentials

## Security Architecture

### Authentication Stack
- **JWT Tokens**: HS256 algorithm
  - Access tokens: 15-minute expiry
  - Refresh tokens: 30-day expiry, stored in DB
  - Issuer/Audience: `gateflow` / `gateflow-api`
  - Claims: `sub` (userId), `email`, `role`, `orgId`
- **Password Hashing**: Argon2id with params `t=3, m=65536, p=4`
- **Storage**: Secure httpOnly cookies for web, SecureStore for mobile

### RBAC Roles
```typescript
enum UserRole {
  ADMIN          // Platform admin (admin-dashboard)
  TENANT_ADMIN   // Full client-dashboard access
  TENANT_USER    // Limited client-dashboard access
  VISITOR        // Scanner app only
  RESIDENT       // Resident portal (Phase 2)
}
```

### Security Layers

#### 1. CSRF Protection
- **Pattern**: Double-submit cookie
- **Implementation**: `apps/client-dashboard/src/lib/csrf.ts`
- **Usage**: All state-changing requests must include CSRF token
```typescript
import { generateCsrfToken, validateCsrfToken } from '@/lib/csrf';
```

#### 2. Rate Limiting
- **Backend**: Upstash Redis
- **Implementation**: `apps/client-dashboard/src/lib/rate-limit.ts`
- **Multi-instance safe**: Uses distributed Redis
- **Limits**: Configurable per endpoint
```typescript
import { rateLimit } from '@/lib/rate-limit';
await rateLimit(request, { max: 10, window: '1m' });
```

#### 3. Field Encryption
- **Algorithm**: AES-256-GCM
- **Use Cases**: Webhook secrets, API keys, sensitive fields
- **Implementation**: `apps/client-dashboard/src/lib/encryption.ts`
```typescript
import { encrypt, decrypt } from '@/lib/encryption';
const encrypted = encrypt(plaintext);
const plaintext = decrypt(encrypted);
```

#### 4. QR Code Signing
- **Algorithm**: HMAC-SHA256
- **Secret**: `QR_SIGNING_SECRET` environment variable
- **Purpose**: Prevent QR code forgery
- **Verification**: Both server-side and offline in scanner app
```typescript
import crypto from 'crypto';
const signature = crypto
  .createHmac('sha256', process.env.QR_SIGNING_SECRET!)
  .update(qrData)
  .digest('hex');
```

#### 5. API Key Authentication
- **Storage**: SHA-256 hashed (never plaintext)
- **Scopes**: Granular permissions via `ApiScope` enum
- **Implementation**: `apps/client-dashboard/src/lib/api-key-auth.ts`
```typescript
import { validateApiKey } from '@/lib/api-key-auth';
const { valid, apiKey } = await validateApiKey(request);
```

### Multi-Tenancy Security

#### Row-Level Security
Every database query MUST include organizationId:
```typescript
// ✅ CORRECT
const gates = await prisma.gate.findMany({
  where: {
    organizationId: user.orgId,
    deletedAt: null
  }
});

// ❌ WRONG - Missing orgId scoping
const gates = await prisma.gate.findMany({
  where: { deletedAt: null }
});
```

#### Soft Deletes
Always use soft deletes to maintain audit trail:
```typescript
// ✅ CORRECT - Soft delete
await prisma.gate.update({
  where: { id },
  data: { deletedAt: new Date() }
});

// ❌ WRONG - Hard delete
await prisma.gate.delete({ where: { id } });
```

### Mobile Security

#### Offline Queue Encryption
- **Algorithm**: AES-256 + PBKDF2 key derivation
- **Purpose**: Encrypt offline scan queue
- **Implementation**: Scanner app uses crypto-js
```typescript
import CryptoJS from 'crypto-js';
const encrypted = CryptoJS.AES.encrypt(data, derivedKey).toString();
```

#### Token Storage
- **Web**: httpOnly cookies (not localStorage)
- **Mobile**: Expo SecureStore (encrypted keychain)
```typescript
import * as SecureStore from 'expo-secure-store';
await SecureStore.setItemAsync('accessToken', token);
```

### Security Headers
All Next.js apps must include:
```typescript
// next.config.js
headers: [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  }
]
```

### Environment Variables
Never commit secrets. Required security env vars:
```bash
# JWT
JWT_SECRET=
NEXTAUTH_SECRET=

# QR Signing
QR_SIGNING_SECRET=

# Encryption
ENCRYPTION_MASTER_KEY=

# Rate Limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Database
DATABASE_URL=
```

## Security Checklist

### For New API Endpoints
- [ ] Validate JWT token
- [ ] Check user role/permissions
- [ ] Scope query by organizationId
- [ ] Validate input with Zod
- [ ] Apply rate limiting
- [ ] Include CSRF protection (POST/PUT/DELETE)
- [ ] Log security events
- [ ] Handle errors without leaking info

### For New Features
- [ ] Review for injection vulnerabilities
- [ ] Validate all user input
- [ ] Sanitize output
- [ ] Use parameterized queries (Prisma handles this)
- [ ] Encrypt sensitive data at rest
- [ ] Use HTTPS only
- [ ] Implement proper error handling

### For Database Changes
- [ ] Add organizationId to new models
- [ ] Add deletedAt for soft deletes
- [ ] Add indexes for performance
- [ ] Review for data leakage
- [ ] Test multi-tenant isolation

## Common Security Patterns

### Protected API Route
```typescript
import { validateAuth } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  // Rate limit
  await rateLimit(request, { max: 10, window: '1m' });
  
  // Authenticate
  const user = await validateAuth(request);
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Authorize
  if (user.role !== 'TENANT_ADMIN') {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  // Scope by org
  const data = await prisma.model.findMany({
    where: {
      organizationId: user.orgId,
      deletedAt: null
    }
  });
  
  return Response.json(data);
}
```

## References
- `docs/SECURITY_OVERVIEW.md` - Complete security documentation
- `docs/MVP_CODE_QUALITY_AND_SECURITY_REVIEW.md` - Security audit
- `apps/client-dashboard/src/lib/auth.ts` - Auth utilities
- `packages/db/prisma/schema.prisma` - Security-related models
