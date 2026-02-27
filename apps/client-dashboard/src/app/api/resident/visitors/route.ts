import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma, QRCodeType as PrismaQRCodeType, AccessRuleType } from '@gate-access/db';
import { signQRPayload, QRCodeType } from '@gate-access/types';
import { checkAndConsumeQuota, canCreateOpenQR } from '@gate-access/db/quota';

export const dynamic = 'force-dynamic';

const CreateVisitorSchema = z.object({
  unitId: z.string().min(1),
  visitorName: z.string().optional(),
  visitorPhone: z.string().optional(),
  visitorEmail: z.string().email().optional(),
  isOpenQR: z.boolean().default(false),
  type: z.enum(['ONETIME', 'DATERANGE', 'RECURRING', 'PERMANENT']).default('ONETIME'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  recurringDays: z.array(z.number().min(0).max(6)).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.sub) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unitId = searchParams.get('unitId');

    const visitors = await prisma.visitorQR.findMany({
      where: {
        createdBy: claims.sub,
        ...(unitId ? { unitId } : {}),
        qrCode: {
          deletedAt: null,
        },
      },
      include: {
        qrCode: true,
        accessRule: true,
        unit: {
          select: {
            name: true,
            building: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: visitors,
    });
  } catch (error) {
    console.error('GET /api/resident/visitors error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const claims = await getSessionClaims();
    if (!claims?.sub || !claims.orgId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = CreateVisitorSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { 
      unitId, visitorName, visitorPhone, visitorEmail, isOpenQR,
      type, startDate, endDate, recurringDays, startTime, endTime 
    } = validation.data;

    // 1. Verify unit belongs to resident
    const unit = await prisma.unit.findFirst({
      where: { id: unitId, userId: claims.sub, deletedAt: null },
    });
    if (!unit) {
      return NextResponse.json({ success: false, message: 'Unit not found or unauthorized' }, { status: 403 });
    }

    // 2. Quota check
    const quotaStatus = await checkAndConsumeQuota(unitId);
    if (!quotaStatus.allowed) {
      return NextResponse.json({ 
        success: false, 
        message: 'Monthly visitor quota reached',
        quotaStatus 
      }, { status: 403 });
    }

    // 3. Open QR check
    if (isOpenQR) {
      const allowedOpenQR = await canCreateOpenQR(unitId);
      if (!allowedOpenQR) {
        return NextResponse.json({ success: false, message: 'Your unit type is not allowed to create Open QRs' }, { status: 403 });
      }
    } else if (!visitorName) {
      return NextResponse.json({ success: false, message: 'Visitor name is required for non-open QRs' }, { status: 400 });
    }

    // 4. Generate QR
    const secret = process.env.QR_SIGNING_SECRET ?? '';
    if (!secret || secret.length < 32) {
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }

    const qrId = randomUUID();
    const prismaType = type === 'ONETIME' ? PrismaQRCodeType.VISITOR : 
                       type === 'PERMANENT' ? PrismaQRCodeType.OPEN : 
                       PrismaQRCodeType.RECURRING;
    
    // Map to types QRCodeType
    const typesType = type === 'ONETIME' ? QRCodeType.VISITOR :
                      type === 'PERMANENT' ? QRCodeType.OPEN :
                      QRCodeType.RECURRING;

    const expiresAt = endDate ? new Date(endDate) : null;
    const maxUses = type === 'ONETIME' ? 1 : null;

    const qrString = signQRPayload(
      {
        qrId,
        organizationId: claims.orgId,
        type: typesType,
        maxUses,
        expiresAt: expiresAt?.toISOString() ?? null,
        issuedAt: new Date().toISOString(),
        nonce: randomUUID(),
      },
      secret
    );

    // 5. Create in DB
    const visitor = await prisma.$transaction(async (tx) => {
      const qrCode = await tx.qRCode.create({
        data: {
          id: qrId,
          code: qrString,
          type: prismaType,
          organizationId: claims.orgId!,
          maxUses,
          expiresAt,
          isActive: true,
        },
      });

      const accessRule = await tx.accessRule.create({
        data: {
          type: type as AccessRuleType,
          startDate: startDate ? new Date(startDate) : null,
          endDate: expiresAt,
          recurringDays,
          startTime,
          endTime,
        },
      });

      return await tx.visitorQR.create({
        data: {
          qrCodeId: qrCode.id,
          unitId,
          visitorName,
          visitorPhone,
          visitorEmail,
          isOpenQR,
          accessRuleId: accessRule.id,
          createdBy: claims.sub!,
        },
        include: {
          qrCode: true,
          accessRule: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    console.error('POST /api/resident/visitors error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
