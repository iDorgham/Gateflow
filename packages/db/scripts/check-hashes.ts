import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    select: { id: true, email: true, passwordHash: true }
  });
  users.forEach(u => {
    console.log(`User: ${u.email}, HasHash: ${!!u.passwordHash}, HashPrefix: ${u.passwordHash?.slice(0, 10)}...`);
  });
}
main().catch(console.error).finally(() => prisma.$disconnect());
