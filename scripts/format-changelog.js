#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');

if (!fs.existsSync(changelogPath)) {
  console.error(
    '❌ changelog formatter failed: CHANGELOG.md not found at repo root.'
  );
  process.exit(1);
}

const TAG_CASE_MAP = new Map([
  ['ai', 'AI'],
  ['ai sdk v6', 'AI SDK v6'],
  ['admin', 'Admin'],
  ['apps version', 'Apps Version'],
  ['assets', 'Assets'],
  ['automation', 'Automation'],
  ['build', 'Build'],
  ['cert', 'Cert'],
  ['ci', 'CI'],
  ['client', 'Client'],
  ['crm', 'CRM'],
  ['db', 'DB'],
  ['deps', 'Deps'],
  ['dev', 'Dev'],
  ['docs', 'Docs'],
  ['github security hardening', 'GitHub Security Hardening'],
  ['maintenance', 'Maintenance'],
  ['maintenance management', 'Maintenance Management'],
  ['marketing', 'Marketing'],
  ['pagespeed', 'PageSpeed'],
  ['pagespeed 100', 'PageSpeed 100'],
  ['perf', 'Perf'],
  ['plan', 'Plan'],
  ['projects crm', 'Projects CRM'],
  ['release notes', 'Release Notes'],
  ['resident mobile one tap', 'Resident Mobile One Tap'],
  ['resident-mobile', 'Resident-Mobile'],
  ['security', 'Security'],
  ['security isolation fix', 'Security Isolation Fix'],
  ['tools', 'Tools'],
  ['typecheck', 'Typecheck'],
  ['ui', 'UI'],
  ['workspace', 'Workspace'],
  ['workspace docs', 'Workspace Docs'],
  ['workspace version', 'Workspace Version'],
]);

function normalizeTag(rawTag) {
  const cleaned = rawTag.replace(/\s+/g, ' ').trim();
  const key = cleaned.toLowerCase();
  return TAG_CASE_MAP.get(key) || cleaned;
}

const original = fs.readFileSync(changelogPath, 'utf8');

const formatted = original
  .replace(/\*\*\[([^\]]+)\]\s*\*\*/g, (_, tag) => `**[${normalizeTag(tag)}]**`)
  .replace(/^(\s*-\s+\*\*\[[^\]]+\]\*\*)(\S)/gm, '$1 $2');

if (formatted === original) {
  console.log('✅ changelog already normalized.');
  process.exit(0);
}

fs.writeFileSync(changelogPath, formatted, 'utf8');
console.log('✅ changelog formatting updated (tag casing + spacing).');
