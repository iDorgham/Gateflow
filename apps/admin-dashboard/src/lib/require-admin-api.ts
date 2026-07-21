import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';

/**
 * Auth gate for admin API route handlers.
 * Prefer calling this at the top of every /api/* handler (defense in depth
 * alongside middleware session checks).
 */
export async function requireAdminApi(
  request: Request
): Promise<NextResponse | null> {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }
  return null;
}
