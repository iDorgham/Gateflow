#!/usr/bin/env node
/**
 * scan-secrets.js — Lightweight secret scanner
 *
 * Modes:
 *   (default)           scan git-staged files (pre-commit)
 *   --all               scan entire tracked tree (CI)
 *   --file <path>       scan one file
 *   --history [N]       scan patches from the last N commits (default 100)
 *
 * HIGH findings exit 1. Unexpected empty --all / --history scans exit 1.
 * Never prints raw secret values (redacted previews only).
 *
 * Usage:
 *   node scripts/check/scan-secrets.js
 *   node scripts/check/scan-secrets.js --all
 *   node scripts/check/scan-secrets.js --history 200
 *   node scripts/check/scan-secrets.js --file path/to/file
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { getRepoRoot } = require('./repo-root');

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
    re: /postgresql:\/\/[^:]+:[^@]{12,}@/,
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
    re: /(TOKEN|SIGNING_SECRET)\s*[:=]\s*["'][a-zA-Z0-9+/=_-]{20,}["']/i,
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

const SKIP_PATTERNS = [
  /\.env\.example$/,
  /\.env\.sample$/,
  /\.env\.template$/,
  /scan-secrets\.js$/,
  /repo-root\.test\.js$/,
  /\/node_modules\//,
  /\/\.next\//,
  /\/dist\//,
  /\/build\//,
  /pnpm-lock\.yaml$/,
  /package-lock\.json$/,
  /\.github\/workflows\//,
  /\.github\/actions\//,
  /\.test\.(ts|tsx|js|mjs)$/,
  /\.spec\.(ts|tsx|js|mjs)$/,
  /__tests__\//,
  /__mocks__\//,
  /\/\.claude\//,
  /\/\.gemini\//,
  /\/\.lighthouseci\//,
  /packages\/db\/prisma\//,
  /\/\.github\/prompts\//,
  /\/~partytown\//,
  /scan_results\.txt$/,
  /\.lighthouseci\//,
  /lighthouse.*\.json$/i,
  /\/coverage\//,
  /\/\.metro\//,
  /\/\.expo\//,
];

const ROOT = getRepoRoot(__dirname);

function shouldSkip(filePath) {
  const normalized = filePath.split(path.sep).join('/');
  return SKIP_PATTERNS.some((p) => p.test(normalized));
}

function isBinary(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    const slice = buf.slice(0, 8000);
    return slice.includes(0);
  } catch {
    return true;
  }
}

function scanContent(content, filePath) {
  const findings = [];
  // Fast pre-filter: only inspect lines if at least one pattern matches file content
  const matchingPatterns = PATTERNS.filter(({ re }) => re.test(content));
  if (matchingPatterns.length === 0) return findings;

  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const { name, severity, re } of matchingPatterns) {
      if (re.test(line)) {
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

function gitLines(args) {
  try {
    return execFileSync('git', args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 3000,
      maxBuffer: 64 * 1024 * 1024,
    })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

function getStagedFiles() {
  return gitLines(['diff', '--cached', '--name-only', '--diff-filter=ACMR']);
}

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  '.turbo',
  'dist',
  'build',
  'coverage',
  'ios',
  'android',
  'Pods',
  'vendor',
  '.gemini',
  '.cursor',
  '.claude',
  '.lighthouseci',
  '.ai',
  '.agents',
  '.antigravity',
  'artifacts',
  'reference',
  '.metro',
  '__tests__',
  '__mocks__',
]);

const BINARY_EXTS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.ico',
  '.webp',
  '.mp4',
  '.webm',
  '.mov',
  '.pdf',
  '.woff',
  '.woff2',
  '.ttf',
  '.eot',
  '.zip',
  '.tar',
  '.gz',
]);

let trackedFiles;

function isEnvironmentFile(filePath) {
  return (
    path.basename(filePath) === '.env' ||
    path.basename(filePath).startsWith('.env.')
  );
}

function isTrackedFile(filePath) {
  trackedFiles ??= new Set(gitLines(['ls-files']));
  return trackedFiles.has(filePath.split(path.sep).join('/'));
}

function walkRepoFiles(dir = ROOT, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(ROOT, full);
    if (entry.isDirectory()) {
      walkRepoFiles(full, fileList);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (BINARY_EXTS.has(ext)) continue;
      if (shouldSkip(rel)) continue;
      if (isEnvironmentFile(rel) && !isTrackedFile(rel)) continue;
      fileList.push(rel);
    }
  }
  return fileList;
}

function getAllFiles() {
  const scanRoots = ['apps', 'packages', 'scripts', '.github'];
  const files = scanRoots.flatMap((r) => walkRepoFiles(path.join(ROOT, r)));
  const trackedEnvironmentFiles = gitLines(['ls-files']).filter(
    isEnvironmentFile
  );
  return [...new Set([...files, ...trackedEnvironmentFiles])];
}

function reportAndExit(mode, considered, scanned, allFindings) {
  const highs = allFindings.filter((f) => f.severity === 'HIGH');
  const mediums = allFindings.filter((f) => f.severity === 'MEDIUM');

  console.log(
    `Secret scan: mode=${mode} files_considered=${considered} files_scanned=${scanned} findings=${allFindings.length}`
  );

  if (allFindings.length === 0) {
    console.log(`✓ Secret scan: no secrets detected (${mode}).`);
    process.exit(0);
  }

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
    console.error(
      '   Commit allowed. Verify these are not real credentials.\n'
    );
    process.exit(0);
  }
}

function scanFileList(relFiles, mode) {
  const absolute = relFiles.map((f) =>
    path.isAbsolute(f) ? f : path.join(ROOT, f)
  );
  const considered = absolute.length;

  if (mode === 'all' && considered === 0) {
    console.error(
      `✗ Secret scan: unexpected empty tree (mode=all). Root=${ROOT}. Refusing false-green.`
    );
    process.exit(1);
  }

  if (mode === 'staged' && considered === 0) {
    console.log(
      'Secret scan: mode=staged files_considered=0 files_scanned=0 findings=0'
    );
    console.log('✓ Secret scan: nothing staged.');
    process.exit(0);
  }

  const allFindings = [];
  let scanned = 0;

  for (const filePath of absolute) {
    if (shouldSkip(filePath)) continue;
    if (!fs.existsSync(filePath)) continue;
    if (isBinary(filePath)) continue;

    let content;
    try {
      content = fs.readFileSync(filePath, 'utf8');
    } catch {
      continue;
    }

    scanned += 1;
    const findings = scanContent(content, path.relative(ROOT, filePath));
    allFindings.push(...findings);
  }

  if ((mode === 'all' || mode === 'file') && scanned === 0) {
    console.error(
      `✗ Secret scan: unexpected zero files scanned (mode=${mode} considered=${considered}). Root=${ROOT}. Refusing false-green.`
    );
    process.exit(1);
  }

  reportAndExit(mode, considered, scanned, allFindings);
}

function scanHistory(maxCommits) {
  let patch;
  try {
    patch = execFileSync(
      'git',
      [
        'log',
        '-p',
        `-n${maxCommits}`,
        '--pretty=format:===COMMIT %H===',
        '--',
        '.',
        ':(exclude).lighthouseci',
        ':(exclude)scan_results.txt',
        ':(exclude)pnpm-lock.yaml',
        ':(exclude)**/node_modules/**',
      ],
      {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        maxBuffer: 128 * 1024 * 1024,
      }
    );
  } catch (err) {
    console.error(
      `✗ Secret scan: history unavailable (${err.message}). Root=${ROOT}.`
    );
    process.exit(1);
  }

  if (!patch || patch.trim().length === 0) {
    console.error(
      `✗ Secret scan: unexpected empty history (mode=history commits=${maxCommits}). Root=${ROOT}. Refusing false-green.`
    );
    process.exit(1);
  }

  // History mode: HIGH only — MEDIUM patterns are too noisy on historical diffs.
  const highOnly = PATTERNS.filter((p) => p.severity === 'HIGH');
  const findings = [];
  const lines = patch.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const { name, severity, re } of highOnly) {
      if (re.test(line)) {
        findings.push({
          name,
          severity,
          line: i + 1,
          preview: '[REDACTED]',
          file: `git-history(last-${maxCommits})`,
        });
      }
    }
  }

  const seen = new Set();
  const unique = findings.filter((f) => {
    const key = `${f.severity}|${f.name}|${f.preview}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  reportAndExit(`history:${maxCommits}`, maxCommits, lines.length, unique);
}

// ── Main ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);

if (args[0] === '--all') {
  scanFileList(getAllFiles(), 'all');
} else if (args[0] === '--file') {
  if (!args[1]) {
    console.error('Usage: scan-secrets.js --file <path>');
    process.exit(1);
  }
  scanFileList([path.resolve(args[1])], 'file');
} else if (args[0] === '--history') {
  const n = args[1] ? parseInt(args[1], 10) : 100;
  if (!Number.isFinite(n) || n < 1) {
    console.error('Usage: scan-secrets.js --history [N]');
    process.exit(1);
  }
  scanHistory(n);
} else {
  scanFileList(getStagedFiles(), 'staged');
}
