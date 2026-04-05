import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { Activity, Shield, Clock, User } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from '@gate-access/ui';

export const metadata = { title: 'Settings | Audit logs' };

export default async function AuditLogsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  await requireAdmin(locale);
  const { t } = await getTranslation(locale, 'admin');

  // Hardcoded example logs for premium feel
  const logs = [
    {
      id: 1,
      action: 'User Created',
      user: 'Admin',
      target: 'John Doe',
      date: '2 mins ago',
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      id: 2,
      action: 'Organization Deleted',
      user: 'Admin',
      target: 'OldCorp',
      date: '1 hour ago',
      color: 'text-red-500 bg-red-500/10',
    },
    {
      id: 3,
      action: 'API Key Rotated',
      user: 'System',
      target: 'Main API',
      date: '3 hours ago',
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      id: 4,
      action: 'Project Updated',
      user: 'Admin',
      target: 'Project Alpha',
      date: '5 hours ago',
      color: 'text-emerald-500 bg-emerald-500/10',
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-black uppercase tracking-tight text-ds-text">
          Audit Trail
        </h2>
        <p className="text-xs text-ds-text-subtlest">
          Monitor all administrative actions and system changes in real-time.
        </p>
      </div>

      <Card className="shadow-sm border border-ds-border">
        <CardHeader className="border-b border-ds-border/50 pb-4 bg-ds-background-subtle/30">
          <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center gap-2.5 text-ds-text">
            <div className="p-1.5 rounded-lg text-blue-600 bg-blue-500/10">
              <Activity className="h-3.5 w-3.5" />
            </div>
            Recent System Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 border-b border-ds-border/30 last:border-none hover:bg-ds-background-neutral-subtle transition-colors cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center ${log.color}`}
                  >
                    <Shield className="h-4 w-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-black text-ds-text uppercase tracking-tight">
                      {log.action}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-ds-text-subtlest">
                      <User className="h-3 w-3" /> {log.user}{' '}
                      <span className="opacity-30">•</span>{' '}
                      <span className="font-bold text-ds-text">
                        Target: {log.target}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-ds-text-subtlest uppercase">
                  <Clock className="h-3 w-3" /> {log.date}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center py-6 border-2 border-dashed border-ds-border/50 rounded-2xl bg-ds-background-neutral-subtle/30 group cursor-pointer hover:border-ds-border-brand transition-all">
        <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtlest group-hover:text-ds-text-brand transition-colors">
          Load Full History Archive
        </span>
      </div>
    </div>
  );
}
