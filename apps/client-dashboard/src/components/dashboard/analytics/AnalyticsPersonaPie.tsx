'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@gate-access/ui';
import { cn } from '@gate-access/ui';

interface AnalyticsPersonaPieProps {
  className?: string;
}

/** Stub: single "All" segment. Full tag-based pie can be added when tag aggregation API exists. */
export function AnalyticsPersonaPie({ className }: AnalyticsPersonaPieProps) {
  const { t } = useTranslation('dashboard');

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-base">{t('analytics.personaTitle', 'Audience')}</CardTitle>
        <CardDescription>{t('analytics.personaDesc', 'By tag (coming soon)')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-lg border border-dashed border-muted bg-muted/20 p-4 text-center text-sm text-muted-foreground">
          <span>{t('analytics.personaStub', 'All contacts')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
