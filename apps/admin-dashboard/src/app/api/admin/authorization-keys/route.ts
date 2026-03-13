import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

function generateKey(): string {
  const { randomBytes } = require('crypto');
  const bytes = randomBytes(32);
  return `gflv_admin_${bytes.toString('base64url')}`;
}

function hashKey(key: string): string {
  const { createHash } = require('crypto');
  return createHash('sha256').update(key).digest('hex');
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const url = new URL(request.url);
    const filter = url.searchParams.get('filter') || 'all';

    const now = new Date();
    const where =
      filter === 'active'
        ? { OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }
        : filter === 'expired'
          ? { expiresAt: { lte: now } }
          : {};

    const keys = await prisma.adminAuthorizationKey.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        organization: { select: { id: true, name: true } },
      },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      data: keys.map((k) => ({
        id: k.id,
        name: k.name,
        keyPrefix: k.keyPrefix,
        type: k.type,
        scopes: [],
        lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
        expiresAt: k.expiresAt?.toISOString() ?? null,
        createdAt: k.createdAt.toISOString(),
        createdBy: k.createdBy,
        organizationId: k.organization?.id,
        organizationName: k.organization?.name,
      })),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('GET /api/admin/authorization-keys error:', msg);
    return NextResponse.json(
      { success: false, message: `Failed to fetch keys: ${msg}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    let { name, type, expiresAt, organizationId } = body;

    if (!name || !type) {
      return NextResponse.json(
        { success: false, message: 'Name and type are required' },
        { status: 400 }
      );
    }

    // Ensure type is a valid enum member
    const upperType = type.toUpperCase();
    if (upperType !== 'ADMIN' && upperType !== 'SERVICE') {
      return NextResponse.json(
        { success: false, message: 'Invalid key type. Must be ADMIN or SERVICE.' },
        { status: 400 }
      );
    }

    if (upperType === 'SERVICE' && !organizationId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Organization ID is required for service keys',
        },
        { status: 400 }
      );
    }

    const key = generateKey();
    const keyHash = hashKey(key);
    const keyPrefix = key.slice(0, 15) + '...';

    const created = await prisma.adminAuthorizationKey.create({
      data: {
        name,
        type: upperType as any,
        keyHash,
        keyPrefix,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        organizationId: upperType === 'SERVICE' ? organizationId : null,
        createdBy: 'admin',
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        type: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: created.id,
        name: created.name,
        keyPrefix: created.keyPrefix,
        key,
        type: created.type,
        scopes: [],
        lastUsedAt: null,
        expiresAt: created.expiresAt?.toISOString() ?? null,
        createdAt: created.createdAt.toISOString(),
        createdBy: 'admin',
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('POST /api/admin/authorization-keys error:', msg);
    return NextResponse.json(
      { success: false, message: `Failed to create authorization key: ${msg}` },
      { status: 500 }
    );
  }
}
