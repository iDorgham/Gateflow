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

    // Map task to category (simplistic mapping for now). Checked in priority
    // order via else-if so the first, most-specific match wins — a chain of
    // independent `if`s would let a later, less-specific match silently
    // overwrite an earlier correct one (e.g. "fix docs prisma schema" would
    // land in Docs sync instead of Schema / DB / Prisma).
    // Short tokens (db/ci/cli) use word-boundary matching so "policy" ≠ "ci".
    const task = entry.task.toLowerCase();
    const hasWord = (word) => new RegExp(`\\b${word}\\b`, 'i').test(task);
    let matchedType = 'Quick structural check'; // Default
    if (hasWord('prisma') || hasWord('schema') || hasWord('db')) {
      matchedType = 'Schema / DB / Prisma';
    } else if (
      hasWord('ci') ||
      hasWord('deploy') ||
      hasWord('turbo') ||
      hasWord('github') ||
      hasWord('workflow')
    ) {
      // CI markers must beat generic "fix" so deploy/CI outcomes don't land
      // in Refactor / TDD.
      matchedType = 'CI / headless automation';
    } else if (hasWord('refactor') || hasWord('fix') || hasWord('tdd')) {
      matchedType = 'Refactor / TDD';
    } else if (hasWord('seo') || hasWord('content') || hasWord('blog')) {
      matchedType = 'Content / SEO draft';
    } else if (hasWord('docs') || hasWord('readme')) {
      matchedType = 'Docs sync from code';
    } else if (
      hasWord('agent') ||
      hasWord('autonomous') ||
      hasWord('multi-step')
    ) {
      matchedType = 'Free-tier agentic';
    } else if (hasWord('terminal') || hasWord('cli')) {
      matchedType = 'Free-tier fast terminal tasks';
    }

    const counts = scoreboard[matchedType][matchedCli];
    if (entry.outcome === 'success') counts.wins++;
    else if (entry.outcome === 'partial') counts.partials++;
    else if (entry.outcome === 'fail') counts.fails++;
  });

  return scoreboard;
}

// Category defaults from CLI_TOOL_MEMORY.md / TOOL_AND_CLI_REFERENCE.md when
// a row has no scored observations yet.
const CATEGORY_DEFAULTS = {
  'Schema / DB / Prisma': 'Gemini',
  'Refactor / TDD': 'Opencode',
  'Content / SEO draft': 'Kiro',
  'Quick structural check': 'Gemini',
  'Free-tier agentic': 'Qwen',
  'Free-tier fast terminal tasks': 'Kilo',
  'Docs sync from code': 'Opencode',
  'CI / headless automation': 'Opencode',
};

function updateMemoryFile(scoreboard) {
  let content = fs.readFileSync(TOOL_MEMORY_PATH, 'utf8');

  // Replace the scoreboard table
  const lines = content.split('\n');
  const startIdx = lines.findIndex((l) => l.includes('| Task type'));
  let endIdx = lines.findIndex((l, i) => i > startIdx && l.trim() === '');
  if (startIdx !== -1 && endIdx === -1) {
    console.warn(
      '⚠ Scoreboard table has no trailing blank line; writing through EOF.'
    );
    endIdx = lines.length;
  }

  if (startIdx === -1 || endIdx === -1) {
    console.warn(
      '⚠ Could not locate scoreboard table in CLI_TOOL_MEMORY.md; skipped write.'
    );
    return false;
  }

  const newRows = Object.entries(scoreboard).map(([type, clis]) => {
    const g = `${clis.Gemini.wins}/${clis.Gemini.partials}/${clis.Gemini.fails}`;
    const o = `${clis.Opencode.wins}/${clis.Opencode.partials}/${clis.Opencode.fails}`;
    const kr = `${clis.Kiro.wins}/${clis.Kiro.partials}/${clis.Kiro.fails}`;
    const kl = `${clis.Kilo.wins}/${clis.Kilo.partials}/${clis.Kilo.fails}`;
    const q = `${clis.Qwen.wins}/${clis.Qwen.partials}/${clis.Qwen.fails}`;

    // Determine Best for — use category-specific default when no evidence.
    let best = CATEGORY_DEFAULTS[type] || 'Gemini';
    const scores = Object.entries(clis).map(([name, s]) => ({
      name,
      score: s.wins * 2 + s.partials,
    }));
    scores.sort((a, b) => b.score - a.score);
    if (scores[0].score > 0) best = scores[0].name;

    // Pad to header widths: Gemini=6, Best for=8
    return `| ${type.padEnd(29)} | ${g.padEnd(6)} | ${o.padEnd(8)} | ${kr.padEnd(5)} | ${kl.padEnd(5)} | ${q.padEnd(5)} | ${best.padEnd(8)} |`;
  });

  lines.splice(startIdx + 2, endIdx - (startIdx + 2), ...newRows);
  content = lines.join('\n');
  fs.writeFileSync(TOOL_MEMORY_PATH, content, 'utf8');
  return true;
}

// --- Main Execution ---

async function run() {
  console.log('🚀 Starting Memory Aggregation...');

  try {
    if (!fs.existsSync(USAGE_LOG_PATH)) {
      console.error('❌ Usage log not found at:', USAGE_LOG_PATH);
      process.exitCode = 1;
      return;
    }

    const usageContent = fs.readFileSync(USAGE_LOG_PATH, 'utf8');
    const logData = parseUsageLog(usageContent);
    console.log(`📊 Found ${logData.length} entries in usage log.`);

    const scoreboard = tallyResults(logData);
    const updated = updateMemoryFile(scoreboard);
    if (updated) {
      console.log('✅ Updated CLI_TOOL_MEMORY.md scoreboard.');
    } else {
      console.error('❌ Failed to update CLI_TOOL_MEMORY.md scoreboard.');
      process.exitCode = 1;
    }

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
    process.exitCode = 1;
  }
}

run();
