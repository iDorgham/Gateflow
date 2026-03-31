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

function scanDir(dir, violations = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) scanDir(fullPath, violations);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');

      // Check for prisma queries missing organizationId
      const prismaQueryRegex =
        /prisma\.[a-zA-Z]+\.(find|update|delete|create|upsert)/g;
      if (prismaQueryRegex.test(content)) {
        if (
          !content.includes('organizationId') &&
          !content.includes('// skip-organization-check')
        ) {
          violations.push({
            file: fullPath,
            type: 'Multi-tenancy violation (missing organizationId)',
          });
        }
      }

      // Check for console.log of potentially sensitive data
      if (
        content.match(/console\.log\(.*(password|secret|key|token|auth).*/i)
      ) {
        violations.push({
          file: fullPath,
          type: 'Potential secret exposure in console.log',
        });
      }
    }
  }
  return violations;
}

const violations = scanDir(process.cwd());

if (violations.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Security Invariant Violations Found:');
  violations.forEach((v) => {
    console.log(`\x1b[33m${v.file}\x1b[0m: ${v.type}`);
  });
  process.exit(1);
} else {
  console.log('\x1b[32m%s\x1b[0m', '✅ Security Invariants: Green');
  process.exit(0);
}
