const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const BUILT_IN_ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ORG_ADMIN: 'Organization Admin',
  SECURITY_MANAGER: 'Security Manager',
  GATE_OPERATOR: 'Gate Operator',
  RESIDENT: 'Resident',
};

const DEFAULT_PERMISSIONS = {
  'Super Admin': {
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
  },
  'Organization Admin': {
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
  },
  'Security Manager': {
    'gates:manage': true,
    'qr:create': false,
    'qr:manage': false,
    'scans:view': true,
    'scans:override': true,
    'workspace:manage': false,
    'roles:manage': false,
    'users:manage': false,
    'analytics:view': true,
    'projects:manage': false,
    'units:manage': false,
    'contacts:manage': false,
  },
  'Gate Operator': {
    'gates:manage': false,
    'qr:create': false,
    'qr:manage': false,
    'scans:view': true,
    'scans:override': false,
    'workspace:manage': false,
    'roles:manage': false,
    'users:manage': false,
    'analytics:view': false,
    'projects:manage': false,
    'units:manage': false,
    'contacts:manage': false,
  },
  'Resident': {
    'gates:manage': false,
    'qr:create': true,
    'qr:manage': true,
    'scans:view': false,
    'scans:override': false,
    'workspace:manage': false,
    'roles:manage': false,
    'users:manage': false,
    'analytics:view': false,
    'projects:manage': false,
    'units:manage': false,
    'contacts:manage': false,
  },
};

async function seedRoles() {
  console.log('Seeding built-in roles (JS)...');

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
