import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogPosts, BLOG_CATEGORIES } from '../../../lib/blog-data';
import { Clock, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Insights on access control, QR security, digital transformation for compounds, schools, and events across Egypt and the Gulf.',
};

const CATEGORY_COLORS: Record<string, string> = {
  Industry: 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400',
  Security: 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400',
  Technical: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400',
  'Use Cases': 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400',
  Changelog: 'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400',
};

export default function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const activeCategory = searchParams.category ?? 'All';
  const posts =
    activeCategory === 'All'
      ? getBlogPosts()
      : getBlogPosts(activeCategory);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <main>
      {/* Hero */}
      <section className="px-6 pb-12 pt-24 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-indigo-600">
            THE GATEFLOW BLOG
          </p>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Insights & Updates
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500 dark:text-slate-400">
            Deep dives on access control, QR security, and the digital transformation of gated
            communities across Egypt and the Gulf.
          </p>

          {/* Category filter */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {BLOG_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={cat === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  activeCategory === cat
                    ? 'bg-indigo-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured post */}
      {featured && (
        <section className="px-6 pb-12">
          <div className="mx-auto max-w-5xl">
            <Link
              href={`/blog/${featured.slug}`}
              className="group block rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="grid md:grid-cols-5">
                {/* Color bar */}
                <div className="h-2 bg-gradient-to-r from-indigo-600 to-[#00C9A7] md:col-span-5" />
                <div className="p-8 md:col-span-3">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        CATEGORY_COLORS[featured.category] ?? 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {featured.category}
                    </span>
                    <span className="text-xs text-slate-400">Featured</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-slate-500 dark:text-slate-400 leading-relaxed">
                    {featured.excerpt}
                  </p>
                  <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-400 text-xs font-bold">
                        {featured.author.initials}
                      </div>
                      {featured.author.name}
                    </span>
                    <span>{featured.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {featured.readTime} min
                    </span>
                  </div>
                </div>
                <div className="hidden md:flex md:col-span-2 items-center justify-center p-8 bg-slate-50 dark:bg-slate-700/30">
                  <div className="space-y-2 w-full">
                    {featured.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"
                      >
                        <Tag size={11} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Post grid */}
      {rest.length > 0 && (
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      CATEGORY_COLORS[post.category] ?? 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {post.category}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold">
                        {post.author.initials}
                      </div>
                      {post.author.name}
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {post.readTime} min
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <section className="px-6 py-24 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            No posts in this category yet. Check back soon.
          </p>
          <Link href="/blog" className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:underline">
            View all posts
          </Link>
        </section>
      )}
    </main>
  );
}
