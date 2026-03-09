import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Looking for duplicate compound projects (Selena Bay / Vernada)...');

  const projects = await prisma.project.findMany({
    where: {
      name: { in: ['Selena Bay', 'Vernada'] },
      deletedAt: null,
    },
    orderBy: { createdAt: 'asc' },
  });

  if (projects.length === 0) {
    console.log('✅ No matching projects found.');
    return;
  }

  const groups = new Map<string, typeof projects>();
  for (const p of projects) {
    const key = `${p.organizationId}:${p.name}`;
    const arr = groups.get(key) ?? [];
    arr.push(p);
    groups.set(key, arr);
  }

  for (const [key, group] of groups.entries()) {
    if (group.length <= 1) continue;
    const [canonical, ...duplicates] = group;
    console.log(
      `⚠️ Found ${group.length} projects for ${key}. Keeping ${canonical.id}, cleaning up ${duplicates
        .map((d) => d.id)
        .join(', ')}`
    );

    const duplicateIds = duplicates.map((d) => d.id);
    const now = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.gate.updateMany({
        where: { projectId: { in: duplicateIds } },
        data: { projectId: canonical.id },
      });

      await tx.unit.updateMany({
        where: { projectId: { in: duplicateIds } },
        data: { projectId: canonical.id },
      });

      await tx.qRCode.updateMany({
        where: { projectId: { in: duplicateIds } },
        data: { projectId: canonical.id },
      });

      await tx.project.updateMany({
        where: { id: { in: duplicateIds } },
        data: { deletedAt: now },
      });
    });

    console.log(`  ✅ Repointed related records and soft-deleted duplicates for ${key}`);
  }

  console.log('✅ Duplicate compound project cleanup finished.');
}

main()
  .catch((err) => {
    console.error('❌ Failed to fix duplicate compound projects:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

