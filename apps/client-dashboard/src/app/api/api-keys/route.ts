import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomBytes, createHash } from 'crypto';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

const ALL_SCOPES = [
  'QR_CREATE',
  'QR_READ',
  'QR_VALIDATE',
  'SCANS_READ',
  'ANALYTICS_READ',
  'WEBHOOK_WRITE',
] as const;

const CreateApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  scopes: z.array(z.enum(ALL_SCOPES)).min(1),
  expiresAt: z.string().datetime().optional(), // ISO 8601
});

// ─── GET /api/api-keys ────────────────────────────────────────────────────────
// Returns all API keys for the org. Never returns keyHash.

export async function GET(): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const keys = await prisma.apiKey.findMany({
      where: { organizationId: claims.orgId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        scopes: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
        createdBy: true,
      },
    });

    return NextResponse.json({ success: true, data: keys });
  } catch (err) {
    console.error('GET /api/api-keys error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// ─── POST /api/api-keys ───────────────────────────────────────────────────────
// Creates a new API key. Returns the full key exactly once — never stored.

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims.sub) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
    }

    const validation = CreateApiKeySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Reject expiry dates in the past
    if (validation.data.expiresAt) {
      const expiry = new Date(validation.data.expiresAt);
      if (expiry <= new Date()) {
        return NextResponse.json(
          { success: false, message: 'Expiry date must be in the future.' },
          { status: 400 }
        );
      }
    }

    // Max 50 keys per org (sane limit)
    const count = await prisma.apiKey.count({ where: { organizationId: claims.orgId } });
    if (count >= 50) {
      return NextResponse.json(
        { success: false, message: 'Maximum of 50 API keys per organisation reached.' },
        { status: 422 }
      );
    }

    // Generate key: gflv_<64 hex chars>
    const rawKey = `gflv_${randomBytes(32).toString('hex')}`;
    const keyPrefix = rawKey.slice(0, 12); // e.g. "gflv_a1b2c3"
    const keyHash = createHash('sha256').update(rawKey).digest('hex');

    const apiKey = await prisma.apiKey.create({
      data: {
        name: validation.data.name,
        keyHash,
        keyPrefix,
        scopes: validation.data.scopes,
        expiresAt: validation.data.expiresAt ? new Date(validation.data.expiresAt) : null,
        organizationId: claims.orgId,
        createdBy: claims.sub,
      },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        scopes: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
        createdBy: true,
      },
    });

    // Return the raw key ONCE — it is never stored and cannot be retrieved again
    return NextResponse.json(
      { success: true, data: { ...apiKey, key: rawKey } },
      { status: 201 }
    );
  } catch (err) {
    console.error('POST /api/api-keys error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
