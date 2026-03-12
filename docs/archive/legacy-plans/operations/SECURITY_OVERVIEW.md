# GateFlow Security & Data Privacy Overview

GateFlow acts as the secure entry gateway for commercial and residential parameters. Thus, ensuring application-level security, secure data transit, and strict authentication flows is our highest priority.

## Architecture

1. **Role-Based Access Control (RBAC)**
   - **`superadmin`**: Maintains absolute system power, oversees organizations and sub-entities within the `admin-dashboard`.
   - **`admin`**: Controls full specific parameters for client projects inside the `client-dashboard`.
   - **`manager`**: Operational control (Gate operators) utilizing the `scanner-app` and managing local workflows.
   - **`user`**: Residential user invoking limits and quotas on the `resident-portal` or `resident-mobile` applications.

2. **Data Encryption**
   - **In Transit**: Complete reliance on TLS 1.3 for all frontend to backend data streams.
   - **At Rest**: PostgreSQL databases employ AES-256 block-level encryption managed via the cloud provider (AWS RDS/Vercel Postgres).
   - **Sensitive Hashing**: All passwords securely hashed using `argon2` modules.

3. **QR Code Generation & Validation**
   - QR access tokens represent unique, time-sensitive cryptographic hashes indicating user validity and access schedule limitations.
   - Scanner app logs are verified locally and eventually synced upstream. If validation encounters a cryptographic mismatch, the pass renders **Invalid**.

## Dependencies and Vulnerability Checks
- All third-party dependencies are strictly monitored. 
- GitHub Dependabot is enabled alongside `pnpm audit` executing in standard CI pipelines.
- Security Headers: Next.js environments are configured to deliver hardened security headers (e.g., Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options) overriding default insecure behaviors.
