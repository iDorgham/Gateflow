/**
 * Enforce Security Invariants
 * Logic: Scans API routes and server components for missing organizationId in Prisma queries and exposed secrets.
 * Skill Reference: gf-system-invariants, gf-qr-crypto-security
 */
const fs = require('fs');
const path = require('path');

const VIOLATIONS = [];
const PRISMA_QUERY_REGEX = /prisma\.[a-zA-Z0-0]+\.(findMany|findUnique|findFirst|update|delete|upsert)\(/g;
const ORG_ID_REGEX = /organizationId/;
const SECRET_EXPOSURE_REGEX = /process\.env\.(QR_SIGNING_SECRET|JWT_SECRET|DATABASE_URL)/g;
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

        // Check for Prisma queries without organizationId check (basic heuristic)
        let match;
        while ((match = PRISMA_QUERY_REGEX.exec(content)) !== null) {
            const startIndex = match.index;
            const endIndex = content.indexOf(')', startIndex);
            const queryBlock = content.substring(startIndex, endIndex);
            
            if (!ORG_ID_REGEX.test(queryBlock)) {
                VIOLATIONS.push(`[SECURITY: MULTI-TENANCY] ${fullPath}:${getLineNumber(content, match.index)} - Probable missing organizationId in query: ${match[0]}...`);
            }
        }

        // Check for direct secret logging/exposure in files
        while ((match = SECRET_EXPOSURE_REGEX.exec(content)) !== null) {
            if (content.includes(`console.log(${match[0]})`) || content.includes(`logger.info(${match[0]})`)) {
                VIOLATIONS.push(`[SECURITY: SECRET EXPOSURE] ${fullPath}:${getLineNumber(content, match.index)} - Secret ${match[0]} is being logged!`);
            }
        }
    }
  }
}

function getLineNumber(content, index) {
  return content.substring(0, index).split('\n').length;
}

const args = process.argv.slice(2);

console.log('--- Starting Security Enforcer ---');

if (args.length > 0) {
  console.log(`Scanning ${args.length} files...`);
  args.forEach(file => {
    if (fs.existsSync(file) && /\.(tsx|ts)$/.test(file)) {
      const content = fs.readFileSync(file, 'utf8');

      let match;
      while ((match = PRISMA_QUERY_REGEX.exec(content)) !== null) {
          const startIndex = match.index;
          const endIndex = content.indexOf(')', startIndex);
          const queryBlock = content.substring(startIndex, endIndex);
          
          if (!ORG_ID_REGEX.test(queryBlock)) {
              VIOLATIONS.push(`[SECURITY: MULTI-TENANCY] ${file}:${getLineNumber(content, match.index)} - Probable missing organizationId in query: ${match[0]}...`);
          }
      }

      while ((match = SECRET_EXPOSURE_REGEX.exec(content)) !== null) {
          if (content.includes(`console.log(${match[0]})`) || content.includes(`logger.info(${match[0]})`)) {
              VIOLATIONS.push(`[SECURITY: SECRET EXPOSURE] ${file}:${getLineNumber(content, match.index)} - Secret ${match[0]} is being logged!`);
          }
      }
    }
  });
} else {
  console.log('Scanning entire directory...');
  scanDir(process.cwd());
}

if (VIOLATIONS.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', 'Security Compliance Failure: Found potential multi-tenancy leaks or secret exposures.');
  VIOLATIONS.forEach(v => console.error(v));
  process.exit(1);
} else {
  console.log('\x1b[32m%s\x1b[0m', 'Security Compliance Pass: Invariants verified.');
  process.exit(0);
}
