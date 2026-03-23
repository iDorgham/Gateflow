'use client';

import { Card, CardContent } from '@gate-access/ui';
import { Users, Building, QrCode, ScrollText, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiMetric {
  label: string;
  value: number | string;
  growth?: number;
  icon: React.ReactNode;
  color: string;
}

interface ProjectKpiCardsProps {
  metrics: {
    contactsCount: number;
    unitsCount: number;
    activeQrs: number;
    scanVolume: number;
    scanGrowth: number;
  };
}

export function ProjectKpiCards({ metrics }: ProjectKpiCardsProps) {
  const data: KpiMetric[] = [
    {
      label: 'Contacts',
      value: metrics.contactsCount,
      icon: <Users className="h-5 w-5" />,
      color: 'blue',
    },
    {
      label: 'Units',
      value: metrics.unitsCount,
      icon: <Building className="h-5 w-5" />,
      color: 'indigo',
    },
    {
      label: 'Active QRs',
      value: metrics.activeQrs,
      icon: <QrCode className="h-5 w-5" />,
      color: 'emerald',
    },
    {
      label: 'Scan Volume',
      value: metrics.scanVolume,
      growth: metrics.scanGrowth,
      icon: <ScrollText className="h-5 w-5" />,
      color: 'orange', // Kimchi Orange style
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((item) => (
        <Card key={item.label} className="overflow-hidden rounded-2xl border-border bg-card shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl font-bold",
                item.color === 'blue' && "bg-blue-500/10 text-blue-500",
                item.color === 'indigo' && "bg-indigo-500/10 text-indigo-500",
                item.color === 'emerald' && "bg-emerald-500/10 text-emerald-500",
                item.color === 'orange' && "bg-primary/10 text-primary" // Kimchi Orange
              )}>
                {item.icon}
              </div>
              {item.growth !== undefined && (
                <div className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-wider",
                  item.growth >= 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                )}>
                  {item.growth >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(item.growth)}%
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                {item.label}
              </p>
              <h3 className="mt-1 text-3xl font-black text-foreground tracking-tight">
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
              </h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
