'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@gateflow/ui';
import { AlertTriangle, Link2 } from 'lucide-react';
import { cn } from '@gateflow/ui';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';

interface CampaignRow {
  campaign: string;
  qualifiedLeads: number;
  firstScans: number;
  linkageRate: number;
  attributionGap: number;
}

interface Diagnostics {
  qualifiedWithoutCampaign: number;
  scansWithoutCampaign: number;
  campaignsMissingFirstScan: string[];
}

interface CampaignFirstScanLinkageProps {
  filters: AnalyticsFilters;
  className?: string;
}

export function CampaignFirstScanLinkage({
  filters,
  className,
}: CampaignFirstScanLinkageProps) {
  const { t } = useTranslation('dashboard');
  const [rows, setRows] = useState<CampaignRow[]>([]);
  const [diagnostics, setDiagnostics] = useState<Diagnostics | null>(null);
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

    fetch(`/api/analytics/campaign-first-scan?${sp.toString()}`, {
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success) {
          setRows(
            Array.isArray(json.data?.campaigns) ? json.data.campaigns : []
          );
          setDiagnostics(json.data?.diagnostics ?? null);
        } else {
          setError(json.message ?? 'Failed to load linkage report');
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
      <Card className={cn('min-h-[340px]', className)}>
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn('min-h-[340px]', className)}>
        <div className="flex h-full items-center justify-center text-sm text-destructive">
          {error}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Link2 className="h-5 w-5 text-primary" />
          {t(
            'analytics.campaignFirstScanTitle',
            'Campaign -> Qualified Lead -> First Scan'
          )}
        </CardTitle>
        <CardDescription>
          {t(
            'analytics.campaignFirstScanDesc',
            'Closed-loop attribution coverage and gap diagnostics by campaign.'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="rounded-lg border border-border/40 overflow-hidden bg-muted/10">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>{t('analytics.campaign', 'Campaign')}</TableHead>
                <TableHead className="text-right">
                  {t('analytics.qualifiedLeads', 'Qualified Leads')}
                </TableHead>
                <TableHead className="text-right">
                  {t('analytics.firstScans', 'First Scans')}
                </TableHead>
                <TableHead className="text-right">
                  {t('analytics.linkageRate', 'Linkage %')}
                </TableHead>
                <TableHead className="text-right">
                  {t('analytics.attributionGap', 'Gap')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell className="text-muted-foreground" colSpan={5}>
                    {t(
                      'analytics.noCampaignLinkage',
                      'No linkage data in selected range.'
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.campaign}>
                    <TableCell className="font-medium">
                      {row.campaign}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {row.qualifiedLeads.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {row.firstScans.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {row.linkageRate}%
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {row.attributionGap.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {diagnostics && (
          <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
            <div className="mb-2 flex items-center gap-2 text-warning">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-wider">
                {t(
                  'analytics.attributionDiagnostics',
                  'Attribution Diagnostics'
                )}
              </span>
            </div>
            <div className="grid gap-1 text-xs text-warning/90">
              <p>
                {t(
                  'analytics.qualifiedWithoutCampaign',
                  'Qualified leads without campaign'
                )}
                : <strong>{diagnostics.qualifiedWithoutCampaign}</strong>
              </p>
              <p>
                {t('analytics.scansWithoutCampaign', 'Scans without campaign')}:{' '}
                <strong>{diagnostics.scansWithoutCampaign}</strong>
              </p>
              <p>
                {t(
                  'analytics.campaignsMissingFirstScan',
                  'Campaigns with no first scan'
                )}
                :{' '}
                <strong>
                  {diagnostics.campaignsMissingFirstScan.length > 0
                    ? diagnostics.campaignsMissingFirstScan.join(', ')
                    : t('analytics.none', 'None')}
                </strong>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
