import { prisma } from '@gate-access/db';
import { generateBrandingCss } from '@/lib/branding-css-generator';

export async function BrandingStyles({ orgId }: { orgId: string }) {
  const branding = await (prisma as any).organizationBranding.findFirst({
    where: { organizationId: orgId, isActive: true },
  });

  if (!branding) return null;

  const rawTokens =
    (branding.tokenOverrides as Record<string, string> | null) ?? {};
  const css = generateBrandingCss(orgId, rawTokens);
  if (!css) return null;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
