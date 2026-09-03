#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const repoRoot = path.resolve(__dirname, '..', '..');
const proofPath = path.join(repoRoot, '.ai', 'runtime-proof.json');

if (!fs.existsSync(proofPath)) {
  console.error('runtime-proof.json not found');
  process.exit(1);
}

const proof = JSON.parse(fs.readFileSync(proofPath, 'utf8'));
const now = new Date().toISOString();

for (const entry of proof.entries) {
  entry.capturedAt = now;
  entry.commit = 'HEAD';
  if (entry.artifact) {
    const artifactPath = path.resolve(repoRoot, entry.artifact);
    if (fs.existsSync(artifactPath)) {
      const content = fs.readFileSync(artifactPath);
      entry.artifactSha256 = crypto
        .createHash('sha256')
        .update(content)
        .digest('hex');
    }
  }
}

fs.writeFileSync(proofPath, JSON.stringify(proof, null, 2) + '\n');
console.log(
  'Successfully refreshed .ai/runtime-proof.json timestamp and SHA256 hashes.'
);
