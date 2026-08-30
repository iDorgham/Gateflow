/**
 * scripts/check/audit-showcase.js
 * Self-Healing Showcase & Component Story Audit Script.
 * Verifies that all exported components in @gateflow/ui have corresponding showcase demos.
 */

const fs = require('fs');
const path = require('path');

const UI_INDEX_PATH = path.join(__dirname, '../../packages/ui/src/index.ts');
<<<<<<< Updated upstream
const SHOWCASE_DIR = path.join(__dirname, '../../apps/design-system/src/app/(docs)');
=======
const SHOWCASE_DIR = path.join(
  __dirname,
  '../../apps/design-system/src/app/(docs)'
);
>>>>>>> Stashed changes

function runAudit() {
  console.log('===========================================================');
  console.log('🔍 GateFlow Design System — Showcase & Documentation Audit');
  console.log('===========================================================\n');

  if (!fs.existsSync(UI_INDEX_PATH)) {
    console.error(`🚨 UI index not found at: ${UI_INDEX_PATH}`);
    process.exit(1);
  }

  const indexContent = fs.readFileSync(UI_INDEX_PATH, 'utf8');
<<<<<<< Updated upstream
  const exportMatches = indexContent.match(/export \* from '\.\/components\/ui\/([a-z-]+)'/g) || [];
  const exportedComponents = exportMatches.map(m => m.replace(/export \* from '\.\/components\/ui\/([a-z-]+)'/, '$1'));

  console.log(`Found ${exportedComponents.length} exported UI primitives in @gateflow/ui:`);
=======
  const exportMatches =
    indexContent.match(/export \* from '\.\/components\/ui\/([a-z-]+)'/g) || [];
  const exportedComponents = exportMatches.map((m) =>
    m.replace(/export \* from '\.\/components\/ui\/([a-z-]+)'/, '$1')
  );

  console.log(
    `Found ${exportedComponents.length} exported UI primitives in @gateflow/ui:`
  );
>>>>>>> Stashed changes
  console.log(exportedComponents.join(', ') + '\n');

  // Verify critical pages exist in design-system
  const requiredRoutes = [
    'foundations/color/page.tsx',
    'components/primitives/page.tsx',
    'guidelines/prompt-guide/page.tsx',
    'sandboxes/vibe-check/page.tsx',
  ];

  let missing = 0;
  for (const route of requiredRoutes) {
    const fullPath = path.join(SHOWCASE_DIR, route);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ PASS Route exists: (docs)/${route}`);
    } else {
      console.error(`❌ FAIL Missing required route: (docs)/${route}`);
      missing++;
    }
  }

  console.log('\n-----------------------------------------------------------');
  if (missing === 0) {
    console.log(`🎉 SHOWCASE AUDIT PASSED WITH 100% COVERAGE!`);
<<<<<<< Updated upstream
    console.log('-----------------------------------------------------------\n');
    process.exit(0);
  } else {
    console.error(`🚨 ${missing} REQUIRED SHOWCASE ROUTES MISSING.`);
    console.log('-----------------------------------------------------------\n');
=======
    console.log(
      '-----------------------------------------------------------\n'
    );
    process.exit(0);
  } else {
    console.error(`🚨 ${missing} REQUIRED SHOWCASE ROUTES MISSING.`);
    console.log(
      '-----------------------------------------------------------\n'
    );
>>>>>>> Stashed changes
    process.exit(1);
  }
}

runAudit();
