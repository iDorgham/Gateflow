/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * JS entry for built-in role seeding. Prefer `npx tsx src/seed-roles.ts`.
 * This file stays in sync with underscore role IDs used by the TypeScript seeder.
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const BUILT_IN_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORG_ADMIN: 'ORG_ADMIN',
  SECURITY_MANAGER: 'SECURITY_MANAGER',
  GATE_OPERATOR: 'GATE_OPERATOR',
  RESIDENT: 'RESIDENT',
};

const ORG_TYPE_ROLES = [
  'REAL_ESTATE_PROPERTY_MANAGER',
  'REAL_ESTATE_CONCIERGE',
  'REAL_ESTATE_MAINTENANCE_STAFF',
  'SCHOOL_PRINCIPAL',
  'SCHOOL_TEACHER',
  'SCHOOL_GUARD',
  'CLUB_MANAGER',
  'CLUB_MEMBER_SERVICES',
  'CLUB_DOOR_STAFF',
  'NIGHTCLUB_VENUE_MANAGER',
  'NIGHTCLUB_BOUNCER',
  'NIGHTCLUB_VIP_HOST',
  'EVENT_MANAGER',
  'EVENT_STAFF_COORDINATOR',
  'EVENT_TICKET_SCANNER',
  'TENANT_ADMIN',
  'TENANT_USER',
  'VISITOR',
];

const ADMIN_PERMISSIONS = {
  'gates:view': true,
  'gates:manage': true,
  'gates:assignments': true,
  'qr:view': true,
  'qr:create': true,
  'qr:manage': true,
  'scans:view': true,
  'scans:override': true,
  'scans:export': true,
  'workspace:manage': true,
  'roles:manage': true,
  'users:view': true,
  'users:manage': true,
  'analytics:view': true,
  'projects:view': true,
  'projects:manage': true,
  'units:view': true,
  'units:manage': true,
  'residents:manage': true,
  'contacts:manage': true,
  'maintenance:view': true,
  'maintenance:manage': true,
};

const OPERATOR_PERMISSIONS = {
  'gates:view': true,
  'gates:manage': false,
  'gates:assignments': false,
  'qr:view': false,
  'qr:create': false,
  'qr:manage': false,
  'scans:view': true,
  'scans:override': false,
  'scans:export': false,
  'workspace:manage': false,
  'roles:manage': false,
  'users:view': false,
  'users:manage': false,
  'analytics:view': false,
  'projects:view': false,
  'projects:manage': false,
  'units:view': false,
  'units:manage': false,
  'residents:manage': false,
  'contacts:manage': false,
  'maintenance:view': true,
  'maintenance:manage': false,
};

function builtinId(slug) {
  return `builtin-${slug.toLowerCase().replace(/_/g, '-')}`;
}

function displayName(slug) {
  return slug
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

async function upsertRole(slug, permissions, description) {
  const name = displayName(slug);
  const existing = await prisma.role.findFirst({
    where: {
      OR: [{ id: builtinId(slug) }, { slug }, { name: slug }, { name }],
    },
    orderBy: { createdAt: 'asc' },
  });
  if (existing) {
    await prisma.role.update({
      where: { id: existing.id },
      data: { name, slug, permissions, isBuiltIn: true, description },
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

async function seedRoles() {
  console.log('Seeding built-in roles (JS)...');

  const renames = [
    ['Organization Admin', 'ORG_ADMIN'],
    ['Super Admin', 'SUPER_ADMIN'],
    ['Security Manager', 'SECURITY_MANAGER'],
    ['Gate Operator', 'GATE_OPERATOR'],
    ['Resident', 'RESIDENT'],
  ];
  for (const [from, to] of renames) {
    await prisma.role.updateMany({
      where: { name: from },
      data: { slug: to, name: displayName(to) },
    });
  }

  for (const [key, name] of Object.entries(BUILT_IN_ROLES)) {
    const permissions =
      name === 'GATE_OPERATOR' || name === 'RESIDENT'
        ? OPERATOR_PERMISSIONS
        : ADMIN_PERMISSIONS;
    await upsertRole(name, permissions, `Built-in ${key}`);
  }

  for (const name of ORG_TYPE_ROLES) {
    const permissions =
      name.includes('MANAGER') ||
      name.includes('PRINCIPAL') ||
      name === 'TENANT_ADMIN'
        ? ADMIN_PERMISSIONS
        : OPERATOR_PERMISSIONS;
    await upsertRole(name, permissions, name);
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
