'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Input,
  Card,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Badge,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@gateflow/ui';
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  BookOpen,
} from 'lucide-react';
import { format } from 'date-fns';
import { AITopicSuggester, TopicSuggestion } from './blog/ai-topic-suggester';
import { useRouter } from 'next/navigation';

export function CmsBlogClient({
  initialPosts,
}: {
  initialPosts: {
    id: string;
    title: string;
    status: string;
    author: string;
    publishedAt: string | null;
    views: number;
  }[];
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState('');

  const handleTopicSelect = (topic: TopicSuggestion) => {
    // Navigate to editor with topic pre-selected
    router.push(`/en/cms/blog/new?topic=${encodeURIComponent(topic.title)}`);
  };

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ds-text">
            {t('cms:blog.title', 'Blog Posts')}
          </h1>
          <p className="text-ds-text-subtle mt-1">
            {t(
              'cms:blog.subtitle',
              'Manage articles, news, and company updates.'
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AITopicSuggester onSelect={handleTopicSelect} />
          <Button
            onClick={() => router.push('/en/cms/blog/new')}
            className="gap-2 bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold/90"
          >
            <Plus className="h-4 w-4" />
            {t('cms:blog.create', 'Write Post')}
          </Button>
        </div>
      </div>

      <Card className="border-ds-border shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 border-b border-ds-border flex items-center justify-between bg-ds-surface-subtle">
            <div className="relative w-full max-w-sm">
              <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-icon-subtle" />
              <Input
                placeholder={t('cms:blog.search', 'Search posts...')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ltr:pl-9 rtl:pr-9 bg-ds-surface border-ds-border"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-ds-text-subtle font-medium">
              <span>{filteredPosts.length} Posts</span>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-ds-surface-subtle">
              <TableRow className="border-ds-border hover:bg-transparent">
                <TableHead className="w-[400px]">Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="w-[70px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-ds-text-subtle"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <BookOpen className="h-8 w-8 text-ds-icon-subtlest" />
                      <p>No blog posts found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id} className="border-ds-border group">
                    <TableCell className="font-medium">
                      <button
                        onClick={() => router.push(`/en/cms/blog/${post.id}`)}
                        className="hover:text-ds-text-brand hover:underline transition-colors text-left"
                      >
                        {post.title}
                      </button>
                    </TableCell>
                    <TableCell>
                      {post.status === 'published' ? (
                        <Badge
                          variant="default"
                          className="bg-ds-background-success text-ds-text-success font-bold px-2.5 py-0.5 rounded-md"
                        >
                          Published
                        </Badge>
                      ) : post.status === 'scheduled' ? (
                        <Badge
                          variant="outline"
                          className="bg-ds-background-brand-subtle text-ds-text-brand border-ds-border-brand/30 font-bold px-2.5 py-0.5 rounded-md"
                        >
                          Scheduled
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-ds-background-neutral text-ds-text-subtle font-bold px-2.5 py-0.5 rounded-md"
                        >
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-ds-text-subtle text-sm">
                      {post.author}
                    </TableCell>
                    <TableCell className="text-ds-text-subtle text-sm">
                      {post.publishedAt
                        ? format(new Date(post.publishedAt), 'MMM d, yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {post.views.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[160px] border-ds-border shadow-md"
                        >
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/en/cms/blog/${post.id}`)
                            }
                            className="gap-2 cursor-pointer"
                          >
                            <Edit className="h-4 w-4 text-ds-icon-subtle" />{' '}
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Eye className="h-4 w-4 text-ds-icon-subtle" />{' '}
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-ds-border" />
                          <DropdownMenuItem className="gap-2 cursor-pointer text-ds-text-danger focus:text-ds-text-danger focus:bg-ds-background-danger">
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
