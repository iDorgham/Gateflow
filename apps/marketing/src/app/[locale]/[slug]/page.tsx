import { notFound } from 'next/navigation';

async function getPageData(slug: string, locale: string) {
  // Use absolute URL from environment in production
  const res = await fetch(
    `${process.env.ADMIN_API_URL}/api/cms/pages/${slug}?locale=${locale}`,
    {
      next: { tags: [`landing-page-${slug}`], revalidate: 3600 },
    }
  );

  if (!res.ok) return null;
  return res.json();
}

/**
 * Dynamic Landing Page Renderer (apps/marketing)
 * Consumes Headless CMS data from the Admin Dashboard.
 */
export default async function CMSLandingPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const data = await getPageData(slug, locale);

  if (!data?.page) notFound();

  return (
    <main
      className="min-h-screen bg-ds-background-neutral"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      {data.page.sections.map(
        (section: {
          id: string;
          content: { headline: string; body: string; ctaText: string };
        }) => (
          <section key={section.id} className="py-24 border-b border-border/30">
            <div className="container mx-auto px-6 max-w-4xl text-center space-y-8">
              <h1 className="text-5xl font-black uppercase tracking-tighter text-ds-text leading-[1.1]">
                {section.content.headline}
              </h1>
              <p className="text-lg font-bold text-ds-text-subtle opacity-70 leading-relaxed max-w-2xl mx-auto">
                {section.content.body}
              </p>
              <div className="pt-8">
                <button className="bg-ds-background-brand-bold text-ds-icon-inverse px-10 h-14 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all">
                  {section.content.ctaText}
                </button>
              </div>
            </div>
          </section>
        )
      )}
    </main>
  );
}
