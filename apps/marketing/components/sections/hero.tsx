import { Button } from '@gate-access/ui';
import { I18nLink } from '../i18n-link';
import type { Locale } from '../../i18n-config';
import { ArrowLeft, ArrowRight, ShieldCheck, Zap, QrCode, CheckCircle2, Home, Lock } from 'lucide-react';
import { getTranslation } from '../../lib/i18n/get-translation';

export async function Hero({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'landing');
  const isRtl = locale === 'ar-EG';

  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-background">
      {/* Abstract Background Decor */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(var(--primary-rgb),0.15),transparent)]" />
      <div className="absolute top-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <div className="container px-6 mx-auto text-center lg:text-left rtl:lg:text-right">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Text Content */}
          <div className="max-w-2xl mx-auto lg:mx-0 relative z-10 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold tracking-wide mb-8 animate-in slide-in-from-bottom-4 duration-500">
              <Lock className="w-4 h-4" />
              <span>{t('trust.badge')}</span>
            </div>
            
            <h1 className="text-5xl font-extrabold leading-[1.15] sm:text-6xl xl:text-7xl mb-6 text-foreground tracking-tight animate-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-both">
              {t('hero.headline.prefix')} <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">
                {t('hero.headline.highlight')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 animate-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
              {t('hero.subHeadline')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12 animate-in slide-in-from-bottom-10 duration-700 delay-300 fill-mode-both">
              <Button size="lg" className="h-14 px-8 text-base font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 group w-full sm:w-auto transition-all" asChild>
                <I18nLink locale={locale} href="/contact">
                  {t('hero.primaryCta')}
                  {isRtl ? (
                    <ArrowLeft className="ml-2 mr-3 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="ml-3 mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </I18nLink>
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 text-base font-semibold rounded-xl w-full sm:w-auto hover:bg-accent transition-colors" asChild>
                <I18nLink locale={locale} href="/solutions">
                  {t('hero.secondaryCta')}
                </I18nLink>
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 opacity-70 animate-in fade-in duration-1000 delay-500 fill-mode-both">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-primary" size={20} />
                <span className="text-sm font-semibold">{t('features.items.qr.title')}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Zap className="text-primary" size={20} />
                <span className="text-sm font-semibold">{t('features.items.offline.title')}</span>
              </div>
            </div>
          </div>

          {/* Right Artwork Content */}
          <div className="relative w-full max-w-lg mx-auto lg:max-w-none mt-10 lg:mt-0 lg:h-[600px] flex items-center justify-center">
            {/* Soft Glow Behind Phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] bg-primary/20 rounded-full blur-[80px]" />
            
            <div className="relative flex flex-col items-center justify-center w-full h-full">
              {/* Main Phone/QR Pass Mockup */}
              <div className="relative z-20 w-[280px] sm:w-[320px] bg-card border shadow-2xl rounded-[2.5rem] overflow-hidden flex flex-col items-center p-6 sm:p-8 animate-in zoom-in-95 duration-700 delay-200 fill-mode-both ring-1 ring-border/50">
                <div className="w-full flex justify-between items-center mb-8">
                   <div className="text-sm font-bold text-foreground">GateFlow Pass</div>
                   <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                   </div>
                </div>
                {/* QR Code Graphic */}
                <div className="w-48 h-48 sm:w-56 sm:h-56 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border mb-8 flex items-center justify-center relative group isolate">
                   <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-2xl opacity-50" />
                   <QrCode className="w-full h-full text-slate-900 group-hover:scale-105 transition-transform duration-500" strokeWidth={1.5} />
                   
                   {/* Scanning Line Animation */}
                   <div className="absolute top-0 left-0 right-0 h-1 bg-primary/50 blur-[1px] shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)] animate-[scan_3s_ease-in-out_infinite]" />
                </div>
                
                {/* Mock User Details */}
                <div className="w-full space-y-4 mb-8">
                   <div className="h-3 w-3/4 bg-muted rounded-full mx-auto" />
                   <div className="h-2 w-1/2 bg-muted rounded-full mx-auto" />
                </div>
                
                {/* Status Badge */}
                <div className="w-full bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 py-3 sm:py-4 rounded-xl flex justify-center items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  {isRtl ? 'تصريح ساري' : 'Active Pass'}
                </div>
              </div>

              {/* Floating Element 1 - Access Granted */}
              <div className="absolute top-10 sm:top-20 -left-4 sm:left-0 rtl:-left-4 rtl:sm:left-0 rtl:lg:auto rtl:lg:-right-12 z-30 bg-background/95 backdrop-blur-md border shadow-xl rounded-2xl p-4 flex gap-4 items-center animate-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
                 <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                   <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                 </div>
                 <div className="text-left rtl:text-right">
                   <p className="text-sm font-bold text-foreground leading-tight">{isRtl ? 'تم الدخول بنجاح' : 'Access Granted'}</p>
                   <p className="text-xs text-muted-foreground mt-0.5">{isRtl ? 'أحمد - فيلا 42' : 'Ahmed - Villa 42'}</p>
                 </div>
              </div>

              {/* Floating Element 2 - Compound Location */}
              <div className="absolute bottom-16 sm:bottom-24 -right-4 sm:-right-8 rtl:-right-4 rtl:sm:-right-8 rtl:lg:auto rtl:lg:-left-8 z-30 bg-background/95 backdrop-blur-md border shadow-xl rounded-2xl p-4 flex gap-4 items-center animate-in slide-in-from-bottom-8 duration-700 delay-700 fill-mode-both">
                 <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                   <Home className="w-5 h-5 sm:w-6 sm:h-6" />
                 </div>
                 <div className="text-left rtl:text-right">
                   <p className="text-sm font-bold text-foreground leading-tight">{isRtl ? 'بالم هيلز' : 'Palm Hills'}</p>
                   <p className="text-xs text-muted-foreground mt-0.5">{isRtl ? 'البوابة الرئيسية - 08:45 ص' : 'Main Gate - 08:45 AM'}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Required CSS for QR scanning animation */}
      <style>{`
        @keyframes scan {
          0% { top: 5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
      `}</style>
    </section>
  );
}
