#!/usr/bin/env node
/**
 * scan-secrets.js — Lightweight secret scanner for staged files
 *
 * Scans git-staged files for common secret patterns before commit.
 * Blocks commit on HIGH severity; warns on MEDIUM.
 *
 * Usage:
 *   node scripts/scan-secrets.js          # scan staged files (pre-commit)
 *   node scripts/scan-secrets.js --all    # scan entire repo
 *   node scripts/scan-secrets.js --file <path>  # scan one file
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ── Secret patterns ───────────────────────────────────────────────────────────
const PATTERNS = [
  // HIGH — will block commit
  { name: 'AWS Access Key', severity: 'HIGH', re: /AKIA[0-9A-Z]{16}/ },
  {
    name: 'AWS Secret Key',
    severity: 'HIGH',
    re: /aws[_\-.]?secret[_\-.]?(access[_\-.]?)?key\s*[:=]\s*["']?[A-Za-z0-9/+=]{40}/i,
  },
  {
    name: 'Private Key Block',
    severity: 'HIGH',
    re: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/,
  },
  {
    name: 'Stripe Secret Key',
    severity: 'HIGH',
    re: /sk_(test|live)_[0-9a-zA-Z]{24,}/,
  },
  { name: 'GitHub PAT (classic)', severity: 'HIGH', re: /ghp_[0-9a-zA-Z]{36}/ },
  {
    name: 'GitHub PAT (fine)',
    severity: 'HIGH',
    re: /github_pat_[0-9a-zA-Z_]{82}/,
  },
  {
    name: 'Anthropic API Key',
    severity: 'HIGH',
    re: /sk-ant-[a-zA-Z0-9\-_]{32,}/,
  },
  {
    name: 'OpenAI API Key',
    severity: 'HIGH',
    re: /sk-[a-zA-Z0-9]{32,}(?![\w-])/,
  },
  { name: 'Google API Key', severity: 'HIGH', re: /AIza[0-9A-Za-z\-_]{35}/ },
  {
    name: 'Slack Bot Token',
    severity: 'HIGH',
    re: /xoxb-[0-9]{11}-[0-9]{11}-[a-zA-Z0-9]{24}/,
  },
  {
    name: 'Slack Webhook',
    severity: 'HIGH',
    re: /https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]+\/B[A-Z0-9]+\/[a-zA-Z0-9]+/,
  },
  {
    name: 'Hardcoded DB Password',
    severity: 'HIGH',
    re: /postgresql:\/\/[^:]+:[^@]{12,}@/, // require 12+ chars to avoid common 8-char dev passwords
  },

  // MEDIUM — warn only
  {
    name: 'Generic Secret Assign',
    severity: 'MEDIUM',
    re: /(SECRET|PASSWORD|PASSWD|API_KEY|AUTH_TOKEN)\s*=\s*["'][^"']{8,}["']/i,
  },
  {
    name: 'Generic Token Assign',
    severity: 'MEDIUM',
    re: /(TOKEN|SIGNING_SECRET)\s*[:=]\s*["'][a-zA-Z0-9+/=_\-]{20,}["']/i,
  },
  {
    name: 'JWT (encoded)',
    severity: 'MEDIUM',
    re: /eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/,
  },
  {
    name: 'Basic Auth in URL',
    severity: 'MEDIUM',
    re: /https?:\/\/[^:]+:[^@]{4,}@(?!localhost|127\.0\.0\.1|fonts\.googleapis\.com)/,
  },
];

// Files/dirs to always skip
const SKIP_PATTERNS = [
  /\.env\.example$/,
  /\.env\.sample$/,
  /\.env\.template$/,
  /scan-secrets\.js$/,
  /\/node_modules\//,
  /\/\.next\//,
  /\/dist\//,
  /\/build\//,
  /pnpm-lock\.yaml$/,
  /package-lock\.json$/,
  /\.github\/workflows\//, // CI yml files use placeholder values, not real secrets
  /\.github\/actions\//,
  /\.test\.(ts|tsx|js)$/, // test files set process.env.X = 'test-value' intentionally
  /\.spec\.(ts|tsx|js)$/,
  /__tests__\//,
  /__mocks__\//,
  /\/\.claude\//,
  /\/\.gemini\//,
  /\/\.lighthouseci\//,
  /packages\/db\/prisma\//,
  /\/\.github\/prompts\//,
  /\/~partytown\//,
];

const ROOT = path.resolve(__dirname, '..');

function shouldSkip(filePath) {
  return SKIP_PATTERNS.some((p) => p.test(filePath));
}

function isBinary(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    // Check first 8000 bytes for null bytes (binary indicator)
    const slice = buf.slice(0, 8000);
    return slice.includes(0);
  } catch {
    return true;
  }
}

function scanContent(content, filePath) {
  const findings = [];
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const { name, severity, re } of PATTERNS) {
      if (re.test(line)) {
        // Redact match in output
        const redacted = line
          .trim()
          .replace(re, (m) => m.slice(0, 6) + '***REDACTED***');
        findings.push({
          name,
          severity,
          line: i + 1,
          preview: redacted,
          file: filePath,
        });
      }
    }
  }
  return findings;
}

function getStagedFiles() {
  try {
    return execSync('git diff --cached --name-only --diff-filter=ACMR', {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

function getAllFiles() {
  try {
    return execSync('git ls-files', {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const mode = args[0];

let files;
if (mode === '--all') {
  files = getAllFiles().map((f) => path.join(ROOT, f));
} else if (mode === '--file') {
  files = [path.resolve(args[1])];
} else {
  files = getStagedFiles().map((f) => path.join(ROOT, f));
}

if (files.length === 0) {
  process.exit(0); // nothing staged
}

const allFindings = [];

for (const filePath of files) {
  if (shouldSkip(filePath)) continue;
  if (!fs.existsSync(filePath)) continue;
  if (isBinary(filePath)) continue;

  let content;
  try {
    content = fs.readFileSync(filePath, 'utf8');
  } catch {
    continue;
  }

  const findings = scanContent(content, path.relative(ROOT, filePath));
  allFindings.push(...findings);
}

if (allFindings.length === 0) {
  console.log('✓ Secret scan: no secrets detected in staged files.');
  process.exit(0);
}

const highs = allFindings.filter((f) => f.severity === 'HIGH');
const mediums = allFindings.filter((f) => f.severity === 'MEDIUM');

console.error('\n🚨 Secret Scanner Results\n');

for (const f of allFindings) {
  const icon = f.severity === 'HIGH' ? '🔴' : '🟡';
  console.error(`${icon} [${f.severity}] ${f.name}`);
  console.error(`   File: ${f.file}:${f.line}`);
  console.error(`   ${f.preview}`);
  console.error('');
}

if (highs.length > 0) {
  console.error(
    `❌ ${highs.length} HIGH severity secret(s) detected — commit BLOCKED.`
  );
  console.error(
    '   Remove the secrets, use environment variables, or add to .gitignore.'
  );
  console.error('   To bypass (NOT recommended): git commit --no-verify\n');
  process.exit(1);
}

if (mediums.length > 0) {
  console.error(
    `⚠️  ${mediums.length} MEDIUM severity potential secret(s) — review before pushing.`
  );
  console.error('   Commit allowed. Verify these are not real credentials.\n');
  process.exit(0);
}
