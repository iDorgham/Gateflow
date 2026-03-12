# Infrastructure

<p align="center">
  <img src="https://img.shields.io/badge/Status-Development-blue" alt="Status">
  <img src="https://img.shields.io/badge/Platform-Vercel-green" alt="Platform">
</p>

Infrastructure configurations and deployment settings for GateFlow.

> **Note:** This folder is currently under development. Most deployment configurations are managed through Vercel.

## Current Architecture

### Deployment Platform

GateFlow is primarily deployed on **Vercel** for the Next.js applications:

| App              | Environment                 |
| ---------------- | --------------------------- |
| Marketing        | Vercel Production           |
| Client Dashboard | Vercel Production           |
| Admin Dashboard  | Vercel Production           |
| Scanner App      | Expo EAS Build              |
| Resident Portal  | Vercel Production (planned) |
| Resident Mobile  | Expo EAS Build (planned)    |

### Database

- **Provider:** PostgreSQL 15+ (Hosted)
- **ORM:** Prisma 5
- **Connection:** Connection pooling recommended for serverless

### Additional Services

| Service                | Purpose                 |
| ---------------------- | ----------------------- |
| **Upstash Redis**      | Rate limiting, caching  |
| **Resend**             | Email delivery          |
| **Stripe**             | Billing & subscriptions |
| **Meta Pixel**         | Analytics & retargeting |
| **Google Analytics 4** | Traffic analysis        |

## Environment Structure

### Development

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Production (Vercel)

Environment variables are managed through Vercel Dashboard:

| Variable                   | Description                  |
| -------------------------- | ---------------------------- |
| `DATABASE_URL`             | PostgreSQL connection string |
| `NEXTAUTH_SECRET`          | JWT signing secret           |
| `NEXTAUTH_URL`             | Production URL               |
| `NEXT_PUBLIC_API_URL`      | API base URL                 |
| `QR_SIGNING_SECRET`        | HMAC key for QR codes        |
| `UPSTASH_REDIS_REST_URL`   | Redis rate limiting          |
| `UPSTASH_REDIS_REST_TOKEN` | Redis auth token             |

## Docker (Future)

Docker support is planned for:

- Local development environment
- Self-hosted deployments
- CI/CD pipelines

Expected structure:

```
infra/
├── docker-compose.yml    # Local development stack
├── Dockerfile.apps/       # Application containers
├── Dockerfile.db/        # Database setup
└── terraform/            # Infrastructure as Code
```

## Terraform (Future)

Infrastructure as Code for:

- AWS/GCP cloud resources
- Database provisioning
- Redis cache setup
- CDN configuration

## Vercel Setup

For new deployments:

1. **Connect Repository** — Link GitHub repo to Vercel
2. **Configure Framework** — Next.js (App Router)
3. **Add Environment Variables** — From `.env.example`
4. **Configure Build Settings** — Use `turbo.json` pipeline
5. **Deploy** — Automatic on push to main

### Build Command

```bash
pnpm turbo build
```

### Output Directory

```bash
.next
```

## Related Documentation

- [Deployment Guide](../../docs/DEPLOYMENT_GUIDE.md)
- [Environment Variables Guide](../../docs/guides/ENVIRONMENT_VARIABLES.md)
- [Security Overview](../../docs/guides/SECURITY_OVERVIEW.md)
- [Vercel Skill](../../.opencode/skills/vercel/SKILL.md)
