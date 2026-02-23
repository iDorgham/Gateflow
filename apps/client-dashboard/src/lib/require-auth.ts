import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, type AccessTokenClaims } from './auth';

/**
 * Extract and verify JWT from Authorization header.
 * Returns claims on success or a 401 NextResponse on failure.
 */
export async function requireAuth(
  request: NextRequest
): Promise<AccessTokenClaims | NextResponse> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json(
      { success: false, message: 'Missing or invalid Authorization header' },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7);
  try {
    return await verifyAccessToken(token);
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid or expired access token' },
      { status: 401 }
    );
  }
}

export function isNextResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}
