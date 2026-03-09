import { prisma } from '../src';

async function main() {
  const orgs = await prisma.organization.findMany({
    where: { deletedAt: null },
    take: 3,
    orderBy: { createdAt: 'asc' },
  });

  console.log(
    'Organizations:',
    orgs.map((o) => ({ id: o.id, email: o.email }))
  );

  for (const org of orgs) {
    console.log('--- Testing org', org.id, org.email);
    try {
      const result = await prisma.qRCode.findMany({
        where: {
          organizationId: org.id,
          deletedAt: null,
        },
        orderBy: [
          { createdAt: 'desc' },
          { code: 'asc' },
        ],
        take: 5,
        include: {
          _count: { select: { scanLogs: true } },
          gate: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } },
          contact: { select: { id: true, firstName: true, lastName: true } },
          unit: { select: { id: true, name: true } },
          scanLogs: {
            orderBy: { scannedAt: 'desc' },
            take: 1,
            select: { scannedAt: true },
          },
        },
      });

      console.log('  QR count:', result.length);
      if (result[0]) {
        console.log('  Sample QR:', {
          id: result[0].id,
          code: result[0].code,
          type: result[0].type,
          createdAt: result[0].createdAt,
        });
      }
    } catch (error) {
      console.error('  Error fetching QR codes for org', org.id, error);
    }
  }
}

main()
  .catch((error) => {
    console.error('Fatal error in debug-qrcodes script:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

