'use client';

import * as React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  Badge,
  Button,
  Separator,
  cn,
} from '@gate-access/ui';
import { Target, Sparkles, MessageSquare, History, ExternalLink } from 'lucide-react';

interface Lead {
  id: string;
  status: string;
  score: number | null;
  source: string | null;
  createdAt: string;
  organizationName: string;
  orgType: string;
  notes?: string;
}

interface LeadPanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onScore: (id: string) => Promise<void>;
  onDraft: (id: string) => Promise<void>;
  isProcessing: boolean;
}

/**
 * Lead Detail Panel
 *
 * Provides a high-density view of lead intelligence, including AI scores,
 * capture context, and quick actions for nurturing.
 */
export function LeadPanel({ lead, isOpen, onClose, onScore, onDraft, isProcessing }: LeadPanelProps) {
  if (!lead) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[540px] border-l border-ds-border overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-ds-background-brand-subtle text-ds-text-brand">
              <Target className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="uppercase text-[9px] font-bold tracking-tighter bg-ds-background-neutral-subtle/30">
              {lead.status}
            </Badge>
          </div>
          <SheetTitle className="text-3xl font-black tracking-tight">{lead.organizationName}</SheetTitle>
          <SheetDescription className="text-[10px] uppercase tracking-[0.2em] font-black text-ds-text-subtle">
            {lead.orgType} VERTICAL • CAPTURED {new Date(lead.createdAt).toLocaleDateString()}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          {/* AI Insights Section */}
          <div className="p-5 rounded-2xl bg-ds-background-neutral-subtle/40 border border-ds-border/50 relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 p-3 opacity-5 transition-transform group-hover:scale-110 duration-700">
              <Sparkles className="h-24 w-24 text-ds-text-brand" />
            </div>
            
            <div className="flex items-baseline justify-between mb-4 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-ds-text-subtle flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-ds-text-brand" />
                AI Predictive Score
              </span>
              {lead.score !== null ? (
                <span className={cn(
                  "text-5xl font-black tabular-nums tracking-tighter",
                  lead.score >= 80 ? 'text-green-500' : lead.score >= 50 ? 'text-yellow-500' : 'text-red-500'
                )}>
                  {lead.score}
                </span>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onScore(lead.id)}
                  disabled={isProcessing}
                  className="gap-2 bg-ds-background-default border-ds-border-brand/30 text-ds-text-brand font-bold"
                >
                  <Sparkles className={cn("h-4 w-4", isProcessing && "animate-spin")} />
                  ANALYZE INTENT
                </Button>
              )}
            </div>

            <Separator className="bg-ds-border/30 mb-4" />

            <div className="space-y-4 relative z-10">
              <div className="flex gap-3">
                <div className="mt-1 p-1 rounded-md bg-ds-background-brand-subtle/40">
                  <Target className="h-3.5 w-3.5 text-ds-text-brand" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-black uppercase tracking-wider text-ds-text">Strategic Recommendation</p>
                  <p className="text-sm text-ds-text-subtle leading-relaxed">
                    {lead.score !== null 
                      ? "High conversion potential. Recommend immediate follow-up with a focused demo highlighting multi-tenant security features and RTL Guard app capabilities."
                      : "Perform intent analysis to unlock personalized outreach strategies and conversion probability."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtle">
              <History className="h-3 w-3" />
              Capture Context
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5 p-3 rounded-xl bg-ds-background-neutral-subtle/20 border border-ds-border/30">
                <p className="text-[9px] font-black text-ds-text-subtle uppercase tracking-widest">Channel Source</p>
                <p className="text-sm font-bold text-ds-text">{lead.source ?? 'Organic Inbound'}</p>
              </div>
              <div className="space-y-1.5 p-3 rounded-xl bg-ds-background-neutral-subtle/20 border border-ds-border/30">
                <p className="text-[9px] font-black text-ds-text-subtle uppercase tracking-widest">Entry Date</p>
                <p className="text-sm font-bold text-ds-text">{new Date(lead.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[9px] font-black text-ds-text-subtle uppercase tracking-widest">Primary Inquiry / Notes</p>
              <div className="p-4 rounded-xl bg-ds-background-neutral-subtle/30 border border-ds-border/40 text-sm leading-relaxed text-ds-text italic font-medium">
                &quot;{lead.notes ?? 'No specific notes provided with the initial inquiry.'}&quot;
              </div>
            </div>
          </div>

          {/* Command Actions */}
          <div className="pt-6 border-t border-ds-border/40 flex flex-col gap-3">
             <Button 
               className="w-full h-14 gap-3 text-base font-black uppercase tracking-widest bg-ds-background-brand-bold hover:bg-ds-background-brand-bold-hover shadow-lg shadow-brand/20 transition-all active:scale-[0.98]" 
               onClick={() => onDraft(lead.id)} 
               disabled={isProcessing}
             >
                <MessageSquare className={cn("h-5 w-5", isProcessing && "animate-pulse")} />
                Generate AI Follow-up
             </Button>
             <div className="grid grid-cols-2 gap-3">
               <Button variant="outline" className="h-12 gap-2 font-bold uppercase text-[10px] tracking-widest border-ds-border/60">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Org
               </Button>
               <Button variant="ghost" className="h-12 gap-2 font-bold uppercase text-[10px] tracking-widest text-ds-text-subtle" onClick={onClose}>
                  Dismiss
               </Button>
             </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
