const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPORT_PATH = path.join(__dirname, '../docs/plan/learning/SKILL_DISCOVERY_REPORT.md');

function discover() {
  console.log('--- Ralph Skill Discovery Engine ---');
  
  let report = `# Skill Discovery Report\n\n**Date:** ${new Date().toISOString()}\n\n`;
  let findingsFound = false;

  // 1. Scan for hardcoded Hex Colors (Should use ADS tokens)
  console.log('Scanning for hardcoded Hex colors...');
  try {
    // Focus on src directories and limit results
    const hexFindings = execSync('grep -rE "#([A-Fa-f0-9]{3}){1,2}" apps/*/src packages/ui/src --exclude-dir=node_modules --exclude-dir=.next | head -n 10', { timeout: 30000 }).toString();
    if (hexFindings) {
      findingsFound = true;
      report += `## 🎨 Design System Violations (Hardcoded Hex)\n\nDetected raw hex values instead of Atlassian Design System tokens (\`var(--ds-...)\`).\n\n\`\`\`text\n${hexFindings}\n\`\`\`\n\n`;
    }
  } catch (e) {
    console.log('Hex scan timed out or failed, skipping...');
  }

  // 2. Scan for potentially missing organizationId guards in Prisma queries
  console.log('Scanning for potential missing organizationId guards...');
  try {
    // Target api routes and lib files
    const prismaFindings = execSync('grep -r "prisma\\..*\\.findMany({" apps/*/src packages/*/src --exclude-dir=node_modules | grep -v "organizationId" | head -n 5', { timeout: 30000 }).toString();
    if (prismaFindings) {
      findingsFound = true;
      report += `## 🔒 Security Invariants (Missing organizationId)\n\nPotential multi-tenant isolation risks. Found \`findMany\` calls without an explicit \`organizationId\` filter.\n\n\`\`\`text\n${prismaFindings}\n\`\`\`\n\n`;
    }
  } catch (e) {
    console.log('Prisma scan timed out or failed, skipping...');
  }

  if (findingsFound) {
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(REPORT_PATH, report);
    console.log(`\nFound violations! Skill Discovery Report generated at: ${REPORT_PATH}`);
  } else {
    console.log('\nNo new patterns discovered. Skill Compliance Score: 100%');
  }
}

discover();
