import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { setAdminSession, clearAdminSession } from '@/lib/admin-auth';

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

    const expectedKey = process.env.ADMIN_ACCESS_KEY ?? 'dev-admin-key-change-in-production';

    // Verify key match
    if (key !== expectedKey) {
      const received = sha256(key);
      const expected = sha256(expectedKey);
      if (received !== expected) {
        return NextResponse.json({ success: false, message: 'Invalid access key.' }, { status: 401 });
      }
    }

    // Set secure session token (signed JWT-like structure)
    setAdminSession();

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    console.error('Login Error:', e);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

export async function DELETE(): Promise<NextResponse> {
  clearAdminSession();
  return NextResponse.json({ success: true });
}
