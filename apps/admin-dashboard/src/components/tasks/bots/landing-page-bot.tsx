'use client';

import React, { useState } from 'react';
import {
  Target,
  Zap,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Rocket,
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

export function LandingPageBot() {
  const [pageType, setPageType] = useState('product');
  const [audience, setAudience] = useState('');
  const [propositions, setPropositions] = useState(['', '', '']);
  const [ctaGoal, setCtaGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<any>(null);

  const updateProposition = (index: number, value: string) => {
    const newProps = [...propositions];
    newProps[index] = value;
    setPropositions(newProps);
  };

  const handleGenerate = async () => {
    if (!audience || !propositions.some((p) => p.trim() !== '')) {
      toast.error(
        'Please provide target audience and at least one value proposition'
      );
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/tasks/bots/landing-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageType,
          audience,
          propositions: propositions.filter((p) => p.trim() !== ''),
          ctaGoal,
        }),
      });

      if (!response.ok)
        throw new Error('Failed to generate landing page draft');

      const data = await response.json();
      setGeneratedDraft(data);
      toast.success('Landing page draft generated successfully!');
    } catch (error) {
      console.error('Bot Error:', error);
      toast.error('AI Bot failed to architect the landing page.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 border-b border-border/30 pb-4">
        <div className="h-12 w-12 rounded-2xl bg-ds-background-brand-bold flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
          <Rocket className="h-6 w-6 text-ds-icon-inverse" />
        </div>
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">
            LP Generator Bot
          </h2>
          <p className="text-[10px] font-bold text-ds-text-subtler uppercase tracking-widest">
            Autonomous conversion architecture & layout synthesis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler flex items-center gap-1.5">
                Target Audience
              </Label>
              <Input
                placeholder="e.g., Property developers..."
                className="bg-muted/30 border-border/50 font-bold text-sm h-11"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler flex items-center gap-1.5">
                Page Archetype
              </Label>
              <Select value={pageType} onValueChange={setPageType}>
                <SelectTrigger className="bg-muted/30 border-border/50 font-bold text-xs h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product Launch</SelectItem>
                  <SelectItem value="service">Service Offering</SelectItem>
                  <SelectItem value="event">Event Registration</SelectItem>
                  <SelectItem value="webinar">Webinar/Sales Page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler flex items-center justify-between">
              Core Value Propositions
              <span className="text-[8px] opacity-60">Max 3 Pillars</span>
            </Label>
            {propositions.map((prop, i) => (
              <div key={i} className="flex gap-2">
                <div className="h-11 w-11 shrink-0 rounded-lg bg-ds-background-neutral flex items-center justify-center text-[10px] font-black border border-border/30">
                  {i + 1}
                </div>
                <Input
                  placeholder={`Proposition ${i + 1}...`}
                  className="bg-muted/30 border-border/50 font-bold text-sm h-11 flex-1"
                  value={prop}
                  onChange={(e) => updateProposition(i, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler flex items-center gap-1.5">
              Primary CTA Goal
            </Label>
            <Input
              placeholder="e.g., Request a Demo, Start Free Trial..."
              className="bg-muted/30 border-border/50 font-bold text-sm h-11"
              value={ctaGoal}
              onChange={(e) => setCtaGoal(e.target.value)}
            />
          </div>

          <Button
            className="w-full h-12 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-xs gap-3 shadow-lg shadow-primary/20 hover:scale-[1.01] transition-all"
            disabled={isGenerating || !audience}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Architecting Page...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Deploy Generator Bot
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <Card className="h-full border-ds-border bg-ds-background-neutral-subtle border-dashed relative overflow-hidden flex flex-col">
            {!generatedDraft && !isGenerating && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-40">
                <Target className="h-12 w-12 mb-4 text-ds-icon-disabled" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Blueprint pending parameters
                </p>
                <p className="text-[9px] font-bold mt-1 uppercase tracking-widest text-ds-text-subtler max-w-[200px]">
                  Bot requires strategy inputs to synthesize layout blocks.
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="relative h-20 w-20">
                  <div className="absolute inset-0 rounded-full border-4 border-ds-border-brand/10" />
                  <div className="absolute inset-0 rounded-full border-4 border-ds-background-brand-bold border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Rocket className="h-8 w-8 text-ds-icon-brand animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2 w-full max-w-xs">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-ds-text-subtler">
                    <span>Synthesizing UX blocks...</span>
                    <span>68%</span>
                  </div>
                  <Progress value={68} className="h-1.5 bg-muted" />
                </div>
              </div>
            )}

            {generatedDraft && !isGenerating && (
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="p-4 bg-ds-background-brand-subtle/5 border-b border-ds-border-brand/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-ds-icon-brand" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-brand">
                      Blueprint Finalized
                    </span>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black h-4 uppercase tracking-widest">
                    v1.0 Layout
                  </Badge>
                </div>

                <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase tracking-tight leading-tight">
                      {generatedDraft.draft.title}
                    </h3>
                    <p className="text-[11px] font-bold text-ds-text-subtle uppercase tracking-tight opacity-70">
                      Conversion-optimized landing page blueprint generated.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-ds-text-subtler">
                      Block Stack Preview
                    </h4>
                    <div className="space-y-2">
                      {JSON.parse(generatedDraft.draft.blocks).map(
                        (block: { type: string }, i: number) => (
                          <div
                            key={i}
                            className="p-3 bg-card border border-border/30 rounded-xl flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-6 w-6 rounded-lg bg-ds-background-brand-subtle text-ds-text-brand flex items-center justify-center text-[10px] font-black border border-ds-border-brand/20">
                                {i + 1}
                              </div>
                              <span className="text-[11px] font-black uppercase tracking-tight text-ds-text">
                                {block.type}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-[7px] font-black uppercase h-3.5 px-1 border-ds-border-brand/20 text-ds-text-subtler"
                            >
                              AI GEN
                            </Badge>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-border/30 bg-card">
                  <Button
                    className="w-full h-11 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] gap-2"
                    onClick={() =>
                      window.open(`/en/cms/landing-pages`, '_blank')
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
