import { requireAdmin } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import {
  ShieldCheck,
  Database,
  Key,
  Globe,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Settings,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  cn,
} from '@gate-access/ui';
import { CompliancePlaceholder } from '@/components/settings/CompliancePlaceholder';

export const metadata = { title: 'Settings | Overview' };

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

export default async function SettingsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;

  const { locale } = params;

  await requireAdmin(locale);
  const { t } = await getTranslation(locale, 'admin');

  const dbUrl = process.env.DATABASE_URL ?? '';
  const dbHost = dbUrl
    ? (() => {
        try {
          return new URL(dbUrl).hostname;
        } catch {
          return t('settings.notSet');
        }
      })()
    : t('settings.notSet');

  const sections = [
    {
      title: t('settings.database'),
      icon: Database,
      color: 'text-blue-600 bg-blue-500/10',
      items: [
        {
          label: t('settings.host'),
          value: dbHost,
          ok: !!dbHost && dbHost !== t('settings.notSet'),
        },
        {
          label: 'DATABASE_URL',
          value: envMasked('DATABASE_URL'),
          ok: envPresent('DATABASE_URL'),
        },
      ],
    },
    {
      title: t('settings.authentication'),
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-500/10',
      items: [
        {
          label: 'NEXTAUTH_SECRET',
          value: envMasked('NEXTAUTH_SECRET'),
          ok: envPresent('NEXTAUTH_SECRET'),
        },
        {
          label: 'NEXTAUTH_URL',
          value: process.env.NEXTAUTH_URL ?? t('settings.notSet'),
          ok: envPresent('NEXTAUTH_URL'),
        },
        {
          label: 'ADMIN_ACCESS_KEY',
          value: envMasked('ADMIN_ACCESS_KEY'),
          ok: envPresent('ADMIN_ACCESS_KEY'),
        },
      ],
    },
    {
      title: t('settings.qrSigning'),
      icon: Key,
      color: 'text-amber-600 bg-amber-500/10',
      items: [
        {
          label: 'QR_SIGNING_SECRET',
          value: envMasked('QR_SIGNING_SECRET'),
          ok: envPresent('QR_SIGNING_SECRET'),
        },
        { label: t('settings.algorithm'), value: 'HMAC-SHA256', ok: true },
        { label: t('settings.minKeyLength'), value: '32 chars', ok: true },
      ],
    },
    {
      title: t('settings.rateLimiting'),
      icon: RefreshCw,
      color: 'text-violet-600 bg-violet-500/10',
      items: [
        {
          label: 'UPSTASH_REDIS_REST_URL',
          value: envMasked('UPSTASH_REDIS_REST_URL'),
          ok: envPresent('UPSTASH_REDIS_REST_URL'),
        },
        {
          label: 'UPSTASH_REDIS_REST_TOKEN',
          value: envMasked('UPSTASH_REDIS_REST_TOKEN'),
          ok: envPresent('UPSTASH_REDIS_REST_TOKEN'),
        },
        { label: t('settings.provider'), value: 'Upstash Redis', ok: true },
      ],
    },
    {
      title: t('settings.appUrls'),
      icon: Globe,
      color: 'text-cyan-600 bg-cyan-500/10',
      items: [
        {
          label: 'NEXT_PUBLIC_APP_URL',
          value: process.env.NEXT_PUBLIC_APP_URL ?? t('settings.notSet'),
          ok: envPresent('NEXT_PUBLIC_APP_URL'),
        },
        {
          label: 'NEXT_PUBLIC_API_URL',
          value: process.env.NEXT_PUBLIC_API_URL ?? t('settings.notSet'),
          ok: envPresent('NEXT_PUBLIC_API_URL'),
        },
      ],
    },
    {
      title: t('settings.securityPolicies'),
      icon: Lock,
      color: 'text-rose-600 bg-rose-500/10',
      items: [
        { label: t('settings.accessTokenTtl'), value: '15 minutes', ok: true },
        {
          label: t('settings.refreshTokenTtl'),
          value: '30 days (rotated)',
          ok: true,
        },
        {
          label: t('settings.passwordHashing'),
          value: 'Argon2id — t=3, m=65536, p=4',
          ok: true,
        },
        { label: t('settings.csrf'), value: 'Double-submit cookie', ok: true },
        {
          label: t('settings.apiKeyStorage'),
          value: 'SHA-256 hash only',
          ok: true,
        },
        {
          label: t('settings.fieldEncryption'),
          value: 'AES-256 (webhook secrets)',
          ok: true,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in slide-in-from-bottom-2 duration-500">
      <div className="grid gap-6 sm:grid-cols-2">
        {sections.map((section) => {
          const sectionMissing = section.items.filter((i) => !i.ok).length;
          return (
            <Card
              key={section.title}
              className={cn(
                'shadow-sm border border-ds-border transition-all duration-300 hover:shadow-md hover:border-ds-border-brand',
                sectionMissing > 0 && 'border-ds-border-warning/50'
              )}
            >
              <CardHeader className="border-b border-ds-border/50 pb-4 bg-ds-background-subtle/30">
                <CardTitle className="text-xs font-black uppercase tracking-wider flex items-center gap-2.5 text-ds-text">
                  <div className={cn('p-1.5 rounded-lg', section.color)}>
                    <section.icon className="h-3.5 w-3.5" />
                  </div>
                  {section.title}
                  {sectionMissing > 0 && (
                    <Badge className="ltr:ml-auto rtl:mr-auto bg-ds-background-warning-subtle text-ds-text-warning border-ds-border-warning text-[9px] font-black uppercase">
                      {sectionMissing} {t('settings.missing')}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col gap-3">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 py-1.5 border-b border-ds-border/30 last:border-none"
                  >
                    <p className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle shrink-0">
                      {item.label}
                    </p>
                    <div className="flex items-center gap-2 min-w-0">
                      {item.ok ? (
                        <CheckCircle2 className="h-3 w-3 text-ds-text-success shrink-0" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-ds-text-warning shrink-0" />
                      )}
                      <code
                        className={cn(
                          'text-[10px] font-mono truncate px-1.5 py-0.5 rounded-sm bg-ds-background-subtle/50',
                          item.ok
                            ? 'text-ds-text font-bold'
                            : 'text-ds-text-warning'
                        )}
                      >
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

      <CompliancePlaceholder />

      <div className="rounded-lg border border-ds-border-warning/30 bg-ds-background-warning-subtle/20 p-4 transition-colors hover:bg-ds-background-warning-subtle/30">
        <div className="flex items-start gap-3">
          <Settings className="h-4 w-4 text-ds-text-warning mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-tight text-ds-text">
              {t('settings.configNoticeTitle')}
            </p>
            <p className="text-[11px] text-ds-text-subtle leading-relaxed">
              {String(t('settings.configNoticeDesc')).split('<1>')[0]}
              <code className="rounded bg-ds-background-subtle px-1 font-mono font-bold text-ds-text mx-0.5">
                .env.local
              </code>
              {String(t('settings.configNoticeDesc')).split('</1>')[1]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
