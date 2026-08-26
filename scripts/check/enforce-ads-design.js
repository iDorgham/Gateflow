#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { getRepoRoot } = require('./repo-root');
const { assertNonZeroScan } = require('./non-zero-scan');

const ROOT = getRepoRoot(__dirname);

const IGNORE_DIRS = new Set([
  'node_modules',
  '.next',
  '.turbo',
  'dist',
  'build',
  'coverage',
  'ios',
  'android',
  'Pods',
  '.git',
  '.ai',
  '.agents',
  '.antigravity',
  'artifacts',
  'reference',
  'packages/tokens',
  '__tests__',
  '__mocks__',
]);

const IGNORE_PATHS = [
  'apps/design-system/',
  'apps/resident-mobile/',
  'packages/db/',
  'packages/types/',
  'docs/',
  'scripts/',
];

const COLOR_HEX_REGEX = /#(?:[0-9a-fA-F]{3,4}){1,2}(?![a-zA-Z0-9_-])/g;
const RGBA_REGEX = /rgba?\([^)]+\)/g;
const GF_PRIMITIVE_REGEX = /--gf-[a-zA-Z0-9-]+/g;

let filesScanned = 0;

function shouldSkip(relPath) {
  return (
    IGNORE_PATHS.some((p) => relPath.startsWith(p)) ||
    /\.(test|spec)\.(ts|tsx|js|jsx)$/.test(relPath) ||
    relPath.includes('/scripts/') ||
    relPath.includes('/api/') ||
    relPath.includes('email.ts')
  );
}

function scanDir(dir, violations = []) {
  if (!fs.existsSync(dir)) return violations;

  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    const relPath = path.relative(ROOT, fullPath);

    if (file.isDirectory()) {
      if (!IGNORE_DIRS.has(file.name) && !shouldSkip(relPath)) {
        scanDir(fullPath, violations);
      }
    } else if (
      file.name.endsWith('.tsx') ||
      file.name.endsWith('.ts') ||
      file.name.endsWith('.css')
    ) {
      if (
        shouldSkip(relPath) ||
        file.name.includes('tokens') ||
        file.name.includes('tailwind.config') ||
        file.name.includes('globals.css')
      )
        continue;

      filesScanned++;

      const content = fs.readFileSync(fullPath, 'utf8');
      const hexMatches = content.match(COLOR_HEX_REGEX);
      const rgbaMatches = content.match(RGBA_REGEX);
      const gfMatches = content.match(GF_PRIMITIVE_REGEX);

      if (hexMatches || rgbaMatches || gfMatches) {
        violations.push({
          file: relPath,
          hex: Array.from(new Set(hexMatches || [])),
          rgba: Array.from(new Set(rgbaMatches || [])),
          gf: Array.from(new Set(gfMatches || [])),
        });
      }
    }
  }
  return violations;
}

const args = process.argv.slice(2);
const scanPaths =
  args.length > 0
    ? args.map((a) => path.resolve(ROOT, a))
    : [
        path.join(ROOT, 'apps', 'client-dashboard', 'src'),
        path.join(ROOT, 'apps', 'admin-dashboard', 'src'),
        path.join(ROOT, 'packages', 'ui', 'src'),
      ];
const violations = [];

scanPaths.forEach((p) => {
  if (fs.existsSync(p)) {
    if (fs.statSync(p).isDirectory()) {
      scanDir(p, violations);
    } else {
      filesScanned++;
      const content = fs.readFileSync(p, 'utf8');
      const hexMatches = content.match(COLOR_HEX_REGEX);
      const rgbaMatches = content.match(RGBA_REGEX);
      const gfMatches = content.match(GF_PRIMITIVE_REGEX);
      if (hexMatches || rgbaMatches || gfMatches) {
        violations.push({
          file: path.relative(ROOT, p),
          hex: Array.from(new Set(hexMatches || [])),
          rgba: Array.from(new Set(rgbaMatches || [])),
          gf: Array.from(new Set(gfMatches || [])),
        });
      }
    }
  }
});

assertNonZeroScan(filesScanned, {
  scannerName: 'enforce-ads-design',
  context: { scanPaths },
});

if (violations.length > 0) {
  console.warn(
    '\x1b[33m%s\x1b[0m',
    '⚠️ ADS Design Notices (Hardcoded values/primitives found):'
  );
  console.log(
    '\x1b[36m%s\x1b[0m',
    `Found ${violations.length} files with custom colors across ${filesScanned} scanned files.\n`
  );

  violations.slice(0, 10).forEach((v) => {
    console.log(`\x1b[33m${v.file}\x1b[0m:`);
    if (v.hex.length)
      console.log(`  - \x1b[31mHex:\x1b[0m ${v.hex.join(', ')}`);
    if (v.rgba.length)
      console.log(`  - \x1b[31mRGBA:\x1b[0m ${v.rgba.join(', ')}`);
    if (v.gf.length)
      console.log(`  - \x1b[35mPrimitive (--gf-*):\x1b[0m ${v.gf.join(', ')}`);
  });

  console.log(
    '\x1b[36m%s\x1b[0m',
    '\n💡 Components should use semantic tokens (var(--ds-...)).'
  );
  process.exit(0);
} else {
  console.log(
    '\x1b[32m%s\x1b[0m',
    `✅ ADS Design Component Compliance: 100% (scanned ${filesScanned} files)`
  );
  process.exit(0);
}
