const fs = require('fs');
const path = require('path');

const BACKLOG_PATH = path.join(
  __dirname,
  '../../docs/plan/backlog/ALL_TASKS_BACKLOG.md'
);
const IN_PROGRESS_DIR = path.join(__dirname, '../../docs/plan/Active/');
const PLANNED_DIR = path.join(__dirname, '../../docs/plan/Ready/');

function prioritize() {
  console.log('--- Ralph Prioritization Engine ---');

  // 1. Scan for active initiatives in Active/
  if (fs.existsSync(IN_PROGRESS_DIR)) {
    const activePlans = fs
      .readdirSync(IN_PROGRESS_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    if (activePlans.length > 0) {
      console.log('\nActive Initiatives (In-Progress):');
      activePlans.forEach((slug) => {
        const planPath = path.join(IN_PROGRESS_DIR, slug, `PLAN_${slug}.md`);
        if (fs.existsSync(planPath)) {
          const content = fs.readFileSync(planPath, 'utf8');
          const phaseMatch = content.match(
            /### Phase (\d+): (.*?) \(CURRENT\)/
          );
          if (phaseMatch) {
            console.log(`- ${slug}: Phase ${phaseMatch[1]} (${phaseMatch[2]})`);
          } else {
            console.log(
              `- ${slug}: Plan found, but no active phase marked (CURRENT).`
            );
          }
        } else {
          console.log(
            `- ${slug}: Plan directory exists, but PLAN_${slug}.md is missing.`
          );
        }
      });
      console.log(
        '\nRecommendation: Complete current active phases before switching contexts.'
      );
      return;
    }
  }

  // 2. Scan Backlog for "Planning" or "In Progress" initiatives
  if (fs.existsSync(BACKLOG_PATH)) {
    const backlog = fs.readFileSync(BACKLOG_PATH, 'utf8');
    const openInitiatives = [];
    const lines = backlog.split('\n');
    let currentInitiative = null;

    for (const line of lines) {
      if (line.startsWith('### ')) {
        // Strip out the slug part before the dash
        currentInitiative = line.replace('### ', '').trim().split(' — ')[0];
      }
      if (
        line.includes('**Status:** 🔄 In Progress') ||
        line.includes('**Status:** 🏗️ Planning')
      ) {
        if (currentInitiative) {
          openInitiatives.push(currentInitiative);
        }
      }
    }

    if (openInitiatives.length > 0) {
      console.log('\nOpen Initiatives detected in backlog:');
      openInitiatives.forEach((init) => console.log(`- ${init}`));

      // Check Ready/ directory for approved plans
      if (fs.existsSync(PLANNED_DIR)) {
        const plannedPlans = fs
          .readdirSync(PLANNED_DIR, { withFileTypes: true })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => dirent.name);

        if (plannedPlans.length > 0) {
          console.log('\nApproved Plans (Ready for /dev):');
          plannedPlans.forEach((p) => console.log(`- ${p}`));
          console.log(
            `\nNext Step Recommendation: Run /dev ${plannedPlans[0]} 1`
          );
          return;
        }
      }

      console.log('\nStrategic Recommendation:');
      console.log(
        `Prepare a formal plan for: ${openInitiatives[0]} using /plan ${openInitiatives[0]}`
      );
    } else {
      console.log(
        '\nAll core initiatives are stable. Check ALL_TASKS_BACKLOG for new ideas.'
      );
    }
  } else {
    console.log('Backlog file not found.');
  }
}

prioritize();
