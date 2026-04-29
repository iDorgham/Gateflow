import { CmsLandingPagesClient } from '@/components/cms/CmsLandingPagesClient';
import { Locale } from '@/lib/i18n/i18n-config';

export const metadata = { title: 'Landing Pages' };

export default async function CmsLandingPagesPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  // Mock data
  const initialPages = [
    {
      id: 'lp_1',
      title: 'Summer Gate Access Promo',
      campaign: 'Summer 2026',
      status: 'published',
      updatedAt: '2026-05-01T10:00:00Z',
      visits: 12450,
      thumbnail: null,
    },
    {
      id: 'lp_2',
      title: 'Enterprise Webinar Registration',
      campaign: 'Q2 Webinars',
      status: 'published',
      updatedAt: '2026-04-15T09:15:00Z',
      visits: 3200,
      thumbnail: null,
    },
    {
      id: 'lp_3',
      title: 'New Feature Launch: AI Scanner',
      campaign: 'Product Launch V7',
      status: 'draft',
      updatedAt: '2026-04-28T16:45:00Z',
      visits: 0,
      thumbnail: null,
    },
    {
      id: 'lp_4',
      title: 'Holiday Discount - 20% Off',
      campaign: 'Winter 2025',
      status: 'archived',
      updatedAt: '2025-12-01T08:00:00Z',
      visits: 45800,
      thumbnail: null,
    },
  ];

  return <CmsLandingPagesClient initialPages={initialPages} />;
}
