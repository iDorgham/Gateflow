import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';
import { setAdminSession, clearAdminSession } from '@/lib/admin-auth';

function sha256(message: string) {
  return createHash('sha256').update(message).digest('hex');
}

/** Simple sliding-window limiter for login brute-force (per IP). */
const loginAttempts = new Map<string, number[]>();
const LOGIN_LIMIT = 10;
const LOGIN_WINDOW_MS = 60_000;

function allowLoginAttempt(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - LOGIN_WINDOW_MS;
  const prior = (loginAttempts.get(ip) ?? []).filter((t) => t > windowStart);
  if (prior.length >= LOGIN_LIMIT) {
    loginAttempts.set(ip, prior);
    return false;
  }
  prior.push(now);
  loginAttempts.set(ip, prior);
  return true;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    if (!allowLoginAttempt(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many login attempts. Try again later.',
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const key: string = body?.key ?? '';

    if (!key || typeof key !== 'string') {
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
