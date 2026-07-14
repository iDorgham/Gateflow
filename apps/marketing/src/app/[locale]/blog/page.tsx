import Link from 'next/link';

async function getBlogPosts(locale: string) {
  const res = await fetch(
    `${process.env.ADMIN_API_URL}/api/cms/blog?locale=${locale}`,
    {
      next: { revalidate: 3600, tags: ['blog-list'] },
    }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.posts || [];
}

/**
 * Blog Index Page (apps/marketing)
 */
export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const posts = await getBlogPosts(locale);

  if (!posts.length)
    return <div className="p-24 text-center">No articles found.</div>;

  return (
    <main
      className="min-h-screen bg-ds-background-neutral py-24 px-6"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto max-w-6xl space-y-12">
        <header className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="text-6xl font-black uppercase tracking-tighter text-ds-text leading-tight">
            Knowledge Sentinel
          </h1>
          <p className="text-lg font-bold text-ds-text-subtle opacity-70">
            Insights on secure community management, access control, and smart
            building resilience.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
          {posts.map(
            (post: {
              id: string;
              slug: string;
              publishedAt: string;
              author: string;
              title: string;
              excerpt: string;
            }) => (
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.slug}`}
                className="group"
              >
                <article className="h-full flex flex-col gap-6 bg-white border border-border/30 rounded-3xl p-8 hover:border-primary/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                  <div className="aspect-[16/10] bg-muted rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary">
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </span>
                      <span className="opacity-30">•</span>
                      <span>By {post.author}</span>
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-ds-text group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm font-bold text-ds-text-subtle opacity-70 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ds-text group-hover:gap-4 transition-all">
                    Read Intelligence Report{' '}
                    <span className="text-primary">→</span>
                  </div>
                </article>
              </Link>
            )
          )}
        </div>
      </div>
    </main>
  );
}
