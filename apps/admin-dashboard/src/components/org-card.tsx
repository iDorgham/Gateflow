import * as React from 'react';
import { Users, MapPin, MoreVertical } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@gate-access/ui';

export interface OrgCardProps {
  id: string;
  name: string;
  logoUrl?: string;
  location: string;
  memberCount: number;
  status: 'active' | 'suspended' | 'pending';
  onManage?: () => void;
}

export function OrgCard({
  name,
  logoUrl,
  location,
  memberCount,
  status,
  onManage,
}: OrgCardProps) {
  const { t } = useTranslation('common');

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-muted">
            <AvatarImage src={logoUrl} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-base line-clamp-1">{name}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ltr:-mr-2 rtl:-ml-2"
          onClick={onManage}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-foreground font-medium">
            <Users className="h-4 w-4 text-muted-foreground" />
            {memberCount.toLocaleString()} {t('admin.organizations.users')}
          </div>
          <Badge
            variant={
              status === 'active'
                ? 'default'
                : status === 'suspended'
                  ? 'destructive'
                  : 'secondary'
            }
            className="capitalize"
          >
            {t(
              `admin.organizations.status${status.charAt(0).toUpperCase() + status.slice(1)}`
            )}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
