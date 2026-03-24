# SKILL: Granular RBAC & Permissions Enforcement

## Purpose
Codify the Role-Based Access Control (RBAC) model for GateFlow v9.0, ensuring strict data isolation and action authorization across all user roles.

## Core Principles
1.  **Explicit Deny**: Everything is restricted by default; users must have explicit permissions to view or act.
2.  **Organization Isolation**: Users cannot cross the "Organization Boundary"; every query must strictly filter by `organizationId`.
3.  **Role Hierarchy**: Inherit permissions through well-defined roles (Resident, Scanner, Admin, SuperAdmin).

## Implementation Rules
- **Roles**:
  - `RESIDENT`: Manage own profile, guest invites, personal qr.
  - `SCANNER`: Verify QR, log entries, view dashboard (read-only).
  - `ADMIN`: Manage users, gates, reports, and org settings.
- **UI Hiding**: Components must be hidden/disabled if the user lacks the required role.
- **Backend check**: Always re-verify roles in Server Actions/APIs.

## Anti-Patterns
- Relying on client-side state for permission checks.
- Using simple booleans like `isAdmin: true` (use granular strings/arrays like `permissions: ['scans:write']`).
- Hardcoding user IDs in the codebase.

## Code Examples

### Permission Guard Component
```tsx
const Can = ({ p, children }) => {
  const { user } = useAuth();
  if (!user.permissions.includes(p)) return null;
  return <>{children}</>;
};

// Usage
<Can p="users:delete">
  <DeleteButton />
</Can>
```

### Server Action Role Verification
```typescript
export async function deleteGate(gateId: string) {
  const session = await getSession();
  if (session.user.role !== "ADMIN") throw new Error("Forbidden");
  
  return await prisma.gate.delete({ 
    where: { id: gateId, organizationId: session.orgId } // Scoped to org
  });
}
```
