import { config } from 'dotenv';
import { resolve } from 'node:path';
import {
  BUILT_IN_ROLES,
  DEFAULT_PERMISSIONS,
  formatRoleLabel,
  ORG_TYPE_MEMBER_ROLES,
  ORG_TYPE_ROLE_PERMISSIONS,
  roleSlug,
  UserRole,
} from '@gate-access/types';

config({ path: resolve(__dirname, '../.env') });

function builtinId(slug: string): string {
  return `builtin-${slug.toLowerCase().replace(/_/g, '-')}`;
}

async function seedRoles() {
  const { prisma } = await import('./client');
  console.log('Seeding built-in roles...');

  async function upsertRole(
    slug: string,
    name: string,
    permissions: Record<string, boolean>,
    description?: string
  ) {
    const existing = await prisma.role.findFirst({
      where: {
        OR: [{ id: builtinId(slug) }, { slug }, { name: slug }, { name }],
      },
      orderBy: { createdAt: 'asc' },
    });

    if (existing) {
      await prisma.role.update({
        where: { id: existing.id },
        data: {
          name,
          slug,
          permissions,
          isBuiltIn: true,
          ...(description ? { description } : {}),
        },
      });
    } else {
      await prisma.role.create({
        data: {
          id: builtinId(slug),
          name,
          slug,
          permissions,
          isBuiltIn: true,
          description: description ?? null,
        },
      });
    }
    console.log(`- Role "${name}" (${slug}) seeded.`);
  }

  for (const [key, slug] of Object.entries(BUILT_IN_ROLES)) {
    const permissions = DEFAULT_PERMISSIONS[slug];
    await upsertRole(
      slug,
      formatRoleLabel(slug),
      permissions,
      `Built-in ${key}`
    );
  }

  const tenantAdminPerms = DEFAULT_PERMISSIONS[BUILT_IN_ROLES.ORG_ADMIN];
  const operatorPerms = DEFAULT_PERMISSIONS[BUILT_IN_ROLES.GATE_OPERATOR];

  await upsertRole(
    UserRole.TENANT_ADMIN,
    formatRoleLabel(UserRole.TENANT_ADMIN),
    tenantAdminPerms,
    'Organization owner / tenant administrator'
  );
  await upsertRole(
    UserRole.TENANT_USER,
    formatRoleLabel(UserRole.TENANT_USER),
    operatorPerms,
    'Standard organization member'
  );
  await upsertRole(
    UserRole.VISITOR,
    formatRoleLabel(UserRole.VISITOR),
    operatorPerms,
    'Visitor / scanner operator'
  );

  for (const role of ORG_TYPE_MEMBER_ROLES) {
    await upsertRole(
      role.slug,
      role.name,
      ORG_TYPE_ROLE_PERMISSIONS[role.slug] ?? operatorPerms,
      role.description
    );
  }

  const leftover = await prisma.role.findMany({
    where: { slug: '' },
  });
  for (const role of leftover) {
    const slug = roleSlug(role.name);
    await prisma.role.update({
      where: { id: role.id },
      data: { slug, name: formatRoleLabel(role.name) },
    });
  }

  console.log('Built-in roles seeding completed.');
  await prisma.$disconnect();
}

seedRoles().catch((e) => {
  console.error(e);
  process.exit(1);
});
