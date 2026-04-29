import { CmsMenusClient } from '@/components/cms/CmsMenusClient';
import { Locale } from '@/lib/i18n/i18n-config';

export const metadata = { title: 'Navigation Menus' };

export default async function CmsMenusPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  // Mock data
  const initialMenus = [
    {
      id: 'menu_1',
      title: 'Main Navigation',
      locations: ['Header', 'Mobile Navbar'],
      items: 6,
      updatedAt: '2026-04-25T10:00:00Z',
    },
    {
      id: 'menu_2',
      title: 'Footer Links',
      locations: ['Footer Column 1'],
      items: 4,
      updatedAt: '2026-04-10T09:15:00Z',
    },
    {
      id: 'menu_3',
      title: 'Legal Links',
      locations: ['Footer Bottom'],
      items: 3,
      updatedAt: '2026-01-15T16:45:00Z',
    },
  ];

  return <CmsMenusClient initialMenus={initialMenus} />;
}
