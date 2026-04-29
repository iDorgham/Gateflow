'use client';

import { ScanLine, Users, GraduationCap, Ticket, GlassWater } from 'lucide-react';
import { Button } from '@gate-access/ui';
import Link from 'next/link';
import { OrganizationType } from '@gate-access/types';

interface DashboardEmptyStateProps {
  orgType: OrganizationType;
  t: (key: string, options?: any) => string;
}

export function DashboardEmptyState({ orgType, t }: DashboardEmptyStateProps) {
  const ICON_MAP: Record<string, any> = {
    [OrganizationType.REAL_ESTATE]: ScanLine,
    [OrganizationType.SCHOOL]: GraduationCap,
    [OrganizationType.CLUB]: Users,
    [OrganizationType.NIGHTCLUB]: GlassWater,
    [OrganizationType.EVENT_ORGANISER]: Ticket,
  };

  const Icon = ICON_MAP[orgType] || ScanLine;

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-12 text-center animate-in fade-in zoom-in duration-300">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">
        {t('overview.noScans', { defaultValue: 'No activity yet' })}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {t(`overview.emptyState.${orgType}`, { 
          defaultValue: t('overview.noScansDesc', 'Create and share a QR code to see activity here.') 
        })}
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/dashboard/qrcodes/create">
            {t('overview.createFirst', { defaultValue: 'Create QR Code' })}
          </Link>
        </Button>
        {orgType === OrganizationType.REAL_ESTATE && (
          <Button variant="outline" asChild>
            <Link href="/dashboard/residents/units">
              {t('orgType.realEstate.unitLabelPlural', { defaultValue: 'Add Units' })}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
