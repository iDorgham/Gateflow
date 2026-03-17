import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  // skip-organization-check (Internal Security Verification Script)
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log('❌ User not found');
    return;
  }
  
  console.log('Found user:', user.email);
  
  const password = process.env.VERIFY_PASSWORD || 'password123';
  const isValid = await argon2.verify(user.passwordHash, password);
  
  console.log('Verification result:', isValid ? '✅ VALID' : '❌ INVALID');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
