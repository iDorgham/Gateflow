/**
 * Standalone legacy dev seed (back-compat).
 * Prefer `pnpm prisma db seed` → `prisma/seed-entry.ts` (Phase 9 router).
 */
import { prisma } from '../src/client';
import { runLegacyDevSeed } from '../src/legacy-dev-seed';

runLegacyDevSeed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
