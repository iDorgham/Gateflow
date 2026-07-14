import { CmsBlogClient } from '@/components/cms/CmsBlogClient';
import { Locale } from '@/lib/i18n/i18n-config';

export const metadata = { title: 'Blog Posts' };

export default async function CmsBlogPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  // Mock data
  const initialPosts = [
    {
      id: 'post_1',
      title: 'Announcing GateFlow 20.0: Omega Equilibrium',
      status: 'published',
      publishedAt: '2026-04-20T10:00:00Z',
      author: 'Jane Doe',
      views: 4520,
    },
    {
      id: 'post_2',
      title: 'How to Implement Security at Scale',
      status: 'published',
      publishedAt: '2026-04-12T09:15:00Z',
      author: 'John Smith',
      views: 3105,
    },
    {
      id: 'post_3',
      title: 'Understanding Role-Based Access Control',
      status: 'draft',
      publishedAt: null,
      author: 'Sarah Jenkins',
      views: 0,
    },
  ];

  return <CmsBlogClient initialPosts={initialPosts} />;
}
