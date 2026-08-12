import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

const HEX_COLOR_REGEX = /^#[0-9A-F]{6}$/i;
// null = keep indefinitely, matching the Organization.*RetentionMonths columns
const RETENTION_MONTHS = z.number().int().min(1).max(120).nullable().optional();

const SettingsSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  domain: z.string().max(100).nullable().optional(),
  accentColor: z
    .string()
    .regex(HEX_COLOR_REGEX, 'Invalid hex color')
    .nullable()
    .optional(),
  logoUrl: z.string().url('Invalid logo URL').nullable().optional(),
  scanLogRetentionMonths: RETENTION_MONTHS,
  visitorHistoryRetentionMonths: RETENTION_MONTHS,
  idArtifactRetentionMonths: RETENTION_MONTHS,
  incidentRetentionMonths: RETENTION_MONTHS,
  retentionLegalHold: z.boolean().optional(),
});

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const validation = SettingsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request',
          error: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      domain,
      accentColor,
      logoUrl,
      scanLogRetentionMonths,
      visitorHistoryRetentionMonths,
      idArtifactRetentionMonths,
      incidentRetentionMonths,
      retentionLegalHold,
    } = validation.data;

    const organizationId = claims.orgId;
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!org || org.deletedAt) {
      return NextResponse.json(
        { success: false, message: 'Organization not found' },
        { status: 404 }
      );
    }

    const retentionFieldsTouched = [
      scanLogRetentionMonths,
      visitorHistoryRetentionMonths,
      idArtifactRetentionMonths,
      incidentRetentionMonths,
      retentionLegalHold,
    ].some((value) => value !== undefined);

    const updated = await prisma.organization.update({
      where: { id: claims.orgId },
      data: {
        name,
        email,
        domain: domain || null,
        ...(accentColor !== undefined && { accentColor: accentColor || null }),
        ...(logoUrl !== undefined && { logoUrl: logoUrl || null }),
        ...(scanLogRetentionMonths !== undefined && { scanLogRetentionMonths }),
        ...(visitorHistoryRetentionMonths !== undefined && {
          visitorHistoryRetentionMonths,
        }),
        ...(idArtifactRetentionMonths !== undefined && {
          idArtifactRetentionMonths,
        }),
        ...(incidentRetentionMonths !== undefined && {
          incidentRetentionMonths,
        }),
        ...(retentionLegalHold !== undefined && { retentionLegalHold }),
        ...(retentionFieldsTouched && { retentionPolicyUpdatedAt: new Date() }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        domain: true,
        accentColor: true,
        logoUrl: true,
        scanLogRetentionMonths: true,
        visitorHistoryRetentionMonths: true,
        idArtifactRetentionMonths: true,
        incidentRetentionMonths: true,
        retentionLegalHold: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PATCH /api/workspace/settings error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
