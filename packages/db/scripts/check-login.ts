import { PrismaClient } from '@prisma/client';
import { verify } from '@node-rs/argon2';

const prisma = new PrismaClient();

async function check(email: string, pass: string) {
  const user = await prisma.user.findFirst({ where: { email, deletedAt: null } });
  if (!user) {
    console.log('User not found');
    return;
  }
  if (!user.passwordHash) {
    console.log('User has no password hash');
    return;
  }
  const match = await verify(user.passwordHash, pass);
  console.log(`Email: ${email}, Match: ${match}`);
}

const email = process.argv[2];
const pass = process.argv[3];

if (!email || !pass) {
  console.log('Usage: npx tsx check-login.ts <email> <password>');
  process.exit(1);
}

check(email, pass).catch(console.error).finally(() => prisma.$disconnect());
