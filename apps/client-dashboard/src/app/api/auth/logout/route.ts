import { NextRequest, NextResponse } from 'next/server';
import { RefreshTokenPayloadSchema } from '@gate-access/types';
import { prisma } from '@gate-access/db';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    const validation = RefreshTokenPayloadSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { refreshToken } = validation.data;

    // Revoke the token if it exists and hasn't been revoked
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: 'Logged out' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
