import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * memory-aggregator.js — Automated synthesis of CLI usage logs into tool memory.
 *
 * This script automates the process defined in .antigravity/skills/cli-memory/SKILL.md.
 * It reads CLI_USAGE_AND_RESULTS.md, tallies wins/partials/fails, and updates
 * CLI_TOOL_MEMORY.md and the continual-learning-index.json.
 */

const __dir = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dir, '../..');

const USAGE_LOG_PATH = path.resolve(
  ROOT,
  'docs/development/learning/CLI_USAGE_AND_RESULTS.md'
);
const TOOL_MEMORY_PATH = path.resolve(
  ROOT,
  'docs/development/learning/CLI_TOOL_MEMORY.md'
);
const INDEX_PATH = path.resolve(
  ROOT,
  '.cursor/hooks/state/continual-learning-index.json'
);
const STATE_PATH = path.resolve(
  ROOT,
  '.cursor/hooks/state/continual-learning.json'
);

// --- Helper Functions ---

function getTimestamp() {
  return new Date().toISOString();
}

function parseUsageLog(content) {
  const lines = content.split('\n');
  const results = [];

  // Match table rows: | Date | CLI | Task / phase | Outcome | Notes |
  const tableRegex =
    /^\|\s*([\d-]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(success|partial|fail)\s*\|\s*([^|]*)\s*\|/i;

  // Match bullet points: - **YYYY-MM-DD** | **CLI** | Task | Outcome | Notes
  const bulletRegex =
    /^-\s+\*\*([\d-]+)\*\*\s+\|\s+\*\*([^|]+)\*\*\s+\|\s+([^|]+)\s+\|\s+(success|partial|fail)\s+\|\s+(.*)/i;

  for (const line of lines) {
    let match = line.match(tableRegex);
    if (match) {
      results.push({
        date: match[1].trim(),
        cli: match[2].trim(),
        task: match[3].trim(),
        outcome: match[4].trim().toLowerCase(),
        notes: match[5].trim(),
      });
      continue;
    }

    match = line.match(bulletRegex);
    if (match) {
      results.push({
        date: match[1].trim(),
        cli: match[2].trim(),
        task: match[3].trim(),
        outcome: match[4].trim().toLowerCase(),
        notes: match[5].trim(),
      });
    }
  }

  return results;
}

function tallyResults(data) {
  const scoreboard = {};
  const taskTypes = [
    'Schema / DB / Prisma',
    'Refactor / TDD',
    'Content / SEO draft',
    'Quick structural check',
    'Free-tier agentic',
    'Free-tier fast terminal tasks',
    'Docs sync from code',
    'CI / headless automation',
  ];

  const clis = ['Gemini', 'Opencode', 'Kiro', 'Kilo', 'Qwen'];

  // Initialize empty scoreboard
  taskTypes.forEach((type) => {
    scoreboard[type] = {};
    clis.forEach((cli) => {
      scoreboard[type][cli] = { wins: 0, partials: 0, fails: 0 };
    });
  });

  data.forEach((entry) => {
    if (entry.cli.toLowerCase().includes('claude')) return; // Exclude Claude from competition

    // Normalize CLI name
    const matchedCli = clis.find((c) =>
      entry.cli.toLowerCase().includes(c.toLowerCase())
    );
    if (!matchedCli) return;

    // Map task to category (simplistic mapping for now)
    let matchedType = 'Quick structural check'; // Default
    if (
      entry.task.toLowerCase().includes('prisma') ||
      entry.task.toLowerCase().includes('schema') ||
      entry.task.toLowerCase().includes('db')
    )
      matchedType = 'Schema / DB / Prisma';
    if (
      entry.task.toLowerCase().includes('refactor') ||
      entry.task.toLowerCase().includes('fix')
    )
      matchedType = 'Refactor / TDD';
    if (
      entry.task.toLowerCase().includes('seo') ||
      entry.task.toLowerCase().includes('content') ||
      entry.task.toLowerCase().includes('blog')
    )
      matchedType = 'Content / SEO draft';
    if (
      entry.task.toLowerCase().includes('docs') ||
      entry.task.toLowerCase().includes('readme')
    )
      matchedType = 'Docs sync from code';
    if (
      entry.task.toLowerCase().includes('ci') ||
      entry.task.toLowerCase().includes('deploy') ||
      entry.task.toLowerCase().includes('turbo')
    )
      matchedType = 'CI / headless automation';

    const counts = scoreboard[matchedType][matchedCli];
    if (entry.outcome === 'success') counts.wins++;
    else if (entry.outcome === 'partial') counts.partials++;
    else if (entry.outcome === 'fail') counts.fails++;
  });

  return scoreboard;
}

function updateMemoryFile(scoreboard) {
  let content = fs.readFileSync(TOOL_MEMORY_PATH, 'utf8');

  // Replace the scoreboard table
  const lines = content.split('\n');
  const startIdx = lines.findIndex((l) => l.includes('| Task type'));
  const endIdx = lines.findIndex((l, i) => i > startIdx && l.trim() === '');

  if (startIdx !== -1 && endIdx !== -1) {
    const header = lines[startIdx];
    const divider = lines[startIdx + 1];
    const newRows = Object.entries(scoreboard).map(([type, clis]) => {
      const g = `${clis.Gemini.wins}/${clis.Gemini.partials}/${clis.Gemini.fails}`;
      const o = `${clis.Opencode.wins}/${clis.Opencode.partials}/${clis.Opencode.fails}`;
      const kr = `${clis.Kiro.wins}/${clis.Kiro.partials}/${clis.Kiro.fails}`;
      const kl = `${clis.Kilo.wins}/${clis.Kilo.partials}/${clis.Kilo.fails}`;
      const q = `${clis.Qwen.wins}/${clis.Qwen.partials}/${clis.Qwen.fails}`;

      // Determine Best for
      let best = 'Gemini'; // Fallback
      const scores = Object.entries(clis).map(([name, s]) => ({
        name,
        score: s.wins * 2 + s.partials,
      }));
      scores.sort((a, b) => b.score - a.score);
      if (scores[0].score > 0) best = scores[0].name;

      return `| ${type.padEnd(29)} | ${g.padEnd(5)} | ${o.padEnd(8)} | ${kr.padEnd(5)} | ${kl.padEnd(5)} | ${q.padEnd(5)} | ${best.padEnd(28)} |`;
    });

    lines.splice(startIdx + 2, endIdx - (startIdx + 2), ...newRows);
    content = lines.join('\n');
  }

  fs.writeFileSync(TOOL_MEMORY_PATH, content, 'utf8');
}

// --- Main Execution ---

async function run() {
  console.log('🚀 Starting Memory Aggregation...');

  try {
    if (!fs.existsSync(USAGE_LOG_PATH)) {
      console.error('❌ Usage log not found at:', USAGE_LOG_PATH);
      return;
    }

    const usageContent = fs.readFileSync(USAGE_LOG_PATH, 'utf8');
    const logData = parseUsageLog(usageContent);
    console.log(`📊 Found ${logData.length} entries in usage log.`);

    const scoreboard = tallyResults(logData);
    updateMemoryFile(scoreboard);
    console.log('✅ Updated CLI_TOOL_MEMORY.md scoreboard.');

    // Update Index
    if (fs.existsSync(INDEX_PATH)) {
      const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
      index.updatedAt = getTimestamp();
      fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2), 'utf8');
      console.log('✅ Updated continual-learning-index.json timestamp.');
    }

    // Update State
    if (fs.existsSync(STATE_PATH)) {
      const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
      state.lastRunAtMs = Date.now();
      state.turnsSinceLastRun = 0;
      fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
      console.log('✅ Updated continual-learning.json state.');
    }

    console.log('🏁 Memory Aggregation Complete.');
  } catch (error) {
    console.error('❌ Error during aggregation:', error);
  }
}

run();
