import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
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
  if (!isAdminAuthenticated()) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

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
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      type: true,
      lastUsedAt: true,
      expiresAt: true,
      createdAt: true,
      createdBy: true,
      organization:
        filter === 'all' ? { select: { id: true, name: true } } : false,
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
      organizationId: (k as any).organization?.id,
      organizationName: (k as any).organization?.name,
    })),
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isAdminAuthenticated()) {
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

    type = type.toUpperCase();

    if (type === 'SERVICE' && !organizationId) {
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
        type,
        keyHash,
        keyPrefix,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        organizationId: type === 'SERVICE' ? organizationId : null,
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error creating auth key:', errorMessage);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    return NextResponse.json(
      { success: false, message: `Failed to create authorization key: ${errorMessage}` },
      { status: 500 }
    );
  }
}
