import { prisma } from '../src/index';
import { hash } from '@node-rs/argon2';

import { BUILT_IN_ROLES, DEFAULT_PERMISSIONS } from '@gate-access/types';

// Use environment variable for password or default to a safe value for dev
const DEFAULT_PASSWORD = process.env.SEED_PASSWORD || 'password123';
const DEFAULT_CONTACT_TAGS = [
  { name: 'family', color: '#22c55e' },
  { name: 'maid', color: '#3b82f6' },
  { name: 'driver', color: '#a855f7' },
  { name: 'prospect', color: '#f59e0b' },
  { name: 'agent', color: '#ef4444' },
] as const;

async function main() {
  console.log('🌱 Starting Legacy Dev Seed...');

  const passwordHash = await hash(DEFAULT_PASSWORD, {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  const org = await prisma.organization.upsert({
    // skip-organization-check (Internal Seed Script)
    where: { email: 'admin@selenadev.com' },
    update: {},
    create: {
      name: 'Selena Development',
      email: 'admin@selenadev.com',
      plan: 'PRO',
    },
  });

  // Create/Upsert Roles (Use non-empty update to force permissions sync)
  const tenantAdminRole = await prisma.role.upsert({
    // skip-organization-check (Internal Seed Script)
    where: { id: 'role-tenant-admin' },
    update: {
      permissions: DEFAULT_PERMISSIONS[BUILT_IN_ROLES.ORG_ADMIN],
    },
    create: {
      id: 'role-tenant-admin',
      name: 'TENANT_ADMIN',
      description: 'Administrative access for an organization',
      isBuiltIn: true,
      permissions: DEFAULT_PERMISSIONS[BUILT_IN_ROLES.ORG_ADMIN],
    },
  });

  const user = await prisma.user.upsert({
    // skip-organization-check (Internal Seed Script)
    where: { email: 'admin@example.com' },
    update: {
      passwordHash,
      organizationId: org.id,
      roleId: tenantAdminRole.id,
    },
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      passwordHash,
      roleId: tenantAdminRole.id,
      organizationId: org.id,
    },
  });

  const user2 = await prisma.user.upsert({
    // skip-organization-check (Internal Seed Script)
    where: { email: 'admin@selenadev.com' },
    update: {
      passwordHash,
      organizationId: org.id,
      roleId: tenantAdminRole.id,
    },
    create: {
      email: 'admin@selenadev.com',
      name: 'Selena Admin',
      passwordHash,
      roleId: tenantAdminRole.id,
      organizationId: org.id,
    },
  });

  await prisma.project.upsert({
    // skip-organization-check (Internal Seed Script)
    where: { id: 'default-proj' },
    update: {},
    create: {
      id: 'default-proj',
      name: 'Main Project',
      organizationId: org.id,
    },
  });

  await prisma.tag.createMany({
    data: DEFAULT_CONTACT_TAGS.map((tag) => ({
      organizationId: org.id,
      name: tag.name,
      color: tag.color,
    })),
    skipDuplicates: true,
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
