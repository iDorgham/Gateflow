const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = ['node_modules', '.next', '.turbo', 'dist', 'ios', 'android', 'Pods'];
const COLOR_HEX_REGEX = /#(?:[0-9a-fA-F]{3,4}){1,2}(?![a-zA-Z0-9_-])/g;
const RGBA_REGEX = /rgba?\([^)]+\)/g;

function scanDir(dir, violations = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) scanDir(fullPath, violations);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      // Exclude tokens files themselves
      if (file.includes('tokens') || file.includes('tailwind.config')) continue;
      
      const content = fs.readFileSync(fullPath, 'utf8');
      const hexMatches = content.match(COLOR_HEX_REGEX);
      const rgbaMatches = content.match(RGBA_REGEX);

      if (hexMatches || rgbaMatches) {
        violations.push({
          file: fullPath,
          hex: hexMatches || [],
          rgba: rgbaMatches || []
        });
      }
    }
  }
  return violations;
}

const violations = scanDir(process.cwd());

if (violations.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', '❌ ADS Design Violations Found:');
  violations.forEach(v => {
    console.log(`\x1b[33m${v.file}\x1b[0m:`);
    if (v.hex.length) console.log(`  - Hex: ${v.hex.join(', ')}`);
    if (v.rgba.length) console.log(`  - RGBA: ${v.rgba.join(', ')}`);
  });
  console.log('\x1b[36m%s\x1b[0m', '\n💡 Tip: Use ADS design tokens (var(--ds-...)) instead of raw hex/rgba values.');
  process.exit(1);
} else {
  console.log('\x1b[32m%s\x1b[0m', '✅ ADS Design: Green');
  process.exit(0);
}
