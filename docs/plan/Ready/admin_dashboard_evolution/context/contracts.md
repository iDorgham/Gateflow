# Contracts — admin_dashboard_evolution

## Multi-Tenancy (Hard Rules)

1. **Every Prisma query MUST include `organizationId`** — no exceptions for org-scoped data
2. **Never use hard deletes** — always `{ deletedAt: new Date() }` for soft delete
3. **Always filter `deletedAt: null`** in every query's `where` clause
4. **OrgId from session** — never trust orgId from request body; always validate against JWT claims
5. **Org context switch** — persisted to localStorage key `gateflow_selected_org` only; never server-side session

## ADS Token Compliance (Non-Negotiable)

```tsx
// ✅ ALWAYS use ADS tokens
import { token } from '@atlaskit/tokens';
backgroundColor: token('ds.background.neutral');
color: token('ds.text');
padding: token('ds.space.300');

// ❌ NEVER use raw colors or Tailwind color classes
backgroundColor: '#1F2937';
className = 'bg-gray-800 text-white p-4';
```

- **Colors:** `ds.background.*`, `ds.text.*`, `ds.icon.*`, `ds.border.*`
- **Spacing:** `ds.space.100` through `ds.space.500`
- **Typography:** `ds.typography.*`
- **Radius:** `ds.border.radius.*`

## RTL Contracts

```tsx
// ✅ CORRECT — logical properties
marginInlineStart: token('ds.space.200');
paddingInlineEnd: token('ds.space.300');
textAlign: dir === 'rtl' ? 'end' : 'start';

// ❌ WRONG — directional properties
marginLeft: '16px';
paddingRight: '24px';
textAlign: 'left';
```

- Use `dir={locale === 'ar' ? 'rtl' : 'ltr'}` at layout root
- All icons that imply direction must flip in RTL (e.g., chevrons, arrows)

## Security Contracts

1. **Authentication:** All dashboard routes require valid `gf_access_token` cookie
2. **Authorization:** Super-admin routes require `isAdmin: true` in JWT claims
3. **CSRF:** All mutations require `x-csrf-token` header matching cookie
4. **OrgId validation:** On every request, confirm `orgId` param matches token's `orgId`
5. **Input sanitization:** All user content sanitized before DB write (DOMPurify for HTML)
6. **Audit logging:** All CUD (Create, Update, Delete) operations logged to `AuditLog` model

## AI Contracts

1. **No auto-publish:** AI-generated content MUST go through human confirmation gate before publish
2. **Audit trail:** Every AI action creates an `AuditLog` entry with `{ action: 'AI_GENERATED', userId, contentType, contentId, timestamp }`
3. **Retry limit:** Max 3 retries on AI failure; after 3 failures, show fallback UI
4. **Streaming required:** All AI text generation must use streaming (`streamText`) for UX
5. **Rate limiting:** AI endpoints rate-limited to 10 req/min per org

## Database Contracts

- `Organization` must exist before any org-scoped resource is created
- `User.organizationId` is always set (except super-admins)
- `Task.linkedType` + `Task.linkedId` for polymorphic links to Blog/Landing pages
- `Role.permissions` JSON field governs all RBAC — never hardcode permission checks

## Frontend Contracts

- All pages must export `generateMetadata()` for SEO
- All pages must have `<h1>` tag for accessibility
- All interactive elements must have unique `id` attributes
- All forms must handle loading, error, and success states
- All lists must handle empty state with descriptive messaging
