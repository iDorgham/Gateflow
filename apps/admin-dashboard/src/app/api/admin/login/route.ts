import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session';
const SECURE = process.env.NODE_ENV === 'production';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => null);
    const key: string = body?.key ?? '';

    if (!key) {
      return NextResponse.json({ success: false, message: 'Access key required.' }, { status: 400 });
    }

    const expectedKey = process.env.ADMIN_ACCESS_KEY ?? 'dev-admin-key-change-in-production';
    if (key !== expectedKey) {
      // Constant-time comparison via sha256 to avoid timing attacks
      const received = createHash('sha256').update(key).digest('hex');
      const expected = createHash('sha256').update(expectedKey).digest('hex');
      if (received !== expected) {
        return NextResponse.json({ success: false, message: 'Invalid access key.' }, { status: 401 });
      }
    }

    const sessionToken = createHash('sha256').update(expectedKey).digest('hex');
    cookies().set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: SECURE,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12, // 12 hours
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

export async function DELETE(): Promise<NextResponse> {
  cookies().delete(COOKIE_NAME);
  return NextResponse.json({ success: true });
}
