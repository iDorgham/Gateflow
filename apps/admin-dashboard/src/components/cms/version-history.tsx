'use client';

import React, { useState } from 'react';
import {
  History,
  RotateCcw,
  Eye,
  Sparkles,
  ChevronRight,
  GitBranch,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  cn,
  ScrollArea,
  Separator,
} from '@gateflow/ui';

interface Version {
  id: string;
  version: number;
  createdAt: string;
  createdBy: {
    name: string;
    avatar?: string;
  };
  changes: string[];
  isAiGenerated: boolean;
}

interface VersionHistoryProps {
  contentId: string;
  versions?: Version[];
  onRestore: (version: Version) => void;
  onPreview: (version: Version) => void;
}

export function VersionHistory({
  contentId: _contentId,
  versions = [
    {
      id: 'v4',
      version: 4,
      createdAt: '2026-04-28T14:20:00Z',
      createdBy: { name: 'Dorgham' },
      changes: [
        'Updated HERO section CTA',
        'Fixed Arabic typography alignment',
      ],
      isAiGenerated: false,
    },
    {
      id: 'v3',
      version: 3,
      createdAt: '2026-04-28T10:00:00Z',
      createdBy: { name: 'GateAI OMEGA' },
      changes: ['Generated SEO meta tags', 'Optimized landing page copy'],
      isAiGenerated: true,
    },
    {
      id: 'v2',
      version: 2,
      createdAt: '2026-04-27T16:45:00Z',
      createdBy: { name: 'Sarah Jenkins' },
      changes: ['Initial structure setup'],
      isAiGenerated: false,
    },
  ],
  onRestore,
  onPreview,
}: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-ds-text-subtler flex items-center gap-2">
          <History className="h-4 w-4" /> Trajectory History
        </h3>
        <Badge
          variant="outline"
          className="text-[8px] font-black uppercase border-ds-border"
        >
          {versions.length} Version{versions.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {versions.map((version, i) => (
            <Card
              key={version.id}
              className={cn(
                'border-ds-border bg-card/40 border-dashed overflow-hidden transition-all group cursor-pointer',
                selectedVersion === version.id
                  ? 'border-ds-border-brand/40 bg-ds-background-brand-subtle/20 shadow-lg'
                  : 'hover:border-ds-border-brand/20'
              )}
              onClick={() => setSelectedVersion(version.id)}
            >
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="text-[10px] font-black text-ds-text-subtler">
                        V
                      </div>
                      <div className="text-lg font-black leading-none">
                        {version.version}
                      </div>
                    </div>
                    <Separator
                      orientation="vertical"
                      className="h-8 bg-border/30"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase tracking-tight">
                          {version.createdBy.name}
                        </span>
                        {version.isAiGenerated && (
                          <Badge className="h-4 px-1 bg-ds-background-brand-bold text-ds-icon-inverse text-[7px] font-black uppercase border-none">
                            <Sparkles className="h-2 w-2 mr-1" /> AI
                          </Badge>
                        )}
                      </div>
                      <span className="text-[9px] font-bold text-ds-text-subtler uppercase tracking-widest">
                        {new Date(version.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg bg-muted/30 hover:bg-ds-background-brand-subtle hover:text-ds-text-brand"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreview(version);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg bg-muted/30 hover:bg-ds-background-brand-subtle hover:text-ds-text-brand"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestore(version);
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {version.changes.length > 0 && (
                  <div className="space-y-1.5">
                    {version.changes.map((change, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-[10px] font-bold text-ds-text-subtle leading-tight"
                      >
                        <ChevronRight className="h-3 w-3 mt-0.5 text-ds-text-brand" />
                        <span>{change}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 rounded-xl bg-ds-background-brand-subtle/10 border border-ds-border-brand/10 flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-ds-background-brand-bold flex items-center justify-center text-ds-icon-inverse shrink-0">
          <GitBranch className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-tight">
            Delta Synchronization Active
          </p>
          <p className="text-[9px] font-bold text-ds-text-subtler uppercase tracking-widest leading-relaxed">
            All structural mutations are snapshotted to the neural ledger for
            audit integrity.
          </p>
        </div>
      </div>
    </div>
  );
}
