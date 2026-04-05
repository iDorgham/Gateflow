import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { Key, Copy, Plus, MoreVertical, Globe, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@gateflow/ui';

export const metadata = { title: 'Settings | API Access' };

export default async function ApiSettingsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  await requireAdmin(locale);
  const { t } = await getTranslation(locale, 'admin');

  const keys = [
    {
      id: 1,
      name: 'Production Hub',
      prefix: 'pk_live',
      date: '2 days ago',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Staging Relay',
      prefix: 'pk_test',
      date: '5 days ago',
      status: 'Deactivated',
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-black uppercase tracking-tight text-ds-text">
            Global API Infrastructure
          </h2>
          <p className="text-xs text-ds-text-subtlest">
            Manage system-level API tokens and webhook secrets for the
            infrastructure.
          </p>
        </div>
        <div className="h-10 px-5 flex items-center gap-2 rounded-xl bg-ds-background-brand-bold text-ds-text-inverse text-[10px] font-black uppercase tracking-widest hover:shadow-lg shadow-ds-background-brand-bold/20 transition-all cursor-pointer">
          <Plus className="h-4 w-4" /> Provision New Key
        </div>
      </div>

      <Card className="shadow-sm border border-ds-border">
        <CardHeader className="border-b border-ds-border/50 pb-4 bg-ds-background-subtle/30">
          <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center gap-2.5 text-ds-text">
            <div className="p-1.5 rounded-lg text-rose-600 bg-rose-500/10">
              <Key className="h-3.5 w-3.5" />
            </div>
            Active Service Tokens
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col">
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between p-6 border-b border-ds-border/30 last:border-none hover:bg-ds-background-neutral-subtle transition-colors cursor-default"
              >
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-ds-background-neutral-subtle border border-ds-border/50 group-hover:bg-ds-background-brand-subtle transition-colors">
                    <Code className="h-5 w-5 text-ds-text-subtlest" />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-xs font-black text-ds-text uppercase tracking-tight truncate">
                      {key.name}
                    </span>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-ds-text-subtlest uppercase tracking-tight">
                      <div className="flex items-center gap-2 px-1.5 py-0.5 rounded bg-ds-background-neutral-subtle border border-ds-border/50 text-ds-text select-all cursor-text pointer-events-auto">
                        {key.prefix}_••••••••••••••••
                        <Copy className="h-3 w-3 opacity-50 hover:opacity-100 cursor-pointer pointer-events-auto" />
                      </div>
                      <span className="opacity-30">•</span> Created {key.date}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant="primary"
                    className={`text-[8px] h-4 font-black rounded-sm border-none uppercase tracking-tighter ${key.status === 'Active' ? 'bg-ds-background-success-bold text-ds-text-inverse' : 'bg-ds-background-neutral-bold text-ds-text-inverse opacity-50'}`}
                  >
                    {key.status}
                  </Badge>
                  <div className="p-1 hover:bg-ds-background-neutral-bold/10 rounded cursor-pointer transition-colors">
                    <MoreVertical className="h-4 w-4 text-ds-text-subtlest" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-2xl border border-ds-border-success/30 bg-ds-background-success-subtle/10 p-6 flex items-center justify-between gap-6">
        <div className="flex flex-col gap-1 flex-1">
          <h4 className="text-[11px] font-black uppercase text-ds-text-success tracking-widest">
            Webhook Security Notice
          </h4>
          <p className="text-[11px] text-ds-text-subtlest leading-relaxed">
            All secret rotations require updating the corresponding services.
            Deactivated keys are kept for 30 days before permanent deletion.
          </p>
        </div>
        <div className="px-4 py-2 border border-ds-border-success/30 rounded-xl text-[10px] font-black uppercase text-ds-text-success hover:bg-ds-background-success-subtle transition-all cursor-pointer">
          Review Docs
        </div>
      </div>
    </div>
  );
}
