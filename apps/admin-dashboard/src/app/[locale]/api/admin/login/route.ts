import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';

const COOKIE_NAME = 'admin_session';
const SECURE = process.env.NODE_ENV === 'production';

function sha256(message: string) {
  return createHash('sha256').update(message).digest('hex');
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => null);
    const key: string = body?.key ?? '';

    if (!key) {
      return NextResponse.json({ success: false, message: 'Access key required.' }, { status: 400 });
    }

    const expectedKey = process.env.ADMIN_ACCESS_KEY;

    if (!expectedKey) {
      console.error('Server Error: ADMIN_ACCESS_KEY is not set.');
      return NextResponse.json({ success: false, message: 'Server configuration error.' }, { status: 500 });
    }
    if (key !== expectedKey) {
      const received = sha256(key);
      const expected = sha256(expectedKey);
      if (received !== expected) {
        return NextResponse.json({ success: false, message: 'Invalid access key.' }, { status: 401 });
      }
    }

    const sessionToken = sha256(expectedKey);
    cookies().set(COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: SECURE,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12, // 12 hours
    });

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error('Login Error:', e);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}


export async function DELETE(): Promise<NextResponse> {
  cookies().delete(COOKIE_NAME);
  return NextResponse.json({ success: true });
}

