'use client';

import * as React from 'react';
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Input,
  Separator,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ScrollArea,
  cn
} from '@gate-access/ui';
import { 
  Plus, 
  Sparkles, 
  Eye, 
  Globe, 
  Save, 
  Trash2, 
  GripVertical,
  Layers,
  Rocket,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

interface Section {
  id: string;
  type: 'HERO' | 'FEATURES' | 'CTA' | 'PRICING' | 'FAQ' | 'SOCIAL_PROOF';
  contentEn: any;
  contentAr: any;
  status: 'DRAFT' | 'PUBLISHED';
}

interface PageBuilderProps {
  pageId: string;
  initialSections: Section[];
  pageSlug: string;
}

/**
 * AI Landing Page Builder
 * 
 * A block-based "Studio" editor for the GateFlow Headless CMS.
 * Features AI section generation, drag-and-drop sequencing,
 * and real-time multi-language preview.
 */
export function PageBuilder({ pageId, initialSections, pageSlug }: PageBuilderProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [activeSection, setActiveSection] = useState<string | null>(initialSections[0]?.id || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleAddSection = (type: Section['type']) => {
    const newSection: Section = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      contentEn: { title: `New ${type} Section`, subtitle: 'Edit this content' },
      contentAr: { title: 'قسم جديد', subtitle: 'تعديل المحتوى' },
      status: 'DRAFT'
    };
    setSections([...sections, newSection]);
    setActiveSection(newSection.id);
  };

  const handleAiGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/cms/generate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, sectionType: 'HERO' }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      
      const newSection: Section = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'HERO',
        contentEn: data.contentEn,
        contentAr: data.contentAr,
        status: 'DRAFT'
      };
      
      setSections([...sections, newSection]);
      setActiveSection(newSection.id);
      toast.success('AI Section generated successfully!');
    } catch (err) {
      toast.error('AI generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-[calc(100vh-8rem)] overflow-hidden border border-ds-border/40 rounded-2xl bg-ds-background-default shadow-2xl">
      {/* Sidebar: Structure & Blocks */}
      <div className="lg:col-span-3 border-r border-ds-border/30 flex flex-col bg-ds-background-neutral-subtle/20">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-ds-text-subtle">Page Structure</h2>
            <Badge variant="outline" className="text-[9px] font-bold tracking-widest bg-ds-background-default border-none">
              {sections.length} BLOCKS
            </Badge>
          </div>

          <div className="space-y-2">
            {sections.map((section) => (
              <div 
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                  activeSection === section.id 
                    ? "bg-ds-background-brand-bold text-white border-transparent" 
                    : "bg-ds-background-default border-ds-border/40 hover:border-ds-border-brand/40"
                )}
              >
                <GripVertical className={cn("h-4 w-4 opacity-30", activeSection === section.id && "opacity-60")} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider opacity-60">{section.type}</p>
                  <p className="text-xs font-bold truncate">{section.contentEn.title}</p>
                </div>
                <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          <Separator className="bg-ds-border/30" />

          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">Add Content</span>
            <div className="grid grid-cols-2 gap-2">
              {(['HERO', 'FEATURES', 'SOCIAL_PROOF', 'CTA'] as const).map(type => (
                <Button 
                  key={type} 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleAddSection(type)}
                  className="h-10 text-[9px] font-black tracking-widest uppercase border-ds-border/40 hover:bg-ds-background-brand-subtle/20"
                >
                  + {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 bg-ds-background-brand-subtle/10 border-t border-ds-border-brand/20">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-ds-text-brand" />
              <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-brand">AI Copilot</span>
            </div>
            <Input 
              placeholder="Describe a section..." 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="text-xs bg-ds-background-default border-ds-border-brand/30" 
            />
            <Button 
              size="sm" 
              className="w-full bg-ds-background-brand-bold hover:bg-ds-background-brand-bold-hover font-bold text-[10px] tracking-widest uppercase h-10"
              onClick={handleAiGenerate}
              disabled={isGenerating || !prompt}
            >
              {isGenerating ? 'GENERATING...' : 'GENERATE SECTION'}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Main: Preview & Controls */}
      <div className="lg:col-span-9 flex flex-col overflow-hidden bg-ds-background-default">
        <div className="h-16 border-b border-ds-border/30 px-8 flex items-center justify-between bg-ds-background-default/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <h1 className="text-sm font-black uppercase tracking-tighter">/p/{pageSlug}</h1>
              <span className="text-[10px] text-ds-text-subtle font-medium flex items-center gap-1">
                <Globe className="h-3 w-3" /> Live on gateflow.site
              </span>
            </div>
            <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-none font-black text-[9px] px-2 py-0.5">DRAFT MODE</Badge>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="font-bold text-[10px] tracking-widest uppercase gap-2">
              <Eye className="h-4 w-4" /> Preview
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="outline" size="sm" className="font-bold text-[10px] tracking-widest uppercase gap-2 border-ds-border/50">
              <Save className="h-4 w-4" /> Save Draft
            </Button>
            <Button size="sm" className="bg-ds-background-brand-bold hover:bg-ds-background-brand-bold-hover font-bold text-[10px] tracking-widest uppercase gap-2 px-6">
              <Rocket className="h-4 w-4" /> Publish Live
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-12 bg-ds-background-neutral-subtle/10">
          <div className="max-w-4xl mx-auto space-y-12 pb-24">
            {sections.map((section, idx) => (
              <Card 
                key={section.id} 
                className={cn(
                  "border-ds-border/40 overflow-hidden group transition-all relative",
                  activeSection === section.id && "ring-2 ring-ds-border-brand/50 shadow-xl"
                )}
              >
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white shadow-md border border-ds-border/20">
                     <Layers className="h-4 w-4" />
                   </Button>
                </div>
                <CardHeader className="bg-ds-background-neutral-subtle/20 border-b border-ds-border/10 py-3">
                  <CardTitle className="text-[9px] font-black uppercase tracking-widest text-ds-text-subtle flex items-center gap-2">
                    SECTION {idx + 1}: {section.type}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-black tracking-tight leading-tight">{section.contentEn.title}</h2>
                    <p className="text-ds-text-subtle leading-relaxed">{section.contentEn.subtitle}</p>
                    <div className="flex gap-4 pt-4">
                      <Button className="bg-ds-background-brand-bold h-12 px-8 font-bold text-xs">Primary Action</Button>
                      <Button variant="outline" className="h-12 px-8 font-bold text-xs border-ds-border/50">Learn More</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {sections.length === 0 && (
              <div className="h-96 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-ds-border/40 rounded-3xl">
                <div className="p-4 rounded-full bg-ds-background-brand-subtle/20 text-ds-text-brand">
                  <Layers className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-black uppercase tracking-widest text-sm">Your Canvas is Empty</p>
                  <p className="text-xs text-ds-text-subtle">Start by adding a section from the sidebar or using the AI Copilot.</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
