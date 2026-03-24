import { prisma, verifySecureInviteSignature } from '@gate-access/db';
import { getTranslation } from '../../../../lib/i18n/get-translation';
import { BrandedPass } from '../../../../components/invitation/BrandedPass';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { Button } from '@gate-access/ui';
import { I18nLink } from '../../../../components/i18n-link';

interface InvitationPageProps {
  params: Promise<{ locale: string; shortId: string }>;
  searchParams: Promise<{ sig?: string }>;
}

export default async function InvitationPage({
  params,
  searchParams,
}: InvitationPageProps) {
  const { locale, shortId } = params;
  const { sig } = searchParams;
  const { t } = await getTranslation(locale as any, 'invitation');

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

  const shortLink = shortLinkData as any; // Cast to any to bypass temporary type sync issues

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
        <Button variant="outline" asChild>
          <I18nLink locale={locale as any} href="/">
            {t('common:backHome')}
          </I18nLink>
        </Button>
      </div>
    );
  }

  // 2. Validate Signature
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

  return (
    <div className="flex-1 bg-[var(--ds-background-subtle,#F4F5F7)] pt-24 pb-32">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Top Branding (Mobile-First) */}
          <div className="text-center mb-12">
            <h1 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 opacity-80">
              {t('welcome')}
            </h1>
            <div className="flex items-center justify-center gap-4 mb-2">
              {org.logoUrl && (
                <img
                  src={org.logoUrl}
                  alt={org.name}
                  className="w-12 h-12 object-contain rounded-lg border bg-white p-1"
                />
              )}
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                {project?.name || org.name}
              </h2>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: The Pass */}
            <BrandedPass
              qrId={shortLink.qrCode.id}
              qrCode={shortLink.qrCode.code}
              visitorName={visitor?.visitorName || null}
              projectName={project?.name || 'GateFlow Access'}
              organizationName={org.name}
              expiresAt={shortLink.qrCode.expiresAt?.toISOString() || null}
              unitName={visitor?.unit?.name || null}
              coordinates={
                gate?.latitude && gate?.longitude
                  ? { lat: gate.latitude, lng: gate.longitude }
                  : undefined
              }
              isVerified={isValidSig}
              delegateToAi={shortLink.qrCode.delegateToAi}
              lang={locale}
            />

            {/* Right Column: Info & Actions */}
            <div className="hidden lg:block space-y-8 animate-in fade-in slide-in-from-right-4 duration-1000">
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border shadow-sm space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{t('verification')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('verificationDesc')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-primary mt-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Show this QR code to the security personnel at the main
                      gate.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full bg-primary mt-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Your access is valid until the expiration date shown on
                      the pass.
                    </p>
                  </div>
                </div>
              </div>

              {/* Extra context / Marketing hooks */}
              <div className="p-8 bg-slate-900 rounded-3xl text-white overflow-hidden relative group">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">
                    Visiting for the first time?
                  </h3>
                  <p className="text-white/60 text-sm mb-6">
                    Download the GateFlow app to manage your own visitor passes
                    in seconds.
                  </p>
                  <Button
                    variant="outline"
                    className="text-white border-white/20 hover:bg-white/10"
                  >
                    Learn More
                  </Button>
                </div>
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-colors" />
              </div>

              {/* GateAI Delegate Column */}
              <div className="p-8 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900 rounded-3xl flex items-start gap-5">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200 dark:shadow-none">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-indigo-900 dark:text-indigo-100">
                    Delegated Check-in
                  </h3>
                  <p className="text-sm text-indigo-700/70 dark:text-indigo-300 text-pretty">
                    GateAI is managing your access today. If you have any
                    trouble at the gate, simply mention your invitation code to
                    our automated concierge for immediate assistance.
                  </p>
                  <Button
                    variant="outline"
                    className="h-9 text-xs border-indigo-200 text-indigo-700 bg-white/50 hover:bg-white"
                  >
                    Talk to GateAI
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
