# Security Policy

## Supported Versions

We currently support the latest major version of GateFlow. Security updates are applied directly to the `master` branch and tagged with new releases.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1.0 | :x:                |

## Reporting a Vulnerability

**DO NOT open a public issue** for security vulnerabilities.

If you discover a security vulnerability within GateFlow, please report it privately to:

- **Email:** security@selenadev.com
- **WhatsApp:** Report via the official GateFlow support channel

Please include:

1. A descriptive title for the vulnerability
2. Step-by-step instructions to reproduce the issue
3. Potential impact (what data or access could be compromised)
4. Your contact information if you'd like to be credited

We aim to respond to all reports within 48 hours and provide a fix or mitigation plan within 7 business days.

## Data Protection Commitment

GateFlow is built on the **Zero-Trust Access Security** pillar. We use:

- **HMAC-SHA256** for all QR signing.
- **Argon2id** for password hashing.
- **AES-256** for offline data encryption.
- **Strict Multi-tenancy** enforced at the Prisma middleware level.

Any breach of tenant isolation is treated as a P0 critical incident.
