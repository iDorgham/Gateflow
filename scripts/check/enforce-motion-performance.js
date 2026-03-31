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
];

function scanDir(dir, warnings = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) scanDir(fullPath, warnings);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');

      if (content.includes('framer-motion')) {
        const nonPerfAnimRegex =
          /animate=\{\{.*(width|height|top|left|margin|padding|fontSize).*\}\}/g;
        if (nonPerfAnimRegex.test(content)) {
          warnings.push({
            file: fullPath,
            type: 'Performance warning: Animation using layout properties (width/height/etc.). Use transform (scale/translate) instead.',
          });
        }
      }
    }
  }
  return warnings;
}

const warnings = scanDir(process.cwd());

if (warnings.length > 0) {
  console.warn('\x1b[33m%s\x1b[0m', '⚠️ Motion Performance Warnings Found:');
  warnings.forEach((w) => {
    console.log(`\x1b[33m${w.file}\x1b[0m: ${w.type}`);
  });
  // Note: We don't exit with 1 for warnings unless specifically requested.
  process.exit(0);
} else {
  console.log('\x1b[32m%s\x1b[0m', '✅ Motion Performance: Green');
  process.exit(0);
}
