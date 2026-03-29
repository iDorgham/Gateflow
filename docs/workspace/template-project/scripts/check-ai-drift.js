#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TEMPLATE_ROOT = path.resolve(__dirname, '..');
const OPS_CORE_ROOT = path.join(TEMPLATE_ROOT, 'ops-core');

const MAPPINGS = [
  { source: 'cursor', target: '.cursor' },
  { source: 'claude', target: '.claude' },
  { source: 'antigravity', target: '.antigravity' },
  { source: 'gemini', target: '.gemini' },
  { source: 'opencode', target: '.opencode' },
];

function hashFile(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex');
}

function listFilesRecursive(rootDir) {
  if (!fs.existsSync(rootDir)) return [];
  const out = [];

  function walk(current, relBase) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const abs = path.join(current, entry.name);
      const rel = path.join(relBase, entry.name);
      if (entry.isDirectory()) {
        walk(abs, rel);
      } else {
        out.push(rel);
      }
    }
  }

  walk(rootDir, '');
  return out.sort();
}

function checkPair(mapping) {
  const sourceRoot = path.join(OPS_CORE_ROOT, mapping.source);
  const targetRoot = path.join(TEMPLATE_ROOT, mapping.target);
  const issues = []; // hard errors — break CI
  const warnings = []; // soft warnings — informational only

  if (!fs.existsSync(sourceRoot)) {
    issues.push(`Missing source: ops-core/${mapping.source}`);
    return { issues, warnings };
  }
  if (!fs.existsSync(targetRoot)) {
    issues.push(`Missing target: ${mapping.target}`);
    return { issues, warnings };
  }

  const sourceFiles = listFilesRecursive(sourceRoot);
  const targetFiles = listFilesRecursive(targetRoot);
  const sourceSet = new Set(sourceFiles);
  const targetSet = new Set(targetFiles);

  // Hard errors: files that should exist in target but are absent or have drifted
  for (const rel of sourceFiles) {
    if (!targetSet.has(rel)) {
      issues.push(`${mapping.target}: missing file ${rel}`);
      continue;
    }
    const sourceHash = hashFile(path.join(sourceRoot, rel));
    const targetHash = hashFile(path.join(targetRoot, rel));
    if (sourceHash !== targetHash) {
      issues.push(`${mapping.target}: content drift in ${rel}`);
    }
  }

  // Soft warnings: extra files in target that don't exist in source.
  // These are project-specific customisations or IDE-generated files — not errors.
  for (const rel of targetFiles) {
    if (!sourceSet.has(rel)) {
      warnings.push(`${mapping.target}: extra file (not in ops-core) ${rel}`);
    }
  }

  return { issues, warnings };
}

function main() {
  const allIssues = [];
  const allWarnings = [];

  for (const mapping of MAPPINGS) {
    const { issues, warnings } = checkPair(mapping);
    allIssues.push(...issues);
    allWarnings.push(...warnings);
  }

  if (allWarnings.length > 0) {
    console.warn('AI folder warnings (non-blocking):');
    for (const w of allWarnings) console.warn(`  ⚠ ${w}`);
  }

  if (allIssues.length > 0) {
    console.error('\nAI folder drift detected (hard errors):');
    for (const issue of allIssues) console.error(`  ✗ ${issue}`);
    process.exit(1);
  }

  console.log('No AI folder drift detected.');
}

main();
