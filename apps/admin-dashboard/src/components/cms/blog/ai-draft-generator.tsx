import React, { useState } from 'react';
import { Button, Card, CardContent, Badge, Progress } from '@gateflow/ui';
import {
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

export interface BlogDraft {
  title: string;
  excerpt: string;
  sections: any[];
  metaDescription: string;
}

interface AIDraftGeneratorProps {
  topic: string;
  onInsert: (draft: BlogDraft) => void;
}

export function AIDraftGenerator({ topic, onInsert }: AIDraftGeneratorProps) {
  const [draft, setDraft] = useState<BlogDraft | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const generateDraft = async () => {
    setIsGenerating(true);
    setProgress(10);

    // Simulate multi-stage generation progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 800);

    try {
      const response = await fetch('/api/cms/blog/generate-draft', {
        method: 'POST',
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      setDraft(data.draft);
      setProgress(100);
      toast.success('AI Draft generated successfully!');
    } catch (error) {
      toast.error('Failed to generate draft');
    } finally {
      setIsGenerating(false);
      clearInterval(timer);
    }
  };

  return (
    <div className="space-y-4 p-6 border-2 border-dashed border-ds-border-brand/30 rounded-2xl bg-ds-background-brand-subtle/20">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-ds-text-brand" />
            <h3 className="font-black text-sm uppercase tracking-tighter text-ds-text">
              AI Draft Architect
            </h3>
          </div>
          <p className="text-xs text-ds-text-subtle">
            Transform your topic into a structured, SEO-optimized blog post.
          </p>
        </div>
        {!draft && (
          <Button
            size="sm"
            onClick={generateDraft}
            disabled={isGenerating || !topic}
            className="bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold/90 shadow-lg"
          >
            {isGenerating ? (
              <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 mr-2" />
            )}
            {isGenerating ? 'Architecting...' : 'Generate Draft'}
          </Button>
        )}
      </div>

      {isGenerating && (
        <div className="space-y-2">
          <Progress value={progress} className="h-1.5 bg-ds-border" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-ds-text-brand animate-pulse">
            {progress < 40
              ? 'Analyzing Topic...'
              : progress < 70
                ? 'Structuring Sections...'
                : 'Polishing Content...'}
          </p>
        </div>
      )}

      {draft && (
        <Card className="border-ds-border-brand/50 shadow-xl bg-ds-surface overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 bg-ds-background-brand-subtle/30 border-b border-ds-border-brand/20 flex items-center justify-between">
              <Badge className="bg-ds-background-brand-bold text-ds-text-inverse border-0 font-black text-[10px] tracking-widest uppercase">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Draft Ready
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-[10px] font-black uppercase text-ds-text-brand"
                onClick={() => setDraft(null)}
              >
                Clear
              </Button>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-ds-text mb-2">{draft.title}</h4>
              <p className="text-[11px] text-ds-text-subtle italic mb-4 line-clamp-3">
                &quot;{draft.excerpt}&quot;
              </p>

              <div className="flex items-center gap-4 text-[10px] font-black uppercase text-ds-text-subtler mb-4">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" /> {draft.sections.length}{' '}
                  Blocks
                </div>
                <div className="flex items-center gap-1 text-ds-text-success">
                  <CheckCircle2 className="h-3 w-3" /> SEO Optimized
                </div>
              </div>

              <Button
                className="w-full bg-ds-surface-brand text-ds-text-brand hover:bg-ds-background-brand-subtle border border-ds-border-brand/30 h-9 font-black uppercase tracking-tighter text-xs"
                onClick={() => onInsert(draft)}
              >
                Insert into Editor
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!draft && !isGenerating && (
        <div className="flex items-center gap-2 p-3 bg-ds-surface border border-ds-border rounded-lg text-ds-text-subtlest italic text-[10px]">
          <AlertCircle className="h-3 w-3" />
          Selected Topic: {topic || 'None selected'}
        </div>
      )}
    </div>
  );
}
