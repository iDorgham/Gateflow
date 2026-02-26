#!/usr/bin/env bash
set -euo pipefail

echo "========================================"
echo "GateFlow Project Setup for Jules (2026)"
echo "========================================"

# 1. Ensure pnpm is available (Jules usually has Node, but confirm pnpm)
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm@latest
fi

# 2. Install all dependencies (Turborepo monorepo)
echo "Installing monorepo dependencies..."
pnpm install --frozen-lockfile

# 3. Generate Prisma client (very important for DB access)
echo "Generating Prisma client..."
pnpm --filter @gate-access/db exec prisma generate

# 4. Apply any pending Prisma migrations (safe in dev)
echo "Applying Prisma migrations (if any)..."
pnpm --filter @gate-access/db exec prisma migrate deploy || echo "Migrations up to date or skipped"

# 5. Set up essential env vars (only if not already present)
ENV_FILE="apps/client-dashboard/.env.local"

if [ ! -f "$ENV_FILE" ]; then
    echo "Creating initial .env.local in client-dashboard..."
    cat << EOF > "$ENV_FILE"
# ======================================
# GateFlow – Client Dashboard Env (Jules)
# ======================================

NODE_ENV=development

# Database (use Supabase/Railway local tunnel or provided DB)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/gate_access?schema=public

# Auth & JWT
JWT_SECRET=$(openssl rand -base64 32)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3001

# QR signing
QR_SIGNING_SECRET=$(openssl rand -base64 32)

# Gemini 1.5 Flash (cheap & fast model)
GEMINI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash

# Optional: for email / other services
RESEND_API_KEY=

# Rate limiting (Upstash – add later if needed)
# UPSTASH_REDIS_REST_URL=
# UPSTASH_REDIS_REST_TOKEN=
EOF

    echo "→ .env.local created. IMPORTANT: Edit GEMINI_API_KEY manually!"
else
    echo "→ .env.local already exists. Skipping creation."
fi

# 6. Optional: start dev server in background (comment out if Jules handles it)
# echo "Starting dev server..."
# pnpm turbo dev &

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit apps/client-dashboard/.env.local → add your GEMINI_API_KEY"
echo "  2. Run: pnpm turbo dev"
echo "  3. Open http://localhost:3001 (client-dashboard)"
echo ""