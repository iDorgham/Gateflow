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
    variant:
      | 'default'
      | 'primary'
      | 'secondary'
      | 'success'
      | 'warning'
      | 'danger';
  }
> = {
  [MaintenanceStatus.OPEN]: { label: 'Open', variant: 'secondary' },
  [MaintenanceStatus.ASSIGNED]: { label: 'Assigned', variant: 'primary' },
  [MaintenanceStatus.IN_PROGRESS]: { label: 'In Progress', variant: 'warning' },
  [MaintenanceStatus.PENDING_PARTS]: {
    label: 'Pending Parts',
    variant: 'warning',
  },
  [MaintenanceStatus.RESOLVED]: { label: 'Resolved', variant: 'success' },
  [MaintenanceStatus.CLOSED]: { label: 'Closed', variant: 'default' },
};

export function MaintenanceStatusBadge({
  status,
  className,
}: MaintenanceStatusBadgeProps) {
  const config = statusMap[status] || { label: status, variant: 'default' };

  return (
    <Badge
      variant={config.variant}
      className={cn('whitespace-nowrap', className)}
    >
      {config.label}
    </Badge>
  );
}
