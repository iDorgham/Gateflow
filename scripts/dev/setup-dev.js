#!/usr/bin/env node
/**
 * setup-dev.js — New developer onboarding script
 *
 * One command to go from a fresh clone to a running dev environment:
 *   1. Check prerequisites (Node, pnpm, git)
 *   2. Install dependencies
 *   3. Create .env.local from .env.example (with prompts for required values)
 *   4. Generate Prisma client
 *   5. Run DB migrations / push schema
 *   6. Verify env vars
 *   7. Print next steps
 *
 * Usage:
 *   node scripts/setup-dev.js
 *   pnpm setup:dev
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const readline = require('readline');

const ROOT = path.resolve(__dirname, '../..');

// ── Colours ───────────────────────────────────────────────────────────────────
const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
};

function ok(msg) {
  console.log(c.green('  ✓ ') + msg);
}
function warn(msg) {
  console.log(c.yellow('  ⚠ ') + msg);
}
function fail(msg) {
  console.error(c.red('  ✗ ') + msg);
}
function info(msg) {
  console.log(c.cyan('  → ') + msg);
}
function step(msg) {
  console.log('\n' + c.bold(msg));
}

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: opts.silent ? 'pipe' : 'inherit',
    }).trim();
  } catch (e) {
    if (opts.safe) return null;
    throw e;
  }
}

function cmdExists(cmd) {
  return spawnSync('which', [cmd], { encoding: 'utf8' }).status === 0;
}

// ── Interactive prompt ────────────────────────────────────────────────────────
function prompt(question, defaultVal = '') {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const display = defaultVal
      ? `${question} ${c.dim(`[${defaultVal}]`)}: `
      : `${question}: `;
    rl.question(display, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultVal);
    });
  });
}

// ── .env.example parser ───────────────────────────────────────────────────────
function parseEnvExample(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const vars = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
    vars[key] = val;
  }
  return vars;
}

// ── Required vars that need real values ──────────────────────────────────────
const REQUIRED_INTERACTIVE = [
  {
    key: 'DATABASE_URL',
    hint: 'PostgreSQL connection string',
    example: 'postgresql://user:pass@localhost:5432/gateflow',
  },
  {
    key: 'NEXTAUTH_SECRET',
    hint: 'Min 32 chars — run: openssl rand -base64 32',
    example: '',
  },
  {
    key: 'QR_SIGNING_SECRET',
    hint: 'Min 32 chars — run: openssl rand -hex 32',
    example: '',
  },
  {
    key: 'ENCRYPTION_MASTER_KEY',
    hint: 'Min 32 chars — run: openssl rand -hex 32',
    example: '',
  },
];

const SAFE_DEFAULTS = {
  NEXTAUTH_URL: 'http://localhost:3001',
  NEXT_PUBLIC_APP_URL: 'http://localhost:3001',
  EXPO_PUBLIC_API_URL: 'http://localhost:3001/api',
  // 35+ chars; matches admin-dashboard dev login helper (no "dev" substring for check-env weak list)
  ADMIN_ACCESS_KEY:
    '1967664b3d703503b4d412aaaf906a9f7f8b7057db224a478d89a7fbfab91762',
  NODE_ENV: 'development',
};

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(
    '\n' +
      c.bold('━━━ GateFlow Dev Setup ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━') +
      '\n'
  );

  // ── Step 1: Prerequisites ─────────────────────────────────────────────────
  step('1. Checking prerequisites...');

  const nodeVer = run('node --version', { silent: true });
  const major = parseInt(nodeVer?.replace('v', '').split('.')[0] || '0', 10);
  if (major >= 20) {
    ok(`Node.js ${nodeVer}`);
  } else {
    fail(`Node.js ${nodeVer} — need v20+. Install from https://nodejs.org`);
    process.exit(1);
  }

  if (cmdExists('pnpm')) {
    ok(`pnpm ${run('pnpm --version', { silent: true })}`);
  } else {
    fail('pnpm not found. Install: npm i -g pnpm');
    process.exit(1);
  }

  if (cmdExists('git')) {
    ok(
      `git ${run('git --version', { silent: true }).replace('git version ', '')}`
    );
  } else {
    fail('git not found');
    process.exit(1);
  }

  const ghAvail = cmdExists('gh');
  if (ghAvail) ok('gh CLI available');
  else warn('gh CLI not found — PR creation will be skipped (optional)');

  // ── Step 2: Install dependencies ─────────────────────────────────────────
  step('2. Installing dependencies...');
  run('pnpm install --frozen-lockfile');
  ok('Dependencies installed');

  // ── Step 3: .env.local ────────────────────────────────────────────────────
  step('3. Setting up environment variables...');

  const envLocal = path.join(ROOT, '.env.local');
  const envExample = path.join(ROOT, '.env.example');

  if (fs.existsSync(envLocal)) {
    warn('.env.local already exists — skipping (delete it to re-run setup)');
  } else {
    const exampleVars = parseEnvExample(envExample);
    const finalVars = { ...exampleVars, ...SAFE_DEFAULTS };

    console.log(c.cyan('\n  Please provide values for required secrets:\n'));
    for (const { key, hint, example } of REQUIRED_INTERACTIVE) {
      const current = finalVars[key] || '';
      const display = example ? `${hint}\n    e.g. ${c.dim(example)}` : hint;
      console.log(`  ${c.bold(key)}: ${c.dim(display)}`);
      const val = await prompt('  Value', current);
      if (val) finalVars[key] = val;
    }

    // Write .env.local
    const lines = [
      '# Auto-generated by scripts/dev/setup-dev.js',
      '# Edit as needed\n',
    ];
    for (const [k, v] of Object.entries(finalVars)) {
      if (v) lines.push(`${k}=${v}`);
    }
    fs.writeFileSync(envLocal, lines.join('\n') + '\n');
    ok('.env.local created');
  }

  // ── Step 4: Prisma generate ───────────────────────────────────────────────
  step('4. Generating Prisma client...');
  try {
    run('pnpm --filter @gate-access/db db:generate');
    ok('Prisma client generated');
  } catch {
    warn('Prisma generate failed — check DATABASE_URL in .env.local');
  }

  // ── Step 5: DB push ───────────────────────────────────────────────────────
  step('5. Pushing schema to database...');
  try {
    run(
      'pnpm --filter @gate-access/db exec -- npx prisma db push --skip-generate',
      { silent: false }
    );
    ok('Database schema up to date');
  } catch {
    warn(
      'DB push failed — is your DATABASE_URL reachable? You can run this later: pnpm prisma db push'
    );
  }

  // ── Step 6: Env validation ────────────────────────────────────────────────
  step('6. Validating environment...');
  try {
    run('node scripts/check/check-env.js --app client');
  } catch {
    warn('Some env vars missing — check .env.local');
  }

  // ── Step 7: Git hooks ─────────────────────────────────────────────────────
  step('7. Installing git hooks...');
  try {
    run('pnpm husky');
    ok('Husky hooks installed');
  } catch {
    warn('Husky setup failed — run: pnpm husky manually');
  }

  // ── Done ─────────────────────────────────────────────────────────────────
  console.log(
    '\n' +
      c.bold('━━━ Setup Complete ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━') +
      '\n'
  );
  console.log(c.green('  ✓ GateFlow dev environment ready!\n'));
  console.log('  Next steps:');
  info('pnpm dev:client          — start client dashboard (port 3001)');
  info('pnpm dev:admin           — start admin dashboard');
  info('pnpm plan:status         — see current feature plans');
  info('pnpm check:env           — verify all env vars');
  info('pnpm preflight           — run lint + typecheck + tests');
  console.log('');
}

main().catch((err) => {
  fail(`Setup failed: ${err.message}`);
  process.exit(1);
});
