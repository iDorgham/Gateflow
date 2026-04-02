/**
 * Prisma seed entry (Phase 9): argv routing for legacy seed, integrity, emulation.
 *
 * Configure in package.json: "prisma": { "seed": "npx tsx prisma/seed-entry.ts" }
 */
import { config } from 'dotenv';

config();

async function main(): Promise<void> {
  const { prisma } = await import('../src/client');
  const { executeSeedCli } = await import('../src/lib/seed-cli-run');
  const { runLegacyDevSeed } = await import('../src/legacy-dev-seed');

  const argv = process.argv.slice(2);
  try {
    await executeSeedCli(argv, { prisma, runLegacyDevSeed });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('[seed-entry]', e instanceof Error ? e.message : e);
  process.exit(1);
});
