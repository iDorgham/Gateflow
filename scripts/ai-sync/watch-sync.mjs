#!/usr/bin/env node
/**
 * watch-sync.mjs — Auto-sync AI tools on workspace/workflow changes.
 * Watches .antigravity/ (skills, commands, agents, workflows) and
 * re-runs sync-ai-tools.sh on any file change.
 *
 * Usage:
 *   pnpm sync:watch
 *   node scripts/watch-sync.mjs
 *   node scripts/watch-sync.mjs --tool claude   (sync one tool only)
 */

import { watch } from 'fs';
import { execSync } from 'child_process';
import { resolve, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, '../..');
const WATCH_DIR = resolve(ROOT, '.antigravity');
const TOOL_ARG = process.argv.includes('--tool')
  ? `--tool ${process.argv[process.argv.indexOf('--tool') + 1]}`
  : '';

const DEBOUNCE_MS = 400;
let timer = null;
let lastFile = '';

function sync() {
  const label = lastFile ? ` (triggered by ${lastFile})` : '';
  console.log(`\n🔄  Syncing AI tools${label}…`);
  try {
    execSync(`bash scripts/ai-sync/sync-ai-tools.sh ${TOOL_ARG}`.trim(), {
      cwd: ROOT,
      stdio: 'inherit',
    });
    console.log('✅  Sync complete\n');
  } catch {
    console.error('❌  Sync failed — check sync-ai-tools.sh output above\n');
  }
}

console.log(`👀  Watching ${relative(ROOT, WATCH_DIR)} for changes…`);
console.log('    Press Ctrl+C to stop.\n');

// Run once on start so tools are in sync immediately
sync();

watch(WATCH_DIR, { recursive: true }, (_event, filename) => {
  if (!filename) return;
  lastFile = filename;
  clearTimeout(timer);
  timer = setTimeout(sync, DEBOUNCE_MS);
});
