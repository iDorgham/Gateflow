import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import {
  Settings,
  ShieldCheck,
  Database,
  Key,
  Globe,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Badge, cn } from '@gate-access/ui';

export const metadata = { title: 'Settings' };

function envPresent(name: string): boolean {
  return !!process.env[name];
}

function envMasked(name: string, chars = 6): string {
  const val = process.env[name];
  if (!val) return '— not set —';
  if (val.length <= chars) return '●'.repeat(val.length);
  return val.slice(0, chars) + '●'.repeat(Math.max(0, val.length - chars - 4)) + val.slice(-4);
}

export default async function SettingsPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  await requireAdmin();
  const { t } = await getTranslation(locale, 'admin');

  const dbUrl = process.env.DATABASE_URL ?? '';
  const dbHost = dbUrl ? (() => {
    try { return new URL(dbUrl).hostname; } catch { return t('settings.notSet'); }
  })() : t('settings.notSet');

  const sections = [
    {
      title: t('settings.database'),
      icon: Database,
      color: 'text-blue-600 bg-blue-500/10',
      items: [
        { label: t('settings.host'), value: dbHost, ok: !!dbHost && dbHost !== t('settings.notSet') },
        { label: 'DATABASE_URL', value: envMasked('DATABASE_URL'), ok: envPresent('DATABASE_URL') },
      ],
    },
    {
      title: t('settings.authentication'),
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-500/10',
      items: [
        { label: 'NEXTAUTH_SECRET', value: envMasked('NEXTAUTH_SECRET'), ok: envPresent('NEXTAUTH_SECRET') },
        { label: 'NEXTAUTH_URL', value: process.env.NEXTAUTH_URL ?? t('settings.notSet'), ok: envPresent('NEXTAUTH_URL') },
        { label: 'ADMIN_ACCESS_KEY', value: envMasked('ADMIN_ACCESS_KEY'), ok: envPresent('ADMIN_ACCESS_KEY') },
      ],
    },
    {
      title: t('settings.qrSigning'),
      icon: Key,
      color: 'text-amber-600 bg-amber-500/10',
      items: [
        { label: 'QR_SIGNING_SECRET', value: envMasked('QR_SIGNING_SECRET'), ok: envPresent('QR_SIGNING_SECRET') },
        { label: t('settings.algorithm'), value: 'HMAC-SHA256', ok: true },
        { label: t('settings.minKeyLength'), value: '32 chars', ok: true },
      ],
    },
    {
      title: t('settings.rateLimiting'),
      icon: RefreshCw,
      color: 'text-violet-600 bg-violet-500/10',
      items: [
        { label: 'UPSTASH_REDIS_REST_URL', value: envMasked('UPSTASH_REDIS_REST_URL'), ok: envPresent('UPSTASH_REDIS_REST_URL') },
        { label: 'UPSTASH_REDIS_REST_TOKEN', value: envMasked('UPSTASH_REDIS_REST_TOKEN'), ok: envPresent('UPSTASH_REDIS_REST_TOKEN') },
        { label: t('settings.provider'), value: 'Upstash Redis', ok: true },
      ],
    },
    {
      title: t('settings.appUrls'),
      icon: Globe,
      color: 'text-cyan-600 bg-cyan-500/10',
      items: [
        { label: 'NEXT_PUBLIC_APP_URL', value: process.env.NEXT_PUBLIC_APP_URL ?? t('settings.notSet'), ok: envPresent('NEXT_PUBLIC_APP_URL') },
        { label: 'NEXT_PUBLIC_API_URL', value: process.env.NEXT_PUBLIC_API_URL ?? t('settings.notSet'), ok: envPresent('NEXT_PUBLIC_API_URL') },
      ],
    },
    {
      title: t('settings.securityPolicies'),
      icon: Lock,
      color: 'text-rose-600 bg-rose-500/10',
      items: [
        { label: t('settings.accessTokenTtl'), value: '15 minutes', ok: true },
        { label: t('settings.refreshTokenTtl'), value: '30 days (rotated)', ok: true },
        { label: t('settings.passwordHashing'), value: 'Argon2id — t=3, m=65536, p=4', ok: true },
        { label: t('settings.csrf'), value: 'Double-submit cookie', ok: true },
        { label: t('settings.apiKeyStorage'), value: 'SHA-256 hash only', ok: true },
        { label: t('settings.fieldEncryption'), value: 'AES-256 (webhook secrets)', ok: true },
      ],
    },
  ];

  const missingCount = sections.flatMap((s) => s.items).filter((i) => !i.ok).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('settings.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('settings.subtitle')}
          </p>
        </div>
        <Badge
          className={cn(
            'font-bold text-[11px] px-3 py-1.5',
            missingCount === 0
              ? 'bg-emerald-500 text-white border-none'
              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700'
          )}
        >
          {missingCount === 0 ? (
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {t('settings.allConfigPresent')}
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              {missingCount === 1 ? t('settings.missingConfig', { count: missingCount }) : t('settings.missingConfigs', { count: missingCount })}
            </span>
          )}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map((section) => {
          const sectionMissing = section.items.filter((i) => !i.ok).length;
          return (
            <Card
              key={section.title}
              className={cn(
                'shadow-md border',
                sectionMissing > 0
                  ? 'border-amber-200 dark:border-amber-800'
                  : 'border-border'
              )}
            >
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-base font-bold flex items-center gap-2.5">
                  <div className={cn('p-1.5 rounded-lg', section.color)}>
                    <section.icon className="h-3.5 w-3.5" />
                  </div>
                  {section.title}
                  {sectionMissing > 0 && (
                    <Badge className="ltr:ml-auto rtl:mr-auto bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-700 text-[9px] font-black uppercase">
                      {sectionMissing} {t('settings.missing')}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-none"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">
                      {item.label}
                    </p>
                    <div className="flex items-center gap-2 min-w-0">
                      {item.ok ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />
                      )}
                      <code className={cn(
                        'text-[11px] font-mono truncate',
                        item.ok ? 'text-foreground' : 'text-amber-600 dark:text-amber-400'
                      )}>
                        {item.value}
                      </code>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 p-4">
        <div className="flex items-start gap-3">
          <Settings className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-amber-900 dark:text-amber-300">{t('settings.configNoticeTitle')}</p>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              {String(t('settings.configNoticeDesc')).split('<1>')[0]}
              <code className="rounded bg-amber-100 dark:bg-amber-900/50 px-1 font-mono">.env.local</code>
              {String(t('settings.configNoticeDesc')).split('</1>')[1]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
