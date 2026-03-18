/**
 * One-time script: create admin@selenadev.com with full permissions
 * Run with: cd packages/db && npx tsx prisma/create-user.ts
 */

import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { hash } from '@node-rs/argon2';

const prisma = new PrismaClient().$extends(withAccelerate());

const ARGON2_OPTIONS = {
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
};

const ALL_PERMISSIONS = {
  'gates:manage': true,
  'qr:create': true,
  'qr:manage': true,
  'scans:view': true,
  'scans:override': true,
  'workspace:manage': true,
  'roles:manage': true,
  'users:manage': true,
  'analytics:view': true,
  'projects:manage': true,
  'units:manage': true,
  'contacts:manage': true,
};

async function main() {
  const email = 'admin@selenadev.com';
  const password = 'password123';
  const name = 'Admin';

  // If user already exists, reset their password
  const existing = await prisma.user.findFirst({ where: { email } });
  if (existing) {
    const passwordHash = await hash(password, ARGON2_OPTIONS);
    await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash, deletedAt: null },
    });
    console.log(`✅ Password reset for ${email} (id: ${existing.id})`);
    console.log(`\n🎉 Done. Login with: ${email} / ${password}`);
    return;
  }

  // Create org
  const org = await prisma.organization.create({
    data: {
      name: 'Selena Dev',
      slug: 'selenadev',
    },
  });
  console.log(`✅ Created org: ${org.name} (${org.id})`);

  // Create default project for org
  await prisma.project.create({
    data: { name: 'Main', organizationId: org.id },
  });
  console.log(`✅ Created default project`);

  // Create role
  const role = await prisma.role.create({
    data: {
      name: 'Organization Admin',
      description: 'Full access admin',
      permissions: ALL_PERMISSIONS,
      isBuiltIn: true,
      organizationId: org.id,
    },
  });
  console.log(`✅ Created role: ${role.name} (${role.id})`);

  // Hash password and create user
  const passwordHash = await hash(password, ARGON2_OPTIONS);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      organizationId: org.id,
      roleId: role.id,
    },
  });
  console.log(`✅ Created user: ${user.email} (${user.id})`);
  console.log(`\n🎉 Done. Login with: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
