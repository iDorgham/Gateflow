import * as React from 'react';
import { Badge } from '../ui/badge';
import { MaintenanceStatus } from '@gate-access/types';
import { cn } from '../../lib/utils';

interface MaintenanceStatusBadgeProps {
  status: MaintenanceStatus | string;
  className?: string;
}

const statusMap: Record<
  string,
  {
    label: string;
    tone: 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  }
> = {
  [MaintenanceStatus.OPEN]: { label: 'Open', tone: 'neutral' },
  [MaintenanceStatus.ASSIGNED]: { label: 'Assigned', tone: 'info' },
  [MaintenanceStatus.IN_PROGRESS]: { label: 'In Progress', tone: 'warning' },
  [MaintenanceStatus.PENDING_PARTS]: {
    label: 'Pending Parts',
    tone: 'warning',
  },
  [MaintenanceStatus.RESOLVED]: { label: 'Resolved', tone: 'success' },
  [MaintenanceStatus.CLOSED]: { label: 'Closed', tone: 'neutral' },
};

export function MaintenanceStatusBadge({
  status,
  className,
}: MaintenanceStatusBadgeProps) {
  const config = statusMap[status] || { label: status, tone: 'neutral' };

  return (
    <Badge
      variant="soft"
      tone={config.tone}
      className={cn('whitespace-nowrap', className)}
    >
      {config.label}
    </Badge>
  );
}
