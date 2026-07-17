import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

const MAX_SERIALIZATION_RETRIES = 3;

function isSerializationFailure(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2034'
  );
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ orgId: string }> }
) {
  const params = await props.params;
  const { orgId } = params;

  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { variables } = await req.json();

    // 1. Transaction to update branding token overrides and create a versioned snapshot.
    // Serializable isolation so two concurrent saves can't both read the same
    // pre-update `current` and silently overwrite each other's token changes —
    // Postgres aborts the losing transaction with a retryable serialization error
    // instead of a lost update / duplicate snapshot version.
    let lastError: unknown;
    let result: unknown;

    for (let attempt = 0; attempt < MAX_SERIALIZATION_RETRIES; attempt++) {
      try {
        result = await prisma.$transaction(
          async (tx) => {
            const current = await (tx as any).organizationBranding.findUnique({
              where: { organizationId: orgId },
            });

            const tokenOverrides: Record<string, string> = {
              ...((current?.tokenOverrides as Record<string, string>) ?? {}),
            };
            for (const v of variables ?? []) {
              const value = typeof v?.value === 'string' ? v.value.trim() : '';
              // Empty UI seeds must not persist as CSS resets (`--token: ;`).
              if (!value) {
                delete tokenOverrides[v.key];
              } else {
                tokenOverrides[v.key] = value;
              }
            }

            if (current) {
              // Snapshot the pre-update state
              await (tx as any).brandingSnapshot.create({
                data: {
                  organizationId: orgId,
                  version: current.version,
                  tokenOverrides: current.tokenOverrides,
                  fontFamily: current.fontFamily,
                  fontFamilyArabic: current.fontFamilyArabic,
                  logoUrl: current.logoUrl,
                  // Admin auth is key-based (no User row); BrandingSnapshot.createdById
                  // is a plain string with no FK constraint.
                  createdById: 'ADMIN',
                },
              });
            }

            return (tx as any).organizationBranding.upsert({
              where: { organizationId: orgId },
              update: {
                tokenOverrides,
                version: { increment: 1 },
              },
              create: {
                organizationId: orgId,
                tokenOverrides,
                version: 1,
              },
            });
          },
          { isolationLevel: 'Serializable' }
        );
        lastError = undefined;
        break;
      } catch (error) {
        lastError = error;
        if (
          !isSerializationFailure(error) ||
          attempt === MAX_SERIALIZATION_RETRIES - 1
        ) {
          throw error;
        }
      }
    }

    if (lastError) throw lastError;

    return NextResponse.json(result);
  } catch (error) {
    console.error('[STYLE_SAVE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
