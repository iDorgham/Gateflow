/**
 * Enforce ADS Design Tokens
 * Logic: Scans .tsx, .ts, and .css files for raw hex codes and arbitrary spacing values.
 * Skill Reference: gf-ads-color-tokens, gf-ads-spacing-grid
 */
const fs = require('fs');
const path = require('path');

const VIOLATIONS = [];
const HEX_REGEX = /#(?:[0-9a-fA-F]{3}){1,2}\b/g;
const SPACING_REGEX = /p-\[[0-9]+px\]|m-\[[0-9]+px\]|gap-\[[0-9]+px\]/g;
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'dist', 'ios', 'android', 'Pods', '.turbo'];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (IGNORE_DIRS.includes(file)) continue;

    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(tsx|ts|css)$/.test(file)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      let match;
      while ((match = HEX_REGEX.exec(content)) !== null) {
        VIOLATIONS.push(`[HEX CODE] ${fullPath}:${getLineNumber(content, match.index)} - Found ${match[0]}`);
      }
      
      while ((match = SPACING_REGEX.exec(content)) !== null) {
        VIOLATIONS.push(`[ARBITRARY SPACING] ${fullPath}:${getLineNumber(content, match.index)} - Found ${match[0]}`);
      }
    }
  }
}

function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

const args = process.argv.slice(2);

console.log('--- Starting ADS Enforcer ---');

if (args.length > 0) {
  console.log(`Scanning ${args.length} files...`);
  args.forEach(file => {
    if (fs.existsSync(file) && /\.(tsx|ts|css)$/.test(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      let match;
      while ((match = HEX_REGEX.exec(content)) !== null) {
        VIOLATIONS.push(`[HEX CODE] ${file}:${getLineNumber(content, match.index)} - Found ${match[0]}`);
      }
      
      while ((match = SPACING_REGEX.exec(content)) !== null) {
        VIOLATIONS.push(`[ARBITRARY SPACING] ${file}:${getLineNumber(content, match.index)} - Found ${match[0]}`);
      }
    }
  });
} else {
  console.log('Scanning entire directory...');
  scanDir(process.cwd());
}

if (VIOLATIONS.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', 'ADS Compliance Failure: Found raw hex codes or arbitrary spacing.');
  VIOLATIONS.forEach(v => console.error(v));
  process.exit(1);
} else {
  console.log('\x1b[32m%s\x1b[0m', 'ADS Compliance Pass: All colors and spacing use tokens.');
  process.exit(0);
}
