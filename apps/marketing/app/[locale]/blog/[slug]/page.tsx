import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug } from '../../../../lib/blog';
import { Clock, ArrowLeft, Tag } from 'lucide-react';
import type { Locale } from '../../../../i18n-config';
import { BlogCard } from '../../../../components/blog-card';

interface Props {
  params: { locale: Locale; slug: string };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const locales: Locale[] = ['en', 'ar-EG'];
  return locales.flatMap((locale) =>
    posts.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — GateFlow Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = await getAllPosts();
  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 2);

  const initials = post.author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main>
      {/* Header */}
      <section className="px-6 pb-12 pt-24 sm:pt-32">
        <div className="mx-auto max-w-2xl">
          <Link
            href={`/${params.locale}/blog`}
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/${params.locale}/blog?tag=${encodeURIComponent(tag)}`}
                className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-semibold hover:bg-primary/20 transition-colors capitalize"
              >
                <Tag size={10} />
                {tag.replace(/-/g, ' ')}
              </Link>
            ))}
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-border pt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-foreground">{post.author}</p>
                <p className="text-xs">{post.authorTitle}</p>
              </div>
            </div>
            <span>·</span>
            <span>{formattedDate}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {post.readingTime}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-2xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* MDX Content */}
      <article className="px-6 py-12">
        <div className="prose prose-slate dark:prose-invert prose-headings:font-black prose-h2:text-2xl prose-a:text-primary prose-code:bg-muted prose-code:px-1 prose-code:rounded mx-auto max-w-2xl">
          <MDXRemote source={post.content} />
        </div>
      </article>

      <div className="mx-auto max-w-2xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="px-6 py-12">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-lg font-black mb-6">Related posts</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} locale={params.locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-primary p-8 text-center">
            <h2 className="text-2xl font-extrabold text-primary-foreground">
              Ready to upgrade your gate access?
            </h2>
            <p className="mt-2 text-primary-foreground/80">
              Start free with 1 gate and 500 scans/month. No credit card required.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href={`/${params.locale}/contact`}
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-primary hover:bg-white/90 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                href={`/${params.locale}/pricing`}
                className="rounded-xl border border-primary-foreground/30 px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              >
                See Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
