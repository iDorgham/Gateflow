#!/usr/bin/env bash
# =============================================================================
# ignore-build.sh — Vercel Ignored Build Step (monorepo)
#
# Exit 0 = skip build | Exit 1 = continue build
# Wire via vercel.json: "ignoreCommand": "bash ../../scripts/ignore-build.sh"
#
# Note: skipped builds may still count toward Hobby deployment quotas.
# Prefer disabling Preview auto-deploys in Vercel project settings for Hobby.
# =============================================================================
set -euo pipefail

AUTHOR="${VERCEL_GIT_COMMIT_AUTHOR_LOGIN:-}"
REF="${VERCEL_GIT_COMMIT_REF:-}"
ENV="${VERCEL_ENV:-}"
MSG="${VERCEL_GIT_COMMIT_MESSAGE:-}"

# ── Dependabot / bot noise ───────────────────────────────────────────────────
if [[ "$AUTHOR" == "dependabot[bot]" || "$AUTHOR" == "dependabot" ]]; then
  echo "🛑 Skip: Dependabot author ($AUTHOR)"
  exit 0
fi
if [[ "$REF" == dependabot/* ]]; then
  echo "🛑 Skip: Dependabot branch ($REF)"
  exit 0
fi

# ── Docs / changelog-only commits (no app/package code) ─────────────────────
if [[ "$MSG" =~ ^(docs|chore\(changelog\)|chore\(release\)) ]]; then
  # Still build if path filter says this app changed (handled below when SHA available)
  :
fi

# ── Path filter: skip if this app directory and shared packages unchanged ─────
# Root Directory in Vercel is apps/<name>, so compare against monorepo root.
APP_DIR="$(basename "$PWD")"
PREV="${VERCEL_GIT_PREVIOUS_SHA:-}"
CUR="${VERCEL_GIT_COMMIT_SHA:-}"

if [[ -n "$PREV" && -n "$CUR" && "$PREV" != "$CUR" ]]; then
  ROOT="$(cd ../.. && pwd)"
  if git -C "$ROOT" diff --quiet "$PREV" "$CUR" -- \
    "apps/$APP_DIR" \
    "packages" \
    "package.json" \
    "pnpm-lock.yaml" \
    "pnpm-workspace.yaml" \
    "turbo.json" 2>/dev/null; then
    echo "🛑 Skip: no relevant changes for apps/$APP_DIR"
    exit 0
  fi
fi

# ── Hobby safeguard: skip automatic Preview (PR / non-production) ───────────
# Production + manual redeploys (VERCEL_ENV=production) still build.
# Bypass: Redeploy in Vercel UI with "Use existing Build Cache" / ignore bypass,
# or use GitHub Actions deploy.yml.
if [[ "$ENV" == "preview" ]]; then
  echo "🛑 Skip: automatic Preview builds disabled (Hobby quota). Use /deploy or promote."
  exit 0
fi

echo "✅ Build apps/$APP_DIR (env=$ENV ref=$REF)"
exit 1
