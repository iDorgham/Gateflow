# GateFlow — Developer Setup & Local Environment Guide

This guide provides complete step-by-step instructions for cloning, configuring, bootstrapping, and running the GateFlow monorepo locally.

---

## 📋 Prerequisites

Before setting up GateFlow, ensure your environment meets the following requirements:

| Requirement    | Version / Details | Notes                                                                                     |
| :------------- | :---------------- | :---------------------------------------------------------------------------------------- |
| **Node.js**    | **≥ 20.0.0**      | Matches the `engines` field in root `package.json`.                                       |
| **pnpm**       | **8.15.0**        | The repository pins `packageManager`. Use **Corepack** (recommended) or a global install. |
| **PostgreSQL** | **≥ 16.0**        | Local installation, Docker container, or hosted service (Neon, Supabase, RDS, etc.).      |
| **Git**        | Latest standard   | Required for repository cloning, Husky hooks, and CI-aligned workflows.                   |

### Enable pnpm via Corepack (Recommended)

```bash
corepack enable
corepack prepare pnpm@8.15.0 --activate
```

_(Optional)_: **Bun** (used for fast `@gate-access/db` testing) and **Expo Go** or native iOS/Android simulators if working on mobile applications.

---

## 1. Clone the Monorepo

```bash
# Via HTTPS
git clone https://github.com/iDorgham/Gateflow.git
cd Gateflow

# Or via SSH
git clone git@github.com:iDorgham/Gateflow.git
cd Gateflow
```

> **Note:** Regardless of your local directory name (`Gateflow`, `Gate-Access`, etc.), ensure commands are executed from the repository root containing `package.json` and `pnpm-workspace.yaml`.

---

## 2. Database Setup (PostgreSQL)

GateFlow requires a PostgreSQL database. Choose one of the following approaches:

| Approach             | Setup Command / Instructions                                                                                       |
| :------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **Local CLI**        | `createdb gate_access`<br>Connection string: `postgresql://USER:PASSWORD@localhost:5432/gate_access?schema=public` |
| **Docker Container** | `docker run --name gateflow-pg -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=gate_access -p 5432:5432 -d postgres:16`    |
| **Hosted Database**  | Create a PostgreSQL instance on Neon, Supabase, AWS RDS, etc., and copy the connection string.                     |

### Prisma Connection String Architecture

Prisma (`packages/db/prisma/schema.prisma`) uses two connection parameters:

- `DATABASE_URL`: Primary application runtime connection.
- `DIRECT_DATABASE_URL`: Direct PostgreSQL connection for migrations, `db push`, and Prisma CLI operations.

_For local PostgreSQL without connection pooling, set both `DATABASE_URL` and `DIRECT_DATABASE_URL` to the **same** connection string._

---

## 3. Install Dependencies

Install all monorepo dependencies across workspaces using `pnpm`:

```bash
pnpm install
```

---

## 4. Environment Variables Configuration

Create a `.env.local` file at the root of the repository.

### Core Environment Matrix

| Variable                | Role                                | Example / Notes                                                      |
| :---------------------- | :---------------------------------- | :------------------------------------------------------------------- |
| `DATABASE_URL`          | App & runtime DB connection         | `postgresql://postgres:dev@localhost:5432/gate_access?schema=public` |
| `DIRECT_DATABASE_URL`   | Direct DB connection for Prisma CLI | Same as `DATABASE_URL` for local development                         |
| `NEXTAUTH_SECRET`       | NextAuth JWT signing secret         | Generate via `openssl rand -base64 32`                               |
| `NEXTAUTH_URL`          | NextAuth canonical URL              | `http://localhost:3001` (Client Dashboard)                           |
| `QR_SIGNING_SECRET`     | HMAC key for QR payload signing     | Must match `EXPO_PUBLIC_QR_SECRET` in scanner app                    |
| `ENCRYPTION_MASTER_KEY` | AES-256 field encryption key        | 32-byte secret key                                                   |
| `ADMIN_ACCESS_KEY`      | Platform administrative key         | Used for platform admin operations                                   |

> For the complete matrix including per-app configuration and optional services (Redis, AI, Meta CAPI, Stripe), refer to [docs/guides/ENVIRONMENT_VARIABLES.md](guides/ENVIRONMENT_VARIABLES.md) and the root `.env.example` file.

---

## 5. Bootstrap the Database

Choose one of the following methods to initialize your database schema and client:

