import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';

/**
 * Short-link resolver for compact QR codes.
 *
 * URL: /s/{shortId}
 *
 * Always returns the raw signed QR payload as plain text (no HTML, no redirects).
 * The GateFlow Scanner app fetches this URL directly, extracts the payload, and
 * validates it against /api/qrcodes/validate.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { shortId: string } },
): Promise<NextResponse> {
  const { shortId } = params;

  const link = await prisma.qrShortLink.findUnique({ where: { shortId } });

  if (!link) {
    return new NextResponse('Not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  if (link.expiresAt && new Date() > link.expiresAt) {
    return new NextResponse('QR link expired', {
      status: 410,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new NextResponse(link.fullPayload, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
