#!/usr/bin/env node
/**
 * check-env.js — Environment variable validator
 *
 * Validates required env vars are set before starting an app.
 * Reads from .env, .env.local, process.env.
 *
 * Usage:
 *   node scripts/check-env.js                  # check all apps
 *   node scripts/check-env.js --app client     # check client-dashboard only
 *   node scripts/check-env.js --app admin
 *   node scripts/check-env.js --app scanner
 *   node scripts/check-env.js --app marketing
 *
 * Add to dev scripts: "dev:client": "node scripts/check-env.js --app client && turbo dev ..."
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ── Required vars manifest ────────────────────────────────────────────────────
// Format: { var, apps, secret, description }
//   apps:   which apps need it ('*' = all)
//   secret: true = must never be a placeholder/default value
const MANIFEST = [
  // ── Database ──────────────────────────────────────────────────────────────
  {
    var: 'DATABASE_URL',
    apps: '*',
    secret: true,
    description: 'PostgreSQL connection string',
    example: 'postgresql://user:pass@localhost:5432/gateflow',
  },

  // ── Auth ──────────────────────────────────────────────────────────────────
  {
    var: 'NEXTAUTH_SECRET',
    apps: ['client', 'admin'],
    secret: true,
    minLength: 32,
    description: 'NextAuth.js signing secret (min 32 chars)',
    example: 'openssl rand -base64 32',
  },
  {
    var: 'NEXTAUTH_URL',
    apps: ['client', 'admin'],
    secret: false,
    description: 'NextAuth base URL',
    example: 'http://localhost:3001',
  },

  // ── QR / Security ─────────────────────────────────────────────────────────
  {
    var: 'QR_SIGNING_SECRET',
    apps: ['client'],
    secret: true,
    minLength: 32,
    description: 'HMAC secret for QR code signing (min 32 chars)',
    example: 'openssl rand -hex 32',
  },
  {
    var: 'ENCRYPTION_MASTER_KEY',
    apps: ['client', 'admin'],
    secret: true,
    minLength: 32,
    description: 'Encryption key for sensitive fields',
    example: 'openssl rand -hex 32',
  },

  // ── Public URLs ───────────────────────────────────────────────────────────
  {
    var: 'NEXT_PUBLIC_APP_URL',
    apps: ['client'],
    secret: false,
    description: 'Public app URL (used for QR short links)',
    example: 'http://localhost:3001',
  },

  // ── Admin ─────────────────────────────────────────────────────────────────
  {
    var: 'ADMIN_ACCESS_KEY',
    apps: ['admin'],
    secret: true,
    minLength: 32,
    description:
      'Admin portal access key (min 32 chars). Used to authenticate the admin dashboard.',
    example: 'openssl rand -base64 32',
  },

  // ── AI Features ───────────────────────────────────────────────────────────
  {
    var: 'ANTHROPIC_API_KEY',
    apps: ['client'],
    secret: true,
    optional: true,
    description:
      'Anthropic API key for AI assistant (optional — disables AI if missing)',
    example: 'sk-ant-...',
  },

  // ── Scanner ───────────────────────────────────────────────────────────────
  {
    var: 'EXPO_PUBLIC_API_URL',
    apps: ['scanner'],
    secret: false,
    description: 'Scanner app API base URL',
    example: 'http://localhost:3001/api',
  },
  {
    var: 'EXPO_PUBLIC_QR_SECRET',
    apps: ['scanner'],
    secret: true,
    description: 'QR signing secret exposed to scanner for local verify',
    example: 'same as QR_SIGNING_SECRET',
  },
];

// Weak/placeholder values that should never be used in production
const WEAK_VALUES = [
  'changeme',
  'secret',
  'password',
  'your-secret',
  'your_secret',
  'placeholder',
  'example',
  'test',
  'dev',
  '12345',
  'abc123',
  'todo',
  'fixme',
  '<your',
  'insert',
  'replace',
];

// ── Load .env files ───────────────────────────────────────────────────────────
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const env = {};
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

function loadEnv(appDir) {
  return {
    ...loadEnvFile(path.join(ROOT, '.env')),
    ...loadEnvFile(path.join(ROOT, '.env.local')),
    ...loadEnvFile(path.join(appDir, '.env')),
    ...loadEnvFile(path.join(appDir, '.env.local')),
    ...process.env,
  };
}

const APP_MAP = {
  client: path.join(ROOT, 'apps', 'client-dashboard'),
  admin: path.join(ROOT, 'apps', 'admin-dashboard'),
  scanner: path.join(ROOT, 'apps', 'scanner-app'),
  marketing: path.join(ROOT, 'apps', 'marketing'),
};

function checkApp(appName, appDir) {
  const env = loadEnv(appDir);
  const relevant = MANIFEST.filter(
    (m) => m.apps === '*' || m.apps.includes(appName)
  );

  const errors = [];
  const warnings = [];

  for (const spec of relevant) {
    const val = env[spec.var];

    if (!val || val.trim() === '') {
      if (spec.optional) {
        warnings.push(
          `  ℹ  ${spec.var} — not set (optional: ${spec.description})`
        );
      } else {
        errors.push(
          `  ✗ ${spec.var} — MISSING\n     ${spec.description}\n     Example: ${spec.example}`
        );
      }
      continue;
    }

    // Check for weak/placeholder values
    if (spec.secret) {
      const lower = val.toLowerCase();
      const isWeak = WEAK_VALUES.some((w) => lower.includes(w));
      if (isWeak) {
        errors.push(
          `  ✗ ${spec.var} — looks like a placeholder value\n     Use a real secret. Example: ${spec.example}`
        );
        continue;
      }
    }

    // Check minimum length
    if (spec.minLength && val.length < spec.minLength) {
      errors.push(
        `  ✗ ${spec.var} — too short (${val.length} chars, need ≥${spec.minLength})\n     Example: ${spec.example}`
      );
      continue;
    }
  }

  return { errors, warnings };
}

// ── Main ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const appArg =
  args.indexOf('--app') !== -1 ? args[args.indexOf('--app') + 1] : null;
const skipProd = process.env.SKIP_ENV_VALIDATION === 'true';

if (skipProd) {
  console.log('ℹ  SKIP_ENV_VALIDATION=true — skipping env check.');
  process.exit(0);
}

const appsToCheck = appArg
  ? APP_MAP[appArg]
    ? { [appArg]: APP_MAP[appArg] }
    : (() => {
        console.error(
          `✗ Unknown app "${appArg}". Valid: ${Object.keys(APP_MAP).join(', ')}`
        );
        process.exit(1);
      })()
  : APP_MAP;

let hasErrors = false;

for (const [appName, appDir] of Object.entries(appsToCheck)) {
  if (!fs.existsSync(appDir)) continue; // app not in this repo variant

  const { errors, warnings } = checkApp(appName, appDir);

  if (errors.length === 0 && warnings.length === 0) {
    console.log(`✓ ${appName}: all required env vars present`);
    continue;
  }

  if (errors.length > 0) {
    hasErrors = true;
    console.error(`\n❌ ${appName} — missing or invalid env vars:\n`);
    errors.forEach((e) => console.error(e));
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️  ${appName} — optional vars not set:`);
    warnings.forEach((w) => console.log(w));
  }
}

if (hasErrors) {
  console.error('\n→ Copy .env.example → .env.local and fill in the values.\n');
  process.exit(1);
}

console.log('\n✓ All environment variables validated.\n');
