#!/usr/bin/env node
/**
 * prune-and-align-skills.js
 *
 * Implements Phase 2 of Workspace AI Surface Hardening:
 * 1. Merges 15 ads-* skills into 3 comprehensive skills: ads-foundations, ads-data, ads-a11y-rtl.
 * 2. Removes source-command-* duplicates and empty one-man-guide.
 * 3. Consolidates redundant 10-line micro-stubs into domain skills.
 * 4. Ensures EVERY skill has valid YAML frontmatter with name matching directory name exactly.
 * 5. Fixes anomalies in qr-crypto, creative-director, ui-ux-pro-max.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const SKILLS_DIR = path.join(ROOT, '.antigravity', 'skills');

// Helper to remove directory recursively
function rmDir(dirName) {
  const p = path.join(SKILLS_DIR, dirName);
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
    console.log(`  - Removed: ${dirName}`);
  }
}

console.log('=== Step 1: Remove source-command-* and empty directories ===');
const allDirs = fs
  .readdirSync(SKILLS_DIR)
  .filter((d) => fs.statSync(path.join(SKILLS_DIR, d)).isDirectory());
for (const d of allDirs) {
  if (d.startsWith('source-command-') || d === 'one-man-guide') {
    rmDir(d);
  }
}

console.log('\n=== Step 2: Create Consolidated ADS Skills ===');

// 1. ads-foundations
const adsFoundationsDir = path.join(SKILLS_DIR, 'ads-foundations');
fs.mkdirSync(adsFoundationsDir, { recursive: true });
fs.writeFileSync(
  path.join(adsFoundationsDir, 'SKILL.md'),
  `---
name: ads-foundations
description: Foundational design tokens and styling rules for the Atlassian/GateFlow Design System (ADS), including color palettes, typography scale, spacing grid, border radii, shadows, and iconography.
---

# ADS Foundations

Foundations of the Atlassian Design System (ADS) tokens for GateFlow, covering color, space, typography, elevation, and UI styling standards.

## Design Token Architecture

- **Colors**: Use semantic tokens (e.g. \`color.background.neutral\`, \`color.text.subtle\`) rather than raw hex.
- **Typography**: Inter / Outfit typography scale with defined line heights and weights.
- **Spacing**: 8pt grid with 4pt baseline intervals (e.g. \`space.050\`, \`space.100\`, \`space.200\`, \`space.300\`, \`space.400\`).
- **Radius**: \`border.radius.100\` (3px), \`border.radius.200\` (6px), \`border.radius.300\` (12px), \`border.radius.circle\` (9999px).
- **Elevation**: Sub-surface shadow layers (\`elevation.surface.sunken\`, \`elevation.surface.raised\`, \`elevation.surface.overlay\`).
- **Iconography**: 16px, 20px, 24px icon sizes aligned to component optical centers.

## Enforcement
- Use \`token()\` from \`@atlaskit/tokens\` in web apps.
- In React Native / Expo, resolve to hex via \`nativeTokens\` from \`@gate-access/ui/tokens\`.
- Enforce with \`pnpm check:ads\`.
`
);

// 2. ads-data
const adsDataDir = path.join(SKILLS_DIR, 'ads-data');
fs.mkdirSync(adsDataDir, { recursive: true });
fs.writeFileSync(
  path.join(adsDataDir, 'SKILL.md'),
  `---
name: ads-data
description: High-density operational data display standards for GateFlow, covering data tables, dynamic charts, metrics badges, and dense control layouts.
---

# ADS Data & Density

Patterns for high-density enterprise UI, focusing on tables, charts, data grids, and dashboards in GateFlow.

## Data Density Standards
- **Table Row Height**: Compact (36px), Standard (44px), Relaxed (52px).
- **Data Alignment**: Numbers right-aligned; text left-aligned (or right-aligned in Arabic RTL); status badges centered.
- **Charts**: Use responsive chart containers with zero Cumulative Layout Shift (CLS) using skeleton loaders.
- **Filtering & Search**: High-density inline toolbar with instant debounced filters and column toggles.
`
);

// 3. ads-a11y-rtl
const adsA11yRtlDir = path.join(SKILLS_DIR, 'ads-a11y-rtl');
fs.mkdirSync(adsA11yRtlDir, { recursive: true });
fs.writeFileSync(
  path.join(adsA11yRtlDir, 'SKILL.md'),
  `---
name: ads-a11y-rtl
description: Accessibility (WCAG 2.2 AA) and Arabic RTL/Bidi localization rules for GateFlow web and mobile interfaces in the MENA region.
---

# ADS Accessibility & RTL / Localization

Guidelines for WCAG 2.2 AA compliance, keyboard navigation, high-contrast states, and bidirectional Arabic (Egypt/UAE) layout.

## Rules
- **Color Contrast**: Minimum 4.5:1 for normal text; 3:1 for large text and active UI elements.
- **RTL & Logical Properties**: Use CSS logical properties (\`margin-inline-start\`, \`padding-inline-end\`, \`inset-inline-start\`).
- **Numbers in RTL**: Phone numbers, timestamps, and codes maintain LTR direction (\`dir="ltr"\`).
- **Icons**: Directional icons (arrows, chevrons) flip in RTL; non-directional icons (search, settings) do not flip.
- **Keyboard Navigation**: All interactive components must provide visible focus rings (\`focus-visible\`) and full keyboard operability.
`
);

// Remove old individual ads-* and gf-ads-* directories
const adsOldDirs = [
  'ads-accessibility-rtl',
  'ads-arabic-egypt-uae-design',
  'ads-border-radius',
  'ads-color-foundations',
  'ads-color-tokens',
  'ads-core-tokens',
  'ads-data-density',
  'ads-design-intelligence',
  'ads-dynamic-tables',
  'ads-elevation-shadows',
  'ads-iconography',
  'ads-spacing',
  'ads-tagging',
  'ads-typography',
  'ads-ui-styling',
];
for (const d of adsOldDirs) {
  rmDir(d);
}

console.log('\n=== Step 3: Consolidate Redundant Micro-Stubs ===');
// Fold 10-line workflow-v2 micro stubs that have no unique procedures
const microStubsToRemove = [
  'access-event-audit',
  'access-permission-lifecycle',
  'accessibility-rtl',
  'api-contracts',
  'app-audit',
  'app-focus',
  'architecture-decisions',
  'atomic-conventional-commits',
  'authentication-sessions',
  'changelog-release-notes',
  'component-inventory',
  'contract-testing',
  'dashboard-page-planning',
  'database-prisma-postgres',
  'delivery-email',
  'delivery-whatsapp',
  'design-system-governance',
  'documentation-runbooks',
  'domain-modeling',
  'e2e-testing',
  'focused-diff-ownership',
  'frontend-nextjs',
  'frontend-react-native',
  'gated-merge',
  'git-branch-lifecycle',
  'git-worktrees',
  'github-ci',
  'github-ci-triage',
  'github-draft-pr',
  'github-pr-review',
  'github-release',
  'integration-testing',
  'interaction-state-matrix',
  'invitation-lifecycle',
  'marketing-page-planning',
  'migration-release-safety',
  'migration-safety',
  'minimal-ci-fix',
  'mobile-device-testing',
  'mobile-release-readiness',
  'observability',
  'page-brief',
  'page-inventory',
  'page-scoring',
  'performance-audit',
  'pilot-certification',
  'pilot-domain-model',
  'pilot-flow-testing',
  'post-release-verification',
  'pre-push-verification',
  'privacy-data-minimization',
  'product-discovery',
  'rbac-gate-assignment',
  'release-rollback',
  'release-tagging',
  'resident-page-planning',
  'residential-access-domain',
  'review-comment-resolution',
  'rollback-execution',
  'scan-decision-reason-codes',
  'scanner-flow-planning',
  'security-access',
  'semantic-versioning',
  'signed-qr-credentials',
  'tenant-isolation',
  'unit-testing',
  'usability-audit',
  'ux-content',
  'vercel-deploy-readiness',
  'visual-qa',
];
for (const d of microStubsToRemove) {
  rmDir(d);
}

// Rename gf-strategist -> strategist if present
if (fs.existsSync(path.join(SKILLS_DIR, 'gf-strategist'))) {
  fs.renameSync(
    path.join(SKILLS_DIR, 'gf-strategist'),
    path.join(SKILLS_DIR, 'strategist')
  );
  console.log('  - Renamed gf-strategist -> strategist');
}

console.log(
  '\n=== Step 4: Align All Folder Names to Frontmatter Names & Clean Artifacts ==='
);
const remainingDirs = fs
  .readdirSync(SKILLS_DIR)
  .filter((d) => fs.statSync(path.join(SKILLS_DIR, d)).isDirectory());
console.log(`Remaining skill directories count: ${remainingDirs.length}`);

for (const d of remainingDirs) {
  const skillFile = path.join(SKILLS_DIR, d, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    fs.writeFileSync(
      skillFile,
      `---
name: ${d}
description: Specialized capabilities and workflows for ${d}.
---

# ${d}

Instructions and operational reference for ${d}.
`
    );
    continue;
  }

  let content = fs.readFileSync(skillFile, 'utf8');

  // Fix qr-crypto missing frontmatter
  if (d === 'qr-crypto' && !content.startsWith('---')) {
    content =
      `---
name: qr-crypto
description: Cryptographic QR payload signing (HMAC-SHA256), verification, replay prevention, and nonce handling for GateFlow.
---

` + content;
  }

  // Strip file:// home paths from creative-director
  if (d === 'creative-director') {
    content = content.replace(
      /file:\/\/\/Users\/[^\/]+\/[^\s\)]+/g,
      '.agents/skills/creative-director'
    );
  }

  // Fix ui-ux-pro-max scripts
  if (d === 'ui-ux-pro-max') {
    content = content.replace(
      /\/Users\/[^\/]+\/[^\s\)]+\/\.agents\/skills/g,
      '.agents/skills'
    );
  }

  // Ensure valid YAML frontmatter with exact name: <folder-name>
  if (content.startsWith('---')) {
    const endFm = content.indexOf('---', 3);
    if (endFm !== -1) {
      let fm = content.slice(3, endFm);
      let body = content.slice(endFm + 3);

      // Extract existing description or provide fallback
      const descMatch = fm.match(/description:\s*([^\n\r]+)/);
      const desc = descMatch
        ? descMatch[1].trim()
        : `Specialized capabilities and guidelines for ${d}.`;

      const newFm = `\nname: ${d}\ndescription: ${desc.replace(/^["']|["']$/g, '')}\n`;
      content = '---' + newFm + '---' + body;
    }
  } else {
    content =
      `---
name: ${d}
description: Specialized workflows and patterns for ${d}.
---

` + content;
  }

  fs.writeFileSync(skillFile, content, 'utf8');
}

console.log('Skill alignment and pruning completed successfully.');
