'use client';

import { Card, CardContent, CardHeader, Badge, Button } from '@gate-access/ui';
import { Pencil } from 'lucide-react';
import type { ProjectDetailActionsRef } from './ProjectDetailActions';

interface Gate {
  id: string;
  name: string;
  location?: string | null;
  isActive?: boolean;
  lastAccessedAt?: Date | string | null;
  _count?: { scanLogs?: number; qrCodes?: number };
}

interface GatesCardWithEditProps {
  gates: Gate[];
  locale: string;
  lastAccessLabel: string;
  noGatesLabel: string;
  actionsRef: React.RefObject<ProjectDetailActionsRef | null>;
}

export function GatesCardWithEdit({
  gates,
  locale,
  lastAccessLabel,
  noGatesLabel,
  actionsRef,
}: GatesCardWithEditProps) {
  return (
    <Card className="border border-border bg-card rounded-xl shadow-sm">
      <CardHeader className="pb-2">
        <h2 className="text-lg font-semibold text-foreground">Gates</h2>
      </CardHeader>
      <CardContent className="pt-0">
        {gates.length === 0 ? (
          <p className="text-sm text-muted-foreground">{noGatesLabel}</p>
        ) : (
          <ul className="space-y-3">
            {gates.map((gate) => (
              <li
                key={gate.id}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2"
              >
                <div>
                  <p className="font-medium text-foreground">{gate.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {lastAccessLabel}:{' '}
                    {gate.lastAccessedAt
                      ? new Date(gate.lastAccessedAt).toLocaleString(locale)
                      : '—'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-[10px] ${
                      gate.isActive
                        ? 'bg-success/20 text-success border-success/30'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {gate.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {gate._count?.qrCodes != null && (
                    <span className="text-xs text-muted-foreground">
                      {gate._count.qrCodes} QR
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => actionsRef.current?.openGateEdit(gate)}
                    aria-label="Edit gate"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
