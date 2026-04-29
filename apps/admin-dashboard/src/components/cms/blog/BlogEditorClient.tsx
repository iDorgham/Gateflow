'use client';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardContent,
  Label,
  Badge,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@gateflow/ui';
import {
  Save,
  Eye,
  Settings,
  Image as ImageIcon,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  Share2,
  Clock,
  Plus,
  FileText,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AIDraftGenerator, BlogDraft } from './ai-draft-generator';
import { BlockLibrary } from '../builder/block-library';
import { ContentBlocksRenderer } from '../builder/content-blocks-renderer';
import { BlockType } from '../blocks/types';
import { toast } from 'sonner';

interface BlogEditorClientProps {
  postId: string;
  initialPost: any;
  initialTopic?: string;
}

export function BlogEditorClient({
  postId,
  initialPost,
  initialTopic,
}: BlogEditorClientProps) {
  const router = useRouter();
  const [post, setPost] = useState(
    initialPost || {
      title: '',
      excerpt: '',
      content: [],
      status: 'draft',
      categoryId: '',
      tags: [],
    }
  );
  const [topic, setTopic] = useState(initialTopic || '');
  const [activeTab, setActiveTab] = useState('editor');

  const handleInsertDraft = (draft: BlogDraft) => {
    setPost({
      ...post,
      title: draft.title,
      excerpt: draft.excerpt,
      content: draft.sections,
      aiGenerated: true,
    });
    setTopic(draft.title);
    toast.success('AI Draft inserted into editor');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-ds-surface-sunken">
      {/* Top Header */}
      <div className="h-16 border-b border-ds-border bg-ds-surface px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 w-px bg-ds-border mx-1" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-ds-text-subtle tracking-widest">
              Blog Architect
            </span>
            <h1 className="text-sm font-bold text-ds-text line-clamp-1">
              {post.title || 'Untitled Masterpiece'}
            </h1>
          </div>
          {post.aiGenerated && (
            <Badge className="bg-ds-background-brand-subtle text-ds-text-brand border-ds-border-brand/30 font-black text-[9px] uppercase tracking-widest ml-2">
              <Sparkles className="h-3 w-3 mr-1" /> AI Assisted
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs font-bold uppercase"
          >
            <Eye className="h-4 w-4 mr-2" /> Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-bold uppercase border-ds-border"
          >
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </Button>
          <Button className="bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold/90 text-xs font-black uppercase shadow-lg px-6">
            <Share2 className="h-4 w-4 mr-2" /> Publish
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Settings & AI */}
        <div className="w-[380px] border-r border-ds-border bg-ds-surface overflow-y-auto p-6 space-y-8 shrink-0">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-ds-text-brand" />
              <h3 className="text-xs font-black uppercase tracking-widest text-ds-text">
                Post Configuration
              </h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-ds-text-subtle">
                  Display Title
                </Label>
                <Input
                  value={post.title}
                  onChange={(e) => setPost({ ...post, title: e.target.value })}
                  placeholder="The art of secure access..."
                  className="font-bold text-sm bg-ds-surface-sunken"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase text-ds-text-subtle">
                  Excerpt (EN)
                </Label>
                <Textarea
                  value={post.excerpt}
                  onChange={(e) =>
                    setPost({ ...post, excerpt: e.target.value })
                  }
                  placeholder="A brief summary for cards and SEO..."
                  className="text-xs min-h-[100px] bg-ds-surface-sunken"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-ds-text-subtle">
                    Category
                  </Label>
                  <Select
                    value={post.categoryId}
                    onValueChange={(val) =>
                      setPost({ ...post, categoryId: val })
                    }
                  >
                    <SelectTrigger className="h-9 text-xs bg-ds-surface-sunken">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="proptech">PropTech</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase text-ds-text-subtle">
                    Status
                  </Label>
                  <div className="flex items-center gap-2 h-9 px-3 rounded-md bg-ds-background-neutral-subtle border border-ds-border text-[10px] font-black uppercase text-ds-text-subtle">
                    <Clock className="h-3 w-3" /> {post.status}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-ds-text-brand" />
              <h3 className="text-xs font-black uppercase tracking-widest text-ds-text">
                AI Creative Suite
              </h3>
            </div>

            <AIDraftGenerator topic={topic} onInsert={handleInsertDraft} />
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-ds-text-brand" />
              <h3 className="text-xs font-black uppercase tracking-widest text-ds-text">
                Media Assets
              </h3>
            </div>
            <Card className="border-ds-border border-dashed bg-ds-surface-sunken hover:bg-ds-background-neutral-subtle transition-colors cursor-pointer group">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-full bg-ds-surface flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                  <ImageIcon className="h-6 w-6 text-ds-icon-subtle" />
                </div>
                <p className="text-[10px] font-bold uppercase text-ds-text-subtle">
                  Upload Cover Image
                </p>
                <p className="text-[9px] text-ds-text-subtlest mt-1">
                  Recommended: 1600 x 900px
                </p>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 overflow-y-auto p-12 bg-ds-surface-sunken/50">
          <div className="max-w-4xl mx-auto space-y-12 bg-ds-surface p-16 rounded-3xl shadow-2xl border border-ds-border relative">
            {/* SEO Visual Badge */}
            <div className="absolute top-8 right-8 flex items-center gap-2 px-3 py-1 bg-ds-background-success/10 text-ds-text-success border border-ds-border-success/20 rounded-full text-[10px] font-black uppercase tracking-wider">
              <CheckCircle2 className="h-3 w-3" /> SEO Optimized Structure
            </div>

            {post.content && post.content.length > 0 ? (
              <ContentBlocksRenderer blocks={post.content} />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
                <div className="h-20 w-20 rounded-3xl bg-ds-surface-sunken border border-ds-border flex items-center justify-center">
                  <FileText className="h-10 w-10 text-ds-icon-subtle" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-ds-text mb-2">
                    Start Designing Your Post
                  </h2>
                  <p className="text-sm text-ds-text-subtle max-w-sm mx-auto">
                    Use the block library to build your content or use the AI
                    Architect on the left to generate a starting draft.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-ds-border font-bold uppercase text-xs"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Your First Block
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Block Library */}
        <div className="w-[300px] border-l border-ds-border bg-ds-surface overflow-y-auto shrink-0">
          <div className="p-6 border-b border-ds-border">
            <h3 className="text-xs font-black uppercase tracking-widest text-ds-text">
              Block Library
            </h3>
          </div>
          <BlockLibrary
            onAddBlock={(type) => {
              const newBlock = {
                id: Math.random().toString(36).substr(2, 9),
                type: type,
                content: {}, // Default content should be handled by registry or component
              };
              setPost({ ...post, content: [...post.content, newBlock] });
              toast.success(`${type} block added`);
            }}
          />
        </div>
      </div>
    </div>
  );
}
