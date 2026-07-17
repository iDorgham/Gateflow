import { prisma } from '@gate-access/db';
import { generateBrandingCss } from '@/lib/branding-css-generator';

export async function BrandingStyles({ orgId }: { orgId: string }) {
  const branding = await (prisma as any).organizationBranding.findUnique({
    where: { organizationId: orgId },
  });

  if (!branding) return null;

  const tokens: Record<string, string> = {
    ...((branding.tokenOverrides as Record<string, string>) ?? {}),
  };

  if (Object.keys(tokens).length === 0) return null;

  const css = generateBrandingCss(orgId, tokens);

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
