import { prisma } from '@gate-access/db';
import { generateBrandingCss } from '@/lib/branding-css-generator';

export async function BrandingStyles({ orgId }: { orgId: string }) {
  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
    select: {
      activeStyle: true,
      themeVariables: true
    }
  });

  if (!organization) return null;

  // Use variables or active style snapshot
  const tokens: Record<string, string> = {};
  
  if (organization.activeStyle) {
    Object.assign(tokens, organization.activeStyle.cssTokens);
  }

  // Overrides from individual theme variables
  organization.themeVariables.forEach(v => {
    tokens[v.key] = v.value;
  });

  if (Object.keys(tokens).length === 0) return null;

  const css = generateBrandingCss(orgId, tokens);

  return (
    <style dangerouslySetInnerHTML={{ __html: css }} />
  );
}
