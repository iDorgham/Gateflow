# GateFlow Contracts

**Invariants and patterns** that all code must satisfy. Use when implementing, reviewing, or generating code.

## Quick Reference

| Contract | Rule |
|----------|------|
| **Multi-tenant** | Every tenant query: `organizationId` scope + `deletedAt: null` |
| **Soft delete** | Never hard-delete; set `deletedAt: new Date()` |
| **QR security** | All QR payloads HMAC-SHA256 signed; never unsigned |
| **Auth** | API routes: `requireAuth` or `getSessionClaims` first |
| **Secrets** | Never commit `.env`; no tokens in localStorage |
| **IDs** | Use `cuid()`; foreign keys indexed |

## Full Contracts

See `CONTRACTS.md` for detailed invariants, patterns, and anti-patterns.
