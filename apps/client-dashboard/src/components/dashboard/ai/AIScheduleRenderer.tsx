'use client';

import * as React from 'react';
import { Card, CardContent } from '@gateflow/ui';
import { CalendarClock, CheckCircle2, Clock } from 'lucide-react';

export interface ScheduleDataBlock {
  type: 'schedule';
  taskType: 'report' | string;
  title: string;
  cron: string;
  params: Record<string, any>;
}

interface AIScheduleRendererProps {
  config: ScheduleDataBlock;
  isRtl?: boolean;
}

export function AIScheduleRenderer({ config, isRtl }: AIScheduleRendererProps) {
  const { title, cron, taskType } = config;
  const t = (en: string, ar: string) => (isRtl ? ar : en);

  const getIntervalLabel = (c: string) => {
    const cl = c.toLowerCase();
    if (cl === 'daily' || cl === '0 0 * * *') return t('Daily', 'يومياً');
    if (cl === 'weekly' || cl === '0 0 * * 0') return t('Weekly', 'أسبوعياً');
    return c;
  };

  return (
    <Card className="my-4 border-[var(--ds-border-discovery)]/30 bg-[var(--ds-background-discovery-subtle)]/10 shadow-sm overflow-hidden">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-[var(--ds-background-discovery-bold)] text-white flex items-center justify-center shrink-0">
          <CalendarClock size={24} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-xs font-semibold text-[var(--ds-text-discovery)] uppercase tracking-wider">
              {t('Scheduled', 'مجدول')}
            </p>
            <CheckCircle2 size={12} className="text-success" />
          </div>
          <h4 className="text-sm font-medium text-[var(--ds-text)] truncate">
            {title}
          </h4>
          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
            <Clock size={10} />
            <span>{getIntervalLabel(cron)}</span>
            <span className="mx-1">•</span>
            <span className="capitalize">
              {taskType === 'report' ? t('Report', 'تقرير') : taskType}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
