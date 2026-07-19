import { prisma } from '@gate-access/db';
import { generateBrandingCss } from '@/lib/branding-css-generator';

export async function BrandingStyles({ orgId }: { orgId: string }) {
  const branding = await (prisma as any).organizationBranding.findFirst({
    where: { organizationId: orgId, isActive: true },
  });

  if (!branding) return null;

  const rawTokens =
    (branding.tokenOverrides as Record<string, string> | null) ?? {};
  const tokens = Object.fromEntries(
    Object.entries(rawTokens).filter(
      ([, value]) => typeof value === 'string' && value.trim().length > 0
    )
  );

  if (Object.keys(tokens).length === 0) return null;

  const css = generateBrandingCss(orgId, tokens);

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
