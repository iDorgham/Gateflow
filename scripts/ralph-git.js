#!/usr/bin/env node

/**
 * Ralph Git Automation (v9.0)
 * Logic: Automates branching, committing, and merging for GateFlow plan phases.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const action = process.argv[2];
const slug = process.argv[3];
const phase = process.argv[4];

if (!action || !slug || !phase) {
  console.error('Usage: node scripts/ralph-git.js <branch|commit|merge> <slug> <phase>');
  process.exit(1);
}

const branchName = `feat/${slug}-phase-${phase}`;
const baseBranch = 'master'; // Matches repository base branch

function run(command) {
  try {
    console.log(`Executing: ${command}`);
    return execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
}

switch (action) {
  case 'branch':
    console.log(`Creating/Switching to branch: ${branchName}`);
    run(`git checkout ${baseBranch} && git pull origin ${baseBranch}`);
    run(`git checkout -b ${branchName} || git checkout ${branchName}`);
    break;

  case 'commit':
    console.log(`Committing changes for ${slug} Phase ${phase}...`);
    run(`git add -A`);
    run(`git commit -m "feat(${slug}): Phase ${phase} completion (Ralph Verified)"`);
    run(`git push -u origin ${branchName}`);
    break;

  case 'merge':
    console.log(`Merging ${branchName} into ${baseBranch}...`);
    run(`git checkout ${baseBranch}`);
    run(`git merge --no-ff ${branchName} -m "chore(merge): integrate ${slug} phase ${phase}"`);
    run(`git push origin ${baseBranch}`);
    run(`git branch -d ${branchName}`);
    break;

  default:
    console.error(`Unknown action: ${action}`);
    process.exit(1);
}
