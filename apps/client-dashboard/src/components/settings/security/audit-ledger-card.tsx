'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lock,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@gateflow/ui';
import type { LedgerVerificationResult } from '@gate-access/db';

export function AuditLedgerCard({ orgName }: { orgName?: string }) {
  const [integrity, setIntegrity] = useState<LedgerVerificationResult | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [exportingJson, setExportingJson] = useState<boolean>(false);
  const [exportingCsv, setExportingCsv] = useState<boolean>(false);

  const fetchIntegrity = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/security/audit-integrity');
      if (res.ok) {
        const data = await res.json();
        setIntegrity(data.integrity);
      }
    } catch (err) {
      console.error('Failed to fetch audit ledger integrity:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrity();
  }, []);

  const handleDownload = (format: 'json' | 'csv') => {
    if (format === 'json') setExportingJson(true);
    if (format === 'csv') setExportingCsv(true);

    const anchor = document.createElement('a');
    anchor.href = `/api/security/audit-export?format=${format}`;
    anchor.download = '';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    setTimeout(() => {
      if (format === 'json') setExportingJson(false);
      if (format === 'csv') setExportingCsv(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Overview & Cryptographic Verification Card */}
      <Card className="border border-border/60 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-lg font-semibold tracking-tight">
                Cryptographic Audit Ledger & Compliance
              </CardTitle>
            </div>
            <CardDescription>
              Tamper-evident append-only ledger chained with SHA-256 for{' '}
              {orgName ?? 'Organization'}. Compliant with Egyptian Personal Data
              Protection Law No. 151 and Saudi PDPL.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchIntegrity}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Verify Chain
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Integrity Status */}
            <div className="p-4 rounded-xl border border-border/50 bg-muted/30 space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ledger Status
              </span>
              <div className="flex items-center gap-2 pt-1">
                {integrity?.isValid ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Verified Intact
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {loading ? 'Checking...' : 'Chain Anomaly Detected'}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Total Audited Records */}
            <div className="p-4 rounded-xl border border-border/50 bg-muted/30 space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Chained Events
              </span>
              <div className="flex items-center gap-2 pt-1">
                <Layers className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">
                  {loading ? '—' : (integrity?.totalEntries ?? 0)}
                </span>
                <span className="text-xs text-muted-foreground">records</span>
              </div>
            </div>

            {/* Latest Hash Seal */}
            <div className="p-4 rounded-xl border border-border/50 bg-muted/30 space-y-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Current Hash Seal
              </span>
              <div className="flex items-center gap-1.5 pt-1">
                <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                <code className="text-xs font-mono text-muted-foreground truncate max-w-[200px]">
                  {loading
                    ? 'calculating...'
                    : integrity?.latestHash
                      ? `${integrity.latestHash.slice(0, 16)}...`
                      : 'Genesis'}
                </code>
              </div>
            </div>
          </div>

          {/* Compliance Reporting Download Actions */}
          <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold">
                Official Compliance Audit Export
              </h4>
              <p className="text-xs text-muted-foreground">
                Download cryptographically signed audit logs with integrity
                seals for regulatory submission.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload('json')}
                disabled={exportingJson || loading}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                {exportingJson ? 'Exporting...' : 'Export JSON'}
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleDownload('csv')}
                disabled={exportingCsv || loading}
                className="gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                {exportingCsv ? 'Exporting...' : 'Export CSV'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
