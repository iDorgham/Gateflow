import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';
import { setAdminSession, clearAdminSession } from '@/lib/admin-auth';

function sha256(message: string) {
  return createHash('sha256').update(message).digest('hex');
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => null);
    const key: string = body?.key ?? '';

    if (!key) {
      return NextResponse.json(
        { success: false, message: 'Access key required.' },
        { status: 400 }
      );
    }

    const expectedKey = process.env.ADMIN_ACCESS_KEY;

    if (!expectedKey || expectedKey.length < 32) {
      console.error(
        'Server Error: ADMIN_ACCESS_KEY is not set or shorter than 32 characters.'
      );
      return NextResponse.json(
        {
          success: false,
          message:
            'Server configuration error: ADMIN_ACCESS_KEY must be at least 32 characters.',
        },
        { status: 503 }
      );
    }
    // Constant-time compare to avoid timing attacks.
    // We compare SHA-256 digests so the comparison length is fixed:
    // - sha256 hex digest is always 64 chars
    // - decoded buffer is always 32 bytes
    const receivedHash = sha256(key);
    const expectedHash = sha256(expectedKey);
    const receivedBuf = Buffer.from(receivedHash, 'hex');
    const expectedBuf = Buffer.from(expectedHash, 'hex');
    if (!timingSafeEqual(receivedBuf, expectedBuf)) {
      return NextResponse.json(
        { success: false, message: 'Invalid access key.' },
        { status: 401 }
      );
    }

    await setAdminSession();

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error('Login Error:', e);
    return NextResponse.json(
      { success: false, message: 'Server error.' },
      { status: 500 }
    );
  }
}

export async function DELETE(): Promise<NextResponse> {
  await clearAdminSession();
  return NextResponse.json({ success: true });
}
