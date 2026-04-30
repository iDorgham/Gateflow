'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  PageHeader,
  cn,
} from '@gate-access/ui';
import {
  Target,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Search,
  Filter,
  Eye,
  ChevronRight,
  GripVertical,
} from 'lucide-react';
import { toast } from 'sonner';
import { LeadPanel } from './LeadPanel';

interface Lead {
  id: string;
  status: string;
  score: number | null;
  source: string | null;
  createdAt: string;
  organizationName: string;
  orgType: string;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
}

interface CrmDashboardProps {
  leads: Lead[];
  locale: string;
  translations: {
    title: string;
    subtitle: string;
    columns: {
      lead: string;
      status: string;
      score: string;
      actions: string;
    };
    actions: {
      score: string;
      draft: string;
    };
    scoreSuccess: string;
    scoreError: string;
  };
}

const KANBAN_STAGES = [
  { id: 'NEW', label: 'New Leads' },
  { id: 'CONTACTED', label: 'Contacted' },
  { id: 'QUALIFIED', label: 'Qualified' },
  { id: 'NEGOTIATION', label: 'Negotiation' },
  { id: 'CLOSED_WON', label: 'Closed Won' },
  { id: 'CLOSED_LOST', label: 'Closed Lost' },
];

export function CrmDashboard({
  leads: initialLeads,
  locale,
  translations,
}: CrmDashboardProps) {
  const [leads, setLeads] = useState(initialLeads);
  const [isScoring, setIsScoring] = useState<string | null>(null);
  const [isDrafting, setIsDrafting] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null;

  const handleScoreLead = async (leadId: string) => {
    setIsScoring(leadId);
    try {
      const res = await fetch('/api/crm/score-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId }),
      });

      if (!res.ok) throw new Error('Scoring failed');

      const result = await res.json();

      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, score: result.score } : l))
      );

      toast.success(translations.scoreSuccess);
    } catch (err) {
      toast.error(translations.scoreError);
    } finally {
      setIsScoring(null);
    }
  };

  const handleGenerateDraft = async (leadId: string) => {
    setIsDrafting(leadId);
    try {
      const res = await fetch('/api/crm/generate-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId,
          tone: 'professional',
          language: locale.split('-')[0],
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Drafting failed');
      }

      const result = await res.json();
      toast.success('Follow-up draft generated (Pending Review)');
      console.log('Draft generated:', result.draft);
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate draft');
    } finally {
      setIsDrafting(null);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    // In a real implementation, make API call here
    toast.success(`Moved to ${newStatus}`);
  };

  const highIntentCount = leads.filter((l) => (l.score ?? 0) >= 80).length;

  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in duration-500 overflow-hidden">
      <div className="shrink-0 space-y-6">
        <PageHeader
          title={translations.title}
          subtitle={translations.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-ds-background-neutral-subtle/40 border-none shadow-none ring-1 ring-ds-border/50">
            <CardHeader className="pb-2 space-y-0">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtle flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                Capture Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tabular-nums">
                {leads.length}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-ds-background-brand-subtle/20 border-none shadow-none ring-1 ring-ds-border-brand/30">
            <CardHeader className="pb-2 space-y-0">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-brand flex items-center gap-2">
                <Sparkles className="h-3 w-3" />
                High Intent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-ds-text-brand tabular-nums">
                {highIntentCount}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ds-text-subtle" />
            <input
              type="text"
              placeholder="Search leads..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-ds-background-default border border-ds-border focus:ring-2 focus:ring-brand/20 outline-none transition-all text-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex h-full gap-4 min-w-max items-start">
          {KANBAN_STAGES.map((stage) => {
            const stageLeads = leads.filter((l) => l.status === stage.id);
            return (
              <div
                key={stage.id}
                className="flex flex-col w-72 h-full max-h-full bg-ds-background-neutral-subtle/30 rounded-xl border border-ds-border/50"
              >
                <div className="p-3 border-b border-ds-border/50 flex justify-between items-center shrink-0">
                  <h3 className="text-xs font-black uppercase tracking-wider text-ds-text-subtle">
                    {stage.label}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] tabular-nums font-bold bg-ds-background-default"
                  >
                    {stageLeads.length}
                  </Badge>
                </div>
                <div className="p-2 overflow-y-auto flex-1 space-y-2">
                  {stageLeads.map((lead) => {
                    const score = lead.score;
                    const colorClass =
                      score && score >= 80
                        ? 'text-green-500'
                        : score && score >= 50
                          ? 'text-yellow-500'
                          : score !== null
                            ? 'text-red-500'
                            : 'text-ds-text-subtle';
                    return (
                      <Card
                        key={lead.id}
                        className="p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-ds-border-brand/50 bg-ds-background-default"
                        onClick={() => setSelectedLeadId(lead.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex flex-col min-w-0 pr-2">
                            <span className="font-bold text-sm text-ds-text truncate">
                              {lead.firstName || lead.lastName
                                ? `${lead.firstName || ''} ${lead.lastName || ''}`.trim()
                                : lead.organizationName}
                            </span>
                            {(lead.firstName || lead.lastName) &&
                              lead.company && (
                                <span className="text-[10px] text-ds-text-subtle truncate">
                                  {lead.company}
                                </span>
                              )}
                            {!(lead.firstName || lead.lastName) && (
                              <span className="text-[10px] uppercase tracking-wider text-ds-text-subtlest font-medium">
                                {lead.orgType}
                              </span>
                            )}
                          </div>
                          <div className="shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-ds-background-neutral-subtle group-hover:bg-ds-background-brand-subtle transition-colors">
                            <ChevronRight className="h-3 w-3 text-ds-text-subtlest group-hover:text-ds-text-brand" />
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-ds-border/30">
                          <div
                            className="flex items-center gap-1.5"
                            title="AI Score"
                          >
                            {score !== null ? (
                              <>
                                <div
                                  className={cn(
                                    'h-1.5 w-1.5 rounded-full',
                                    score >= 80
                                      ? 'bg-green-500'
                                      : score >= 50
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                  )}
                                />
                                <span
                                  className={cn(
                                    'font-black text-xs tabular-nums',
                                    colorClass
                                  )}
                                >
                                  {score}
                                </span>
                              </>
                            ) : (
                              <span className="text-[9px] font-bold tracking-widest uppercase text-ds-text-subtlest">
                                UNRATED
                              </span>
                            )}
                          </div>

                          <div className="flex gap-1">
                            {stage.id === 'NEW' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-ds-background-brand-subtle hover:text-ds-text-brand"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateLeadStatus(lead.id, 'CONTACTED');
                                }}
                                title="Move to Contacted"
                              >
                                <ChevronRight className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                  {stageLeads.length === 0 && (
                    <div className="h-24 flex items-center justify-center text-center p-4 border-2 border-dashed border-ds-border/50 rounded-lg">
                      <span className="text-[10px] font-bold text-ds-text-subtlest uppercase tracking-widest">
                        No Leads
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <LeadPanel
        lead={selectedLead}
        isOpen={!!selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        onScore={handleScoreLead}
        onDraft={handleGenerateDraft}
        isProcessing={!!isScoring || !!isDrafting}
      />
    </div>
  );
}
