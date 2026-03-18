# GateFlow Deployment Overview

GateFlow is a monorepo consisting of multiple Next.js applications that share logic via `@gate-access/` packages. Every app must be deployed to Vercel as its own project using the guide below.

## 📁 App Guides
* [🚀 Client Dashboard](docs/deployment/CLIENT_DASHBOARD.md)
* [🔐 Admin Dashboard](docs/deployment/ADMIN_DASHBOARD.md)
* [🏢 Marketing App](docs/deployment/MARKETING.md)

## ⚠️ Mandatory Monorepo Settings
Every app project on Vercel **MUST** have the following settings:
1.  **Framework Preset**: `Next.js`.
2.  **Build Command**: `pnpm run build`.
3.  **Install Command**: `pnpm install`.
4.  **Monorepo Setting**: "Include source files outside of the Root Directory" **must be CHECKED**.

## 🛠 Troubleshooting
If you encounter build errors, check the following:
* **"Module not found: @gate-access/..."**: Ensure the "Include source files outside" checkbox is enabled in Vercel.
* **"ERR_PNPM_OUTDATED_LOCKFILE"**: Run `pnpm install` locally, commit the `pnpm-lock.yaml`, and push to GitHub.
* **"Failed to collect page data"**: Ensure all required environment variables are set in the Vercel dashboard for that specific app.
