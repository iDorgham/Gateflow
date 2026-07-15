const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@selenadev.com';
  const user = await prisma.user.findFirst({
    where: { email },
    include: { role: true },
  });

  if (!user) {
    console.log('❌ User not found');
  } else {
    console.log('✅ User found:', user.email, 'Role:', user.role?.name);
    console.log('   DeletedAt:', user.deletedAt);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
