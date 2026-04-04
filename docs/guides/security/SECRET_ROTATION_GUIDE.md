# Secret Management & Rotation Guide

This document outlines the policy and procedure for managing and rotating secrets within the GateFlow ecosystem.

## 1. Secret Inventory

| Secret Name                | Purpose                          | App(s)       | Impact if Leaked                    |
| -------------------------- | -------------------------------- | ------------ | ----------------------------------- |
| `DATABASE_URL`             | Primary DB Connection            | All          | Full data compromise.               |
| `NEXTAUTH_SECRET`          | JWT Signing / Session Encryption | All          | User session hijacking.             |
| `QR_SIGNING_SECRET`        | HMAC-SHA256 for QR integrity     | Scanner, API | Ticket forgery.                     |
| `ENCRYPTION_MASTER_KEY`    | AES-256 for sensitive DB fields  | API, CRM     | PII/Auth data disclosure.           |
| `ADMIN_ACCESS_KEY`         | Admin API guard                  | Admin, API   | Unauthorized org management.        |
| `VERCEL_TOKEN`             | Deployment access                | CI/CD        | Infrastructure control.             |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiting / Caching          | API          | Performance degradation / DoS risk. |

## 2. General Security Rules

1. **NO Hardcoded Secrets**: Use `.env` files for local development and GitHub Secrets for CI/CD.
2. **Minimum Length**: All secrets MUST be at least 32 characters long.
3. **Environment Isolation**: Production secrets MUST never be used in Staging or Development environments.
4. **Least Privilege**: GitHub Actions should only have the `permissions` required for the task.

## 3. Rotation Procedure

Rotate critical secrets every 90 days or immediately upon suspected compromise.

### A. NextAuth & JWT Secrets

1. Generate a new key: `openssl rand -base64 48`
2. Update GitHub Secrets / Vercel Env Vars.
3. Redeploy apps.
4. **Impact**: All users will be logged out and must sign in again.

### B. QR Signing Secret

1. Generate a new key: `openssl rand -hex 32`
2. Run migration to re-sign current QR codes if necessary (or accept temporary invalidation).
3. Update GitHub/Vercel.
4. **Impact**: Existing paper-based QR codes might fail validation until updated.

### C. Database Credentials

1. Create a new user in RDS/PostgreSQL with the same permissions.
2. Update application config to use the new user.
3. Verify connectivity.
4. Revoke the old user's access.
5. **Impact**: Zero-downtime if done correctly.

## 4. Automated Scanning

GateFlow uses a custom `scripts/scan-secrets.js` hook to prevent accidental commits.

- **Run Locally**: `node scripts/scan-secrets.js`
- **CI Enforcement**: Included in the `ci.yml` workflow.

To bypass a false positive (last resort):

```bash
git commit -m "..." --no-verify
```
