'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Settings2,
  Type,
  Hash,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import {
  Card,
  Button,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Badge,
  Progress,
} from '@gateflow/ui';
import { toast } from 'sonner';

export function BlogWriterBot() {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('professional');
  const [wordCount, setWordCount] = useState('800');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<any>(null);

  const handleGenerate = async () => {
    if (!topic) {
      toast.error('Please provide a topic or title');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/tasks/bots/blog-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, keywords, tone, wordCount }),
      });

      if (!response.ok) throw new Error('Failed to generate blog draft');

      const data = await response.json();
      setGeneratedDraft(data);
      toast.success('Blog draft generated successfully!');
    } catch (error) {
      console.error('Bot Error:', error);
      toast.error('AI Bot encountered an error while writing.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 border-b border-border/30 pb-4">
        <div className="h-12 w-12 rounded-2xl bg-ds-background-brand-bold flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
          <BookOpen className="h-6 w-6 text-ds-icon-inverse" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">
            Blog Writer Bot
          </h2>
          <p className="text-[10px] font-bold text-ds-text-subtler uppercase tracking-widest">
            Neural content synthesis for PropTech thought leadership
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler flex items-center gap-1.5">
              <Type className="h-3 w-3" /> Topic or Working Title
            </Label>
            <Input
              placeholder="e.g., The impact of AI on smart gate security..."
              className="bg-muted/30 border-border/50 font-bold text-sm h-11"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler flex items-center gap-1.5">
              <Hash className="h-3 w-3" /> Target Keywords
            </Label>
            <Input
              placeholder="smart gates, security, PropTech, UAE"
              className="bg-muted/30 border-border/50 font-bold text-sm h-11"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler flex items-center gap-1.5">
                <Settings2 className="h-3 w-3" /> Brand Tone
              </Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="bg-muted/30 border-border/50 font-bold text-xs h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="visionary">Visionary</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler flex items-center gap-1.5">
                <Hash className="h-3 w-3" /> Word Count
              </Label>
              <Select value={wordCount} onValueChange={setWordCount}>
                <SelectTrigger className="bg-muted/30 border-border/50 font-bold text-xs h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500">~500 words</SelectItem>
                  <SelectItem value="800">~800 words</SelectItem>
                  <SelectItem value="1200">~1200 words</SelectItem>
                  <SelectItem value="1500">~1500 words</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            className="w-full h-12 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-xs gap-3 shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all"
            disabled={isGenerating || !topic}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Bot is writing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Initialize AI Synthesis
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <Card className="h-full border-ds-border bg-ds-background-neutral-subtle border-dashed relative overflow-hidden flex flex-col">
            {!generatedDraft && !isGenerating && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
                <BookOpen className="h-12 w-12 mb-4 text-ds-icon-disabled" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Awaiting input parameters
                </p>
                <p className="text-[9px] font-bold mt-1 uppercase tracking-widest text-ds-text-subtler max-w-[200px]">
                  Configure the bot to generate your first draft structure.
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="relative h-20 w-20">
                  <div className="absolute inset-0 rounded-full border-4 border-ds-border-brand/10" />
                  <div className="absolute inset-0 rounded-full border-4 border-ds-background-brand-bold border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-ds-icon-brand animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2 w-full max-w-xs">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-ds-text-subtler">
                    <span>Structuring neural path...</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-1.5 bg-muted" />
                </div>
              </div>
            )}

            {generatedDraft && !isGenerating && (
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="p-4 bg-ds-background-success/5 border-b border-ds-border-success/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-ds-icon-success" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-success">
                      Draft Ready
                    </span>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-black h-4 uppercase tracking-widest">
                    v1.0 Synthesis
                  </Badge>
                </div>

                <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase tracking-tight leading-tight">
                      {generatedDraft.draft.titleEn}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {
                        JSON.parse(generatedDraft.draft.aiDraftContent).blocks
                          .length
                      }{' '}
                      sections identified
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-ds-text-subtler">
                      Structure Preview
                    </h4>
                    <div className="space-y-2">
                      {JSON.parse(generatedDraft.draft.aiDraftContent)
                        .blocks.slice(0, 4)
                        .map((block: { type: string }, i: number) => (
                          <div
                            key={i}
                            className="p-3 bg-card border border-border/30 rounded-xl flex items-center gap-3"
                          >
                            <div className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center text-[10px] font-black">
                              {i + 1}
                            </div>
                            <span className="text-[11px] font-bold uppercase tracking-tight opacity-70">
                              {block.type} Block
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-border/30 bg-card">
                  <Button
                    className="w-full h-11 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] gap-2"
                    onClick={() =>
                      window.open(
                        `/en/cms/blog/${generatedDraft.draft.id}`,
                        '_blank'
                      )
                    }
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in Front Builder
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
