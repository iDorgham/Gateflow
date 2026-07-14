import { notFound } from 'next/navigation';

async function getBlogPost(slug: string, locale: string) {
  const res = await fetch(
    `${process.env.ADMIN_API_URL}/api/cms/blog?slug=${slug}&locale=${locale}`,
    {
      next: { revalidate: 3600, tags: [`blog-${slug}`] },
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.post;
}

/**
 * Single Blog Post Page (apps/marketing)
 * Renders an AI-generated intelligence report in a premium reading environment.
 */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getBlogPost(slug, locale);

  if (!post) notFound();

  return (
    <article
      className="min-h-screen bg-ds-background-neutral py-32 px-6"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto max-w-3xl space-y-12">
        {/* HEADER */}
        <header className="space-y-8 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary">
            <span>By {post.author.name}</span>
            <span className="opacity-30">•</span>
            <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            <span className="opacity-30">•</span>
            {post.categories.map((c: { slug: string; name: string }) => (
              <span
                key={c.slug}
                className="bg-primary/10 px-3 py-1 rounded-full"
              >
                {c.name}
              </span>
            ))}
          </div>

          <h1 className="text-6xl font-black uppercase tracking-tighter text-ds-text leading-[1.05] drop-shadow-sm">
            {post.title}
          </h1>

          <p className="text-xl font-bold text-ds-text-subtle leading-normal italic opacity-80 border-l-4 border-primary pl-6 ml-6">
            {post.excerpt}
          </p>
        </header>

        {/* FEATURED IMAGE STUB */}
        <div className="aspect-[21/9] bg-muted/20 rounded-[3rem] border border-border/30 overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        </div>

        {/* CONTENT */}
        <div
          className="prose prose-xl prose-slate max-w-none pt-12 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:font-bold prose-p:text-ds-text-subtle prose-p:leading-loose text-ds-text"
          dangerouslySetInnerHTML={{ __html: post.content }} // In a real app, use a Markdown parser
        />

        {/* FOOTER */}
        <footer className="pt-24 border-t border-border/30">
          <div className="bg-white rounded-3xl p-12 text-center space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-widest">
              About the Intelligence Group
            </h3>
            <p className="text-sm font-bold text-ds-text-subtler opacity-70 max-w-lg mx-auto">
              GateFlow Intelligence provides research and strategic guidance for
              modern urban resilience and secure access automation.
            </p>
          </div>
        </footer>
      </div>
    </article>
  );
}
