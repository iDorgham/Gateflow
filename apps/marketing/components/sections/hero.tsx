import { Button } from '@gate-access/ui';
import { I18nLink } from '../i18n-link';
import type { Locale } from '../../i18n-config';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { getTranslation } from '../../lib/i18n/get-translation';

export async function Hero({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'landing');
  const { t: tc } = await getTranslation(locale, 'common');
  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(var(--primary-rgb),0.05)_0%,transparent_100%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[600px] w-full max-w-7xl blur-[120px] opacity-20 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] h-64 w-64 bg-primary rounded-full" />
        <div className="absolute top-[30%] right-[20%] h-80 w-80 bg-indigo-500 rounded-full" />
      </div>

      <div className="container px-6 mx-auto text-center lg:text-left rtl:lg:text-right">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-2xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6 animate-in">
              <Zap size={14} />
              <span>{t('trust.badge')}</span>
            </div>
            
            <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl xl:text-7xl mb-6">
              {t('hero.headline.prefix')} <br className="hidden md:block" />
              <span className="text-primary italic">
                {t('hero.headline.highlight')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
              {t('hero.subHeadline')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
              <Button size="lg" className="h-14 px-8 text-base font-bold rounded-xl shadow-xl shadow-primary/25 group w-full sm:w-auto" asChild>
                <I18nLink locale={locale} href="/contact">
                  {t('hero.primaryCta')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </I18nLink>
              </Button>
              <Button variant="outline" size="lg" className="h-14 px-8 text-base font-semibold rounded-xl w-full sm:w-auto" asChild>
                <I18nLink locale={locale} href="/solutions">
                  {t('hero.secondaryCta')}
                </I18nLink>
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 opacity-60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-primary" size={20} />
                <span className="text-xs font-bold uppercase tracking-tighter">{t('features.items.qr.title')}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Zap className="text-primary" size={20} />
                <span className="text-xs font-bold uppercase tracking-tighter">{t('features.items.offline.title')}</span>
              </div>
            </div>
          </div>

          <div className="relative">
             <div className="relative z-10 rounded-2xl border bg-card/50 backdrop-blur shadow-2xl overflow-hidden aspect-video group">
                {/* Visual Placeholder - Will be updated with generated assets */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-indigo-500/5 flex items-center justify-center">
                   <div className="relative w-full h-full p-4">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                      
                      {/* Floating UI Elements */}
                      <div className="absolute top-10 left-10 p-4 bg-background rounded-xl border shadow-lg animate-in" style={{ animationDelay: '0.2s' }}>
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-success/20 rounded-full flex items-center justify-center text-success">✓</div>
                            <div>
                               <div className="text-[10px] font-bold text-muted-foreground uppercase">{tc('status.success')}</div>
                               <div className="text-sm font-black">{tc('status.active')}</div>
                            </div>
                         </div>
                      </div>

                      <div className="absolute bottom-10 right-10 p-4 bg-background rounded-xl border shadow-lg animate-in" style={{ animationDelay: '0.4s' }}>
                         <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">⚡</div>
                            <div>
                               <div className="text-[10px] font-bold text-muted-foreground uppercase">{t('features.items.offline.title')}</div>
                               <div className="text-sm font-black">{tc('status.success')}</div>
                            </div>
                         </div>
                      </div>

                      <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary opacity-5 h-48 w-48" />
                   </div>
                </div>
             </div>
             
             {/* Abstract blobs */}
             <div className="absolute -bottom-6 -right-6 h-32 w-32 bg-primary/10 rounded-full blur-2xl" />
             <div className="absolute -top-6 -left-6 h-32 w-32 bg-indigo-500/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Shield({ className, ...props }: any) {
    return (
        <svg
            {...props}
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
    )
}
