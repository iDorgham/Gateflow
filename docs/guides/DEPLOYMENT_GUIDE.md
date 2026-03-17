# GateFlow Deployment Guide

This guide provides step-by-step instructions for deploying the GateFlow platform. The system uses a monorepo architecture, with web applications deployed to **Vercel** and mobile applications built via **Expo Application Services (EAS)**.

---

## 🏗️ Deployment Architecture

| Component | Platform | Strategy |
| :--- | :--- | :--- |
| **Web Apps** (Marketing, Dashboards) | **Vercel** | CI/CD on `master` branch push |
| **Mobile Apps** (Scanner, Resident) | **Expo EAS** | Manual cloud builds / OTA updates |
| **Database** | **PostgreSQL** | Prisma Migrations |
| **Edge Logic** | **Upstash** | Redis for rate-limiting & caching |

---

## 🌐 Web Applications (Next.js)

The monorepo contains multiple Next.js applications in the `apps/` directory.

### 1. Vercel Configuration
For each application (`admin-dashboard`, `client-dashboard`, `marketing`, `resident-portal`):

- **Framework Preset**: Next.js
- **Root Directory**: `apps/[app-name]`
- **Build Command**: `pnpm turbo build --filter=[app-name]`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

### 2. Required Environment Variables
Ensure these are set in the Vercel Dashboard (**Settings > Environment Variables**):

| Variable | Description | App |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | All |
| `NEXTAUTH_SECRET` | Secret key for JWT signing | Dashboards |
| `NEXTAUTH_URL` | Production URL of the app | Dashboards |
| `QR_SIGNING_SECRET` | HMAC key for QR codes | Client Dashboard |
| `UPSTASH_REDIS_REST_URL` | Redis URL for rate limiting | Client Dashboard |
| `UPSTASH_REDIS_REST_TOKEN` | Redis token | Client Dashboard |
| `STRIPE_SECRET_KEY` | Stripe Private API Key | Client Dashboard |
| `GEMINI_API_KEY` | Google Gemini API Key | Admin Dashboard |

---

## 📱 Mobile Applications (Expo)

### 1. Prerequisites
- Install EAS CLI: `npm install -g eas-cli`
- Authenticate: `eas login`

### 2. Production Builds
Run from the root of the project or the specific app directory:

```bash
# From root, targeting the scanner-app
pnpm --filter scanner-app eas build --platform all --profile production
```

### 3. OTA (Over-the-Air) Updates
To deploy code changes without a full app store submission:

```bash
pnpm --filter scanner-app eas update --branch main --message "Hotfix description"
```

---

## 🗄️ Database Management

### 1. Migrations
Apply schema changes to the production database:

```bash
# From packages/db
pnpm prisma migrate deploy
```

### 2. Manual Reset (Caution)
To wipe and reset the database (dev/staging only):

```bash
pnpm prisma migrate reset --force
```

---

## 🛠️ Build Verification

Before pushing to production, always verify the build locally:

```bash
# Build all applications and packages
pnpm turbo build

# Build a specific app
pnpm turbo build --filter=client-dashboard
```

---

## 🛡️ Security Posture
- **Soft Deletes**: Deletions are handled via the `deletedAt` field. Never hard-delete production data.
- **Tenant Isolation**: Every query must include `organizationId`.
- **Secrets**: Never commit `.env` files. Rotate keys annually.
