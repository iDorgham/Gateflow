/**
 * Diagnostic: check user state and verify password
 * Run with: cd packages/db && npx tsx prisma/check-user.ts
 */

import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { verify } from '@node-rs/argon2';

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  const email = 'admin@selenadev.com';
  const password = 'password123';

  const user = await prisma.user.findFirst({
    where: { email },
    include: { role: true },
  });

  if (!user) {
    console.log('❌ User not found at all');
    return;
  }

  console.log('User found:');
  console.log('  id:', user.id);
  console.log('  email:', user.email);
  console.log('  deletedAt:', user.deletedAt);
  console.log('  roleId:', user.roleId);
  console.log('  role:', user.role ? user.role.name : '❌ MISSING ROLE');
  console.log('  passwordHash (first 30):', user.passwordHash.slice(0, 30));

  // Check with deletedAt: null (same as login route)
  const userStrict = await prisma.user.findFirst({
    where: { email, deletedAt: null },
    include: { role: true },
  });
  console.log('\nWith deletedAt:null filter:', userStrict ? '✅ found' : '❌ NOT FOUND (deletedAt is set!)');

  // Verify password
  try {
    const valid = await verify(user.passwordHash, password);
    console.log('\nPassword match:', valid ? '✅ correct' : '❌ WRONG');
  } catch (e) {
    console.log('\nPassword verify error:', e);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
