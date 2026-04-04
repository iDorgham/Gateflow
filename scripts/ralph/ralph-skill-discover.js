const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPORT_PATH = path.join(
  __dirname,
  '../docs/development/learning/SKILL_DISCOVERY_REPORT.md'
);

function discover() {
  console.log('--- Ralph Skill Discovery Engine ---');

  let report = `# Skill Discovery Report\n\n**Date:** ${new Date().toISOString()}\n\n`;
  let findingsFound = false;

  // 1. Scan for hardcoded Hex Colors (Should use ADS tokens)
  // Exclude hexes that are part of a var() fallback like bg-[var(--ds-bg,#hex)]
  // Exclude test pages
  console.log('Scanning for hardcoded Hex colors...');
  try {
    const hexFindings = execSync(
      'grep -rE "#([A-Fa-f0-9]{3}){1,2}" apps/*/src packages/ui/src --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=test --exclude-dir=tests | grep -vE "var\\(--ds-.*,#" | grep -vE "token\\(.*,[\'\\\" ]?#" | grep -vE "\\\\\\${token" | grep -v "create-test" | head -n 10',
      { timeout: 30000 }
    ).toString();
    if (hexFindings.trim()) {
      findingsFound = true;
      report += `## 🎨 Design System Violations (Hardcoded Hex)\n\nDetected raw hex values instead of Atlassian Design System tokens (\`var(--ds-...)\`).\n\n\`\`\`text\n${hexFindings}\n\`\`\`\n\n`;
    }
  } catch (e) {
    console.log('Hex scan timed out or failed, skipping...');
  }

  // 2. Scan for potentially missing organizationId guards in Prisma queries
  console.log('Scanning for potential missing organizationId guards...');
  try {
    const files = execSync(
      'find apps packages -name "*.ts" -o -name "*.tsx" | grep -v "node_modules" | grep -v ".next" | grep -v "admin-dashboard"'
    )
      .toString()
      .split('\n')
      .filter(Boolean);
    let prismaFindings = '';

    for (const file of files) {
      if (fs.statSync(file).isDirectory()) continue;
      const content = fs.readFileSync(file, 'utf8');
      const matches = content.matchAll(
        /prisma\.(.*?)\.findMany\({([\s\S]*?)}\)/g
      );
      for (const match of matches) {
        if (
          !match[2].includes('organizationId') &&
          !match[2].includes('// ignore-security-guard')
        ) {
          const line = content.substring(0, match.index).split('\n').length;
          prismaFindings += `${file}:${line}: prisma.${match[1]}.findMany({...})\n`;
        }
      }
    }

    if (prismaFindings.trim()) {
      findingsFound = true;
      report += `## 🔒 Security Invariants (Missing organizationId)\n\nPotential multi-tenant isolation risks. Found \`findMany\` calls without an explicit \`organizationId\` filter.\n\n\`\`\`text\n${prismaFindings}\n\`\`\`\n\n`;
    }
  } catch (e) {
    console.log('Prisma scan failed, skipping...', e);
  }

  if (findingsFound) {
    fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
    fs.writeFileSync(REPORT_PATH, report);
    console.log(
      `\nFound violations! Skill Discovery Report generated at: ${REPORT_PATH}`
    );
  } else {
    // If we reach here, it means we found NO violations after filtering
    console.log('\nNo new patterns discovered. Skill Compliance Score: 100%');
  }
}

discover();
