import type { Metadata } from 'next';
import {
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import { I18nLink } from '../../../components/i18n-link';
import type { Locale } from '../../../i18n-config';
import { absoluteMarketingTitle } from '../../../lib/metadata-title';
import { DashboardIllustration } from '../../../components/sections/app-illustrations';
import { CineEntrance } from '../../../components/cine-entrance';

export const metadata: Metadata = {
  title: absoluteMarketingTitle('Sign In'),
  description: 'Access the GateFlow administration dashboard.',
};

export default async function LoginPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const castLocale = locale as Locale;
  const isRtl = castLocale === 'ar-EG';

  return (
    <div className="flex min-h-dvh w-full bg-ds-surface selection:bg-ds-background-brand-bold selection:text-white overflow-hidden">
      {/* Left Panel: Immersive Artwork (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-ds-surface-sunken items-center justify-center p-12 overflow-hidden border-e border-ds-border">
        {/* Abstract Background Element */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, var(--ds-text-primary) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <CineEntrance direction="none" duration={1.5}>
          <div
            className="relative z-10 w-full max-w-[640px] aspect-[1000/600] rounded-3xl overflow-hidden border border-ds-border-bold bg-ds-surface-overlay"
            style={{ boxShadow: 'var(--ds-shadow-deep)' }}
          >
            <DashboardIllustration />

            {/* Overlay Glass Badge */}
            <div className="absolute top-8 left-8 flex items-center gap-3 px-4 py-2 rounded-2xl bg-ds-surface/40 backdrop-blur-md border border-ds-border shadow-lg">
              <div className="w-2 h-2 rounded-full bg-ds-background-success-bold animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-primary">
                System Operational
              </span>
            </div>
          </div>
        </CineEntrance>

        {/* Motivational Text */}
        <div className="absolute bottom-16 left-16 right-16">
          <CineEntrance delay={0.4} direction="up" distance={20}>
            <h2 className="text-3xl font-black text-ds-text-heading tracking-tighter leading-tight mb-4">
              {isRtl
                ? 'لوحة تحكم أمنية بمستوى عالمي لمؤسستك.'
                : 'Enterprise-grade security at your fingertips.'}
            </h2>
            <div className="flex gap-6">
              {[
                { icon: Lock, label: isRtl ? 'مشفر بالكامل' : 'Zero-Trust' },
                { icon: Globe, label: isRtl ? 'وصول عالمي' : 'Global Edge' },
                {
                  icon: CheckCircle2,
                  label: isRtl ? 'متوافق مع المعايير' : 'SLA Guaranteed',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-ds-text-subtle font-bold text-sm"
                >
                  <item.icon size={16} className="text-ds-text-brand" />
                  {item.label}
                </div>
              ))}
            </div>
          </CineEntrance>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative bg-ds-surface">
        {/* Subtle top gradient bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-ds-primary-accent to-transparent opacity-30" />

        <div className="w-full max-w-[440px]">
          <CineEntrance direction="up" distance={40}>
            <div className="flex flex-col items-center lg:items-start text-center lg:text-start mb-10">
              <div className="w-14 h-14 bg-ds-background-brand-bold text-ds-text-inverse flex items-center justify-center rounded-2xl mb-8 shadow-xl shadow-ds-primary-accent/20">
                <Shield size={30} strokeWidth={2.5} />
              </div>

              <h1 className="text-4xl font-black tracking-tighter text-ds-text-heading mb-4 leading-[1.1]">
                {isRtl ? 'تسجيل الدخول' : 'Sign in'}
              </h1>

              <p className="text-ds-text-subtle text-lg font-medium leading-relaxed">
                {isRtl
                  ? 'أدخل لوحة التحكم المركزية لإدارة مؤسستك والوصول إليها.'
                  : 'Enter the centralized command center to manage your organization and assets.'}
              </p>
            </div>

            <div className="space-y-4 w-full">
              <Link
                href="https://app.gateflow.com/login"
                className="flex items-center justify-center gap-3 h-14 text-sm font-black w-full group rounded-2xl bg-ds-background-brand-bold text-ds-text-inverse hover:bg-ds-background-brand-bold-hovered shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                {isRtl ? 'الذهاب إلى لوحة التحكم' : 'Continue to Dashboard'}
                {isRtl ? (
                  <ArrowLeft size={18} strokeWidth={2.5} />
                ) : (
                  <ArrowRight
                    size={18}
                    strokeWidth={2.5}
                    className="group-hover:translate-x-1.5 transition-transform"
                  />
                )}
              </Link>

              <div className="flex items-center gap-4 py-4">
                <div className="h-px flex-1 bg-ds-border" />
                <span className="text-[11px] font-black text-ds-text-subtlest uppercase tracking-widest">
                  {isRtl ? 'أو' : 'OR'}
                </span>
                <div className="h-px flex-1 bg-ds-border" />
              </div>

              <I18nLink
                locale={castLocale}
                href="/contact"
                className="flex items-center justify-center h-14 text-sm font-bold w-full rounded-2xl border border-ds-border hover:bg-ds-surface-raised hover:border-ds-border-bold transition-all duration-300"
              >
                {isRtl ? 'طلب الدعم الفني' : 'Contact Support'}
              </I18nLink>
            </div>

            <div className="mt-16 pt-8 border-t border-ds-border w-full flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-ds-text-subtlest font-bold uppercase tracking-wider text-center md:text-start">
                © {new Date().getFullYear()} GateFlow Enterprise <br />
                <span className="opacity-60">
                  MENA Region Centralized Security
                </span>
              </p>

              <div className="flex gap-4">
                {['Status', 'Privacy', 'Security'].map((label) => (
                  <Link
                    key={label}
                    href="#"
                    className="text-[10px] font-black text-ds-text-subtlest hover:text-ds-text-primary transition-colors uppercase tracking-widest"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </CineEntrance>
        </div>
      </div>
    </div>
  );
}
