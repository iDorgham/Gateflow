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
  Textarea,
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
  Sparkles, 
  Globe, 
  Save, 
  Rocket, 
  CheckCircle2, 
  AlertTriangle, 
  Type, 
  Search,
  BookOpen,
  Image as ImageIcon,
  Languages,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

interface BlogPostDraft {
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  slugEn: string;
  slugAr: string;
  metaTitleEn: string;
  metaDescEn: string;
}

interface BlogEditorProps {
  initialDraft: BlogPostDraft;
  organizationId: string;
}

/**
 * AI Blog Editorial Dashboard
 * 
 * A high-performance writing environment for the GateFlow CMS.
 * Supports side-by-side multi-language editing, AI-assisted 
 * content refinement, and real-time SEO auditing.
 */
export function BlogEditor({ initialDraft, organizationId }: BlogEditorProps) {
  const [draft, setDraft] = useState<BlogPostDraft>(initialDraft);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topicPrompt, setTopicPrompt] = useState('');

  const handleAiGenerate = async () => {
    if (!topicPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/cms/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicPrompt, organizationId }),
      });
      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      setDraft(data);
      toast.success('AI Editorial Draft generated successfully!');
    } catch (err) {
      toast.error('AI generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
      setTopicPrompt('');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* AI Strategy Bar */}
      <Card className="border-ds-border-brand/30 bg-ds-background-brand-subtle/10 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-ds-text-brand" />
                <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-brand">Editorial AI Assistant</span>
              </div>
              <div className="flex gap-3">
                <Input 
                  placeholder="Enter a topic or working title (e.g., The future of QR access in Dubai properties)..." 
                  value={topicPrompt}
                  onChange={(e) => setTopicPrompt(e.target.value)}
                  className="bg-ds-background-default border-ds-border/50 h-12"
                />
                <Button 
                  onClick={handleAiGenerate}
                  disabled={isGenerating || !topicPrompt}
                  className="h-12 px-8 bg-ds-background-brand-bold font-bold uppercase tracking-widest gap-2 shrink-0"
                >
                  {isGenerating ? 'Drafting...' : 'Generate Full Draft'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-20rem)]">
        {/* Editor Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black uppercase tracking-tight">Post Editor</h1>
            <div className="flex gap-3">
               <Button variant="outline" className="font-bold text-[10px] tracking-widest uppercase gap-2">
                 <Languages className="h-4 w-4" /> Sync Arabic
               </Button>
               <Button variant="outline" className="font-bold text-[10px] tracking-widest uppercase gap-2">
                 <Save className="h-4 w-4" /> Save
               </Button>
            </div>
          </div>

          <Tabs defaultValue="en" className="flex-1 flex flex-col">
            <TabsList className="bg-ds-background-neutral-subtle/30 p-1 w-fit">
              <TabsTrigger value="en" className="px-6 font-bold text-[10px] uppercase tracking-widest">English Version</TabsTrigger>
              <TabsTrigger value="ar" className="px-6 font-bold text-[10px] uppercase tracking-widest">Arabic Version</TabsTrigger>
            </TabsList>
            
            <TabsContent value="en" className="flex-1 mt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">Post Title</label>
                <Input 
                  value={draft.titleEn} 
                  onChange={(e) => setDraft({...draft, titleEn: e.target.value})}
                  className="text-2xl font-black h-16 border-ds-border/40" 
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle mb-2 block">Content (Markdown)</label>
                <Textarea 
                  value={draft.contentEn}
                  onChange={(e) => setDraft({...draft, contentEn: e.target.value})}
                  className="h-full min-h-[400px] font-mono text-sm leading-relaxed p-8 border-ds-border/40 focus:ring-0" 
                />
              </div>
            </TabsContent>

            <TabsContent value="ar" className="flex-1 mt-6 space-y-6" dir="rtl">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">عنوان المقال</label>
                <Input 
                  value={draft.titleAr} 
                  onChange={(e) => setDraft({...draft, titleAr: e.target.value})}
                  className="text-2xl font-black h-16 border-ds-border/40 font-arabic" 
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle mb-2 block">المحتوى</label>
                <Textarea 
                  value={draft.contentAr}
                  onChange={(e) => setDraft({...draft, contentAr: e.target.value})}
                  className="h-full min-h-[400px] font-arabic text-lg leading-relaxed p-8 border-ds-border/40 focus:ring-0" 
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar: SEO & Settings */}
        <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2">
          <Card className="border-ds-border/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-widest">SEO Health</CardTitle>
                <Badge className="bg-green-500 font-black text-[9px] tracking-widest px-2">92/100</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                 <p className="text-[10px] font-bold text-ds-text-subtle uppercase">Target Keyword</p>
                 <Input value="QR Access Control Dubai" className="h-8 text-xs bg-ds-background-neutral-subtle/20" />
               </div>
               <div className="space-y-3">
                 <div className="flex items-center gap-2">
                   <CheckCircle2 className="h-3 w-3 text-green-500" />
                   <span className="text-[11px] font-medium">Keywords in title</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <CheckCircle2 className="h-3 w-3 text-green-500" />
                   <span className="text-[11px] font-medium">Meta description length</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <AlertTriangle className="h-3 w-3 text-orange-500" />
                   <span className="text-[11px] font-medium">Missing alt text on images</span>
                 </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-ds-border/40">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Publication Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                 <p className="text-[10px] font-bold text-ds-text-subtle uppercase">Permalink (Slug)</p>
                 <div className="flex bg-ds-background-neutral-subtle/30 p-2 rounded border border-ds-border/20 text-[10px] font-mono truncate">
                   /en/blog/{draft.slugEn || '...'}
                 </div>
               </div>
               <div className="space-y-2">
                 <p className="text-[10px] font-bold text-ds-text-subtle uppercase">Featured Image</p>
                 <div className="aspect-video bg-ds-background-neutral-subtle/50 rounded-xl border-2 border-dashed border-ds-border/40 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-ds-border-brand/40 transition-colors">
                   <ImageIcon className="h-6 w-6 text-ds-text-subtle group-hover:text-ds-text-brand" />
                   <span className="text-[9px] font-black uppercase tracking-widest text-ds-text-subtle">Generate with AI</span>
                 </div>
               </div>
               <Separator className="bg-ds-border/30" />
               <Button className="w-full bg-ds-background-brand-bold hover:bg-ds-background-brand-bold-hover h-12 font-bold uppercase tracking-widest gap-2">
                 <Rocket className="h-4 w-4" /> Go Live
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
