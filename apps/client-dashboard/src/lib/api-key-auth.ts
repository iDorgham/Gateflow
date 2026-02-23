/**
 * API Key Authentication Middleware
 *
 * Validates incoming requests that carry a GateFlow API key in the
 * Authorization header (Bearer scheme).
 *
 * Usage in an API route:
 *   const auth = await validateApiKey(request, 'QR_READ');
 *   if (!auth.success) return NextResponse.json({ message: auth.message }, { status: auth.status });
 *   // auth.orgId is now available
 */

import { createHash } from 'crypto';
import { NextRequest } from 'next/server';
import { prisma } from '@gate-access/db';
import type { ApiScope } from '@gate-access/db';

interface ApiKeyAuthSuccess {
  success: true;
  orgId: string;
  keyId: string;
}

interface ApiKeyAuthFailure {
  success: false;
  status: 401 | 403;
  message: string;
}

export type ApiKeyAuthResult = ApiKeyAuthSuccess | ApiKeyAuthFailure;

/**
 * Validate the Bearer API key on an incoming request.
 *
 * @param request       The Next.js request object.
 * @param requiredScope Optional scope the key must have for authorization.
 */
export async function validateApiKey(
  request: NextRequest,
  requiredScope?: ApiScope
): Promise<ApiKeyAuthResult> {
  // 1. Extract Bearer token
  const authHeader = request.headers.get('authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) {
    return { success: false, status: 401, message: 'Missing Authorization header' };
  }

  const rawKey = authHeader.slice(7).trim();
  if (!rawKey) {
    return { success: false, status: 401, message: 'Empty API key' };
  }

  // 2. Hash the key for lookup
  const keyHash = createHash('sha256').update(rawKey).digest('hex');

  // 3. Look up by hash
  const apiKey = await prisma.apiKey.findUnique({
    where: { keyHash },
    select: {
      id: true,
      organizationId: true,
      scopes: true,
      expiresAt: true,
    },
  });

  if (!apiKey) {
    return { success: false, status: 401, message: 'Invalid API key' };
  }

  // 4. Check expiry
  if (apiKey.expiresAt && apiKey.expiresAt <= new Date()) {
    return { success: false, status: 401, message: 'API key has expired' };
  }

  // 5. Check scope
  if (requiredScope && !apiKey.scopes.includes(requiredScope)) {
    return {
      success: false,
      status: 403,
      message: `This API key does not have the required scope: ${requiredScope}`,
    };
  }

  // 6. Update lastUsedAt (fire-and-forget — non-blocking)
  void prisma.apiKey
    .update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    })
    .catch((err) => console.error('[api-key-auth] Failed to update lastUsedAt:', err));

  return {
    success: true,
    orgId: apiKey.organizationId,
    keyId: apiKey.id,
  };
}
