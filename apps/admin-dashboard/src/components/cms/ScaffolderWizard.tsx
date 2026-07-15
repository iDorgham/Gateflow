'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Sparkles,
  Target,
  Building2,
  ArrowRight,
  CheckCircle2,
  Layout,
  Type,
  Globe,
  Loader2,
  Monitor,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Button,
  Input,
  Textarea,
  Badge,
  Separator,
  cn,
} from '@gateflow/ui';
import { useRouter } from 'next/navigation';

interface ScaffolderWizardProps {
  orgId: string;
  orgName: string;
  locale: string;
}

export function ScaffolderWizard({
  orgId,
  orgName,
  locale,
}: ScaffolderWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [industry, setIndustry] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/cms/pages/scaffold', {
        method: 'POST',
        body: JSON.stringify({ goal, industry, organizationName: orgName }),
      });
      const data = await res.json();
      setResult(data);
      setStep(2);
    } catch (err) {
      console.error('Generation failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsGenerating(true); // Reuse loading state
    try {
      const res = await fetch(`/api/organizations/${orgId}/cms/pages`, {
        method: 'POST',
        body: JSON.stringify(result),
      });
      const data = await res.json();
      router.push(`/${locale}/organizations/${orgId}/cms/pages/${data.id}`);
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-500/10 text-blue-600 mb-2">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight italic">
          AI Page Architect
        </h1>
        <p className="text-ds-text-subtle max-w-lg mx-auto">
          Describe your objective, and our AI will architect a high-conversion
          landing page structure and draft persuasive copy for you.
        </p>
      </div>

      <div className="relative">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-500',
              step === 1
                ? 'bg-blue-600 scale-125 shadow-lg shadow-blue-500/40'
                : 'bg-ds-border'
            )}
          ></div>
          <div className="w-12 h-0.5 bg-ds-border"></div>
          <div
            className={cn(
              'w-3 h-3 rounded-full transition-all duration-500',
              step === 2
                ? 'bg-blue-600 scale-125 shadow-lg shadow-blue-500/40'
                : 'bg-ds-border'
            )}
          ></div>
        </div>

        {step === 1 ? (
          <Card className="border-ds-border/40 shadow-2xl bg-white overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" />
                    Conversion Goal
                  </label>
                  <Textarea
                    placeholder="e.g., 'Generate leads for a luxury villa cleaning service' or 'Collect email signups for our early access beta'"
                    className="min-h-[120px] rounded-2xl border-ds-border/40 bg-slate-50/30 focus:ring-blue-500/20 text-sm p-4 outline-none resize-none"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" />
                    Industry Context
                  </label>
                  <Input
                    placeholder="e.g., Real Estate, Fintech, E-commerce"
                    className="h-12 rounded-2xl border-ds-border/40 bg-slate-50/30 focus:ring-blue-500/20 text-sm px-4"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                  <div className="pt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <p className="text-[11px] text-amber-700/80 italic leading-relaxed">
                      AI will automatically generate high-converting copy in
                      both **English** and **Arabic**, optimized for MENA market
                      psychology.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 rounded-2xl gap-3 font-black uppercase tracking-widest text-sm transition-all active:scale-95"
                disabled={!goal || !industry || isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Architecting Page Structure...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    SCAFFOLD LANDING PAGE
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="font-black uppercase tracking-tight text-xl">
                Architectural Blueprint Ready
              </h3>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl h-10 border-ds-border/40"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 rounded-xl h-10 shadow-lg shadow-blue-500/20 gap-2"
                  onClick={handleSave}
                  disabled={isGenerating}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isGenerating ? 'Saving...' : 'Finalize & Edit'}
                </Button>
              </div>
            </div>

            <Card className="border-ds-border/40 shadow-xl bg-white">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center gap-6 pb-6 border-b border-ds-border/40">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                    <Monitor className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle mb-1">
                      Page Title & Slug
                    </h4>
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-bold">{result?.titleEn}</div>
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px]"
                      >
                        /{result?.slug}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
                    Structure & Sections
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result?.sections?.map((section: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border border-ds-border/40 bg-slate-50/50 flex items-center gap-4 hover:border-blue-500/20 hover:bg-blue-50/30 transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-ds-border/40 flex items-center justify-center text-slate-400 font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                            {section.type}
                          </div>
                          <div className="text-xs font-medium text-ds-text-subtle truncate max-w-[200px]">
                            {JSON.stringify(section.contentEn).substring(0, 50)}
                            ...
                          </div>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900 text-white">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      <Globe className="w-3 h-3" /> English Content
                    </div>
                    <div className="text-[11px] text-slate-300 italic">
                      Optimized for clarity and global reach.
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      <Globe className="w-3 h-3" /> Arabic Content
                    </div>
                    <div
                      className="text-[11px] text-slate-300 italic text-right"
                      dir="rtl"
                    >
                      مُحسّن للثقافة المحلية وسيكولوجية السوق.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
