#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');

function fail(message) {
  console.error(`❌ changelog check failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(changelogPath)) {
  fail('CHANGELOG.md not found at repository root.');
}

const content = fs.readFileSync(changelogPath, 'utf8');

const unreleasedMatch = content.match(
  /## \[Unreleased\]([\s\S]*?)(?:\n---\n|\n## \[|$)/
);
if (!unreleasedMatch) {
  fail('missing `## [Unreleased]` section.');
}

const unreleasedBody = unreleasedMatch[1];
const requiredSections = ['Workspace', 'AI Tools', 'Apps'];

for (const section of requiredSections) {
  if (!new RegExp(`^### ${section}$`, 'm').test(unreleasedBody)) {
    fail(`missing required subsection: \`### ${section}\`.`);
  }
}

const headingMatches = unreleasedBody.match(/^###\s+.+$/gm) || [];
const invalidHeadings = headingMatches.filter((heading) => {
  const clean = heading.replace(/^###\s+/, '').trim();
  return !requiredSections.includes(clean);
});

if (invalidHeadings.length > 0) {
  fail(
    `unexpected unreleased headings: ${invalidHeadings.join(
      ', '
    )}. Allowed: Workspace, AI Tools, Apps.`
  );
}

const hasBullet = /-\s+\*\*\[[^\]]+\]\*\*\s+.+/m.test(unreleasedBody);
if (!hasBullet) {
  fail(
    'unreleased section has no valid bullet in `- **[Tag]** description` format.'
  );
}

console.log('✅ changelog check passed.');
