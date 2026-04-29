'use client';

import * as React from 'react';

import {
  FileText,
  Sparkles,
  Languages,
  Globe,
  Search,
  CheckCircle2,
  Image as ImageIcon,
  Send,
  Eye,
  History,
  Type,
  Info,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Input,
  Label,
  cn,
  ScrollArea,
  Separator,
} from '@gateflow/ui';
import { toast } from 'sonner';

/**
 * Premium AI Blog Editor
 * Studio-grade writing environment with bi-lingual parity.
 */
export function BlogEditor({ postId: _postId }: { postId?: string }) {
  const [activeLocale, setActiveLocale] = React.useState<'en' | 'ar'>('en');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [topic, setTopic] = React.useState('');

  // Blog State
  const [content, setContent] = React.useState({
    en: {
      title: '',
      slug: '',
      body: '',
      excerpt: '',
      metaTitle: '',
      metaDesc: '',
    },
    ar: {
      title: '',
      slug: '',
      body: '',
      excerpt: '',
      metaTitle: '',
      metaDesc: '',
    },
  });

  const handleAICompose = async () => {
    if (!topic) return;
    setIsGenerating(true);
    toast.promise(
      fetch('/api/cms/generate-blog', {
        method: 'POST',
        body: JSON.stringify({ topic, title: topic, orgId: 'GLOBAL' }),
      }).then((res) => res.json()),
      {
        loading: 'Drafting multi-lingual blog content...',
        success: (data: { draft: { en: any; ar: any } }) => {
          setContent({
            en: data.draft.en,
            ar: data.draft.ar,
          });
          return 'AI Draft generated! Review and localize below.';
        },
        error: 'AI content engine failed.',
      }
    );
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] w-full gap-6 animate-in fade-in duration-1000 overflow-hidden">
      {/* TOOLBAR */}
      <div className="flex items-center justify-between bg-card/60 backdrop-blur-md p-3 px-6 border border-border/50 rounded-2xl shadow-sm shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 pr-6 border-r border-border/30">
            <FileText className="h-5 w-5 text-primary" />
            <h1 className="text-sm font-black uppercase tracking-tighter">
              Blog Studio v2.0
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border border-border/20">
            <Button
              variant={activeLocale === 'en' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 gap-2 font-black uppercase tracking-widest text-[10px]"
              onClick={() => setActiveLocale('en')}
            >
              <Globe className="h-3.5 w-3.5" /> English
            </Button>
            <Button
              variant={activeLocale === 'ar' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 gap-2 font-black uppercase tracking-widest text-[10px]"
              onClick={() => setActiveLocale('ar')}
            >
              <Languages className="h-3.5 w-3.5" /> Arabic
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="text-[10px] font-black tracking-widest uppercase border-amber-500/30 text-amber-500"
          >
            DRAFT (EN/AR synced)
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <History className="h-4 w-4" /> Versions
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <Eye className="h-4 w-4" /> Global Preview
          </Button>
          <Button className="h-9 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] gap-2 px-6">
            <Send className="h-4 w-4" /> Ready to Publish
          </Button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* MAIN EDITOR AREA */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <Card className="flex-1 border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden flex flex-col">
            <ScrollArea className="flex-1">
              <div
                className={cn(
                  'p-12 max-w-[800px] mx-auto space-y-12',
                  activeLocale === 'ar'
                    ? 'text-right font-arabic'
                    : 'text-left font-sans'
                )}
                dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
              >
                {/* TITLE BOX */}
                <textarea
                  className="w-full bg-transparent border-none text-5xl font-black uppercase tracking-tighter resize-none outline-none focus:ring-0 placeholder:opacity-20 leading-[1.1]"
                  placeholder={
                    activeLocale === 'en'
                      ? 'Article Title...'
                      : 'عنوان المقال...'
                  }
                  value={
                    activeLocale === 'en' ? content.en.title : content.ar.title
                  }
                  rows={1}
                  onChange={(e) => {
                    const val = e.target.value;
                    setContent((prev) => ({
                      ...prev,
                      [activeLocale]: { ...prev[activeLocale], title: val },
                    }));
                  }}
                />

                <div className="flex items-center gap-4 text-xs font-bold text-ds-text-subtler opacity-60">
                  <Badge
                    variant="secondary"
                    className="h-5 text-[9px] font-black uppercase"
                  >
                    v1.2
                  </Badge>
                  <span>800 words</span>
                  <span>12 min read</span>
                </div>

                <Separator className="bg-border/20" />

                {/* CONTENT BODY */}
                <textarea
                  className="w-full bg-transparent border-none text-lg font-bold leading-relaxed resize-none outline-none focus:ring-0 placeholder:opacity-20 h-auto min-h-[500px]"
                  placeholder={
                    activeLocale === 'en'
                      ? 'Start writing your draft...'
                      : 'ابدأ بكتابة مسودتك هنا...'
                  }
                  value={
                    activeLocale === 'en' ? content.en.body : content.ar.body
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setContent((prev) => ({
                      ...prev,
                      [activeLocale]: { ...prev[activeLocale], body: val },
                    }));
                  }}
                />
              </div>
            </ScrollArea>

            <div className="p-3 bg-muted/30 border-t border-border/30 flex justify-between items-center px-6">
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2 text-[10px] font-black uppercase tracking-widest opacity-60"
                >
                  <Type className="h-3.5 w-3.5" /> Formatting
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2 text-[10px] font-black uppercase tracking-widest opacity-60"
                >
                  <ImageIcon className="h-3.5 w-3.5" /> Add Asset
                </Button>
              </div>
              <div className="text-[10px] font-black uppercase text-ds-text-subtler opacity-40">
                Autosaved 2m ago
              </div>
            </div>
          </Card>
        </div>

        {/* SIDEBAR: AI & SEO */}
        <div className="w-80 shrink-0 flex flex-col gap-6 overflow-y-auto pr-2">
          {/* AI COMPOSER */}
          <Card className="border-primary/20 bg-primary/5 shadow-none group">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" /> AI Ghostwriter
                </Label>
              </div>
              <p className="text-[10px] font-bold text-ds-text-subtle leading-normal">
                {
                  'Need an industry-leading draft? Enter a topic (e.g. "Smart Access for Gated Communities") and I\'ll build the full multi-lingual structure.'
                }
              </p>
              <Input
                placeholder="Enter blog topic..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-9 text-xs font-bold bg-background/50 border-primary/20"
              />
              <Button
                className="w-full bg-primary h-9 font-black uppercase tracking-widest text-[9px] gap-2 shadow-lg shadow-primary/20"
                disabled={!topic || isGenerating}
                onClick={handleAICompose}
              >
                {isGenerating ? 'Drafting...' : 'Draft Full Article'}
              </Button>
            </CardContent>
          </Card>

          {/* SEO SETTINGS */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-4 space-y-6">
              <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler flex items-center gap-2">
                <Search className="h-3.5 w-3.5" /> SEO Intel
              </Label>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black uppercase text-ds-text-subtler">
                    URL Slug ({activeLocale})
                  </p>
                  <div className="flex bg-muted rounded-lg border border-border/30 h-9 items-center px-3 gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                    <span className="text-[10px] font-bold text-ds-text-subtler opacity-50">
                      gateflow.site/blog/
                    </span>
                    <Input
                      className="border-none bg-transparent h-full p-0 text-[10px] font-black uppercase"
                      value={
                        activeLocale === 'en'
                          ? content.en.slug
                          : content.ar.slug
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        setContent((prev) => ({
                          ...prev,
                          [activeLocale]: { ...prev[activeLocale], slug: val },
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[9px] font-black uppercase text-ds-text-subtler">
                    Meta Description
                  </p>
                  <textarea
                    className="w-full bg-muted border border-border/30 rounded-lg p-3 text-[10px] font-bold h-24 outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                    value={
                      activeLocale === 'en'
                        ? content.en.metaDesc
                        : content.ar.metaDesc
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      setContent((prev) => ({
                        ...prev,
                        [activeLocale]: {
                          ...prev[activeLocale],
                          metaDesc: val,
                        },
                      }));
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/30">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase text-ds-text-subtler">
                    SEO Score
                  </p>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px]">
                    A-92
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-ds-text-subtle">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Focus
                    keyword in title
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-ds-text-subtle">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Meta
                    description optimal
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-ds-text-subtle opacity-50">
                    <Info className="h-3 w-3 text-ds-text-subtler" /> Missing H1
                    keywords
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-border/30" />

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler">
              Featured Graphics
            </Label>
            <div className="h-40 bg-muted/50 rounded-2xl border border-dashed border-border/50 flex flex-col items-center justify-center gap-3 group hover:bg-muted transition-colors cursor-pointer">
              <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                <ImageIcon className="h-5 w-5 text-ds-text-subtler" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-tight">
                Generate Blog Cover
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
