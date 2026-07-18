const fs = require('fs');
const path = require('path');

const dir = 'docs/reference/apps';
const output = path.join(dir, 'GATEFLOW_COMPLETE_CONTEXT_REFERENCE.md');

const files = [
  'FILES_AND_STRUCTURE_REFERENCE.md',
  'DATABASE_BACKEND_AND_TECH_REFERENCE.md',
  'API_GATEWAY_AND_CONTRACTS_REFERENCE.md',
  'ADMIN_DASHBOARD_REFERENCE.md',
  'CLIENT_DASHBOARD_REFERENCE.md',
  'MARKETING_APP_REFERENCE.md',
  'SCANNER_APP_REFERENCE.md',
  'RESIDENT_PORTAL_REFERENCE.md',
  'DESIGN_SYSTEM_REFERENCE.md',
  'UI_UX_AND_DESIGN_REFERENCE.md',
  'PLANNING_AND_PLAN_LIFECYCLE_REFERENCE.md',
  'MEMORY_AND_LEARNED_DATA_REFERENCE.md',
  'WORKSPACE_AI_ENVIRONMENT_REFERENCE.md',
  'AI_CONTEXT_BLOCK_REFERENCE.md',
  'FUNCTIONS_AND_SERVICES_INDEX_REFERENCE.md',
  'PAGES_AND_ROUTES_INDEX_REFERENCE.md',
  'OTHER_REPO_DEVELOPMENTS_REFERENCE.md',
];

let content =
  '# GateFlow Complete Context Reference\n\nGenerated on ' +
  new Date().toISOString() +
  '\n\n';

files.forEach((file) => {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    // Remove title if it's the first line
    const lines = fileContent.split('\n');
    if (lines[0]?.startsWith('# ')) {
      lines.shift();
    }
    const filteredLines = lines;

    content += `\n## ${file.replace('_REFERENCE.md', '').replace(/_/g, ' ')}\n\n`;
    content += filteredLines
      .join('\n')
      .replace(/\[([^\]]+)\]\(file:\/\/\/[^)]+\)/g, '$1'); // Strip file links
    content += '\n\n---\n';
  }
});

fs.writeFileSync(output, content);
console.log('Complete context reference generated at ' + output);
