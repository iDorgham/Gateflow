'use client';

import * as React from 'react';
import { useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  Badge,
  ScrollArea,
  Separator,
} from '@gateflow/ui';
import {
  History,
  Sparkles,
  User,
  RotateCcw,
  Eye,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

export interface Version {
  id: string;
  version: number;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
  };
  changes: string[];
  isAiGenerated: boolean;
  content: any;
}

interface VersionHistoryProps {
  contentId: string;
  versions: Version[];
  onRestore: (version: Version) => void;
  onView: (version: Version) => void;
}

export function VersionHistory({
  contentId,
  versions,
  onRestore,
  onView,
}: VersionHistoryProps) {
  const { t } = useTranslation('admin');

  return (
    <div className="flex flex-col h-full bg-ds-background-neutral-subtle rounded-xl border border-ds-border overflow-hidden">
      <div className="p-4 bg-ds-background border-b border-ds-border flex items-center gap-2">
        <History className="h-4 w-4 text-primary" />
        <h3 className="font-bold text-sm">
          {t('cms.versionHistory', 'Version History')}
        </h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {versions.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <Clock className="h-8 w-8 text-ds-text-subtle mx-auto opacity-20" />
              <p className="text-xs text-ds-text-subtle">
                {t('cms.noVersions', 'No versions found')}
              </p>
            </div>
          ) : (
            versions.map((version, index) => (
              <Card
                key={version.id}
                className="border-ds-border hover:border-primary/30 transition-colors shadow-none bg-ds-background"
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-primary">
                        v{version.version}
                      </span>
                      {index === 0 && (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-4 bg-green-500/10 text-green-600 border-green-500/20"
                        >
                          {t('cms.current', 'Current')}
                        </Badge>
                      )}
                      {version.isAiGenerated && (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-4 bg-primary/10 text-primary border-primary/20 flex items-center gap-1"
                        >
                          <Sparkles className="h-2 w-2" />
                          AI
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-[11px] text-ds-text-subtle">
                      <User className="h-3 w-3" />
                      <span>{version.createdBy.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-ds-text-subtle">
                      <Clock className="h-3 w-3" />
                      <span>
                        {format(
                          new Date(version.createdAt),
                          'MMM d, yyyy HH:mm'
                        )}
                      </span>
                    </div>
                  </div>

                  {version.changes && version.changes.length > 0 && (
                    <div className="mb-3">
                      <ul className="text-[10px] text-ds-text-subtle space-y-0.5 list-disc list-inside">
                        {version.changes.map((change, i) => (
                          <li key={i} className="truncate">
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-7 text-[11px] gap-1"
                      onClick={() => onView(version)}
                    >
                      <Eye className="h-3 w-3" />
                      {t('common.view', 'View')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 h-7 text-[11px] gap-1 hover:bg-primary/5 hover:text-primary"
                      onClick={() => onRestore(version)}
                    >
                      <RotateCcw className="h-3 w-3" />
                      {t('common.restore', 'Restore')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
