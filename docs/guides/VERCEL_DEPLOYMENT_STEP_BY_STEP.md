# Step-by-Step Vercel Deployment Guide

This guide details the exact steps needed to deploy any GateFlow web app to Vercel.

## 1. Connect Repository to Vercel

1.  Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** > **"Project"**.
3.  Import the `Gateflow` repository from your GitHub account.

## 2. Project Configuration (Crucial for Monorepo)

Since GateFlow is a monorepo, you must configure each app individually. Repeat these steps for **Marketing**, **Client Dashboard**, and **Admin Dashboard**.

### **Step A: Set Root Directory**
1.  In the Vercel "Import Project" screen, click **"Edit"** next to **Root Directory**.
2.  Select the app folder (e.g., `apps/client-dashboard`).
3.  Ensure **"Include source files outside of the Root Directory in the Build Step"** is **CHECKED** (required for shared packages like `@gate-access/db`).

### **Step B: Framework & Build Settings**
- **Framework Preset**: `Next.js` (Vercel should auto-detect this).
- **Build Command**: `pnpm run build`
- **Install Command**: `pnpm install`

## 3. Configure Environment Variables

Before clicking "Deploy", you must add the environment variables for the specific app.

1.  Expand the **Environment Variables** section.
2.  Copy the keys from the app's `.env.example` file.
3.  **Mandatory Production Keys**:
    -   `DATABASE_URL`: Your production PostgreSQL URL.
    -   `NEXTAUTH_SECRET`: Generate a random string (e.g., `openssl rand -base64 32`).
    -   `NEXTAUTH_URL`: The production domain (e.g., `https://app.gateflow.site`).
    -   `QR_SIGNING_SECRET`: (Client Dashboard only) A secure secret for QR signatures.
    -   `STRIPE_SECRET_KEY`: (Client Dashboard only) Your Stripe Live Secret Key.

## 4. Deploy and Verify

1.  Click **"Deploy"**.
2.  Wait for the build to finish. Vercel will install dependencies, build shared packages (via Turborepo), and generate the Next.js bundle.
3.  Once finished, click the preview image to visit the live site.

## 5. Post-Deployment (Database)

If this is a fresh database:
1.  Run migrations from your local machine targeting the production DB:
    ```bash
    DATABASE_URL="your_production_db_url" pnpm --filter @gate-access/db prisma migrate deploy
    ```
2.  (Optional) Seed initial data:
    ```bash
    DATABASE_URL="your_production_db_url" pnpm --filter @gate-access/db prisma db seed
    ```

---

## Troubleshooting Build Errors

### **"Module not found: Can't resolve '@gate-access/..."**
- **Fix**: Ensure the "Root Directory" in Vercel is set correctly and that "Include source files outside of the Root Directory" is enabled.

### **"pnpm not found"**
- **Fix**: Ensure you have a `packageManager` field in your root `package.json` pointing to `pnpm`. (This is already set in GateFlow).

### **"ERR_PNPM_OUTDATED_LOCKFILE"**
- **Cause**: The `pnpm-lock.yaml` file is out of sync with one of the `package.json` files in the monorepo.
- **Fix**: Run `pnpm install` on your local machine to update the lockfile, then commit and push the updated `pnpm-lock.yaml`.
- **Tip**: Vercel runs in a "frozen-lockfile" mode by default, meaning it will fail if the lockfile isn't perfectly matched. Always ensure your local lockfile is committed after adding or removing dependencies.

### **Stripe/Secret Key Errors**
- **Fix**: Ensure `STRIPE_SECRET_KEY` and other required secrets are set in the Vercel Dashboard for that specific project.
