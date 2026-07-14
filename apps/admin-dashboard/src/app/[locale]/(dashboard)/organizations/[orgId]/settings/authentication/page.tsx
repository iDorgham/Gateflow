import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  cn,
} from '@gateflow/ui';

export const metadata = { title: 'Settings | Authentication' };

function envPresent(name: string): boolean {
  return !!process.env[name];
}

function envMasked(name: string, chars = 6): string {
  const val = process.env[name];
  if (!val) return '— not set —';
  if (val.length <= chars) return '●'.repeat(val.length);
  return (
    val.slice(0, chars) +
    '●'.repeat(Math.max(0, val.length - chars - 4)) +
    val.slice(-4)
  );
}

export default async function AuthenticationSettingsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  await requireAdmin(locale);
  const { t } = await getTranslation(locale, 'admin');

  const items = [
    {
      label: 'NEXTAUTH_SECRET',
      value: envMasked('NEXTAUTH_SECRET'),
      ok: envPresent('NEXTAUTH_SECRET'),
      description: 'Used to encrypt tokens and email hashes.',
    },
    {
      label: 'NEXTAUTH_URL',
      value: process.env.NEXTAUTH_URL ?? t('settings.notSet'),
      ok: envPresent('NEXTAUTH_URL'),
      description: 'The canonical site URL for authentication callbacks.',
    },
    {
      label: 'ADMIN_ACCESS_KEY',
      value: envMasked('ADMIN_ACCESS_KEY'),
      ok: envPresent('ADMIN_ACCESS_KEY'),
      description: 'The hardcoded key required for initial platform login.',
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-black uppercase tracking-tight text-ds-text">
          {t('settings.authentication')}
        </h2>
        <p className="text-xs text-ds-text-subtlest">
          Secure your platform and manage session environment variables.
        </p>
      </div>

      <Card className="shadow-sm border border-ds-border">
        <CardHeader className="border-b border-ds-border/50 pb-4 bg-ds-background-subtle/30">
          <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center gap-2.5 text-ds-text">
            <div className="p-1.5 rounded-lg text-emerald-600 bg-emerald-500/10">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            Auth Environment
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col gap-6">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 first:pt-0 border-b border-ds-border/30 last:border-none last:pb-0"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-ds-text">
                  {item.label}
                </span>
                <span className="text-[10px] text-ds-text-subtlest">
                  {item.description}
                </span>
              </div>

              <div className="flex items-center gap-2 min-w-0">
                {item.ok ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-ds-text-success shrink-0" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 text-ds-text-warning shrink-0" />
                )}
                <code
                  className={cn(
                    'text-[10px] font-mono truncate px-2 py-1 rounded bg-ds-background-subtle border border-ds-border/50',
                    item.ok
                      ? 'text-ds-text font-bold'
                      : 'text-ds-text-warning font-bold'
                  )}
                >
                  {item.value}
                </code>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