### Path A — Automated Setup (Recommended)

Run the interactive setup helper:

```bash
pnpm setup:dev
```

The automated script (`scripts/dev/setup-dev.js`) will:

1. Validate frozen dependencies (`pnpm install --frozen-lockfile`).
2. Seed the root `.env.local` file from `.env.example` and prompt for missing secrets.
3. Generate the Prisma Client (`pnpm db:generate`).
4. Apply the Prisma schema to the database (`prisma db push`).
5. Run environment checks (`pnpm check:env --app client`).
6. Initialize Husky git hooks.

### Path B — Manual Setup

```bash
# 1. Copy environment template
cp .env.example .env.local

# 2. Edit .env.local with your database credentials and secrets

# 3. Generate Prisma Client
pnpm db:generate

# 4. Push schema to database
pnpm --filter @gate-access/db exec prisma db push

# (Optional) Run versioned migrations instead of db push
pnpm --filter @gate-access/db exec prisma migrate dev
```

### Inspect Database (Prisma Studio)

Launch Prisma Studio to visually inspect and manage database records:

```bash
pnpm db:studio
```

---

## 6. Pre-flight Environment Validation

Before starting dev servers, run environment checks to verify your setup:

```bash
# Check environment variables across all configured applications
pnpm check:env

# Check client dashboard environment specifically
pnpm check:env:client

# Run full CI-like pre-flight verification (lint, typecheck, tests)
pnpm preflight

# Check Workflow status and next suggested engineering steps
pnpm workflow:v2:guide
```

---

## 7. Running Development Servers

GateFlow uses **Turborepo** to orchestrate development tasks. While `pnpm dev` launches every application in parallel, running specific filtered targets is recommended for daily work.

### Filtered Development Commands

| Command                  | Workspace Target   | Description                                   | Local URL                 |
| :----------------------- | :----------------- | :-------------------------------------------- | :------------------------ |
| **`pnpm dev:client`**    | `client-dashboard` | Property Manager & B2B Dashboard + API routes | **http://localhost:3001** |
| **`pnpm dev:admin`**     | `admin-dashboard`  | Platform Administrator Operations             | **http://localhost:3002** |
| **`pnpm dev:marketing`** | `marketing`        | Public Marketing Site & Lead Funnel           | **http://localhost:3000** |
| **`pnpm dev:resident`**  | `resident-portal`  | Web Resident Self-Service Portal              | **http://localhost:3004** |
| **`pnpm dev:scanner`**   | `scanner-app`      | Gate Guard Scanner App (Expo CLI)             | Terminal QR / Simulator   |
| **`pnpm dev:mobile`**    | `resident-mobile`  | Resident Mobile App (Expo CLI)                | Terminal QR / Simulator   |
| **`pnpm dev`**           | _(All Workspaces)_ | Launches dev servers across all applications  | Parallel execution        |

> **Tip:** In a typical development session, start with `pnpm dev:client` in one terminal window. Open a second terminal window for `pnpm dev:admin` or mobile servers as needed.

---

## 8. Mobile App Development (Expo)

To run the mobile applications (`scanner-app` or `resident-mobile`):

1. Install **Expo Go** on your physical device, or launch an **iOS Simulator** / **Android Emulator**.
2. Run `pnpm dev:scanner` or `pnpm dev:mobile`.
3. Scan the terminal QR code using Expo Go or press `i` (iOS) / `a` (Android) to launch in a simulator.

### Scanner Environment Configuration

Ensure `apps/scanner-app/.env` contains:

- `EXPO_PUBLIC_API_URL`: Points to your local backend API (e.g., `http://localhost:3001/api` or your local network IP for physical devices).
- `EXPO_PUBLIC_QR_SECRET`: Must be identical to `QR_SIGNING_SECRET` in your root `.env.local`.

---

## 9. Production Builds & Verification

To compile production bundles across all applications and shared packages:

```bash
pnpm build
```

Individual app production start commands are defined in each app's `package.json` (e.g., `next start` after `next build`).

---

## 📚 Related Documentation

- [Environment Variables Reference](guides/ENVIRONMENT_VARIABLES.md)
- [Automation & Tooling Guide (Ralph Loop)](guides/AUTOMATION_GUIDE.md)
- [Infrastructure & Deployment Guide](../infra/README.md)
- [Master Architecture Reference](reference/architecture/ARCHITECTURE.md)
