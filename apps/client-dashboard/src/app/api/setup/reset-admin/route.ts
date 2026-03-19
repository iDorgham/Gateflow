import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';

// DELETE THIS FILE after use — one-time setup endpoint
const SECRET = 'gateflow-setup-2026';

// Pre-computed argon2id hash of "password123" (generated locally)
const PASSWORD_HASH = '$argon2id$v=19$m=65536,t=3,p=4$Abr48HQ+axKv5PKJMQmHUw$xMDgdrY4kGO9XUGY/apj8UcT+n1FaButa24uu1P1g9Q';

const BUILT_IN_ROLES = [
  {
    name: 'TENANT_ADMIN',
    permissions: {
      'gates:manage': true, 'qr:create': true, 'qr:manage': true,
      'scans:view': true, 'scans:override': true, 'workspace:manage': true,
      'roles:manage': true, 'users:manage': true, 'analytics:view': true,
      'projects:manage': true, 'units:manage': true, 'contacts:manage': true,
    },
  },
  {
    name: 'TENANT_USER',
    permissions: {
      'gates:manage': false, 'qr:create': true, 'qr:manage': true,
      'scans:view': true, 'scans:override': false, 'workspace:manage': false,
      'roles:manage': false, 'users:manage': false, 'analytics:view': true,
      'projects:manage': false, 'units:manage': false, 'contacts:manage': false,
    },
  },
  {
    name: 'GATE_OPERATOR',
    permissions: {
      'gates:manage': false, 'qr:create': false, 'qr:manage': false,
      'scans:view': true, 'scans:override': false, 'workspace:manage': false,
      'roles:manage': false, 'users:manage': false, 'analytics:view': false,
      'projects:manage': false, 'units:manage': false, 'contacts:manage': false,
    },
  },
  {
    name: 'RESIDENT',
    permissions: {
      'gates:manage': false, 'qr:create': true, 'qr:manage': true,
      'scans:view': false, 'scans:override': false, 'workspace:manage': false,
      'roles:manage': false, 'users:manage': false, 'analytics:view': false,
      'projects:manage': false, 'units:manage': false, 'contacts:manage': false,
    },
  },
];

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('secret');
  if (token !== SECRET) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const results: Record<string, string> = {};

  // 1. Seed built-in roles
  for (const roleData of BUILT_IN_ROLES) {
    const existing = await prisma.role.findFirst({ where: { name: roleData.name, organizationId: null } });
    if (!existing) {
      const role = await prisma.role.create({ data: { ...roleData, isBuiltIn: true, organizationId: null } });
      results[`role_${roleData.name}`] = `created (${role.id})`;
    } else {
      results[`role_${roleData.name}`] = `exists (${existing.id})`;
    }
  }

  const tenantAdminRole = await prisma.role.findFirst({ where: { name: 'TENANT_ADMIN', organizationId: null } });
  if (!tenantAdminRole) return NextResponse.json({ error: 'TENANT_ADMIN role missing after seed' }, { status: 500 });

  // 2. Find or create org
  let org = await prisma.organization.findFirst({ where: { slug: 'selenadev' } });
  if (!org) {
    org = await prisma.organization.create({ data: { name: 'Selena Dev', slug: 'selenadev' } });
    results.org = `created (${org.id})`;
  } else {
    results.org = `exists (${org.id})`;
  }

  // 3. Find or create default project
  const project = await prisma.project.findFirst({ where: { organizationId: org.id } });
  if (!project) {
    const p = await prisma.project.create({ data: { name: 'Main', organizationId: org.id } });
    results.project = `created (${p.id})`;
  } else {
    results.project = `exists (${project.id})`;
  }

  // 4. Reset or create admin user — with org assigned so onboarding is skipped
  const email = 'admin@selenadev.com';
  const existing = await prisma.user.findFirst({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash: PASSWORD_HASH, deletedAt: null, organizationId: org.id, roleId: tenantAdminRole.id },
    });
    results.user = `updated (${existing.id})`;
  } else {
    const user = await prisma.user.create({
      data: { email, name: 'Admin', passwordHash: PASSWORD_HASH, roleId: tenantAdminRole.id, organizationId: org.id },
    });
    results.user = `created (${user.id})`;
  }

  return NextResponse.json({ ok: true, results });
}
