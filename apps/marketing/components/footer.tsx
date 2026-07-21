import { Shield } from 'lucide-react';
import { I18nLink } from './i18n-link';
import type { Locale } from '../i18n-config';
import { getTranslation } from '../lib/i18n/get-translation';

// lucide-react v1 dropped brand/logo icons — inline minimal glyphs instead.
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={20}
      height={20}
      {...props}
    >
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={20}
      height={20}
      {...props}
    >
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-6.8L4 22H1l8.1-9.3L1 2h7.4l5.1 6.2L18.9 2Zm-1.2 18h1.9L7.4 4H5.4l12.3 16Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={20}
      height={20}
      {...props}
    >
      <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.5.5.85 1.03 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45 2.53c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2Zm0 1.8c-2.67 0-2.99.01-4.04.06-.97.04-1.5.2-1.85.34-.47.18-.8.4-1.15.75s-.57.68-.75 1.15c-.14.35-.3.88-.34 1.85C3.81 9 3.8 9.32 3.8 12s.01 2.99.06 4.05c.04.97.2 1.5.34 1.85.18.47.4.8.75 1.15s.68.57 1.15.75c.35.14.88.3 1.85.34 1.05.05 1.37.06 4.04.06s2.99-.01 4.04-.06c.97-.04 1.5-.2 1.85-.34.47-.18.8-.4 1.15-.75s.57-.68.75-1.15c.14-.35.3-.88.34-1.85.05-1.06.06-1.38.06-4.05s-.01-2.99-.06-4.05c-.04-.97-.2-1.5-.34-1.85a3.09 3.09 0 0 0-.75-1.15 3.09 3.09 0 0 0-1.15-.75c-.35-.14-.88-.3-1.85-.34C14.99 3.81 14.67 3.8 12 3.8Zm0 3.07a5.13 5.13 0 1 1 0 10.26 5.13 5.13 0 0 1 0-10.26Zm0 1.8a3.33 3.33 0 1 0 0 6.66 3.33 3.33 0 0 0 0-6.66Zm5.34-1.98a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={20}
      height={20}
      {...props}
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

export async function Footer({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, 'navigation');

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <I18nLink
              locale={locale}
              href="/"
              className="flex items-center gap-2 mb-4"
            >
              <Shield className="text-primary" />
              <span className="font-bold text-xl uppercase tracking-tighter">
                {t('header.logo')}
              </span>
            </I18nLink>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              {t('footer.brand.description')}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Twitter"
              >
                <TwitterIcon />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
                aria-label="Linkedin"
              >
                <LinkedinIcon />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-foreground">
              {t('footer.columns.product')}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <I18nLink
                  locale={locale}
                  href="/features"
                  className="hover:text-primary"
                >
                  {t('footer.links.features')}
                </I18nLink>
              </li>
              <li>
                <I18nLink
                  locale={locale}
                  href="/pricing"
                  className="hover:text-primary"
                >
                  {t('footer.links.pricing')}
                </I18nLink>
              </li>
              <li>
                <I18nLink
                  locale={locale}
                  href="/solutions"
                  className="hover:text-primary"
                >
                  {t('footer.links.solutions')}
                </I18nLink>
              </li>
              <li>
                <I18nLink
                  locale={locale}
                  href="/resources#security"
                  className="hover:text-primary"
                >
                  {t('footer.links.security')}
                </I18nLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-foreground">
              {t('footer.columns.company')}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <I18nLink
                  locale={locale}
                  href="/company#about"
                  className="hover:text-primary"
                >
                  {t('footer.links.about')}
                </I18nLink>
              </li>
              <li>
                <I18nLink
                  locale={locale}
                  href="/contact"
                  className="hover:text-primary"
                >
                  {t('footer.links.contact')}
                </I18nLink>
              </li>
              <li>
                <I18nLink
                  locale={locale}
                  href="/company#careers"
                  className="cursor-not-allowed text-muted-foreground hover:text-primary"
                >
                  {t('footer.links.careers')}
                </I18nLink>
              </li>
              <li>
                <I18nLink
                  locale={locale}
                  href="/company#press"
                  className="cursor-not-allowed text-muted-foreground hover:text-primary"
                >
                  Press
                </I18nLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-foreground">
              {t('footer.columns.legal')}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <I18nLink
                  locale={locale}
                  href="/legal/privacy"
                  className="hover:text-primary"
                >
                  {t('footer.links.privacy')}
                </I18nLink>
              </li>
              <li>
                <I18nLink
                  locale={locale}
                  href="/legal/terms"
                  className="hover:text-primary"
                >
                  {t('footer.links.terms')}
                </I18nLink>
              </li>
              <li>
                <I18nLink
                  locale={locale}
                  href="/legal/security"
                  className="hover:text-primary"
                >
                  {t('footer.links.security')}
                </I18nLink>
              </li>
              <li>
                <I18nLink
                  locale={locale}
                  href="/legal/cookies"
                  className="hover:text-primary"
                >
                  {t('footer.links.cookies')}
                </I18nLink>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-border" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {t('header.logo')}. All Rights
            Reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
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
