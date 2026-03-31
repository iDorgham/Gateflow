const { execSync } = require('child_process');

const command = process.argv[2];
const slug = process.argv[3];
const phase = process.argv[4];

if (!command || !slug || (command !== 'status' && !phase)) {
  console.error('Usage: node ralph-git.js <command> <slug> <phase>');
  process.exit(1);
}

const branchName = `feat/${slug}-phase-${phase}`;
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
      execSync(`git commit -m "feat(${slug}): complete phase ${phase}"`, {
        stdio: 'inherit',
      });
      break;

    case 'merge':
      console.log(`Merging ${branchName} into ${baseBranch}`);
      execSync(`git checkout ${baseBranch}`, { stdio: 'inherit' });
      execSync(`git merge ${branchName}`, { stdio: 'inherit' });
      execSync(`git push origin ${baseBranch}`, { stdio: 'inherit' });
      break;

    case 'tag': {
      const tagNameInput = process.argv[5] || 'stable';
      // Sanitize: allow only alphanumeric, dashes, and dots
      const tagName = tagNameInput.replace(/[^a-zA-Z0-9.-]/g, '-');
      const fullTagName = `v${slug}-p${phase}-${tagName}`;

      console.log(`Ensuring tag: ${fullTagName}`);
      try {
        // Attempt to delete locally first to allow overwriting/fresh tag
        execSync(`git tag -d ${fullTagName}`, { stdio: 'ignore' });
      } catch (e) {
        // Tag didn't exist locally, that's fine
      }

      try {
        execSync(
          `git tag -a ${fullTagName} -m "Phase ${phase} complete: ${tagName}"`,
          { stdio: 'inherit' }
        );
        console.log(`Pushing tag to origin...`);
        // Use --force to ensure remote is updated if we are re-tagging a phase
        execSync(`git push origin ${fullTagName} --force`, {
          stdio: 'inherit',
        });
      } catch (error) {
        console.error(`Failed to create or push tag:`, error.message);
        process.exit(1);
      }
      break;
    }

    case 'status': {
      console.log(`--- Ralph Status: ${slug} ---`);
      const currentBranch = execSync('git rev-parse --abbrev-ref HEAD')
        .toString()
        .trim();
      console.log(`Current Branch: ${currentBranch}`);

      try {
        const lastTag = execSync(
          `git tag -l "v${slug}-p*" | sort -V | tail -n 1`
        )
          .toString()
          .trim();
        if (lastTag) {
          console.log(`Last Completed Phase Tag: ${lastTag}`);
          const match = lastTag.match(/-p(\d+)-/);
          if (match) {
            console.log(`Next Suggested Phase: ${parseInt(match[1]) + 1}`);
          }
        } else {
          console.log(`No phases completed yet for ${slug}.`);
          console.log(`Next Suggested Phase: 1`);
        }
      } catch (e) {
        console.log(`Could not determine phase status.`);
      }
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
} catch (error) {
  console.error(`Error during ${command}:`, error.message);
  process.exit(1);
}
