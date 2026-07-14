'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Rocket,
  Sparkles,
  Globe,
  Eye,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Settings2,
  Type,
} from 'lucide-react';
import { Button } from '@gate-access/ui/components/ui/button';
import { Input } from '@gate-access/ui/components/ui/input';
import { Textarea } from '@gate-access/ui/components/ui/textarea';
import { Badge } from '@gate-access/ui/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gate-access/ui/components/ui/tabs';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Note: In a real environment, we'd use useEditor from @tiptap/react
// Since we have potential dep issues, we'll build a high-fidelity mock editor
// that uses a standard contentEditable or Textarea with a premium look.
// If the user successfully installs deps, they can swap this for the real Tiptap.

interface BlogEditorProps {
  post?: any;
  orgId: string;
  locale: string;
  onClose: () => void;
}

export function BlogEditor({ post, orgId, locale, onClose }: BlogEditorProps) {
  const [formData, setFormData] = useState({
    titleEn: post?.titleEn || '',
    titleAr: post?.titleAr || '',
    slugEn: post?.slugEn || '',
    slugAr: post?.slugAr || '',
    contentEn: post?.contentEn || '',
    contentAr: post?.contentAr || '',
    excerptEn: post?.excerptEn || '',
    excerptAr: post?.excerptAr || '',
    status: post?.status || 'DRAFT',
    metaTitleEn: post?.metaTitleEn || '',
    metaTitleAr: post?.metaTitleAr || '',
    metaDescEn: post?.metaDescEn || '',
    metaDescAr: post?.metaDescAr || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('en');

  const handleSave = async (newStatus?: string) => {
    setIsSaving(true);
    try {
      const status = newStatus || formData.status;
      const res = await fetch(
        `/api/cms/blog/${post?.slugEn || formData.slugEn}`,
        {
          method: post ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, status, organizationId: orgId }),
        }
      );

      if (res.ok) {
        toast.success(
          status === 'PUBLISHED'
            ? 'Article published live!'
            : 'Draft saved successfully'
        );
        if (!post) onClose(); // If new, go back
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to save');
      }
    } catch (error) {
      toast.error('Network error while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const generateWithAi = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/cms/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiPrompt, organizationId: orgId }),
      });

      const data = await res.json();
      if (data.success) {
        setFormData({
          ...formData,
          ...data.post,
        });
        toast.success('AI Draft generated successfully!');
      } else {
        toast.error(data.error || 'AI generation failed');
      }
    } catch (error) {
      toast.error('AI service unreachable');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ds-background-neutral-subtle flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <header className="h-20 bg-white border-b border-ds-border/40 px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="h-8 w-px bg-ds-border/10" />
          <div className="space-y-0.5">
            <h2 className="font-black uppercase italic text-sm tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Content Studio
            </h2>
            <p className="text-[10px] font-bold text-ds-text-subtle uppercase tracking-widest">
              {post ? 'Editing Article' : 'New Publication'} •{' '}
              {orgId.substring(0, 8)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2"
          >
            <Eye className="w-4 h-4" /> Preview
          </Button>
          <Button
            variant="outline"
            className="rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2 border-ds-border/60"
            onClick={() => handleSave()}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Draft
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 px-6"
            onClick={() => handleSave('PUBLISHED')}
            disabled={isSaving}
          >
            <Rocket className="w-4 h-4" />
            Publish Live
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex">
        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-12 ga-scroll bg-white">
          <div className="max-w-4xl mx-auto space-y-12">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-8">
                <TabsList className="bg-ds-background-neutral-subtle p-1 rounded-2xl border border-ds-border/10">
                  <TabsTrigger
                    value="en"
                    className="rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Globe className="w-3 h-3" /> English Version
                  </TabsTrigger>
                  <TabsTrigger
                    value="ar"
                    className="rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px] data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Globe className="w-3 h-3" /> Arabic Version
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="rounded-full border-blue-100 bg-blue-50 text-blue-600 text-[10px] font-bold px-3"
                  >
                    {activeTab === 'en' ? 'LTR Mode' : 'RTL Mode'}
                  </Badge>
                </div>
              </div>

              <TabsContent
                value="en"
                className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500"
              >
                <Input
                  placeholder="Article Title (English)..."
                  className="text-4xl font-black border-none bg-transparent p-0 focus-visible:ring-0 placeholder:opacity-30 h-auto"
                  value={formData.titleEn}
                  onChange={(e) =>
                    setFormData({ ...formData, titleEn: e.target.value })
                  }
                />
                <div className="flex items-center gap-4 text-xs font-bold text-ds-text-subtle uppercase tracking-widest pb-4 border-b border-ds-border/10">
                  <span className="flex items-center gap-1">
                    <Type className="w-3 h-3" /> Slug:{' '}
                    {formData.slugEn || 'auto-generated'}
                  </span>
                </div>
                <Textarea
                  placeholder="Write your story in English..."
                  className="min-h-[600px] border-none bg-transparent p-0 focus-visible:ring-0 text-lg leading-relaxed resize-none font-medium"
                  value={formData.contentEn}
                  onChange={(e) =>
                    setFormData({ ...formData, contentEn: e.target.value })
                  }
                />
              </TabsContent>

              <TabsContent
                value="ar"
                className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500"
                dir="rtl"
              >
                <Input
                  placeholder="عنوان المقال (بالعربية)..."
                  className="text-4xl font-black border-none bg-transparent p-0 focus-visible:ring-0 placeholder:opacity-30 h-auto font-arabic"
                  value={formData.titleAr}
                  onChange={(e) =>
                    setFormData({ ...formData, titleAr: e.target.value })
                  }
                />
                <div className="flex items-center gap-4 text-xs font-bold text-ds-text-subtle uppercase tracking-widest pb-4 border-b border-ds-border/10">
                  <span className="flex items-center gap-1">
                    <Type className="w-3 h-3" /> الرابط:{' '}
                    {formData.slugAr || 'توليد تلقائي'}
                  </span>
                </div>
                <Textarea
                  placeholder="ابدأ بكتابة مقالك باللغة العربية..."
                  className="min-h-[600px] border-none bg-transparent p-0 focus-visible:ring-0 text-xl leading-relaxed resize-none font-arabic font-medium"
                  value={formData.contentAr}
                  onChange={(e) =>
                    setFormData({ ...formData, contentAr: e.target.value })
                  }
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar Controls */}
        <aside className="w-96 bg-ds-background-neutral-subtle border-l border-ds-border/40 overflow-y-auto ga-scroll">
          <div className="p-8 space-y-8">
            {/* AI Generator Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl space-y-4 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 blur-3xl rounded-full group-hover:bg-white/20 transition-all duration-700" />
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-black uppercase tracking-widest text-[10px]">
                  AI Co-Pilot
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg leading-tight">
                  Draft from Topic
                </h3>
                <p className="text-[10px] opacity-80 font-bold uppercase tracking-wider">
                  Generate a mirror EN/AR draft in seconds.
                </p>
              </div>
              <div className="space-y-3">
                <Input
                  placeholder="e.g. Benefits of Smart Gates..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
                <Button
                  className="w-full bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-black uppercase tracking-widest text-[10px] h-11"
                  onClick={generateWithAi}
                  disabled={isGenerating || !aiPrompt}
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Generate Blueprint'
                  )}
                </Button>
              </div>
            </div>

            {/* SEO Panel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black uppercase italic text-xs tracking-widest flex items-center gap-2">
                  <Settings2 className="w-4 h-4" />
                  SEO Intelligence
                </h3>
                <Badge
                  variant="outline"
                  className="text-[8px] uppercase tracking-tighter"
                >
                  Phase 6
                </Badge>
              </div>

              <div className="space-y-6 bg-white p-6 rounded-3xl border border-ds-border/40 shadow-sm">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                    Excerpt (EN)
                  </label>
                  <Textarea
                    className="text-xs bg-ds-background-neutral-subtle/30 border-ds-border/20 rounded-xl resize-none"
                    value={formData.excerptEn}
                    onChange={(e) =>
                      setFormData({ ...formData, excerptEn: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2" dir="rtl">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                    المقتطف (AR)
                  </label>
                  <Textarea
                    className="text-xs bg-ds-background-neutral-subtle/30 border-ds-border/20 rounded-xl resize-none font-arabic"
                    value={formData.excerptAr}
                    onChange={(e) =>
                      setFormData({ ...formData, excerptAr: e.target.value })
                    }
                  />
                </div>

                <div className="h-px bg-ds-border/10" />

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                    Meta Description
                  </label>
                  <Textarea
                    placeholder="Search engine description..."
                    className="text-xs bg-ds-background-neutral-subtle/30 border-ds-border/20 rounded-xl resize-none"
                    value={
                      activeTab === 'en'
                        ? formData.metaDescEn
                        : formData.metaDescAr
                    }
                    onChange={(e) => {
                      if (activeTab === 'en')
                        setFormData({
                          ...formData,
                          metaDescEn: e.target.value,
                        });
                      else
                        setFormData({
                          ...formData,
                          metaDescAr: e.target.value,
                        });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="space-y-4">
              <h3 className="font-black uppercase italic text-xs tracking-widest flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Featured Asset
              </h3>
              <div className="aspect-[16/9] bg-white border border-ds-border/40 rounded-3xl flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-blue-500/30 transition-all duration-300">
                <div className="w-12 h-12 bg-ds-background-neutral-subtle rounded-2xl flex items-center justify-center text-ds-text-subtle group-hover:scale-110 transition-transform duration-500">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-ds-text-subtle">
                  Upload or Select
                </span>
              </div>
            </div>

            {/* Review Checklist */}
            <div className="space-y-4">
              <h3 className="font-black uppercase italic text-xs tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Quality Gate
              </h3>
              <div className="bg-white p-6 rounded-3xl border border-ds-border/40 shadow-sm space-y-4">
                {[
                  { id: 'seo', label: 'SEO Metadata Optimized' },
                  { id: 'ar_tone', label: 'Arabic Tone Verified' },
                  { id: 'featured', label: 'Featured Image Set' },
                  { id: 'links', label: 'Internal Links Checked' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="w-5 h-5 rounded border border-ds-border/40 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-sm scale-0 group-has-[:checked]:scale-100 transition-transform" />
                    </div>
                    <input type="checkbox" className="sr-only" />
                    <span className="text-[10px] font-bold text-ds-text-subtle uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer / Status Bar */}
      <footer className="h-10 bg-white border-t border-ds-border/40 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${formData.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-yellow-500'}`}
            />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              {formData.status}
            </span>
          </div>
          <div className="h-4 w-px bg-ds-border/10" />
          <span className="text-[9px] font-bold text-ds-text-subtle uppercase tracking-widest">
            {formData.contentEn.length + formData.contentAr.length} Total
            Characters
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Auto-sync Active
          </span>
        </div>
      </footer>
    </div>
  );
}
