'use client';

import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Badge,
  Alert,
  AlertTitle,
  AlertDescription,
  Textarea,
  Label,
  ScrollArea,
  Separator,
} from '@gateflow/ui';
import { ContentBlocksRenderer } from '../../cms/builder/content-blocks-renderer';

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (feedback?: string) => void;
  onReject: (feedback?: string) => void;
  content: any; // Could be object or stringified JSON
  title: string;
  type: 'BLOG_POST' | 'LANDING_PAGE';
}

export function ReviewDialog({
  isOpen,
  onClose,
  onApprove,
  onReject,
  content,
  title,
  type,
}: ReviewDialogProps) {
  const [feedback, setFeedback] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleAction = async (action: 'approve' | 'reject') => {
    setIsSubmitting(true);
    if (action === 'approve') {
      await onApprove(feedback);
    } else {
      await onReject(feedback);
    }
    setIsSubmitting(false);
  };

  const blocks = React.useMemo(() => {
    if (!content) return [];
    try {
      return typeof content === 'string' ? JSON.parse(content) : content;
    } catch (e) {
      return [];
    }
  }, [content]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-ds-border bg-card/95 backdrop-blur-xl">
        <DialogHeader className="p-6 border-b border-border/30 bg-noise">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-ds-background-brand-bold flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="h-5 w-5 text-ds-icon-inverse" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tight">
                  Review AI Synthesis
                </DialogTitle>
                <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-ds-text-subtler">
                  Human-in-the-loop validation for {type.replace('_', ' ')}
                </DialogDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-amber-500/10 text-amber-500 border-none text-[8px] font-black uppercase tracking-[0.2em] px-2 h-5"
            >
              Pending Verification
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          <div className="flex-1 flex flex-col border-r border-border/30">
            <div className="p-4 bg-muted/20 border-b border-border/30 flex items-center justify-between">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler flex items-center gap-2">
                <Eye className="h-3.5 w-3.5" /> Content Preview
              </h4>
              <span className="text-[9px] font-bold text-ds-text-subtle uppercase">
                {title}
              </span>
            </div>
            <ScrollArea className="flex-1 p-6 bg-ds-background-neutral-subtle/50">
              <div className="max-w-2xl mx-auto space-y-8 bg-card p-8 rounded-2xl border border-border/30 shadow-sm">
                <h1 className="text-3xl font-black uppercase tracking-tight leading-tight">
                  {title}
                </h1>
                <Separator className="bg-border/30" />
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ContentBlocksRenderer blocks={blocks} />
                </div>
              </div>
            </ScrollArea>
          </div>

          <div className="w-full lg:w-80 flex flex-col bg-noise border-t lg:border-t-0 border-border/30">
            <div className="p-4 border-b border-border/30 bg-muted/20">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" /> Quality Audit
              </h4>
            </div>
            <div className="flex-1 p-4 space-y-6 overflow-y-auto custom-scrollbar">
              <Alert className="bg-ds-background-brand-subtle/30 border-ds-border-brand/20">
                <Sparkles className="h-4 w-4 text-ds-icon-brand" />
                <AlertTitle className="text-[10px] font-black uppercase tracking-tight">
                  AI Generated
                </AlertTitle>
                <AlertDescription className="text-[10px] font-bold leading-relaxed opacity-80">
                  This content was synthesized using neural models. Verify all
                  factual claims and regional compliance.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtler">
                    Validation Notes
                  </Label>
                  <Textarea
                    placeholder="Add feedback for the team or AI iteration..."
                    className="min-h-[120px] bg-card border-border/50 text-xs font-bold resize-none"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <h5 className="text-[9px] font-black uppercase tracking-widest text-ds-text-subtler">
                    Compliance Checklist
                  </h5>
                  {[
                    'Factual Accuracy Verified',
                    'Bi-lingual Consistency (EN/AR)',
                    'Brand Tone Alignment',
                    'Regional Regulation Check',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded border border-border/50 flex items-center justify-center shrink-0 cursor-pointer hover:border-ds-border-brand/50 transition-colors">
                        <CheckCircle2 className="h-3 w-3 text-ds-icon-brand opacity-20" />
                      </div>
                      <span className="text-[10px] font-bold text-ds-text-subtle">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border/30 bg-muted/30 flex flex-col gap-2">
              <Button
                className="w-full h-11 bg-ds-background-brand-bold text-ds-icon-inverse font-black uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-primary/20"
                onClick={() => handleAction('approve')}
                disabled={isSubmitting}
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve & Publish
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 border-rose-500/20 text-rose-500 hover:bg-rose-500/5 font-black uppercase tracking-widest text-[10px] gap-2"
                onClick={() => handleAction('reject')}
                disabled={isSubmitting}
              >
                <XCircle className="h-4 w-4" />
                Reject Draft
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
