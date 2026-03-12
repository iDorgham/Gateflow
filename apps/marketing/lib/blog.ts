import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

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
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
  const posts = files.map((f) => parseMdxFile(path.join(BLOG_DIR, f)));
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
