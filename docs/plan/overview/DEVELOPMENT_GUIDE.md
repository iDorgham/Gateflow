# GateFlow Development Guide

Welcome to the GateFlow Monorepo! This guide contains instructions for setting up your local environment and understanding the monorepo workspace configurations.

## Prerequisites

1. **Node.js**: v20+ recommended.
2. **Package Manager**: We strictly use `pnpm` (v8+). Do not use `npm` or `yarn`.
3. **Database**: PostgreSQL database required for local Prisma interactions.
4. **Mobile**: Expo CLI installed (`pnpm i -g expo-cli`) and Xcode/Android Studio for simulator testing.

## Local Setup

1. **Install Dependencies**:
   ```bash
   pnpm install
   ```
2. **Environment Variables**:
   Copy the respective `.env.example` configurations into `.env.local` inside the workspace applications you wish to test. (Refer to `ENVIRONMENT_VARIABLES.md`).
3. **Database Initialization**:
   Currently, database schemas and migrations are handled in individual environments. Generate the Prisma client if the package requires it.
4. **Run Development Server**:
   From the root of the repository, run the Turbo pipeline:
   ```bash
   pnpm turbo dev
   ```
   This command starts the Next.js servers (`admin-dashboard`, `client-dashboard`, `marketing`, `resident-portal`) and Mobile Expo servers simultaneously.

## Workspace Architecture

GateFlow utilizes **Turborepo** to orchestrate:
- `apps/admin-dashboard`: Next.js Web App for superadmins.
- `apps/client-dashboard`: Next.js Web App for B2B portal clients.
- `apps/marketing`: Next.js Web App for public landing pages.
- `apps/resident-portal`: Next.js Web App for residential user features.
- `apps/resident-mobile`: React Native Expo unified mobile app for residents.
- `apps/scanner-app`: React Native Expo specialized app for gate operators to scan QR credentials.

### Shared Packages
- `packages/ui`: The unified source of truth for all complex React components, tokens, and Tailwind variables.
- `packages/config`: ESLint, Prettier, TypeScript generic configurations.

## Git & PR Workflow
- Cut feature branches (`feat/feature-name`) from `main`.
- Pre-commit hooks will format and lint your code.
- Ensure all CI/CD pipelines and Turborepo builds pass before requesting a review.
