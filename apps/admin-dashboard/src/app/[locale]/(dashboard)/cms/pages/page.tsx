import { CmsPagesClient } from '@/components/cms/CmsPagesClient';
import { Locale } from '@/lib/i18n/i18n-config';

export const metadata = { title: 'CMS Pages' };

export default async function CmsPagesPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  // Mock pages data since Prisma models do not exist yet.
  const initialPages = [
    {
      id: 'page_1',
      title: 'Home',
      slug: '/',
      status: 'published',
      publishedAt: '2026-04-01T10:00:00Z',
      updatedAt: '2026-04-20T14:30:00Z',
      author: { id: 'usr_1', name: 'Admin User' },
    },
    {
      id: 'page_2',
      title: 'About Us',
      slug: '/about',
      status: 'published',
      publishedAt: '2026-04-05T09:15:00Z',
      updatedAt: '2026-04-18T11:20:00Z',
      author: { id: 'usr_1', name: 'Admin User' },
    },
    {
      id: 'page_3',
      title: 'Services',
      slug: '/services',
      status: 'draft',
      publishedAt: null,
      updatedAt: '2026-04-28T16:45:00Z',
      author: { id: 'usr_2', name: 'Content Editor' },
    },
    {
      id: 'page_4',
      title: 'Contact',
      slug: '/contact',
      status: 'published',
      publishedAt: '2026-04-10T08:00:00Z',
      updatedAt: '2026-04-10T08:00:00Z',
      author: { id: 'usr_1', name: 'Admin User' },
    },
  ];

  return <CmsPagesClient initialPages={initialPages} />;
}
