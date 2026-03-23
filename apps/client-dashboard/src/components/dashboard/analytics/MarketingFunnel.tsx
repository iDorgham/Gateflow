'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@gate-access/ui';
import { cn } from '@gate-access/ui';
import { motion } from 'framer-motion';
import { TrendingUp, MousePointer2, UserCheck, CheckCircle2 } from 'lucide-react';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';

interface FunnelStage {
  name: string;
  count: number;
  dropoffRate?: number;
}

interface MarketingFunnelProps {
  filters: AnalyticsFilters;
  className?: string;
}

const STAGE_ICONS = [
  UserCheck,      // QR Created
  MousePointer2,  // Landing Page Opens
  CheckCircle2,   // QR Scanned / Arrived
];

export function MarketingFunnel({ filters, className }: MarketingFunnelProps) {
  const { t } = useTranslation('dashboard');
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const sp = new URLSearchParams();
    sp.set('dateFrom', filters.from);
    sp.set('dateTo', filters.to);
    if (filters.projectId) sp.set('projectId', filters.projectId);

    fetch(`/api/analytics/funnel?${sp.toString()}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && Array.isArray(json.data?.stages)) {
          setStages(json.data.stages);
        } else {
          setError(json.message ?? 'Failed to load funnel');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? 'Network error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters.from, filters.to, filters.projectId]);

  if (loading) {
    return (
      <Card className={cn('min-h-[400px]', className)}>
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </Card>
    );
  }

  if (error || stages.length === 0) {
    return (
      <Card className={cn('min-h-[400px]', className)}>
        <div className="flex h-full items-center justify-center text-muted-foreground">
          {error || t('analytics.noFunnelData', 'No funnel data available')}
        </div>
      </Card>
    );
  }

  const maxCount = Math.max(...stages.map(s => s.count), 1);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t('analytics.funnelTitle', 'Conversion Funnel')}
          </CardTitle>
          <CardDescription>
            {t('analytics.funnelDesc', 'Marketing-to-Arrival conversion analysis')}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative space-y-8">
          {stages.map((stage, idx) => {
            const Icon = STAGE_ICONS[idx] || CheckCircle2;
            const widthPct = (stage.count / maxCount) * 100;
            const prevStage = stages[idx - 1];
            const dropoffVal = prevStage ? Math.round(((prevStage.count - stage.count) / prevStage.count) * 100) : 0;
            const conversionPct = prevStage ? Math.round((stage.count / prevStage.count) * 100) : 0;

            return (
              <div key={stage.name} className="relative">
                {/* Dropoff connector */}
                {idx > 0 && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
                    <div className="h-4 w-px bg-border group-hover:bg-primary transition-colors" />
                    <div className="rounded-full bg-muted/80 backdrop-blur px-2 py-0.5 text-[10px] font-black border border-border flex items-center gap-1 shadow-sm">
                      <span className="text-destructive">-{dropoffVal}%</span>
                      <span className="text-muted-foreground/30">•</span>
                      <span className="text-success">{conversionPct}% CV</span>
                    </div>
                  </div>
                )}

                <div className="group relative flex flex-col gap-3">
                  <div className="flex items-end justify-between px-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/5 text-primary border border-primary/10">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold tracking-tight uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                        {stage.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black">{stage.count.toLocaleString()}</span>
                      <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        {t('analytics.total', 'Total Items')}
                      </span>
                    </div>
                  </div>

                  {/* Funnel Bar */}
                  <div className="relative h-14 w-full bg-muted/30 rounded-2xl overflow-hidden border border-border/40 backdrop-blur-sm">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/80 to-primary shadow-[0_0_20px_-5px_hsl(var(--primary))]"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[length:24px_24px] opacity-20" />
                    </motion.div>
                    
                    {/* Glass glare */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-white/10 pointer-events-none" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall Conversion Indicator */}
        {stages.length >= 3 && (
          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 flex items-center justify-between overflow-hidden relative">
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <TrendingUp className="h-24 w-24" />
            </div>
            <div className="space-y-1 relative z-10">
              <p className="text-sm font-bold uppercase tracking-widest text-primary/70">
                {t('analytics.overallConversion', 'Overall Arrival Rate')}
              </p>
              <p className="text-xs text-muted-foreground max-w-[200px]">
                {t('analytics.overallConversionDesc', 'From initial creation to physical gate entry.')}
              </p>
            </div>
            <div className="text-right relative z-10">
              <span className="text-4xl font-black text-primary italic">
                {Math.round((stages[2].count / stages[0].count) * 100)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
