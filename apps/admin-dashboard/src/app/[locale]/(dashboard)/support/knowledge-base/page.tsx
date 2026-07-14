'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Filter,
  FileText,
  ChevronRight,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  Button,
  Input,
  Card,
  CardContent,
  Badge,
  Skeleton,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gateflow/ui';

interface Article {
  id: string;
  title: string;
  category: string;
  author: string;
  views: number;
  updatedAt: string;
  status: 'PUBLISHED' | 'DRAFT';
}

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock fetch for articles
    setTimeout(() => {
      setArticles([
        {
          id: 'KB-001',
          title: 'Gate Scanner Sync Best Practices',
          category: 'Hardware',
          author: 'Dorgham',
          views: 1240,
          updatedAt: '2026-04-20T10:00:00Z',
          status: 'PUBLISHED',
        },
        {
          id: 'KB-002',
          title: 'Managing Organization Roles and Permissions',
          category: 'Security',
          author: 'Sarah',
          views: 850,
          updatedAt: '2026-04-25T14:30:00Z',
          status: 'PUBLISHED',
        },
        {
          id: 'KB-003',
          title: 'Dubai-A Cluster Manual Override',
          category: 'Infrastructure',
          author: 'Omar',
          views: 420,
          updatedAt: '2026-04-28T09:15:00Z',
          status: 'DRAFT',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-ds-icon-brand" />
            Knowledge Base
          </h1>
          <p className="text-xs font-bold text-ds-text-subtler uppercase tracking-widest mt-1">
            Authoritative neural repository for ecosystem documentation and FAQ
          </p>
        </div>

        <Button className="h-11 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] gap-2 px-6 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" /> Create Article
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1">
          {[
            'All Articles',
            'Hardware',
            'Security',
            'Infrastructure',
            'Mobile',
          ].map((cat, i) => (
            <Button
              key={i}
              variant={i === 0 ? 'default' : 'outline'}
              className={cn(
                'h-9 px-4 text-[9px] font-black uppercase tracking-widest rounded-full',
                i === 0
                  ? 'bg-ds-background-brand-bold text-ds-icon-inverse'
                  : 'border-ds-border'
              )}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtler" />
          <Input
            placeholder="Search articles..."
            className="pl-10 h-11 text-xs font-bold border-ds-border bg-card/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-ds-border-brand/40 bg-ds-background-brand-subtle/20 border-dashed group hover:bg-ds-background-brand-subtle/30 transition-all cursor-pointer">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-ds-background-brand-bold flex items-center justify-center text-ds-icon-inverse shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Sparkles className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black uppercase tracking-tight text-ds-text-brand">
                AI Article Generator
              </h3>
              <p className="text-[10px] font-bold text-ds-text-subtler uppercase tracking-widest leading-relaxed">
                Automatically synthesize documentation from support ticket
                clusters
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-[10px] font-black uppercase tracking-widest gap-2"
            >
              Start Synthesis <ArrowRight className="h-3 w-3" />
            </Button>
          </CardContent>
        </Card>

        {isLoading
          ? Array(2)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-2xl" />
              ))
          : articles.map((article) => (
              <Card
                key={article.id}
                className="border-ds-border bg-card/40 backdrop-blur-md group hover:border-ds-border-brand/30 transition-all duration-300 relative overflow-hidden border-dashed"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <Badge
                      variant="outline"
                      className="text-[8px] font-black uppercase tracking-widest px-2 h-5 border-border/40 bg-muted/30"
                    >
                      {article.category}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-ds-text-subtler"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 border-ds-border"
                      >
                        <DropdownMenuItem className="text-[10px] font-black uppercase gap-2 py-2">
                          <Edit3 className="h-3.5 w-3.5" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[10px] font-black uppercase gap-2 py-2 text-rose-500">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-black uppercase tracking-tight group-hover:text-ds-text-brand transition-colors">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-ds-text-subtler">
                      <FileText className="h-3 w-3" /> {article.id} • Last
                      updated {new Date(article.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/20">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase opacity-60">
                          Views
                        </span>
                        <span className="text-xs font-black">
                          {article.views.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-col border-l border-border/30 pl-3">
                        <span className="text-[9px] font-black uppercase opacity-60">
                          Status
                        </span>
                        <span
                          className={cn(
                            'text-[9px] font-black uppercase tracking-widest',
                            article.status === 'PUBLISHED'
                              ? 'text-emerald-500'
                              : 'text-amber-500'
                          )}
                        >
                          {article.status}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl bg-muted/30 hover:bg-ds-background-brand-subtle hover:text-ds-text-brand transition-all"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
