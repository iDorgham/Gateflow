import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { hash } from '@node-rs/argon2';

// DELETE THIS FILE after use — one-time setup endpoint
const SECRET = 'gateflow-setup-2026';

const ARGON2_OPTIONS = { memoryCost: 65536, timeCost: 3, parallelism: 4 };

const ALL_PERMISSIONS = {
  'gates:manage': true, 'qr:create': true, 'qr:manage': true,
  'scans:view': true, 'scans:override': true, 'workspace:manage': true,
  'roles:manage': true, 'users:manage': true, 'analytics:view': true,
  'projects:manage': true, 'units:manage': true, 'contacts:manage': true,
};

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('secret');
  if (token !== SECRET) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const email = 'admin@selenadev.com';
  const password = 'password123';
  const passwordHash = await hash(password, ARGON2_OPTIONS);

  const existing = await prisma.user.findFirst({ where: { email }, include: { role: true } });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash, deletedAt: null },
    });
    return NextResponse.json({ ok: true, action: 'password_reset', id: existing.id, role: existing.role?.name });
  }

  // Need a role — find or create one
  let role = await prisma.role.findFirst({ where: { name: 'Organization Admin' } });
  if (!role) {
    // Find any org to attach to
    const org = await prisma.organization.findFirst({ where: { deletedAt: null } });
    role = await prisma.role.create({
      data: {
        name: 'Organization Admin',
        permissions: ALL_PERMISSIONS,
        isBuiltIn: true,
        organizationId: org?.id ?? null,
      },
    });
  }

  const org = await prisma.organization.findFirst({ where: { deletedAt: null } });
  const user = await prisma.user.create({
    data: { email, name: 'Admin', passwordHash, roleId: role.id, organizationId: org?.id ?? null },
  });

  return NextResponse.json({ ok: true, action: 'created', id: user.id });
}
