import { NextRequest, NextResponse } from 'next/server';
import type { z } from 'zod';
import type { Permission } from '@gate-access/types';
import { getSessionClaims } from '@/lib/auth-cookies';
import { hasPermission, type AccessTokenClaims } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export type ApiGuardContext = {
  claims: AccessTokenClaims;
  orgId: string;
  body?: unknown;
};

type GuardOptions<TSchema extends z.ZodTypeAny | undefined = undefined> = {
  permission?: Permission;
  schema?: TSchema;
  rateLimit?: { key: string; limit: number; windowMs: number };
};

/**
 * Composable API guards: auth → optional RBAC → optional Zod → optional rate limit.
 * Returns either a NextResponse error or a typed context for the handler.
 */
export async function withApiGuards<TSchema extends z.ZodTypeAny | undefined>(
  request: NextRequest | Request,
  options: GuardOptions<TSchema> = {}
): Promise<
  | NextResponse
  | (ApiGuardContext & {
      data: TSchema extends z.ZodTypeAny ? z.infer<TSchema> : undefined;
    })
> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (options.permission && !hasPermission(claims, options.permission)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (options.rateLimit) {
    const identity = claims.sub ?? claims.orgId;
    const limited = await checkRateLimit(
      `${options.rateLimit.key}:${identity}`,
      options.rateLimit.limit,
      options.rateLimit.windowMs
    );
    if (!limited.allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  let data: unknown = undefined;
  if (options.schema) {
    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const parsed = options.schema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    data = parsed.data;
  }

  return {
    claims,
    orgId: claims.orgId,
    data: data as TSchema extends z.ZodTypeAny ? z.infer<TSchema> : undefined,
  };
}

export function isGuardError(
  result: NextResponse | ApiGuardContext
): result is NextResponse {
  return result instanceof NextResponse;
}
