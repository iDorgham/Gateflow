# Deployment Guide

GateFlow's deployment process is configured to deploy independently per application via Vercel (for Web) and EAS (for React Native Mobile).

## Web Applications (Next.js)

All Next.js applications (`admin-dashboard`, `client-dashboard`, `marketing`, `resident-portal`) map seamlessly to Vercel Deployments.

### Platform Configuration
- **Framework Preset**: Next.js
- **Root Directory**: Select the relevant `apps/{app-name}` directory.
- **Build Command**: `pnpm run build` (Turborepo handles caching and builds automatically).
- **Output Directory**: `.next`

Keep all relevant `ENVIRONMENT_VARIABLES` securely mapped inside the Vercel Dashboard Settings for that specific project.

## Mobile Applications (Expo)

We handle Mobile distributions natively through Expo Application Services (EAS).

### Building `scanner-app` / `resident-mobile`
1. Ensure you have logged in to your Expo account via `eas login`.
2. Configure your build profile found in `eas.json` for development, preview, or production.
3. Trigger a cloud build:
   ```bash
   eas build --profile production --platform all
   ```
4. For OTA (Over-The-Air) updates utilizing Expo Updates:
   ```bash
   eas update --branch main --message "Hotfix deployment"
   ```

## CI/CD Pipeline
GitHub Actions are integrated into the repository to execute automated checks:
- Standard ESLint validations (`pnpm lint`).
- TypeScript type checking (`pnpm typecheck`).
- Unit testing routines (`pnpm test`).

These pipelines must pass before code is merged into the `main` branch to trigger the production releases.
