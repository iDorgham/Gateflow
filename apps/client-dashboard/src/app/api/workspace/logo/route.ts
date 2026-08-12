import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

const MAX_LOGO_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
]);

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Logo must be a PNG, JPEG, WebP, or SVG image',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_LOGO_BYTES) {
      return NextResponse.json(
        { success: false, message: 'Logo must be 5MB or smaller' },
        { status: 400 }
      );
    }

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

    const extension =
      file.type === 'image/svg+xml' ? 'svg' : file.type.split('/')[1];
    const blob = await put(
      `org-logos/${organizationId}-${Date.now()}.${extension}`,
      file,
      {
        access: 'public',
        contentType: file.type,
      }
    );

    await prisma.organization.update({
      where: { id: organizationId },
      data: { logoUrl: blob.url },
    });

    return NextResponse.json({ success: true, data: { logoUrl: blob.url } });
  } catch (error) {
    console.error('POST /api/workspace/logo error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
