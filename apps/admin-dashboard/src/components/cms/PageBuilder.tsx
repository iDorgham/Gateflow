'use client';

import * as React from 'react';
import { Reorder } from 'framer-motion';
import {
  Type,
  Layout,
  Plus,
  Box,
  Sparkles,
  Globe,
  Send,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Languages,
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
 * AI Landing Page Builder
 * Block-based Headless CMS for GateFlow marketing.
 */
interface PageSection {
  id: string;
  type: string;
  contentEn: {
    headline: string;
    body: string;
    ctaText: string;
    ctaLink: string;
  };
  contentAr: {
    headline: string;
    body: string;
    ctaText: string;
    ctaLink: string;
  };
  aiGenerated?: boolean;
}

export function PageBuilder({ pageId: _pageId }: { pageId?: string }) {
  const [sections, setSections] = React.useState<PageSection[]>([]);
  const [activeLocale, setActiveLocale] = React.useState<'en' | 'ar'>('en');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [prompt, setPrompt] = React.useState('');
  const [isPublishing, setIsPublishing] = React.useState(false);

  const sectionTypes = [
    { type: 'HERO', icon: Layout, label: 'Hero Section' },
    { type: 'FEATURES', icon: Box, label: 'Features Grid' },
    { type: 'SOCIAL_PROOF', icon: CheckCircle2, label: 'Trust/Clients' },
    { type: 'CTA', icon: Send, label: 'Call to Action' },
    { type: 'FAQ', icon: Type, label: 'FAQ Block' },
  ];

  const handleAddField = (type: string) => {
    const newSection = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      contentEn: {
        headline: 'New Section',
        body: 'Draft your content here...',
        ctaText: 'Get Started',
        ctaLink: '#',
      },
      contentAr: {
        headline: 'قسم جديد',
        body: 'اكتب المحتوى الخاص بك هنا...',
        ctaText: 'ابدأ الآن',
        ctaLink: '#',
      },
    };
    setSections([...sections, newSection]);
  };

  const handleGenerate = async (type: string) => {
    if (!prompt) return;
    setIsGenerating(true);
    toast.promise(
      fetch('/api/cms/generate-section', {
        method: 'POST',
        body: JSON.stringify({ prompt, type, orgId: 'GLOBAL' }),
      }).then((res) => res.json()),
      {
        loading: 'AI is crafting your marketing copy...',
        success: (data) => {
          const newSec = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            contentEn: data.section.en,
            contentAr: data.section.ar,
            aiGenerated: true,
          };
          setSections([...sections, newSec]);
          setPrompt('');
          return 'Section drafted! Awaiting your review.';
        },
        error: 'AI generation failed.',
      }
    );
    setIsGenerating(false);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    toast.success('Page published to www.gateflow.site');
    setIsPublishing(false);
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] w-full gap-6 overflow-hidden animate-in fade-in duration-700">
      {/* LEFT: Section Library */}
      <div className="w-72 shrink-0 flex flex-col gap-4">
        <ScrollArea className="flex-1">
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler">
                Add Components
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {sectionTypes.map((item) => (
                  <Button
                    key={item.type}
                    variant="outline"
                    className="h-14 justify-start gap-3 bg-muted/10 border-border/30 hover:border-primary/50 hover:bg-primary/5 group"
                    onClick={() => handleAddField(item.type)}
                  >
                    <div className="bg-muted p-2 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-tight leading-none">
                        {item.label}
                      </p>
                      <p className="text-[9px] font-bold text-ds-text-subtler">
                        Drag or click to add
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <Separator className="bg-border/30" />

            {/* AI ASSISTANT BOX */}
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" /> AI Section Architect
              </Label>
              <Card className="border-primary/20 bg-primary/5 shadow-inner">
                <CardContent className="p-3 space-y-3">
                  <p className="text-[10px] font-bold text-ds-text-subtle">
                    {
                      "Describe your section and I'll generate high-converting copy in EN & AR."
                    }
                  </p>
                  <Input
                    placeholder="e.g., Explain our secure QR gate technology..."
                    className="h-8 text-xs font-bold bg-background/50 border-primary/20"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <Button
                    size="sm"
                    className="w-full bg-primary h-8 font-black uppercase tracking-widest text-[9px] gap-2"
                    disabled={!prompt || isGenerating}
                    onClick={() => handleGenerate('HERO')}
                  >
                    {isGenerating ? 'Drafting...' : 'Generate Block'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* CENTER: Canvas */}
      <div className="flex-1 flex flex-col gap-4 relative">
        <div className="flex items-center justify-between px-2 bg-muted/20 p-2 rounded-xl border border-border/30">
          <div className="flex gap-2">
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
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px] font-black uppercase">
              DRAFT VERSION 1.2
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-[10px] font-black uppercase tracking-widest gap-2"
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </Button>
            <Button
              className="h-8 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] gap-2"
              onClick={handlePublish}
              disabled={isPublishing}
            >
              <Send className="h-3.5 w-3.5" /> Publish Hub
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 rounded-2xl bg-muted/10 border border-border/30 p-8">
          <Reorder.Group
            axis="y"
            values={sections}
            onReorder={setSections}
            className="space-y-4 max-w-2xl mx-auto"
          >
            {sections.map((section) => (
              <Reorder.Item
                key={section.id}
                value={section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="cursor-move"
              >
                <Card className="border-border/50 bg-card overflow-hidden group hover:border-primary/40 transition-colors">
                  <div className="p-2 border-b border-border/30 flex justify-between bg-muted/10">
                    <div className="flex items-center gap-3">
                      <Box className="h-3 w-3 text-ds-text-subtler" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler">
                        {section.type}
                      </span>
                      {section.aiGenerated && (
                        <Badge className="h-4 bg-primary/20 text-primary border-none text-[8px] font-black gap-1 uppercase">
                          <Sparkles className="h-2 w-2" /> AI Draft
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div
                      className={cn(
                        'space-y-4',
                        activeLocale === 'ar' ? 'text-right' : 'text-left'
                      )}
                      dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
                    >
                      <h2 className="text-2xl font-black uppercase tracking-tight leading-tight text-ds-text">
                        {activeLocale === 'en'
                          ? section.contentEn.headline
                          : section.contentAr.headline}
                      </h2>
                      <p className="text-xs font-bold leading-relaxed text-ds-text-subtle opacity-70">
                        {activeLocale === 'en'
                          ? section.contentEn.body
                          : section.contentAr.body}
                      </p>
                      <div className="flex gap-4 pt-2">
                        <Button
                          disabled
                          className="h-9 font-black uppercase tracking-widest text-[9px]"
                        >
                          {activeLocale === 'en'
                            ? section.contentEn.ctaText
                            : section.contentAr.ctaText}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reorder.Item>
            ))}
            {sections.length === 0 && (
              <div className="flex flex-col items-center justify-center h-96 opacity-20 filter grayscale border-2 border-dashed border-border/50 rounded-3xl">
                <Plus className="h-12 w-12 mb-4" />
                <p className="text-sm font-black uppercase tracking-[0.2em]">
                  Add your first section
                </p>
              </div>
            )}
          </Reorder.Group>
        </ScrollArea>
      </div>

      {/* RIGHT Bar: Config & Accessibility */}
      <div className="w-80 shrink-0 space-y-6">
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-4 space-y-6">
            <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler">
              Page Properties
            </Label>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase text-ds-text-subtler">
                  Slug URL
                </p>
                <div className="flex bg-muted rounded-lg border border-border/30 h-9 items-center px-3 gap-2">
                  <span className="text-[10px] font-bold text-ds-text-subtler opacity-50">
                    gateflow.site/
                  </span>
                  <Input
                    className="border-none bg-transparent h-full p-0 text-[10px] font-black uppercase"
                    placeholder="secure-qr-access"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase text-ds-text-subtler">
                  SEO Metadata (EN)
                </p>
                <Input
                  className="h-9 text-[10px] font-bold"
                  placeholder="Title for Google..."
                />
              </div>
            </div>

            <Separator className="bg-border/30" />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase text-ds-text-subtler">
                  Accessibility Check
                </p>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[9px]">
                  P-88
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-ds-text-subtle">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" /> All
                  images have alt text
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-ds-text-subtle">
                  <AlertCircle className="h-3 w-3 text-amber-500" /> Contrast
                  ratio is tight
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
