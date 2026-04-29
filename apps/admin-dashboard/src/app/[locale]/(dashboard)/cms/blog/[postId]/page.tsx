import { BlogEditorClient } from '@/components/cms/blog/BlogEditorClient';
import { Locale } from '@/lib/i18n/i18n-config';

export const metadata = { title: 'Blog Editor' };

export default async function BlogEditorPage(props: {
  params: Promise<{ locale: Locale; postId: string }>;
  searchParams: Promise<{ topic?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { locale, postId } = params;
  const topic = searchParams.topic;

  // In real app, fetch post data if postId !== 'new'
  const initialPost =
    postId === 'new'
      ? null
      : {
          id: postId,
          title: 'The Future of Smart Gate Access',
          excerpt:
            'Exploring how AI and IoT are transforming perimeter security...',
          content: [],
          status: 'draft',
          categoryId: 'tech',
          tags: ['ai', 'security'],
        };

  return (
    <BlogEditorClient
      postId={postId}
      initialPost={initialPost}
      initialTopic={topic}
    />
  );
}
