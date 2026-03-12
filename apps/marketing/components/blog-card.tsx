import Link from 'next/link';
import { Clock, Tag } from 'lucide-react';
import type { BlogPost } from '../lib/blog';
import type { Locale } from '../i18n-config';

const TAG_COLORS: Record<string, string> = {
  security: 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400',
  'access-control': 'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400',
  operations: 'bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400',
  performance: 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400',
  technical: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400',
  architecture: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400',
  mena: 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400',
  'property-management': 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
  guide: 'bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400',
};

interface BlogCardProps {
  post: BlogPost;
  locale: Locale;
  featured?: boolean;
}

export function BlogCard({ post, locale, featured = false }: BlogCardProps) {
  const href = `/${locale}/blog/${post.slug}`;
  const initials = post.author
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  if (featured) {
    return (
      <Link
        href={href}
        className="group block rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
      >
        <div className="h-1.5 bg-gradient-to-r from-primary to-primary/40" />
        <div className="grid md:grid-cols-5">
          <div className="p-8 md:col-span-3">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${TAG_COLORS[tag] ?? 'bg-muted text-muted-foreground'}`}
                >
                  {tag}
                </span>
              ))}
              <span className="text-xs text-muted-foreground">Featured</span>
            </div>
            <h2 className="text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors leading-snug">
              {post.title}
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                  {initials}
                </div>
                {post.author}
              </span>
              <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {post.readingTime}
              </span>
            </div>
          </div>
          <div className="hidden md:flex md:col-span-2 items-center justify-center p-8 bg-muted/30">
            <div className="space-y-2 w-full">
              {post.tags.map((tag) => (
                <span key={tag} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Tag size={11} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div className="flex flex-wrap gap-1.5 mb-3">
        {post.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${TAG_COLORS[tag] ?? 'bg-muted text-muted-foreground'}`}
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
        {post.title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
        {post.excerpt}
      </p>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
            {initials}
          </div>
          {post.author}
        </div>
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {post.readingTime}
        </span>
      </div>
    </Link>
  );
}
