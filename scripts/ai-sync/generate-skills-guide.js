const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const SKILLS_DIR = path.join(ROOT, '.antigravity', 'skills');
const OUTPUT_FILE = path.join(ROOT, 'docs', 'workspace', 'SKILLS_GUIDE.md');

const dirs = fs
  .readdirSync(SKILLS_DIR)
  .filter((d) => fs.statSync(path.join(SKILLS_DIR, d)).isDirectory())
  .sort();

const rows = [];
for (const d of dirs) {
  const f = path.join(SKILLS_DIR, d, 'SKILL.md');
  let desc = 'Specialized capabilities and guidelines.';
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, 'utf8');
    const m = c.match(/^description:\s*([^\n\r]+)/m);
    if (m) {
      desc = m[1].trim().replace(/^["']|["']$/g, '');
    }
  }
  rows.push(`| \`${d}\` | ${desc} |`);
}

const content = `# GateFlow Workspace — Skills Guide

Index of skills under **\`.antigravity/skills/\`** (mirrored to **\`.agents/skills/\`** and synchronized to all IDE tools via **\`pnpm sync\`**). Each skill is a directory with a \`SKILL.md\` file and YAML frontmatter (\`name\`, \`description\`).

**Total active skills:** ${dirs.length} (exact count matching disk).

For command documentation see [COMMAND_GUIDE.md](./COMMAND_GUIDE.md). For workspace guide behavior see **\`gf-guide\`**.

---

## Active Skills Registry (${dirs.length})

| Skill Folder | Description |
| :--- | :--- |
${rows.join('\n')}

---

## How Skills Work

1. Agents match incoming tasks to skill **descriptions** in frontmatter.
2. The matched skill instructions load into context (patterns, checklists, templates, constraints).
3. Workflows directly reference relevant domain skills by their directory folder name.
`;

fs.writeFileSync(OUTPUT_FILE, content, 'utf8');
console.log(`Generated ${OUTPUT_FILE} with ${dirs.length} active skills.`);
