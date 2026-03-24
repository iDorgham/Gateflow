# SKILL: Data Privacy & MENA Compliance (GDPR/NDP)

## Purpose
Ensure GateFlow v9.0 adheres to international data privacy standards (GDPR) and local MENA data protection laws (e.g., Egypt's NDP Law).

## Core Principles
1.  **Data Minimization**: Only collect PII (Personally Identifiable Information) that is absolutely necessary for operations.
2.  **Right to Be Forgotten**: Implement efficient soft-delete and permanent purge mechanisms for user data.
3.  **MENA Residency**: Ensure data storage and transit comply with local regional residency requirements when specified.

## Implementation Rules
- **PII Masking**: Mask phone numbers and emails in dashboard views unless full access is granted.
- **Audit Logs**: Record who accessed what PII and when.
- **Anonymization**: Scrub logs and analytics of specific names after 90 days.

## Anti-Patterns
- Storing unencrypted PII in logs or transient caches (Redis).
- Keeping guest data indefinitely after the visit is complete.
- Sharing PII across organizations.

## Code Examples

### Masking Utility
```typescript
export const maskPII = (value: string, type: 'email' | 'phone') => {
  if (type === 'email') {
    const [name, domain] = value.split('@');
    return `${name[0]}***@${domain}`;
  }
  return value.slice(0, 3) + "****" + value.slice(-3);
};
```

### Purpose-Scoped Query
```typescript
// Only fetch public fields for non-admin viewers
const getVisitorProfile = async (id: string, viewerRole: string) => {
  const select = viewerRole === 'ADMIN' 
    ? { id: true, name: true, phone: true } 
    : { id: true, name: true }; // Hide phone for scanners
    
  return await prisma.visitor.findUnique({ where: { id }, select });
};
```
