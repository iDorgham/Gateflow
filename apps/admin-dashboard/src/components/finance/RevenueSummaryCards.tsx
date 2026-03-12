import { Card, CardContent, cn } from '@gate-access/ui';
import { DollarSign, TrendingUp, Building2 } from 'lucide-react';

interface RevenueSummaryCardsProps {
  mrr: number;
  proCount: number;
  freeCount: number;
  locale: string;
}

export function RevenueSummaryCards({ mrr, proCount, freeCount, locale }: RevenueSummaryCardsProps) {
  const stats = [
    {
      label: 'MRR (Estimated)',
      value: `$${mrr.toLocaleString(locale)}`,
      sub: 'Monthly recurring revenue',
      icon: DollarSign,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'PRO Subscriptions',
      value: proCount.toLocaleString(locale),
      sub: `$${(proCount * 99).toLocaleString(locale)} / month`,
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Free Orgs',
      value: freeCount.toLocaleString(locale),
      sub: 'Upgrade candidates',
      icon: Building2,
      color: 'text-muted-foreground',
      bg: 'bg-muted/50',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              <div className={cn('p-1.5 rounded-lg', stat.bg, stat.color)}>
                <stat.icon className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-2xl font-black text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-tight">{stat.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
