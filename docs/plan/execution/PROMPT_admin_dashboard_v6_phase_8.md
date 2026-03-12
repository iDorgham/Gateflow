# Phase 8: Settings + Admins Management

## Primary role
FULLSTACK

## Preferred tool
- [x] Cursor (default)

## Context
- **App**: `apps/admin-dashboard`
- **Refs**:
  - `apps/admin-dashboard/src/app/[locale]/(dashboard)/settings/page.tsx` — current stub
  - `apps/admin-dashboard/src/app/[locale]/(dashboard)/admins/page.tsx` — current stub
  - `apps/admin-dashboard/src/lib/admin-auth.ts`
  - `@gate-access/ui` — Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Badge, Textarea, cn

## Goal
Build out the Settings page (platform-wide config, compliance placeholder, session info) and the Admins page (admin access key management, audit access info).

## Scope (in)

### Settings page
- **`src/app/[locale]/(dashboard)/settings/page.tsx`** (server component):
  - `<PageHeader title="Settings" subtitle="Platform configuration and compliance" />`
  - **Platform Info section** (read-only cards):
    - GateFlow version (hardcoded or from `package.json`)
    - Environment: `process.env.NODE_ENV`
    - Database URL: masked (`postgresql://***@host:port/gateflow`)
    - Admin access key status: "Configured ✓" or "⚠ Not set"
  - **Session settings** (read-only):
    - Current session expiry: "12 hours"
    - Token rotation: "On login"
  - **Compliance placeholder** (`src/components/settings/CompliancePlaceholder.tsx`):
    - Card titled "Compliance Reporting"
    - Body: "SOC 2 and GDPR compliance reporting will be available in a future release."
    - Badge: "Coming Q4 2026"
    - Links placeholder: "Download DPA template", "Export audit logs" (link to audit-logs page)
  - **Notification settings placeholder** — simple card with "Email alerts for critical events: Coming soon"

### Admins page
- **`src/app/[locale]/(dashboard)/admins/page.tsx`** (server component):
  - `<PageHeader title="Admin Access" subtitle="Manage platform administrator access" />`
  - **Current access key card**:
    - Shows: "ADMIN_ACCESS_KEY is configured" with a green badge
    - Shows key fingerprint (first 8 chars of SHA-256 of the key) so admin can verify which key is active
    - Warning: "Keep this key secret. Rotate it by updating the environment variable and redeploying."
  - **Session management card**:
    - "Active session expires in: 12 hours"
    - "Sign out all sessions" button — calls `DELETE /[locale]/api/admin/login` (already exists)
  - **Access log placeholder**:
    - "Admin access logging coming in a future release."
    - Link to audit-logs page for now
  - **Security recommendations** list:
    - ✓ Access key ≥ 32 characters
    - ✓ HTTPS enforced in production
    - ✓ Session cookie: httpOnly + sameSite=lax
    - ○ MFA: not yet implemented

### Components
- `src/components/settings/CompliancePlaceholder.tsx`
- `src/components/settings/PlatformInfoCard.tsx`

## Steps (ordered)
1. Create `src/components/settings/CompliancePlaceholder.tsx`.
2. Create `src/components/settings/PlatformInfoCard.tsx`.
3. Rebuild `src/app/[locale]/(dashboard)/settings/page.tsx`.
4. Rebuild `src/app/[locale]/(dashboard)/admins/page.tsx`.
5. Run `pnpm turbo lint --filter=admin-dashboard`.
6. Run `pnpm turbo typecheck --filter=admin-dashboard`.
7. Commit: `feat(admin): settings page and admins management (phase 8)`.

## Scope (out)
- Editable settings stored in DB (deferred — no schema changes needed now)
- MFA for admin
- Real compliance report generation

## Acceptance criteria
- [ ] Settings page renders with platform info, compliance placeholder, session info.
- [ ] Compliance section has "Coming Q4 2026" badge.
- [ ] Admins page shows key fingerprint (first 8 chars of SHA-256).
- [ ] "Sign out all sessions" button works (calls existing DELETE endpoint).
- [ ] Security recommendations list renders with ✓/○ icons.
- [ ] No hardcoded secrets shown (DB URL masked, key fingerprint only).
- [ ] `pnpm turbo lint --filter=admin-dashboard` passes.
- [ ] `pnpm turbo typecheck --filter=admin-dashboard` passes.

## Git commit
```
feat(admin): settings page and admins management (phase 8)
```
