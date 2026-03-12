import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '../../../lib/blog';
import { BlogCard } from '../../../components/blog-card';
import type { Locale } from '../../../i18n-config';

export const metadata: Metadata = {
  title: 'Blog — GateFlow',
  description:
    'Insights on access control, QR security, and digital transformation for compounds, schools, and events across Egypt and the Gulf.',
};

const ALL_TAGS = ['security', 'access-control', 'operations', 'performance', 'technical', 'architecture', 'mena', 'property-management', 'guide'];

export default async function BlogPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { tag?: string };
}) {
  const allPosts = await getAllPosts();
  const activeTag = searchParams.tag ?? '';
  const posts = activeTag
    ? allPosts.filter((p) => p.tags.includes(activeTag))
    : allPosts;

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <main>
      {/* Hero */}
      <section className="px-6 pb-12 pt-24 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">
            THE GATEFLOW BLOG
          </p>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            Insights &amp; Updates
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Deep dives on access control, QR security, and the digital transformation of gated
            communities across Egypt and the Gulf.
          </p>

          {/* Tag filter */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link
              href={`/${locale}/blog`}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                !activeTag
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/70'
              }`}
            >
              All
            </Link>
            {ALL_TAGS.filter((tag) => allPosts.some((p) => p.tags.includes(tag))).map((tag) => (
              <Link
                key={tag}
                href={`/${locale}/blog?tag=${encodeURIComponent(tag)}`}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors capitalize ${
                  activeTag === tag
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                }`}
              >
                {tag.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="px-6 pb-12">
          <div className="mx-auto max-w-5xl">
            <BlogCard post={featured} locale={locale} featured />
          </div>
        </section>
      )}

      {/* Post grid */}
      {rest.length > 0 && (
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <BlogCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <section className="px-6 py-24 text-center">
          <p className="text-muted-foreground">No posts tagged &ldquo;{activeTag}&rdquo; yet.</p>
          <Link
            href={`/${locale}/blog`}
            className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
          >
            View all posts
          </Link>
        </section>
      )}
    </main>
  );
}
