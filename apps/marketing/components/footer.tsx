import { Shield, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { I18nLink } from './i18n-link';
import type { Locale } from '../i18n-config';
import { getTranslation } from '../lib/i18n/get-translation';

export async function Footer({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'navigation');
  const { t: tc } = await getTranslation(locale, 'common');

  return (
    <footer className="bg-background border-t">
      <div className="container px-6 py-12 mx-auto">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <I18nLink locale={locale} href="/" className="flex items-center gap-2 mb-4">
              <Shield className="text-primary" />
              <span className="font-bold text-xl uppercase tracking-tighter">{t('header.logo')}</span>
            </I18nLink>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              {t('footer.brand.description')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Instagram size={20} /></a>
              <a href="#" className="text-muted-foreground hover:text-primary"><Linkedin size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-foreground">{t('footer.columns.product')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><I18nLink locale={locale} href="/features" className="hover:text-primary">{t('footer.links.features')}</I18nLink></li>
              <li><I18nLink locale={locale} href="/pricing" className="hover:text-primary">{t('footer.links.pricing')}</I18nLink></li>
              <li><I18nLink locale={locale} href="/solutions" className="hover:text-primary">{t('footer.links.solutions')}</I18nLink></li>
              <li><I18nLink locale={locale} href="/resources#security" className="hover:text-primary">{t('footer.links.security')}</I18nLink></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-foreground">{t('footer.columns.company')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><I18nLink locale={locale} href="/company#about" className="hover:text-primary">{t('footer.links.about')}</I18nLink></li>
              <li><I18nLink locale={locale} href="/contact" className="hover:text-primary">{t('footer.links.contact')}</I18nLink></li>
              <li><I18nLink locale={locale} href="/company#careers" className="hover:text-primary opacity-50 cursor-not-allowed">{t('footer.links.careers')}</I18nLink></li>
              <li><I18nLink locale={locale} href="/company#press" className="hover:text-primary opacity-50 cursor-not-allowed">Press</I18nLink></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-foreground">{t('footer.columns.legal')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><I18nLink locale={locale} href="/legal/privacy" className="hover:text-primary">{t('footer.links.privacy')}</I18nLink></li>
              <li><I18nLink locale={locale} href="/legal/terms" className="hover:text-primary">{t('footer.links.terms')}</I18nLink></li>
              <li><I18nLink locale={locale} href="/legal/security" className="hover:text-primary">{t('footer.links.security')}</I18nLink></li>
              <li><I18nLink locale={locale} href="/legal/cookies" className="hover:text-primary">{t('footer.links.cookies')}</I18nLink></li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-border" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {t('header.logo')}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">
              {t('footer.brand.madeIn')}
            </span>
            <div className="h-4 w-6 bg-red-600 rounded-sm relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1/3 bg-red-600" />
              <div className="absolute inset-x-0 top-1/3 h-1/3 bg-white" />
              <div className="absolute inset-x-0 top-2/3 h-1/3 bg-black" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
