'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { cn } from '@gate-access/ui';
import { buildContactsUrl, buildUnitsUrl } from '@/lib/analytics';
import type { AnalyticsFilters } from '@/lib/analytics/analytics-filters';

interface AnalyticsApplyFiltersButtonProps {
  locale: string;
  filters: AnalyticsFilters;
  className?: string;
}

export function AnalyticsApplyFiltersButton({ locale, filters, className }: AnalyticsApplyFiltersButtonProps) {
  const { t } = useTranslation('dashboard');

  const contactsHref = buildContactsUrl(locale, filters);
  const unitsHref = buildUnitsUrl(locale, filters);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm text-muted-foreground">
        {t('analytics.applyFiltersTo', 'Apply filters to')}
      </span>
      <Link
        href={contactsHref}
        className="text-sm font-medium text-primary hover:underline"
      >
        {t('analytics.applyToContacts', 'Contacts')}
      </Link>
      <span className="text-muted-foreground">|</span>
      <Link
        href={unitsHref}
        className="text-sm font-medium text-primary hover:underline"
      >
        {t('analytics.applyToUnits', 'Units')}
      </Link>
    </div>
  );
}
