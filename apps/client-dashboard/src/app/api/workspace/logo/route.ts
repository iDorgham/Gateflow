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

// Magic number signatures for file type validation
const FILE_SIGNATURES = {
  PNG: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  JPEG: [0xff, 0xd8, 0xff],
  WEBP_RIFF: [0x52, 0x49, 0x46, 0x46], // "RIFF"
  WEBP_WEBP: [0x57, 0x45, 0x42, 0x50], // "WEBP" at offset 8
};

function validateFileSignature(
  buffer: ArrayBuffer,
  declaredType: string
): boolean {
  const bytes = new Uint8Array(buffer);

  if (declaredType === 'image/png') {
    return FILE_SIGNATURES.PNG.every((byte, i) => bytes[i] === byte);
  }

  if (declaredType === 'image/jpeg') {
    return FILE_SIGNATURES.JPEG.every((byte, i) => bytes[i] === byte);
  }

  if (declaredType === 'image/webp') {
    const riffMatch = FILE_SIGNATURES.WEBP_RIFF.every(
      (byte, i) => bytes[i] === byte
    );
    const webpMatch = FILE_SIGNATURES.WEBP_WEBP.every(
      (byte, i) => bytes[8 + i] === byte
    );
    return riffMatch && webpMatch;
  }

  return false;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const claims = await getSessionClaims();
    if (!claims?.orgId || !claims.permissions?.['workspace:manage']) {
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

    // Reject SVG uploads to avoid XML-based security risks
    if (file.type === 'image/svg+xml') {
      return NextResponse.json(
        {
          success: false,
          message: 'SVG uploads are not supported for security reasons',
        },
        { status: 400 }
      );
    }

    // Validate file content matches declared MIME type
    const fileBuffer = await file.arrayBuffer();
    if (!validateFileSignature(fileBuffer, file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: 'File content does not match declared file type',
        },
        { status: 400 }
      );
    }

    const organizationId = claims.orgId;
    const org = await prisma.organization.findFirst({
      where: { id: organizationId, deletedAt: null },
    });
    if (!org) {
      return NextResponse.json(
        { success: false, message: 'Organization not found' },
        { status: 404 }
      );
    }

    const extension = file.type.split('/')[1];
    const blob = await put(
      `org-logos/${organizationId}-${Date.now()}.${extension}`,
      fileBuffer,
      {
        access: 'public',
        contentType: file.type,
      }
    );

    const updateResult = await prisma.organization.updateMany({
      where: { id: organizationId, deletedAt: null },
      data: { logoUrl: blob.url },
    });

    if (updateResult.count === 0) {
      return NextResponse.json(
        { success: false, message: 'Organization not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { logoUrl: blob.url } });
  } catch (error) {
    console.error('POST /api/workspace/logo error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
