'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@gate-access/ui';
import { Input } from '@gate-access/ui';
import { Label } from '@gate-access/ui';
import { cn } from '@gate-access/ui';

interface AnalyticsROIWidgetProps {
  attributedScans: number;
  className?: string;
}

export function AnalyticsROIWidget({ attributedScans, className }: AnalyticsROIWidgetProps) {
  const { t } = useTranslation('dashboard');
  const [valuePerScan, setValuePerScan] = useState('');

  const valueNum = useMemo(() => {
    const n = parseFloat(valuePerScan.replace(/,/g, ''));
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }, [valuePerScan]);

  const totalROI = attributedScans * valueNum;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base">{t('analytics.roiTitle', 'ROI calculator')}</CardTitle>
        <CardDescription>
          {t('analytics.roiDesc', 'Value per attributed scan × scans')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="roi-value">{t('analytics.valuePerScan', 'Value per scan')}</Label>
          <Input
            id="roi-value"
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={valuePerScan}
            onChange={(e) => setValuePerScan(e.target.value)}
            className="max-w-[140px]"
          />
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">{t('analytics.attributedScans', 'Attributed scans')}</p>
          <p className="text-2xl font-bold">{attributedScans.toLocaleString()}</p>
          <p className="mt-2 text-xs text-muted-foreground">{t('analytics.estimatedROI', 'Estimated ROI')}</p>
          <p className="text-xl font-semibold text-primary">
            {totalROI.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
