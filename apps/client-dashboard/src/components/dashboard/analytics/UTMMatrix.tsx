'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@gateflow/ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@gateflow/ui';
import { cn } from '@gateflow/ui';
import { MousePointer2, UserCheck, BarChart3, Info } from 'lucide-react';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';

interface UTMMatrixRow {
  source: string;
  medium: string;
  clicks: number;
  scans: number;
  conversionRate: number;
}

interface UTMMatrixProps {
  filters: AnalyticsFilters;
  className?: string;
}

export function UTMMatrix({ filters, className }: UTMMatrixProps) {
  const { t } = useTranslation('dashboard');
  const [rows, setRows] = useState<UTMMatrixRow[]>([]);
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

    fetch(`/api/analytics/utm-matrix?${sp.toString()}`, {
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && Array.isArray(json.data?.matrix)) {
          setRows(json.data.matrix);
        } else {
          setError(json.message ?? 'Failed to load UTM matrix');
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

  if (error || rows.length === 0) {
    return (
      <Card className={cn('min-h-[400px]', className)}>
        <div className="flex h-full items-center justify-center text-muted-foreground">
          {error ||
            t('analytics.noUTMData', 'No UTM attribution data available')}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          {t('analytics.utmMatrixTitle', 'Source / Medium Attribution')}
        </CardTitle>
        <CardDescription>
          {t(
            'analytics.utmMatrixDesc',
            'Detailed conversion breakdown by traffic sources.'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="rounded-lg border border-border/40 overflow-hidden bg-muted/10">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest">
                  {t('analytics.source', 'Source')}
                </TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest">
                  {t('analytics.medium', 'Medium')}
                </TableHead>
                <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest">
                  <div className="flex items-center justify-end gap-1.5">
                    <MousePointer2 className="h-3 w-3" />
                    {t('analytics.clicks', 'Clicks')}
                  </div>
                </TableHead>
                <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest">
                  <div className="flex items-center justify-end gap-1.5">
                    <UserCheck className="h-3 w-3" />
                    {t('analytics.arrivals', 'Arrivals')}
                  </div>
                </TableHead>
                <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest">
                  {t('analytics.conversion', 'CVR %')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, idx) => {
                const cvr = row.conversionRate;
                const cvrColor =
                  cvr > 25
                    ? 'bg-success/10 text-success'
                    : cvr > 10
                      ? 'bg-warning/10 text-warning'
                      : cvr > 0
                        ? 'bg-info/10 text-info'
                        : 'bg-muted text-muted-foreground';

                return (
                  <TableRow
                    key={`${row.source}-${row.medium}-${idx}`}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-medium">{row.source}</TableCell>
                    <TableCell className="text-muted-foreground italic text-xs">
                      {row.medium}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {row.clicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs font-bold">
                      {row.scans.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className={cn(
                          'inline-flex items-center justify-center rounded-md px-2 py-1 text-[11px] font-black min-w-[44px]',
                          cvrColor
                        )}
                      >
                        {cvr}%
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 p-3 rounded-lg border border-primary/10 bg-primary/5 flex items-start gap-3">
          <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-[11px] leading-relaxed text-primary/80">
            {t(
              'analytics.utmMatrixInfo',
              'Arrivals represent physical security scans where the QR code was originally generated from that marketing link. CVR % measures the conversion from Landing Page Opens to physical entry.'
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
