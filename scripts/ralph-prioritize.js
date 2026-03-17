const fs = require('fs');
const path = require('path');

const BACKLOG_PATH = path.join(__dirname, '../docs/plan/backlog/ALL_TASKS_BACKLOG.md');
const AUTONOMY_PLAN_PATH = path.join(__dirname, '../docs/plan/execution/PLAN_gateflow_v9_autonomy.md');

function prioritize() {
  console.log('--- Ralph Prioritization Engine ---');
  
  if (!fs.existsSync(BACKLOG_PATH)) {
    console.error('Backlog file not found.');
    return;
  }

  const backlog = fs.readFileSync(BACKLOG_PATH, 'utf8');
  const autonomyPlan = fs.readFileSync(AUTONOMY_PLAN_PATH, 'utf8');

  // 1. Check current Autonomy Plan status
  const autonomyMatches = autonomyPlan.match(/### Phase (\d+): (.*?) \[IN-PROGRESS\]/);
  if (autonomyMatches) {
    console.log(`Current Active Initiative: GateFlow v9.0 Autonomy`);
    console.log(`Active Phase: Phase ${autonomyMatches[1]} (${autonomyMatches[2]})`);
    console.log('Recommendation: Complete current Autonomy Phase before switching contexts.');
    return;
  }

  // 2. Scan Backlog for "Planning" or "In Progress" initiatives
  const openInitiatives = [];
  const lines = backlog.split('\n');
  let currentInitiative = null;

  for (const line of lines) {
    if (line.startsWith('### ')) {
      currentInitiative = line.replace('### ', '').trim();
    }
    if (line.includes('**Status:** 🔄 In Progress') || line.includes('**Status:** 🏗️ Planning')) {
      if (currentInitiative) {
        openInitiatives.push(currentInitiative);
      }
    }
  }

  if (openInitiatives.length > 0) {
    console.log('\nOther Open Initiatives detected:');
    openInitiatives.forEach(init => console.log(`- ${init}`));
    
    // Simple heuristic: prioritize UI remake if it's open
    if (openInitiatives.some(i => i.includes('atlassian_ui_remake'))) {
      console.log('\nStrategic Recommendation:');
      console.log('The Atlassian UI Remake is a high-priority architectural shift.');
      console.log('Proceed to: Phase 4 of atlassian_ui_remake (Feature Modules).');
    }
  } else {
    console.log('\nAll core initiatives are stable. Check ALL_TASKS_BACKLOG for new ideas.');
  }
}

prioritize();
