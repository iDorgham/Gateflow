import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogPost, getBlogPosts } from '../../../lib/blog-data';
import { Clock, Tag, ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const allPosts = getBlogPosts();
  const idx = allPosts.findIndex((p) => p.slug === post.slug);
  const prev = idx > 0 ? allPosts[idx - 1] : null;
  const next = idx < allPosts.length - 1 ? allPosts[idx + 1] : null;

  return (
    <main>
      {/* Header */}
      <section className="px-6 pb-12 pt-24 sm:pt-32">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 text-xs font-bold">
              {post.category}
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-0.5 text-xs"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-6 flex items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-400 text-sm font-bold">
                {post.author.initials}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{post.author.name}</p>
                <p className="text-xs">{post.author.role}</p>
              </div>
            </div>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock size={13} />
              {post.readTime} min read
            </span>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-2xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
      </div>

      {/* Content */}
      <article className="px-6 py-12">
        <div className="prose-gateflow mx-auto max-w-2xl">
          {post.sections.map((section, i) => (
            <div key={i}>
              {section.heading && <h2>{section.heading}</h2>}
              <p>{section.body}</p>
              {section.list && (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </article>

      {/* Divider */}
      <div className="mx-auto max-w-2xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
      </div>

      {/* Post nav */}
      <nav className="px-6 py-12">
        <div className="mx-auto max-w-2xl flex items-center justify-between gap-4">
          {prev ? (
            <Link
              href={`/blog/${prev.slug}`}
              className="group flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm hover:shadow-md transition-all max-w-xs"
            >
              <ArrowLeft size={16} className="mt-0.5 shrink-0 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              <div>
                <p className="text-xs text-slate-400 mb-1">Previous</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                  {prev.title}
                </p>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="group flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm hover:shadow-md transition-all max-w-xs text-right"
            >
              <div>
                <p className="text-xs text-slate-400 mb-1">Next</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                  {next.title}
                </p>
              </div>
              <ArrowRight size={16} className="mt-0.5 shrink-0 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </nav>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-indigo-700 p-8 text-center">
            <h2 className="text-2xl font-extrabold text-white">Ready to upgrade your gate access?</h2>
            <p className="mt-2 text-indigo-200">
              Start free with 1 gate and 500 scans/month. No credit card required.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition-colors"
              >
                Start Free Trial
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-indigo-500 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-600 transition-colors"
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
