#!/usr/bin/env node
/**
 * upgrade.js — Workspace Template Version Migrator
 *
 * Compares installed template version against the current template
 * and reports what has changed or needs updating.
 *
 * Usage:
 *   node path/to/template-project/scripts/upgrade.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TARGET_ROOT = process.cwd();
const TEMPLATE_ROOT = path.resolve(__dirname, '..');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hashFile(p) {
  if (!fs.existsSync(p)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

function listFilesRecursive(root) {
  if (!fs.existsSync(root)) return [];
  const out = [];
  const walk = (dir, base) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      const rel = path.join(base, entry.name);
      if (entry.isDirectory()) walk(abs, rel);
      else out.push(rel);
    }
  };
  walk(root, '');
  return out.sort();
}

function readVersion(versionFile) {
  if (!fs.existsSync(versionFile)) return null;
  const raw = fs.readFileSync(versionFile, 'utf8');
  const match = raw.match(/Version:\s*([^\s\n]+)/);
  return match ? match[1] : null;
}

// ─── Diff Logic ───────────────────────────────────────────────────────────────

function diffDirectory(templateDir, targetDir, label) {
  const templateFiles = listFilesRecursive(templateDir);
  const added = [];
  const modified = [];
  const missing = [];

  for (const rel of templateFiles) {
    const templatePath = path.join(templateDir, rel);
    const targetPath = path.join(targetDir, rel);

    if (!fs.existsSync(targetPath)) {
      missing.push(rel);
    } else {
      const th = hashFile(templatePath);
      const ih = hashFile(targetPath);
      if (th !== ih) modified.push(rel);
    }
  }

  // Files in target that don't exist in template (custom additions)
  const targetFiles = listFilesRecursive(targetDir);
  const templateSet = new Set(templateFiles);
  for (const rel of targetFiles) {
    if (!templateSet.has(rel)) added.push(rel);
  }

  return { label, added, modified, missing };
}

// ─── Report ───────────────────────────────────────────────────────────────────

function printReport(results) {
  let totalChanges = 0;
  for (const r of results) {
    const changes = r.modified.length + r.missing.length;
    totalChanges += changes;
    if (changes === 0 && r.added.length === 0) {
      console.log(`  ✓ ${r.label} — up to date`);
      continue;
    }
    console.log(`\n  ${r.label}:`);
    for (const f of r.missing)
      console.log(`    + NEW in template (not installed): ${f}`);
    for (const f of r.modified) console.log(`    ~ Modified in template: ${f}`);
    for (const f of r.added)
      console.log(`    * Custom (only in your project): ${f}`);
  }
  return totalChanges;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log(
    '\n── Workspace Template Upgrade Check ──────────────────────────\n'
  );

  const templateVersion = readVersion(
    path.join(TEMPLATE_ROOT, 'docs/workspace/TEMPLATE_VERSION.md')
  );
  const installedVersion = readVersion(
    path.join(TARGET_ROOT, 'docs/workspace/TEMPLATE_VERSION.md')
  );

  console.log(`  Template version : ${templateVersion ?? 'unknown'}`);
  console.log(`  Installed version: ${installedVersion ?? 'not found'}`);

  if (
    templateVersion &&
    installedVersion &&
    templateVersion === installedVersion
  ) {
    console.log(
      '\n  ✓ Versions match — checking for file-level drift anyway...\n'
    );
  } else {
    console.log('\n  ⚠ Version mismatch — changes detected:\n');
  }

  const checks = [
    {
      templateDir: path.join(TEMPLATE_ROOT, 'ops-core'),
      targetDir: path.join(
        TARGET_ROOT,
        'docs/workspace/template-project/ops-core'
      ),
      label: 'ops-core/',
    },
    {
      templateDir: path.join(TEMPLATE_ROOT, 'scripts'),
      targetDir: path.join(
        TARGET_ROOT,
        'docs/workspace/template-project/scripts'
      ),
      label: 'scripts/',
    },
    {
      templateDir: path.join(TEMPLATE_ROOT, 'docs/workspace'),
      targetDir: path.join(TARGET_ROOT, 'docs/workspace'),
      label: 'docs/workspace/',
    },
  ];

  const results = checks.map(({ templateDir, targetDir, label }) =>
    diffDirectory(templateDir, targetDir, label)
  );

  const totalChanges = printReport(results);

  console.log(
    '\n──────────────────────────────────────────────────────────────'
  );
  if (totalChanges === 0) {
    console.log('  ✓ No changes to apply. Your installation is current.\n');
  } else {
    console.log(`  ${totalChanges} change(s) found.`);
    console.log(
      '  To apply: re-run node scripts/install.js or manually copy changed files.\n'
    );
  }
}

main();
