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
  '__tests__',
  '__mocks__',
]);

const TARGET_DIRS = ['apps', 'packages'];

let filesScanned = 0;

function scanDir(dir, warnings = []) {
  if (!fs.existsSync(dir)) return warnings;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      if (!IGNORE_DIRS.has(file.name)) scanDir(fullPath, warnings);
    } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
      filesScanned++;
      const content = fs.readFileSync(fullPath, 'utf8');

      if (content.includes('framer-motion')) {
        const nonPerfAnimRegex =
          /animate=\{\{.*(width|height|top|left|margin|padding|fontSize).*\}\}/g;
        if (nonPerfAnimRegex.test(content)) {
          warnings.push({
            file: path.relative(ROOT, fullPath),
            type: 'Performance warning: Animation using layout properties (width/height/etc.). Use transform (scale/translate) instead.',
          });
        }
      }
    }
  }
  return warnings;
}

const warnings = [];
for (const target of TARGET_DIRS) {
  scanDir(path.join(ROOT, target), warnings);
}

assertNonZeroScan(filesScanned, {
  scannerName: 'enforce-motion-performance',
  context: { roots: TARGET_DIRS },
});

if (warnings.length > 0) {
  console.warn('\x1b[33m%s\x1b[0m', '⚠️ Motion Performance Warnings Found:');
  warnings.forEach((w) => {
    console.log(`\x1b[33m${w.file}\x1b[0m: ${w.type}`);
  });
  // Note: We don't exit with 1 for warnings unless specifically requested.
  process.exit(0);
} else {
  console.log(
    '\x1b[32m%s\x1b[0m',
    `✅ Motion Performance: Green (scanned ${filesScanned} files)`
  );
  process.exit(0);
}
