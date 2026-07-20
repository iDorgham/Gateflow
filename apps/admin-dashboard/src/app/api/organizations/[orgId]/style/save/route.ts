import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import {
  filterValidBrandingTokens,
  isValidBrandingTokenKey,
  validateBrandingTokenValue,
} from '@gate-access/types';
import { prisma, withSerializableRetry } from '@gate-access/db';

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

    // Transaction to update branding token overrides and create a versioned snapshot.
    // Serializable isolation so two concurrent saves can't both read the same
    // pre-update `current` and silently overwrite each other's token changes —
    // Postgres aborts the losing transaction with a retryable serialization error
    // instead of a lost update / duplicate snapshot version. withSerializableRetry
    // retries that error a bounded number of times instead of surfacing a 500.
    const result = await withSerializableRetry(prisma, async (tx) => {
      const current = await (tx as any).organizationBranding.findUnique({
        where: { organizationId: orgId },
      });

      const tokenOverrides: Record<string, string> = filterValidBrandingTokens({
        ...((current?.tokenOverrides as Record<string, string>) ?? {}),
      });
      for (const v of variables ?? []) {
        const key = typeof v?.key === 'string' ? v.key : '';
        if (!isValidBrandingTokenKey(key)) continue;
        const value = typeof v?.value === 'string' ? v.value.trim() : '';
        if (!value) {
          delete tokenOverrides[key];
        } else if (validateBrandingTokenValue(value)) {
          tokenOverrides[key] = value;
        }
      }

      const validatedOverrides = filterValidBrandingTokens(tokenOverrides);

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

      // Saving always (re)activates branding — a save on a record that was
      // previously deactivated should make it visible to BrandingStyles.tsx
      // (which reads isActive: true) again, not stay silently invisible.
      return (tx as any).organizationBranding.upsert({
        where: { organizationId: orgId },
        update: {
          tokenOverrides: validatedOverrides,
          version: { increment: 1 },
          isActive: true,
        },
        create: {
          organizationId: orgId,
          tokenOverrides: validatedOverrides,
          version: 1,
          isActive: true,
        },
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[STYLE_SAVE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
