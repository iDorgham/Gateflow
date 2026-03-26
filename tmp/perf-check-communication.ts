import { PrismaClient } from '@gate-access/db';
import { performance } from 'perf_hooks';

async function main() {
  const prisma = new PrismaClient();
  const orgId = 'cmn7gitz60000xeo8ydw6ugvl'; // Valid Org ID from database

  console.log(
    `🚀 Starting CommunicationLog performance simulation (10k writes) for org ${orgId}...`
  );

  const start = performance.now();
  const batchSize = 1000;
  const total = 10000;

  for (let i = 0; i < total; i += batchSize) {
    const data = Array.from({ length: batchSize }).map((_, j) => ({
      organizationId: orgId,
      provider: 'perf-test',
      type: 'INVITATION',
      status: 'SENT',
      createdAt: new Date(),
    }));

    await prisma.communicationLog.createMany({
      data,
    });
    console.log(`✅ Progress: ${i + batchSize}/${total}`);
  }

  const end = performance.now();
  const totalWriteTime = end - start;
  console.log(
    `⏱️ Total write time: ${totalWriteTime.toFixed(2)}ms (${(totalWriteTime / total).toFixed(2)}ms per write)`
  );

  console.log('\n🔍 Testing traversal performance (tenant query)...');
  const queryStart = performance.now();
  const logs = await prisma.communicationLog.findMany({
    where: { organizationId: orgId },
    take: 50,
    orderBy: { createdAt: 'desc' },
  });
  const queryEnd = performance.now();
  console.log(
    `⏱️ Query time (findMany 50): ${(queryEnd - queryStart).toFixed(2)}ms`
  );

  const countStart = performance.now();
  const counts = await prisma.communicationLog.count({
    where: { organizationId: orgId },
  });
  const countEnd = performance.now();
  console.log(
    `⏱️ Query time (count): ${(countEnd - countStart).toFixed(2)}ms for ${counts} records`
  );

  // Cleanup
  console.log('\n🧹 Cleaning up test data...');
  await prisma.communicationLog.deleteMany({
    where: { organizationId: orgId, provider: 'perf-test' },
  });

  await prisma.$disconnect();
}

main().catch(console.error);
