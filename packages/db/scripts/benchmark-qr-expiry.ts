import { prisma } from '../src/client';

/**
 * Benchmark Script for QR Code Expiry Query
 *
 * This script benchmarks the performance of querying for expired QR codes.
 * It simulates the query found in `apps/client-dashboard/src/app/api/notifications/expired-qrs/route.ts`.
 *
 * Usage:
 * 1. Ensure DATABASE_URL is set in your environment.
 * 2. Run `pnpm db:generate` to generate the Prisma client.
 * 3. Run this script using `ts-node` or `tsx`.
 *    e.g., `pnpm tsx packages/db/scripts/benchmark-qr-expiry.ts`
 */

async function main() {
  console.log('Starting benchmark...');

  // Create a unique organization for testing
  const orgName = `BenchmarkOrg_${Date.now()}`;
  const org = await prisma.organization.create({
    data: {
      name: orgName,
      email: `benchmark_${Date.now()}@example.com`,
    },
  });

  console.log(`Created organization: ${org.id}`);

  try {
    const totalQRs = 10000;
    const batchSize = 1000;
    console.log(`Seeding ${totalQRs} QR codes...`);

    const now = new Date();
    const past = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30); // 30 days ago
    const future = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30); // 30 days future

    for (let i = 0; i < totalQRs; i += batchSize) {
      const data = [];
      for (let j = 0; j < batchSize; j++) {
        if (i + j >= totalQRs) break;

        const isExpired = Math.random() < 0.5;
        // Random date between past and now for expired, now and future for active
        const expiresAt = isExpired
          ? new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()))
          : new Date(now.getTime() + Math.random() * (future.getTime() - now.getTime()));

        data.push({
          code: `bench_${org.id}_${i + j}`,
          type: 'SINGLE' as const,
          organizationId: org.id,
          expiresAt,
          isActive: true,
        });
      }

      // Note: createMany is generally more performant for seeding
      await prisma.qRCode.createMany({
        data,
      });
      console.log(`Seeded ${Math.min(i + batchSize, totalQRs)}/${totalQRs}`);
    }

    console.log('Seeding complete. Running benchmark queries...');

    // Warmup query
    await runQuery(org.id);

    // Measure multiple runs
    const iterations = 5;
    let totalTime = 0;

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await runQuery(org.id);
      const end = performance.now();
      const duration = end - start;
      console.log(`Run ${i + 1}: ${duration.toFixed(2)}ms`);
      totalTime += duration;
    }

    console.log(`Average time: ${(totalTime / iterations).toFixed(2)}ms`);

  } catch (error) {
    console.error('Benchmark error:', error);
  } finally {
    console.log('Cleaning up...');
    // Clean up all data for this org (cascade deletes QR codes)
    try {
        await prisma.organization.delete({
            where: { id: org.id },
        });
    } catch (e) {
        console.error('Cleanup failed:', e);
    }
    console.log('Cleanup complete.');
  }
}

async function runQuery(orgId: string) {
  // Simulating the query from apps/client-dashboard/src/app/api/notifications/expired-qrs/route.ts
  const now = new Date();

  return await prisma.qRCode.findMany({
    where: {
      organizationId: orgId,
      deletedAt: null,
      isActive: true,
      expiresAt: { lte: now },
    },
    select: {
      id: true,
      code: true,
      expiresAt: true,
      gate: { select: { name: true } },
      project: { select: { name: true } },
    },
    orderBy: { expiresAt: 'desc' },
    take: 10,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
