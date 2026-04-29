import { EditorClient } from '@/components/cms/builder/editor-client';
import { Locale } from '@/lib/i18n/i18n-config';

export const metadata = { title: 'Page Builder' };

export default async function PageEditorPage(props: {
  params: Promise<{ locale: Locale; pageId: string }>;
}) {
  const params = await props.params;
  const { locale, pageId } = params;

  // Render the editor full width/height (hides standard layout paddings if handled correctly by layout.tsx,
  // or we can just render the client inside the existing container)

  // Initialize with some mock data for demo purposes
  const initialBlocks = [
    {
      id: 'HERO_1',
      type: 'HERO',
      content: {
        en: {
          headline: 'The future of access control',
          subheadline: 'Manage your gates effortlessly.',
          ctaText: 'Get Started',
        },
        ar: {
          headline: 'مستقبل التحكم بالوصول',
          subheadline: 'أدر بواباتك بسهولة.',
          ctaText: 'ابدأ الآن',
        },
      },
      styles: {
        textAlign: 'center',
      },
    },
  ] as any[];

  return (
    <div className="-m-6 h-[calc(100vh-64px)]">
      <EditorClient
        initialBlocks={initialBlocks}
        locale={locale as any}
        pageId={pageId}
      />
    </div>
  );
}
