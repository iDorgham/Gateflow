import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma, QRCodeType as PrismaQRCodeType } from '@gate-access/db';
import { signQRPayload, QRCodeType } from '@gate-access/types';

const BulkCreateItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.string().optional(),
  gate: z.string().optional(),
  expiresAt: z.string().optional(),
  type: z.enum(['SINGLE', 'RECURRING', 'PERMANENT']).default('SINGLE'),
  maxUses: z.number().int().positive().optional(),
});

const BulkCreateRequestSchema = z.object({
  items: z.array(BulkCreateItemSchema).min(1).max(500),
});

type BulkItem = z.infer<typeof BulkCreateItemSchema>;
type QRTypeKey = 'SINGLE' | 'RECURRING' | 'PERMANENT';

function toTypesQRCodeType(t: QRTypeKey): QRCodeType {
  const map: Record<QRTypeKey, QRCodeType> = {
    SINGLE: QRCodeType.SINGLE,
    RECURRING: QRCodeType.RECURRING,
    PERMANENT: QRCodeType.PERMANENT,
  };
  return map[t];
}

function toPrismaQRCodeType(t: QRTypeKey): PrismaQRCodeType {
  const map: Record<QRTypeKey, PrismaQRCodeType> = {
    SINGLE: PrismaQRCodeType.SINGLE,
    RECURRING: PrismaQRCodeType.RECURRING,
    PERMANENT: PrismaQRCodeType.PERMANENT,
  };
  return map[t];
}

interface ValidatedItem {
  original: BulkItem;
  index: number;
  gateId: string | null;
  expiresAt: string | null;
  resolvedMaxUses: number | null;
  qrId: string;
  qrString: string;
}

interface ItemError {
  index: number;
  name: string;
  error: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const validation = BulkCreateRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const secret = process.env.QR_SIGNING_SECRET ?? '';
    if (!secret || secret.length < 32) {
      return NextResponse.json(
        { success: false, message: 'Server configuration error: QR signing secret not set' },
        { status: 500 }
      );
    }

    const { items } = validation.data;

    // Load org's gates once for gate-name resolution
    const orgGates = await prisma.gate.findMany({
      where: { organizationId: claims.orgId, deletedAt: null },
      select: { id: true, name: true },
    });
    const gateByName = new Map(orgGates.map((g) => [g.name.toLowerCase(), g]));

    // Phase 1: validate + sign (no DB writes yet)
    const validItems: ValidatedItem[] = [];
    const errors: ItemError[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Resolve gate by name
      let gateId: string | null = null;
      if (item.gate?.trim()) {
        const gate = gateByName.get(item.gate.trim().toLowerCase());
        if (!gate) {
          errors.push({ index: i, name: item.name, error: `Gate "${item.gate}" not found` });
          continue;
        }
        gateId = gate.id;
      }

      // Validate expiry date
      let expiresAt: string | null = null;
      if (item.expiresAt?.trim() && item.type !== 'PERMANENT') {
        const expDate = new Date(item.expiresAt);
        if (isNaN(expDate.getTime()) || expDate <= new Date()) {
          errors.push({ index: i, name: item.name, error: 'Expiry must be a valid future date' });
          continue;
        }
        expiresAt = expDate.toISOString();
      }

      // Validate maxUses for RECURRING
      if (item.type === 'RECURRING' && (!item.maxUses || item.maxUses < 1)) {
        errors.push({
          index: i,
          name: item.name,
          error: 'maxUses must be a positive integer for RECURRING type',
        });
        continue;
      }

      const resolvedMaxUses =
        item.type === 'SINGLE' ? 1 : item.type === 'PERMANENT' ? null : (item.maxUses ?? null);

      const qrId = randomUUID();

      let qrString: string;
      try {
        qrString = signQRPayload(
          {
            qrId,
            organizationId: claims.orgId,
            type: toTypesQRCodeType(item.type),
            maxUses: resolvedMaxUses,
            expiresAt,
            issuedAt: new Date().toISOString(),
            nonce: randomUUID(),
          },
          secret
        );
      } catch (err) {
        errors.push({
          index: i,
          name: item.name,
          error: `Signing failed: ${(err as Error).message}`,
        });
        continue;
      }

      validItems.push({ original: item, index: i, gateId, expiresAt, resolvedMaxUses, qrId, qrString });
    }

    // Phase 2: persist valid items in a single transaction
    const created: Array<{
      index: number;
      qrId: string;
      qrString: string;
      name: string;
      email?: string;
    }> = [];

    if (validItems.length > 0) {
      await prisma.$transaction(async (tx) => {
        for (const v of validItems) {
          await tx.qRCode.create({
            data: {
              code: v.qrString,
              type: toPrismaQRCodeType(v.original.type),
              organizationId: claims.orgId!,
              gateId: v.gateId,
              maxUses: v.resolvedMaxUses,
              expiresAt: v.expiresAt ? new Date(v.expiresAt) : null,
              isActive: true,
            },
          });
          created.push({
            index: v.index,
            qrId: v.qrId,
            qrString: v.qrString,
            name: v.original.name,
            email: v.original.email,
          });
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        created,
        errors,
        totalCreated: created.length,
        totalErrors: errors.length,
      },
    });
  } catch (error) {
    console.error('Bulk QR create error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
