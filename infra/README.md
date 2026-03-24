# Infrastructure

<div align="center">

**Infrastructure configurations and deployment settings for GateFlow**

_Vercel for web apps, Expo EAS for mobile apps_

[![Platform](https://img.shields.io/badge/Platform-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Status](https://img.shields.io/badge/Status-Development-blue?style=for-the-badge)](#)

</div>

---

## Current Architecture

### Deployment Platform

| App              | Environment       |
| :--------------- | :---------------- |
| Marketing        | Vercel Production |
| Client Dashboard | Vercel Production |
| Admin Dashboard  | Vercel Production |
| Scanner App      | Expo EAS Build    |
| Resident Portal  | Vercel Production |
| Resident Mobile  | Expo EAS Build    |

---

## Database

| Layer          | Technology                     |
| :------------- | :----------------------------- |
| **Provider**   | PostgreSQL 15+ (Hosted)        |
| **ORM**        | Prisma 5                       |
| **Connection** | Connection pooling recommended |

---

## Additional Services

| Service                | Purpose                 |
| :--------------------- | :---------------------- |
| **Upstash Redis**      | Rate limiting, caching  |
| **Resend**             | Email delivery          |
| **Stripe**             | Billing & subscriptions |
| **Meta Pixel**         | Analytics & retargeting |
| **Google Analytics 4** | Traffic analysis        |

---

## Environment Structure

### Development

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Production (Vercel)

Variables managed through Vercel Dashboard:

| Variable              | Description           |
| :-------------------- | :-------------------- |
| `DATABASE_URL`        | PostgreSQL connection |
| `NEXTAUTH_SECRET`     | JWT signing           |
| `NEXTAUTH_URL`        | Production URL        |
| `NEXT_PUBLIC_API_URL` | API base URL          |
| `QR_SIGNING_SECRET`   | HMAC key              |
| `UPSTASH_REDIS_*`     | Redis config          |

---

## Future: Docker & Terraform

### Docker (Planned)

- Local development environment
- Self-hosted deployments
- CI/CD pipelines

### Terraform (Planned)

- AWS/GCP cloud resources
- Database provisioning
- Redis cache setup

---

## Vercel Setup

For new deployments:

1. **Connect Repository** — Link GitHub repo to Vercel
2. **Configure Framework** — Next.js (App Router)
3. **Add Environment Variables** — From `.env.example`
4. **Configure Build** — Use `turbo.json` pipeline
5. **Deploy** — Automatic on push to main

### Build Command

```bash
pnpm turbo build
```

---

## Related Documentation

| Document                                                            | Description           |
| :------------------------------------------------------------------ | :-------------------- |
| [Deployment Guide](../../docs/DEPLOYMENT_GUIDE.md)                  | Vercel deployment     |
| [Environment Variables](../../docs/guides/ENVIRONMENT_VARIABLES.md) | All env vars          |
| [Security Overview](../../docs/guides/SECURITY_OVERVIEW.md)         | Security architecture |
| [Vercel Skill](../../.opencode/skills/vercel/SKILL.md)              | Vercel guidance       |
