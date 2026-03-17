const { execSync } = require('child_process');

const command = process.argv[2];
const slug = process.argv[3];
const phase = process.argv[4];

if (!command || !slug || !phase) {
  console.error('Usage: node ralph-git.js <command> <slug> <phase>');
  process.exit(1);
}

const branchName = `dev/${slug}/phase-${phase}`;
const baseBranch = 'master';

try {
  switch (command) {
    case 'branch':
      console.log(`Creating/Switching to branch: ${branchName}`);
      try {
        execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
      } catch (e) {
        execSync(`git checkout ${branchName}`, { stdio: 'inherit' });
      }
      break;

    case 'commit':
      console.log(`Committing changes for ${slug} phase ${phase}`);
      execSync('git add .', { stdio: 'inherit' });
      execSync(`git commit -m "feat(${slug}): complete phase ${phase}"`, { stdio: 'inherit' });
      break;

    case 'merge':
      console.log(`Merging ${branchName} into ${baseBranch}`);
      execSync(`git checkout ${baseBranch}`, { stdio: 'inherit' });
      execSync(`git merge ${branchName}`, { stdio: 'inherit' });
      execSync(`git push origin ${baseBranch}`, { stdio: 'inherit' });
      break;

    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
} catch (error) {
  console.error(`Error during ${command}:`, error.message);
  process.exit(1);
}
