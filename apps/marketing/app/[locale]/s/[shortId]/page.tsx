export const dynamic = 'force-dynamic';

import { prisma, verifySecureInviteSignature } from '@gate-access/db';
import { getTranslation } from '../../../../lib/i18n/get-translation';
import {
  AlertCircle,
  ShieldAlert,
  Building,
  ShieldCheck,
  Clock,
  User,
  Navigation,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { Button, Separator } from '@gate-access/ui';
import { I18nLink } from '../../../../components/i18n-link';
import type { Locale } from '../../../../i18n-config';

interface InvitationPageProps {
  params: Promise<{ locale: string; shortId: string }>;
  searchParams: Promise<{ sig?: string }>;
}

export default async function InvitationPage(props: InvitationPageProps) {
  const { locale, shortId } = await props.params;
  const { sig } = await props.searchParams;
  const castLocale = locale as Locale;
  const { t } = await getTranslation(castLocale, 'invitation');

  // 1. Fetch the Short Link record
  const shortLinkData = await (prisma.qrShortLink as any).findFirst({
    where: {
      shortId,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      qrCode: {
        include: {
          organization: true,
          project: {
            include: {
              gates: {
                where: { isActive: true, deletedAt: null },
                take: 1,
              },
            },
          },
          visitorQR: {
            include: {
              unit: true,
            },
          },
        },
      },
    },
  });

  const shortLink = shortLinkData as any;

  if (!shortLink) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {t('unauthorizedTitle')}
        </h1>
        <p className="text-slate-500 max-w-sm mb-8">{t('unauthorizedDesc')}</p>
        <I18nLink locale={castLocale} href="/">
          <Button variant="outline">{t('common:backHome')}</Button>
        </I18nLink>
      </div>
    );
  }

  const secret =
    process.env.EXPRESS_INVITE_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'fallback-secret-at-least-16-chars';
  const isValidSig = sig
    ? verifySecureInviteSignature(shortId, sig, secret)
    : false;

  const visitor = shortLink.qrCode.visitorQR;
  const project = shortLink.qrCode.project;
  const org = shortLink.qrCode.organization;
  const gate = project?.gates?.[0];
  const isArabic = castLocale === 'ar-EG';

  return (
    <div className="flex-1 bg-[var(--ds-background-subtle,#F4F5F7)] pt-24 pb-32">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 opacity-80">
              {t('welcome')}
            </h1>
            <div className="flex items-center justify-center gap-4 mb-2">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                {project?.name || org.name}
              </h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* INLINED PASS UI TO BYPASS BUILD CRASH */}
            <div className="w-full max-w-md mx-auto space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-primary/10 shadow-2xl overflow-hidden p-8 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <Building className="w-3 h-3" />
                      {org.name}
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                      {project?.name || 'GateFlow Access'}
                    </h2>
                  </div>
                  {isValidSig && (
                    <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {t('verification')}
                    </div>
                  )}
                </div>

                <div className="aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 flex flex-col items-center justify-center border-2 border-dashed">
                  <div className="w-48 h-48 bg-slate-200 rounded-xl" />
                  <p className="mt-4 text-[10px] uppercase font-bold text-slate-400">
                    {t('verificationDesc')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {t('fullName')}
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      {visitor?.visitorName || 'Guest'}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {t('validUntil')}
                  </span>
                  <span className="font-bold">
                    {shortLink.qrCode.expiresAt
                      ? new Date(
                          shortLink.qrCode.expiresAt
                        ).toLocaleDateString()
                      : 'Permanent'}
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border shadow-sm space-y-6">
                <h3 className="font-bold text-lg">{t('verification')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('verificationDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
