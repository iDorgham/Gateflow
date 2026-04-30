'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Plus,
  Layout,
  Eye,
  Zap,
  Save,
  Globe,
  CheckCircle2,
  AlertCircle,
  GripVertical,
  Trash2,
  Sparkles,
  Smartphone,
  Monitor,
  ArrowRight,
  ChevronRight,
  Check,
  RotateCcw,
  Languages,
  ArrowUpRight,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  ScrollArea,
  Separator,
  Switch,
  Label,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  cn,
} from '@gate-access/ui';
import { motion, AnimatePresence } from 'framer-motion';

interface LandingPageSection {
  id: string;
  type: string;
  order: number;
  contentEn: any;
  contentAr: any;
  aiGenerated: boolean;
  status?: 'PENDING' | 'CONFIRMED' | 'REJECTED';
}

interface PageBuilderProps {
  initialPage: {
    id: string;
    slug: string;
    titleEn: string;
    titleAr: string;
    status: string;
    sections: LandingPageSection[];
  };
  orgId: string | null;
}

export function PageBuilder({ initialPage, orgId }: PageBuilderProps) {
  const [page, setPage] = useState(initialPage);
  const [sections, setSections] = useState<LandingPageSection[]>(
    initialPage.sections
  );
  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    sections[0]?.id || null
  );
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [locale, setLocale] = useState<'en' | 'ar'>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [generationType, setGenerationType] = useState('HERO');

  const activeSection = sections.find((s) => s.id === activeSectionId);

  const handleAddSection = (type: string) => {
    const newSection: LandingPageSection = {
      id: `new-${Date.now()}`,
      type,
      order: sections.length,
      contentEn: getDefaultContent(type, 'en'),
      contentAr: getDefaultContent(type, 'ar'),
      aiGenerated: false,
    };
    setSections([...sections, newSection]);
    setActiveSectionId(newSection.id);
  };

  const handleDeleteSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
    if (activeSectionId === id) setActiveSectionId(sections[0]?.id || null);
  };

  const handleGenerateSection = async () => {
    if (!generationPrompt) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/cms/generate-section', {
        method: 'POST',
        body: JSON.stringify({
          prompt: generationPrompt,
          sectionType: generationType,
          organizationId: orgId,
          locale,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const newSection: LandingPageSection = {
          id: `ai-${Date.now()}`,
          type: generationType,
          order: sections.length,
          contentEn:
            locale === 'en'
              ? data.section
              : getDefaultContent(generationType, 'en'),
          contentAr:
            locale === 'ar'
              ? data.section
              : getDefaultContent(generationType, 'ar'),
          aiGenerated: true,
          status: 'PENDING',
        };
        setSections([...sections, newSection]);
        setActiveSectionId(newSection.id);
        setGenerationPrompt('');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // In a real app, this would call an API to save the sections
    setTimeout(() => setIsSaving(false), 1000);
  };

  const handlePublish = async () => {
    // Requires all AI sections to be confirmed
    const unconfirmed = sections.filter(
      (s) => s.aiGenerated && s.status === 'PENDING'
    );
    if (unconfirmed.length > 0) {
      alert('Please approve all AI-generated content before publishing.');
      return;
    }

    setIsSaving(true);
    try {
      await fetch(`/api/cms/pages/${page.slug}`, {
        method: 'POST',
        body: JSON.stringify({ status: 'PUBLISHED' }),
      });
      setPage({ ...page, status: 'PUBLISHED' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-950 text-white font-sans selection:bg-indigo-500/30">
      {/* Left Sidebar: Structure */}
      <aside className="w-80 border-r border-white/5 bg-slate-900/50 flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Page Structure
            </h2>
            <Badge
              variant="outline"
              className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
            >
              {page.status}
            </Badge>
          </div>

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {sections.map((section, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={section.id}
                  onClick={() => setActiveSectionId(section.id)}
                  className={cn(
                    'group p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3',
                    activeSectionId === section.id
                      ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/20'
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  )}
                >
                  <GripVertical className="w-4 h-4 text-white/30 group-hover:text-white/60" />
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-tight">
                      {section.type}
                    </div>
                    {section.aiGenerated && (
                      <div className="flex items-center gap-1 mt-1">
                        <Sparkles className="w-3 h-3 text-indigo-300" />
                        <span className="text-[9px] text-indigo-200 font-medium">
                          AI Generated
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(section.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full mt-6 bg-white text-slate-900 hover:bg-slate-200 gap-2 font-bold text-xs uppercase tracking-widest rounded-xl h-11">
                <Plus className="w-4 h-4" />
                Add Block
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-black italic uppercase">
                  Choose Section Type
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  'HERO',
                  'FEATURES',
                  'CTA',
                  'PRICING',
                  'SOCIAL_PROOF',
                  'FAQ',
                  'LEAD_FORM',
                ].map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    className="h-24 flex flex-col gap-2 border-white/5 bg-white/5 hover:bg-white/10 hover:border-indigo-500/50"
                    onClick={() => handleAddSection(type)}
                  >
                    <Layout className="w-5 h-5 text-indigo-400" />
                    <span className="text-[10px] font-black tracking-widest uppercase">
                      {type.replace('_', ' ')}
                    </span>
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-auto p-6 border-t border-white/5 space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-400 hover:text-white hover:bg-white/5"
            onClick={() => setLocale(locale === 'en' ? 'ar' : 'en')}
          >
            <Languages className="w-4 h-4" />
            <span className="text-[10px] font-black tracking-widest uppercase">
              Language: {locale.toUpperCase()}
            </span>
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-white/10 bg-transparent hover:bg-white/5 gap-2 rounded-xl"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
            <Button
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 gap-2 rounded-xl shadow-lg shadow-indigo-600/20"
              onClick={handlePublish}
              disabled={isSaving}
            >
              <ArrowUpRight className="w-4 h-4" />
              Publish
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content: Preview & Editor */}
      <main className="flex-1 flex flex-col bg-slate-950 relative">
        {/* Top bar for tools */}
        <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-slate-900/30 backdrop-blur-xl z-10">
          <div className="flex items-center gap-6">
            <div className="flex bg-white/5 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('desktop')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  viewMode === 'desktop'
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white/60'
                )}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  viewMode === 'mobile'
                    ? 'bg-white/10 text-white'
                    : 'text-white/40 hover:text-white/60'
                )}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="text-xs font-medium text-white/40 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" />
              www.gateflow.site/{locale}/{page.slug}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 italic">
                AI Co-Pilot Active
              </span>
            </div>
          </div>
        </header>

        {/* The "Stage" */}
        <div className="flex-1 overflow-hidden p-8 flex flex-col items-center">
          <div
            className={cn(
              'bg-white rounded-3xl shadow-2xl transition-all duration-500 overflow-hidden flex flex-col',
              viewMode === 'desktop'
                ? 'w-full max-w-5xl flex-1'
                : 'w-[375px] h-[667px] flex-none'
            )}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="h-6 bg-slate-100 flex items-center px-4 gap-1.5">
              <div className="w-2 h-2 rounded-full bg-slate-300" />
              <div className="w-2 h-2 rounded-full bg-slate-300" />
              <div className="w-2 h-2 rounded-full bg-slate-300" />
            </div>
            <ScrollArea className="flex-1 bg-white">
              <div className="min-h-full">
                {sections.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-40 text-slate-400 gap-4">
                    <div className="p-6 rounded-full bg-slate-50 border border-slate-100">
                      <Layout className="w-12 h-12 text-slate-200" />
                    </div>
                    <p className="text-sm font-medium tracking-tight">
                      Empty Canvas
                    </p>
                    <Button
                      variant="outline"
                      className="rounded-full border-slate-200 text-slate-900 font-bold px-6"
                    >
                      Start Building
                    </Button>
                  </div>
                ) : (
                  sections.map((section) => (
                    <div
                      key={section.id}
                      onClick={() => setActiveSectionId(section.id)}
                      className={cn(
                        'relative group transition-all',
                        activeSectionId === section.id
                          ? 'ring-4 ring-indigo-500 ring-inset'
                          : 'hover:bg-slate-50/50'
                      )}
                    >
                      {/* Placeholder rendering based on type */}
                      <div className="py-12 px-8">
                        <PreviewBlock section={section} locale={locale} />
                      </div>

                      {activeSectionId === section.id && (
                        <div className="absolute top-4 right-4 flex gap-2 z-20">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 rounded-lg shadow-sm font-bold text-[10px]"
                          >
                            Edit Block
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 rounded-lg shadow-sm border-slate-200 bg-white font-bold text-[10px]"
                          >
                            Settings
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* AI Generator Bottom Bar */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-6"
            >
              <div className="bg-indigo-600 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase italic tracking-tighter">
                      AI Magic in Progress...
                    </h4>
                    <p className="text-xs text-indigo-100">
                      Drafting the perfect section for your audience.
                    </p>
                  </div>
                </div>
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'easeInOut' }}
                    className="h-full bg-white"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-6 bg-slate-900/50 border-t border-white/5 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto flex gap-4">
            <div className="relative flex-1">
              <Input
                value={generationPrompt}
                onChange={(e) => setGenerationPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateSection()}
                placeholder="Prompt AI to generate a section (e.g., 'Modern Hero for high-end villas')..."
                className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 pr-4 focus:ring-indigo-500/30 focus:border-indigo-500/50 text-sm"
              />
              <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
            </div>
            <Select
              value={generationType}
              onValueChange={setGenerationType}
              className="w-32 bg-white/5 border-white/10 rounded-2xl h-14"
            >
              <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl font-bold text-[10px] uppercase tracking-widest">
                {generationType}
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                <SelectItem value="HERO">HERO</SelectItem>
                <SelectItem value="FEATURES">FEATURES</SelectItem>
                <SelectItem value="CTA">CTA</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleGenerateSection}
              disabled={!generationPrompt || isGenerating}
              className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase tracking-widest gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Zap className="w-4 h-4 fill-white" />
              Generate
            </Button>
          </div>
        </div>
      </main>

      {/* Right Sidebar: Assets & Review */}
      <aside className="w-80 border-l border-white/5 bg-slate-900/50 flex flex-col shrink-0">
        <div className="p-6 flex-1 flex flex-col">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            HiTL Review Gate
          </h2>

          <ScrollArea className="flex-1 -mx-2 px-2">
            <div className="space-y-6">
              {sections.filter((s) => s.aiGenerated).length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="p-4 rounded-full bg-white/5 border border-white/5 inline-block text-white/20">
                    <Eye className="w-8 h-8" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    No AI Assets to Review
                  </p>
                </div>
              ) : (
                sections
                  .filter((s) => s.aiGenerated)
                  .map((section) => (
                    <Card
                      key={section.id}
                      className="bg-white/5 border-white/10 overflow-hidden rounded-2xl group transition-all hover:border-indigo-500/30"
                    >
                      <div className="aspect-video bg-slate-800 relative">
                        {section.type === 'HERO' ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <Sparkles className="w-8 h-8 text-indigo-400/20" />
                          </div>
                        ) : (
                          <div className="p-4 h-full flex flex-col justify-center">
                            <div className="h-2 w-1/2 bg-white/20 rounded-full mb-2" />
                            <div className="h-2 w-3/4 bg-white/10 rounded-full mb-2" />
                            <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Badge className="text-[8px] font-black uppercase tracking-widest bg-white/10 text-white border-0">
                            {section.type} Asset
                          </Badge>
                          <span
                            className={cn(
                              'text-[8px] font-black uppercase tracking-widest',
                              section.status === 'PENDING'
                                ? 'text-amber-400'
                                : 'text-green-400'
                            )}
                          >
                            {section.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="flex-1 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold"
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 h-8 rounded-lg bg-green-600 hover:bg-green-500 text-[10px] font-bold"
                            onClick={() => {
                              setSections((prev) =>
                                prev.map((s) =>
                                  s.id === section.id
                                    ? { ...s, status: 'CONFIRMED' }
                                    : s
                                )
                              );
                            }}
                          >
                            Approve
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </ScrollArea>
        </div>

        <Card className="m-6 bg-indigo-600/10 border-indigo-500/20 p-4 rounded-2xl">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">
                Human-in-the-Loop
              </h4>
              <p className="text-[10px] text-indigo-200/60 leading-relaxed">
                All AI generations must be manually approved to ensure brand
                safety and layout precision.
              </p>
            </div>
          </div>
        </Card>
      </aside>
    </div>
  );
}

function PreviewBlock({
  section,
  locale,
}: {
  section: LandingPageSection;
  locale: 'en' | 'ar';
}) {
  const content = locale === 'en' ? section.contentEn : section.contentAr;

  switch (section.type) {
    case 'HERO':
      return (
        <div className="text-center py-20 space-y-6">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-none">
            {content.heroTitle || 'Your Visionary Future'}
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {content.heroSubtitle ||
              'Transforming access control with intelligent MENA-focused solutions.'}
          </p>
          <Button
            size="lg"
            className="rounded-full bg-slate-900 hover:bg-slate-800 px-8 h-14 text-base font-bold shadow-xl shadow-slate-900/20"
          >
            {content.ctaText || 'Get Started'}
          </Button>
        </div>
      );
    case 'FEATURES':
      return (
        <div className="py-12">
          <h2 className="text-3xl font-black text-slate-900 mb-12 text-center uppercase tracking-tight italic">
            {content.title || 'Advanced Features'}
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {(content.features || [1, 2, 3]).map((f: any, i: number) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {f.title || 'Feature Title'}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {f.description ||
                    'Intelligent description generated by the GateFlow neural fabric.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    default:
      return (
        <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center">
          <p className="text-slate-400 font-medium uppercase tracking-widest text-[10px]">
            {section.type} Content Preview
          </p>
        </div>
      );
  }
}

function getDefaultContent(type: string, locale: string) {
  if (type === 'HERO') {
    return locale === 'en'
      ? {
          heroTitle: 'Secure Your Community',
          heroSubtitle: 'The most advanced access control system in MENA.',
          ctaText: 'Book a Demo',
        }
      : {
          heroTitle: 'أمّن مجتمعك',
          heroSubtitle: 'نظام التحكم في الوصول الأكثر تقدماً في الشرق الأوسط.',
          ctaText: 'احجز عرضاً',
        };
  }
  return {};
}

function Select({ children, value, onValueChange, className }: any) {
  return <div className={className}>{children}</div>;
}
function SelectTrigger({ children, className }: any) {
  return (
    <button
      className={cn('w-full px-4 flex items-center justify-between', className)}
    >
      {children} <Plus className="w-3 h-3" />
    </button>
  );
}
function SelectContent({ children, className }: any) {
  return null;
} // Stub for simplicity in this artifact
function SelectItem({ children, value }: any) {
  return null;
}
