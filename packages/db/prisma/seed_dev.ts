import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,   // 64 MiB
  timeCost: 3,         // 3 iterations
  parallelism: 4,
  raw: false,
};

// Use environment variable for password or default to a safe value for dev
const DEFAULT_PASSWORD = process.env.SEED_PASSWORD || 'password123';

async function main() {
  console.log('🌱 Starting Dev Seed...');

  const passwordHash = await argon2.hash(DEFAULT_PASSWORD, ARGON2_OPTIONS);

  const org = await prisma.organization.upsert({
    where: { email: 'admin@selenadev.com' },
    update: {},
    create: {
      name: 'Selena Development',
      email: 'admin@selenadev.com',
      plan: 'ENTERPRISE',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      passwordHash,
      organizationId: org.id,
      role: 'TENANT_ADMIN',
    },
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      passwordHash,
      role: 'TENANT_ADMIN',
      organizationId: org.id,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'admin@selenadev.com' },
    update: {
      passwordHash,
      organizationId: org.id,
      role: 'TENANT_ADMIN',
    },
    create: {
      email: 'admin@selenadev.com',
      name: 'Selena Admin',
      passwordHash,
      role: 'TENANT_ADMIN',
      organizationId: org.id,
    },
  });

  await prisma.project.upsert({
    where: { id: 'default-proj' },
    update: {},
    create: {
      id: 'default-proj',
      name: 'Main Project',
      organizationId: org.id,
    },
  });

  console.log('✅ Created Organization:', org.name);
  console.log('✅ Created Admin User 1:', user.email);
  console.log('✅ Created Admin User 2:', user2.email);
  // Security: Do not log cleartext password
  console.log('🔑 Password: [HIDDEN] (check SEED_PASSWORD env var or default)');
  console.log('🌱 Dev Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
