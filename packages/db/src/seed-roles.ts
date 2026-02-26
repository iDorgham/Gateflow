import { prisma } from './client';
import { BUILT_IN_ROLES, DEFAULT_PERMISSIONS } from '@gate-access/types';

async function seedRoles() {
  console.log('Seeding built-in roles...');

  for (const [key, name] of Object.entries(BUILT_IN_ROLES)) {
    const permissions = DEFAULT_PERMISSIONS[name];
    
    await prisma.role.upsert({
      where: { id: `builtin-${key.toLowerCase().replace(/_/g, '-')}` },
      update: {
        name,
        permissions,
        isBuiltIn: true,
      },
      create: {
        id: `builtin-${key.toLowerCase().replace(/_/g, '-')}`,
        name,
        permissions,
        isBuiltIn: true,
      },
    });
    console.log(`- Role "${name}" seeded.`);
  }

  console.log('Built-in roles seeding completed.');
}

seedRoles()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
