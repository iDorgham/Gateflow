import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { getBlogPosts, getBlogPost as getCmsPost } from './cms';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  authorTitle: string;
  tags: string[];
  excerpt: string;
  readingTime: string;
  content: string;
  isCms?: boolean;
}

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

function parseMdxFile(filePath: string): BlogPost {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const rt = readingTime(content);
  return {
    slug: (data.slug as string) || path.basename(filePath, '.mdx'),
    title: (data.title as string) || '',
    date: (data.date as string) || '',
    author: (data.author as string) || '',
    authorTitle: (data.authorTitle as string) || '',
    tags: (data.tags as string[]) || [],
    excerpt: (data.excerpt as string) || '',
    readingTime: rt.text,
    content,
    isCms: false,
  };
}

export async function getAllPosts(locale: string = 'en'): Promise<BlogPost[]> {
  // 1. Fetch static MDX posts
  let staticPosts: BlogPost[] = [];
  if (fs.existsSync(BLOG_DIR)) {
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
    staticPosts = files.map((f) => parseMdxFile(path.join(BLOG_DIR, f)));
  }

  // 2. Fetch CMS posts
  const cmsPostsData = await getBlogPosts(locale);
  const cmsPosts: BlogPost[] = cmsPostsData.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.publishedAt?.toISOString() || '',
    author: p.author.name,
    authorTitle: 'GateFlow Editorial',
    tags: p.tags.map((t) => t.slug),
    excerpt: p.excerpt,
    readingTime: `${Math.ceil(p.content.split(' ').length / 200)} min read`,
    content: p.content,
    isCms: true,
  }));

  // 3. Merge and sort
  const allPosts = [...staticPosts, ...cmsPosts];
  return allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(
  slug: string,
  locale: string = 'en'
): Promise<BlogPost | null> {
  // 1. Try CMS first
  const cmsPost = await getCmsPost(slug, locale);
  if (cmsPost) {
    return {
      slug: cmsPost.slug,
      title: cmsPost.title,
      date: cmsPost.publishedAt?.toISOString() || '',
      author: cmsPost.author.name,
      authorTitle: 'GateFlow Editorial',
      tags: cmsPost.tags.map((t) => t.slug),
      excerpt: cmsPost.excerpt,
      readingTime: `${Math.ceil(cmsPost.content.split(' ').length / 200)} min read`,
      content: cmsPost.content,
      isCms: true,
    };
  }

  // 2. Fallback to static
  const posts = await getAllPosts(locale);
  return posts.find((p) => p.slug === slug) ?? null;
}
