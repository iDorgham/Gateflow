import { CmsSettingsClient } from '@/components/cms/CmsSettingsClient';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';

export const metadata = { title: 'CMS Settings' };

export default async function CmsSettingsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  // We fetch translations server-side, though the client component also uses useTranslation.
  // We can pass them down or rely on the global translation provider.

  // Mock settings data since Prisma models do not exist yet.
  const initialSettings = {
    siteName: 'GateFlow',
    siteDescription: 'Modern Digital Gate Infrastructure',
    defaultLanguage: 'en',
    timezone: 'Asia/Dubai',
    seo: {
      metaTitleTemplate: '{page_title} | GateFlow',
      metaDescriptionTemplate: '',
      ogImageUrl: 'https://www.gateflow.site/og.jpg',
      twitterCardType: 'summary_large_image',
    },
    headers: {
      gtmId: 'GTM-XXXXX',
      metaPixelId: '',
      customCss: '',
      faviconUrl: '/favicon.ico',
    },
    security: {
      httpsEnforced: true,
      cspEnabled: false,
      xFrameOptions: 'DENY',
    },
    performance: {
      imageOptimization: true,
      lazyLoading: true,
      cdnUrl: '',
      cacheDuration: 3600,
    },
  };

  return <CmsSettingsClient initialSettings={initialSettings} />;
}
