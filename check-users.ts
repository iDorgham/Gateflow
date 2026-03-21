import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ select: { email: true } });
  console.log('Users in DB:', users);
  const orgs = await prisma.organization.findMany({ select: { id: true, name: true, pixelMetaId: true, pixelGtmId: true } });
  console.log('Orgs in DB:', orgs);
}
main().finally(() => prisma.$disconnect());
