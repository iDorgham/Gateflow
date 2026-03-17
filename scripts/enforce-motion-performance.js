/**
 * Enforce Motion Performance
 * Logic: Scans for layout-thrashing animation properties (width, height, top, left, etc.) in Framer Motion components.
 * Skill Reference: gf-framer-motion-layout, gf-motion-philosophy
 */
const fs = require('fs');
const path = require('path');

const VIOLATIONS = [];
const LAYOUT_PROPS = ['width', 'height', 'top', 'bottom', 'left', 'right', 'margin', 'padding'];
const MOTION_PROPS_REGEX = /animate=\{\s*\{([^}]+)\}\s*\}/g;
const IGNORE_DIRS = ['node_modules', '.next', '.git', 'dist', 'ios', 'android', 'Pods', '.turbo'];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (IGNORE_DIRS.includes(file)) continue;

    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      scanDir(fullPath);
    } else if (/\.(tsx|ts)$/.test(file)) {
        const content = fs.readFileSync(fullPath, 'utf8');

        let match;
        while ((match = MOTION_PROPS_REGEX.exec(content)) !== null) {
            const propBlock = match[1];
            LAYOUT_PROPS.forEach(prop => {
                if (new RegExp(`\\b${prop}\\b`).test(propBlock)) {
                    VIOLATIONS.push(`[PERFORMANCE: LAYOUT THRASH] ${fullPath}:${getLineNumber(content, match.index)} - Animating '${prop}' directly. Use 'scale', 'x', or 'y' instead.`);
                }
            });
        }
    }
  }
}

function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

const args = process.argv.slice(2);

console.log('--- Starting Motion Performance Enforcer ---');

if (args.length > 0) {
  console.log(`Scanning ${args.length} files...`);
  args.forEach(file => {
    if (fs.existsSync(file) && /\.(tsx|ts)$/.test(file)) {
      const content = fs.readFileSync(file, 'utf8');

      let match;
      while ((match = MOTION_PROPS_REGEX.exec(content)) !== null) {
          const propBlock = match[1];
          LAYOUT_PROPS.forEach(prop => {
              if (new RegExp(`\\b${prop}\\b`).test(propBlock)) {
                  VIOLATIONS.push(`[PERFORMANCE: LAYOUT THRASH] ${file}:${getLineNumber(content, match.index)} - Animating '${prop}' directly. Use 'scale', 'x', or 'y' instead.`);
              }
          });
      }
    }
  });
} else {
  console.log('Scanning entire directory...');
  scanDir(process.cwd());
}

if (VIOLATIONS.length > 0) {
  console.warn('\x1b[33m%s\x1b[0m', 'Motion Performance Warning: Found non-performant layout animations.');
  VIOLATIONS.forEach(v => console.warn(v));
  // Not exiting with 1 for now, just warning, unless critical.
  process.exit(0);
} else {
  console.log('\x1b[32m%s\x1b[0m', 'Motion Performance Pass: Animations are performant.');
  process.exit(0);
}
