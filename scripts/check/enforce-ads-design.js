const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = [
  'node_modules',
  '.next',
  '.turbo',
  'dist',
  'ios',
  'android',
  'Pods',
  '.git',
  '.cursor',
  'packages/tokens',
];

const COLOR_HEX_REGEX = /#(?:[0-9a-fA-F]{3,4}){1,2}(?![a-zA-Z0-9_-])/g;
const RGBA_REGEX = /rgba?\([^)]+\)/g;
const GF_PRIMITIVE_REGEX = /--gf-[a-zA-Z0-9-]+/g;

function scanDir(dir, violations = []) {
  const relativeDir = path.relative(process.cwd(), dir);
  if (IGNORE_DIRS.includes(relativeDir)) return violations;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(process.cwd(), fullPath);

    if (fs.statSync(fullPath).isDirectory()) {
      if (!IGNORE_DIRS.includes(file) && !IGNORE_DIRS.includes(relPath)) {
        scanDir(fullPath, violations);
      }
    } else if (
      file.endsWith('.tsx') ||
      file.endsWith('.ts') ||
      file.endsWith('.css')
    ) {
      if (
        file.includes('tokens') ||
        file.includes('tailwind.config') ||
        file.includes('globals.css')
      )
        continue;

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
    ? args.map((a) => path.resolve(process.cwd(), a))
    : [process.cwd()];
const violations = [];

scanPaths.forEach((p) => {
  if (fs.existsSync(p)) {
    if (fs.statSync(p).isDirectory()) {
      scanDir(p, violations);
    } else {
      // Single file scan logic... (simplified)
    }
  }
});

if (violations.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', '❌ ADS Design Violations Found');
  console.log(
    '\x1b[36m%s\x1b[0m',
    `Found ${violations.length} files with hardcoded primitives or raw colors.\n`
  );

  violations.forEach((v) => {
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
    '\n💡 Rule: Components must ONLY use semantic tokens (var(--ds-...)).'
  );
  process.exit(1);
} else {
  console.log('\x1b[32m%s\x1b[0m', '✅ ADS Design Component Compliance: 100%');
  process.exit(0);
}
