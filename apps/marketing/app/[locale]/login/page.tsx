import type { Metadata } from 'next';
import { Button } from '@gate-access/ui';
import { Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Locale } from '../../../i18n-config';

export const metadata: Metadata = {
  title: 'Sign In | GateFlow',
  description: 'Access the GateFlow administration dashboard.',
};

export default function LoginPage({ params: { locale } }: { params: { locale: Locale } }) {
  const isRtl = locale === 'ar-EG';

  return (
    <div className="flex-grow flex items-center justify-center bg-[var(--ds-surface-sunken,#F4F5F7)] relative overflow-hidden py-20 transition-colors duration-300">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
           style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--ds-background-brand-bold,#0052CC)] to-transparent" />

      <div className="container max-w-[520px] px-6 relative z-10">
        <div className="bg-[var(--ds-surface-raised,#FFFFFF)] border border-[var(--ds-border,#DFE1E6)] rounded-lg shadow-[var(--ds-shadow-raised)] p-10 flex flex-col items-center text-center transition-all duration-300">
          
          <div className="w-16 h-16 bg-[var(--ds-background-brand-bold,#0052CC)] text-white flex items-center justify-center rounded-xl mb-8 shadow-lg shadow-blue-500/20">
            <Shield size={32} />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[var(--ds-text,#172B4D)] mb-4">
            {isRtl ? 'تسجيل الدخول إلى جيت فلو' : 'Sign in to GateFlow'}
          </h1>
          
          <p className="text-[var(--ds-text-subtle,#42526E)] text-lg mb-10 leading-relaxed max-w-[360px]">
            {isRtl 
              ? 'سيتم توجيهك إلى لوحة التحكم الآمنة الخاصة بنا. يرجى التأكد من توفر مفتاح الوصول الخاص بمؤسستك.'
              : 'You are being redirected to our secure dashboard. Please have your organization access key ready.'}
          </p>
          
          <div className="grid gap-4 w-full">
            <Button variant="brand" size="lg" className="h-12 text-sm font-bold w-full group" asChild>
              <Link href="https://app.gateflow.com/login" className="flex items-center justify-center gap-2">
                {isRtl ? 'الذهاب إلى لوحة التحكم' : 'Continue to Dashboard'}
                {isRtl ? <ArrowLeft size={16} /> : <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
              </Link>
            </Button>
            
            <Button variant="subtle" size="lg" className="h-12 text-sm font-semibold w-full" asChild>
              <Link href={`/${locale}/contact`}>
                {isRtl ? 'تحتاج مساعدة؟' : 'Contact Support'}
              </Link>
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--ds-border,#DFE1E6)] w-full">
            <p className="text-[12px] text-[var(--ds-text-subtlest,#6B778C)] font-medium">
              © {new Date().getFullYear()} GateFlow Enterprise Security <br />
              Atlassian-grade infrastructure for modern access control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
