import { Badge, cn } from '@gate-access/ui';
import { Users, ScanLine } from 'lucide-react';

interface OrgRow {
  id: string;
  name: string;
  plan: string;
  userCount: number;
  scansThisMonth: number;
  createdAt: string;
  mrr: number;
}

interface SubscriptionTableProps {
  orgs: OrgRow[];
  locale: string;
}

const planColors: Record<string, string> = {
  FREE: 'bg-muted text-muted-foreground border-border',
  PRO: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
};

export function SubscriptionTable({ orgs, locale }: SubscriptionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" role="table" aria-label="Subscriptions">
        <thead>
          <tr className="bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-b border-border">
            <th className="px-5 py-3 text-left">Organization</th>
            <th className="px-5 py-3 text-left">Plan</th>
            <th className="px-5 py-3 text-center">Users</th>
            <th className="px-5 py-3 text-center">Scans (Month)</th>
            <th className="px-5 py-3 text-right">MRR</th>
            <th className="px-5 py-3 text-left">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orgs.map((org) => (
            <tr key={org.id} className="group hover:bg-primary/5 transition-colors">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs shrink-0">
                    {org.name.substring(0, 2).toUpperCase()}
                  </div>
                  <p className="font-bold text-foreground text-xs truncate max-w-[160px]">{org.name}</p>
                </div>
              </td>
              <td className="px-5 py-3.5">
                <Badge variant="outline" className={cn('text-[10px] font-bold uppercase tracking-wider', planColors[org.plan] ?? '')}>
                  {org.plan}
                </Badge>
              </td>
              <td className="px-5 py-3.5 text-center">
                <span className="flex items-center justify-center gap-1 text-xs font-bold text-foreground">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  {org.userCount.toLocaleString(locale)}
                </span>
              </td>
              <td className="px-5 py-3.5 text-center">
                <span className="flex items-center justify-center gap-1 text-xs font-bold text-foreground">
                  <ScanLine className="h-3 w-3 text-muted-foreground" />
                  {org.scansThisMonth.toLocaleString(locale)}
                </span>
              </td>
              <td className="px-5 py-3.5 text-right">
                <span className={cn('text-sm font-black', org.mrr > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground')}>
                  {org.mrr > 0 ? `$${org.mrr}` : '—'}
                </span>
              </td>
              <td className="px-5 py-3.5 text-xs text-muted-foreground">
                {new Date(org.createdAt).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
