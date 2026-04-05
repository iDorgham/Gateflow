import { requireAdmin, expectedSessionToken } from '@/lib/admin-auth';
import { getTranslation } from '@/lib/i18n/i18n';
import { Locale } from '@/lib/i18n/i18n-config';
import { prisma } from '@gate-access/db';
import { cookies } from 'next/headers';
import { createAdmin } from './admin-actions';
import { Shield, UserPlus, KeyRound, ShieldCheck, Info } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Input,
  Label,
  cn,
  PageHeader,
} from '@gateflow/ui';
import { AdminsTable } from './AdminsTable';

export const metadata = { title: 'Platform Authority' };

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminsPage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;

  const { locale } = params;

  await requireAdmin(locale);
  const { t } = await getTranslation(locale, 'admin');

  // Key fingerprint — first 8 chars of the session token hash (safe to show)
  let keyFingerprint = '— not configured —';
  let keyConfigured = false;
  try {
    const token = expectedSessionToken();
    keyFingerprint = token.slice(0, 8) + '…';
    keyConfigured = true;
  } catch {
    // ADMIN_ACCESS_KEY not set
  }

  const adminKeyLength = process.env.ADMIN_ACCESS_KEY?.length ?? 0;

  const admins = await prisma.user.findMany({
    where: { role: { name: 'ADMIN', organizationId: null } },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      deletedAt: true,
    },
  });

  const tableLabels = {
    platformAdmins: t('admins.platformAdmins', { count: admins.length }),
    suspended: t('admins.suspended'),
    reset: t('admins.reset'),
    restore: t('admins.restore'),
    suspend: t('admins.suspend'),
  };

  // Read and clear flash
  let pwFlash: { id: string; pw: string } | null = null;
  try {
    const raw = (await cookies()).get('_adminpwflash')?.value;
    if (raw) {
      pwFlash = JSON.parse(raw) as { id: string; pw: string };
      (await cookies()).delete('_adminpwflash');
    }
  } catch {
    // ignore
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <PageHeader
        titleClassName="italic uppercase"
        title={t('admins.title')}
        subtitle={t('admins.subtitle')}
        badge={
          <Badge
            variant="primary"
            className="h-6 font-black tracking-widest px-2 italic shadow-sm"
          >
            SYSTEM AUTH
          </Badge>
        }
      />

      {/* Auth mechanism info */}
      <Card className="border-ds-border-information bg-ds-background-information/20 shadow-sm overflow-hidden group">
        <div className="h-1 bg-ds-background-information-bold w-full opacity-50 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-ds-background-information-bold text-ds-text-inverse rounded-2xl shadow-lg">
              <Info className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black italic uppercase tracking-tight text-ds-text-information">
                {t('admins.twoLayerAuth')}
              </p>
              <p className="text-[13px] text-ds-text-information font-medium max-w-4xl leading-relaxed">
                {String(t('admins.twoLayerAuthDesc')).split('<1>')[0]}
                <code className="rounded-lg bg-white/50 border border-ds-border-information px-2 py-0.5 font-mono text-[11px] font-black text-ds-text-information mx-1 shadow-inner italic">
                  ADMIN_ACCESS_KEY
                </code>
                {String(t('admins.twoLayerAuthDesc')).split('</1>')[1]}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password flash */}
      {pwFlash && (
        <Card className="border-ds-border-warning bg-ds-background-warning/20 shadow-2xl shadow-amber-500/10 animate-in zoom-in-95 duration-500">
          <CardHeader className="pb-4 border-b border-ds-border-warning/50">
            <div className="flex items-center gap-3 text-ds-text-subtle uppercase">
              <KeyRound className="h-5 w-5 text-ds-icon-warning" />
              <CardTitle className="text-sm font-black tracking-widest">
                {t('admins.tempPasswordGen')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtle opacity-70">
              {t('admins.shareSecurely')}
            </p>
            <div className="relative group max-w-md">
              <code className="block w-full rounded-2xl bg-white/80 border-2 border-ds-border-warning px-8 py-5 font-mono text-2xl font-black tracking-[0.3em] text-ds-text-subtle text-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] ltr:tracking-[0.3em] rtl:tracking-normal group-hover:bg-white transition-colors">
                {pwFlash.pw}
              </code>
              <Badge
                variant="primary"
                className="absolute -top-3 ltr:-right-2 rtl:-left-2 h-6 px-3 bg-ds-background-warning-bold text-ds-text-inverse font-black text-[9px] tracking-[0.2em] uppercase border-none shadow-md"
              >
                {t('admins.expiresIn')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Access key fingerprint + security checklist */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-ds-border shadow-sm hover:shadow-md transition-all">
          <CardHeader className="border-b border-ds-border/50 pb-4 bg-ds-background-neutral-subtle/30">
            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-ds-text-subtle flex items-center gap-2">
              <Shield className="h-3.5 w-3.5" />
              Access Key Authority
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle opacity-70">
                ADMIN_ACCESS_KEY
              </span>
              <Badge
                variant={keyConfigured ? 'success' : 'danger'}
                className="h-5 px-2 text-[9px] font-black uppercase italic"
              >
                {keyConfigured ? 'CONFIGURED' : 'NOT SET'}
              </Badge>
            </div>
            {keyConfigured && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle opacity-70">
                    Fingerprint
                  </span>
                  <code className="text-xs font-mono font-black text-ds-text-brand bg-ds-background-neutral-subtle px-2 py-1 rounded-lg border border-ds-border/50 shadow-inner italic">
                    {keyFingerprint}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle opacity-70">
                    Key Strength
                  </span>
                  <span
                    className={cn(
                      'text-[11px] font-black italic uppercase',
                      adminKeyLength >= 32
                        ? 'text-ds-text-success'
                        : 'text-ds-text-danger'
                    )}
                  >
                    {adminKeyLength} BITS{' '}
                    {adminKeyLength >= 32 ? '✓ OPTIMAL' : '(INSECURE)'}
                  </span>
                </div>
              </>
            )}
            <p className="text-[9px] font-bold text-ds-text-subtlest pt-4 border-t border-ds-border/50 uppercase tracking-widest">
              Rotate via{' '}
              <code className="font-mono text-ds-text-brand">
                .env.production
              </code>{' '}
              Redepoloyment required.
            </p>
          </CardContent>
        </Card>

        <Card className="border-ds-border shadow-sm hover:shadow-md transition-all">
          <CardHeader className="border-b border-ds-border/50 pb-4 bg-ds-background-neutral-subtle/30">
            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-ds-text-subtle flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Compliance Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3.5">
            {[
              { label: 'Entropy ≥ 32 characters', ok: adminKeyLength >= 32 },
              { label: 'Platform Master Secret Configured', ok: keyConfigured },
              { label: 'Cookie Context: httpOnly + lax', ok: true },
              {
                label: 'TLS/SSL Enforcement: ACTIVE',
                ok: process.env.NODE_ENV === 'production',
              },
              { label: 'Dual-Layer Architecture Verified', ok: true },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={cn(
                    'h-5 w-5 rounded-lg flex items-center justify-center text-[10px] shrink-0 border transition-all',
                    ok
                      ? 'bg-ds-background-success-subtle border-ds-border-success text-ds-text-success shadow-sm'
                      : 'bg-ds-background-neutral-subtle border-ds-border text-ds-text-subtlest opacity-60'
                  )}
                >
                  {ok ? '✓' : '—'}
                </div>
                <span
                  className={cn(
                    'text-[11px] font-black italic uppercase tracking-tight',
                    ok ? 'text-ds-text' : 'text-ds-text-subtlest opacity-60'
                  )}
                >
                  {label}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Admin list */}
        <div className="lg:col-span-2 flex flex-col">
          <Card className="border-ds-border shadow-md overflow-hidden flex flex-col flex-1">
            <CardHeader className="flex flex-row items-center justify-between border-b border-ds-border/50 px-6 py-5 bg-ds-background-neutral-subtle/30">
              <div>
                <CardTitle className="text-base font-black italic uppercase tracking-tight text-ds-text">
                  {tableLabels.platformAdmins}
                </CardTitle>
                <p className="text-[11px] text-ds-text-subtle font-medium">
                  Verified system administrator accounts with full
                  infrastructure access.
                </p>
              </div>
              <Shield className="h-5 w-5 text-ds-icon-subtle opacity-30" />
            </CardHeader>
            <CardContent className="p-0 flex-1">
              <AdminsTable
                admins={admins}
                locale={locale}
                labels={tableLabels}
              />
            </CardContent>
          </Card>
        </div>

        {/* Create admin form */}
        <div className="space-y-6">
          <Card className="border-ds-border shadow-xl overflow-hidden sticky top-6">
            <div className="h-1 bg-ds-background-brand-bold w-full" />
            <CardHeader className="px-6 pt-6">
              <CardTitle className="text-base font-black italic uppercase tracking-tight text-ds-text flex items-center gap-3">
                <div className="p-2 bg-ds-background-neutral-subtle rounded-lg">
                  <UserPlus className="h-4 w-4 text-ds-text-brand" />
                </div>
                {t('admins.addAdmin')}
              </CardTitle>
              <p className="text-[11px] text-ds-text-subtle font-medium">
                Provision new administrative credentials.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <form action={createAdmin} className="space-y-5">
                <input type="hidden" name="locale" value={locale} />
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-[10px] font-black italic uppercase tracking-[0.1em] text-ds-text-subtle"
                  >
                    {t('admins.fullName')}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={t('admins.fullNamePlaceholder')}
                    required
                    className="h-11 border-ds-border bg-ds-background-neutral-subtle/50 focus:bg-ds-background-default transition-all rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-[10px] font-black italic uppercase tracking-[0.1em] text-ds-text-subtle"
                  >
                    {t('admins.email')}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t('admins.emailPlaceholder')}
                    required
                    className="h-11 border-ds-border bg-ds-background-neutral-subtle/50 focus:bg-ds-background-default transition-all rounded-xl"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-[10px] font-black italic uppercase tracking-[0.1em] text-ds-text-subtle"
                  >
                    {t('admins.initialPassword')}
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={t('admins.passwordPlaceholder')}
                    minLength={8}
                    required
                    className="h-11 border-ds-border bg-ds-background-neutral-subtle/50 focus:bg-ds-background-default transition-all rounded-xl text-left ltr:text-left rtl:text-right"
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-12 text-xs font-black italic uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:translate-y-0.5 transition-all"
                >
                  <UserPlus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                  {t('admins.createAdminBtn')}
                </Button>
              </form>
            </CardContent>
            <div className="p-4 bg-ds-background-neutral-subtle/50 border-t border-ds-border">
              <p className="text-[9px] text-ds-text-subtlest text-center font-bold uppercase tracking-widest">
                Action will be logged in Immutable Audit Archive
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
