#!/usr/bin/env node
/**
 * check-db-drift.js — Prisma migration drift detector
 *
 * Detects mismatches between your schema.prisma and the database:
 *   1. Unapplied migrations (migrations in /migrations not yet run on DB)
 *   2. Schema drift (schema.prisma changed since last migration)
 *   3. Missing migration files (DB has migrations not in your repo)
 *
 * Usage:
 *   node scripts/check-db-drift.js             # full check (requires DATABASE_URL)
 *   node scripts/check-db-drift.js --schema    # schema diff only (no DB needed)
 *   node scripts/check-db-drift.js --fail      # exit 1 if drift found
 *   pnpm check:db-drift
 *
 * Requires: DATABASE_URL env var (or .env.local)
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const SCHEMA_FILE = path.join(
  ROOT,
  'packages',
  'db',
  'prisma',
  'schema.prisma'
);
const MIGRATIONS = path.join(ROOT, 'packages', 'db', 'prisma', 'migrations');

// ── Load .env files ───────────────────────────────────────────────────────────
function loadEnvFile(p) {
  if (!fs.existsSync(p)) return {};
  const env = {};
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    )
      val = val.slice(1, -1);
    env[trimmed.slice(0, eq).trim()] = val;
  }
  return env;
}

function getEnv() {
  return {
    ...loadEnvFile(path.join(ROOT, '.env')),
    ...loadEnvFile(path.join(ROOT, '.env.local')),
    ...process.env,
  };
}

// ── Schema change detection (no DB needed) ────────────────────────────────────
function checkSchemaHash() {
  if (!fs.existsSync(SCHEMA_FILE)) {
    console.log(
      'ℹ  schema.prisma not found at packages/db/prisma/schema.prisma'
    );
    return null;
  }

  const hashFile = path.join(ROOT, 'packages', 'db', 'prisma', '.schema-hash');
  const schema = fs.readFileSync(SCHEMA_FILE, 'utf8');

  // Simple content hash
  let hash = 0;
  for (let i = 0; i < schema.length; i++) {
    hash = (hash << 5) - hash + schema.charCodeAt(i);
    hash |= 0;
  }
  const currentHash = String(Math.abs(hash));

  if (!fs.existsSync(hashFile)) {
    fs.writeFileSync(hashFile, currentHash);
    return { changed: false, message: 'Schema hash baseline created.' };
  }

  const savedHash = fs.readFileSync(hashFile, 'utf8').trim();
  if (savedHash !== currentHash) {
    return {
      changed: true,
      message: 'schema.prisma has changed since last migration baseline.',
    };
  }
  return { changed: false, message: 'Schema unchanged since last baseline.' };
}

// ── Local migration file analysis ─────────────────────────────────────────────
function getLocalMigrations() {
  if (!fs.existsSync(MIGRATIONS)) return [];
  return fs
    .readdirSync(MIGRATIONS)
    .filter((d) => {
      const full = path.join(MIGRATIONS, d);
      return (
        fs.statSync(full).isDirectory() &&
        fs.existsSync(path.join(full, 'migration.sql'))
      );
    })
    .sort();
}

// ── Prisma migrate status ─────────────────────────────────────────────────────
function runMigrateStatus(env) {
  const result = spawnSync(
    'npx',
    ['prisma', 'migrate', 'status', '--schema', SCHEMA_FILE],
    {
      cwd: ROOT,
      encoding: 'utf8',
      env: { ...env, PATH: process.env.PATH },
      stdio: 'pipe',
    }
  );
  return {
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    code: result.status,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const schemaOnly = args.includes('--schema');
const failMode = args.includes('--fail');

const issues = [];
const warnings = [];

// 1. Schema hash check (always)
const schemaCheck = checkSchemaHash();
if (schemaCheck?.changed) {
  warnings.push(
    `⚠️  Schema drift: ${schemaCheck.message}\n   Run: pnpm --filter @gate-access/db db:generate && pnpm prisma db push`
  );
} else if (schemaCheck) {
  console.log(`✓ ${schemaCheck.message}`);
}

// 2. Local migration count
const localMigrations = getLocalMigrations();
console.log(`✓ Local migrations: ${localMigrations.length} found`);

if (schemaOnly) {
  if (issues.length === 0 && warnings.length === 0) {
    console.log('\n✓ No schema drift detected (schema-only mode).\n');
    process.exit(0);
  }
  warnings.forEach((w) => console.warn('\n' + w));
  process.exit(failMode && issues.length > 0 ? 1 : 0);
}

// 3. Live DB check (requires DATABASE_URL)
const env = getEnv();
if (!env.DATABASE_URL) {
  console.log(
    'ℹ  DATABASE_URL not set — skipping live DB migration status check.'
  );
  console.log(
    '   Set DATABASE_URL in .env.local or run with --schema for offline check.\n'
  );
  warnings.forEach((w) => console.warn('\n' + w));
  process.exit(0);
}

console.log('🔍 Checking live DB migration status...');
const { stdout, stderr, code } = runMigrateStatus(env);
const output = stdout + stderr;

// Parse prisma output for known drift signals
if (
  code !== 0 ||
  output.includes('following migration(s) have not yet been applied')
) {
  // Extract unapplied migration names
  const unapplied = [...output.matchAll(/^\s+(\d{14}_\w+)/gm)].map((m) => m[1]);
  if (unapplied.length > 0) {
    issues.push(
      `❌ ${unapplied.length} unapplied migration(s):\n` +
        unapplied.map((m) => `   • ${m}`).join('\n') +
        `\n   Fix: pnpm --filter @gate-access/db exec -- npx prisma migrate deploy`
    );
  } else {
    issues.push(
      `❌ Migration drift detected:\n${output
        .trim()
        .split('\n')
        .slice(0, 6)
        .map((l) => '   ' + l)
        .join('\n')}`
    );
  }
} else if (output.includes('Database schema is up to date')) {
  console.log('✓ Database schema is up to date');
} else if (output.includes('already applied')) {
  console.log('✓ All migrations applied');
} else {
  // Unknown output — just show it
  const summary = output.trim().split('\n').slice(0, 4).join('\n');
  if (summary) console.log(`ℹ  Prisma status:\n${summary}`);
}

// ── Report ────────────────────────────────────────────────────────────────────
console.log('');

if (issues.length === 0 && warnings.length === 0) {
  console.log('✓ No migration drift detected.\n');
  process.exit(0);
}

warnings.forEach((w) => console.warn(w + '\n'));
issues.forEach((i) => console.error(i + '\n'));

if (issues.length > 0) {
  process.exit(failMode ? 1 : 0);
}
