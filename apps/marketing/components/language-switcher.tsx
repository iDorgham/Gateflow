'use client';

import { usePathname, useRouter } from 'next/navigation';
import { i18n, type Locale } from '../i18n-config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gateflow/ui';

const GlobeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
  </svg>
);

const localeLabels: Record<
  Locale,
  { label: string; short: string; flag: string }
> = {
  en: { label: 'English', short: 'EN', flag: '🇺🇸' },
  'ar-EG': { label: 'العربية', short: 'AR', flag: '🇪🇬' },
};

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale: Locale) => {
    if (!pathname) return;

    // Sync across apps using a top-level cookie if on subdomains
    const domain = window.location.hostname.includes('.')
      ? `.${window.location.hostname.split('.').slice(-2).join('.')}`
      : undefined;

    document.cookie = `gf_locale=${newLocale}; path=/; max-age=31536000${domain ? `; domain=${domain}` : ''}`;

    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  const current = localeLabels[currentLocale] ?? localeLabels.en;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="group inline-flex items-center gap-2 rounded-xl border border-ds-border bg-ds-surface-raised px-3 py-2 text-[12px] font-black uppercase tracking-[0.15em] text-ds-text-subtle transition-all duration-200 hover:border-ds-border-brand hover:bg-ds-background-brand-subtle hover:text-ds-text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-border-brand"
          aria-label="Switch language"
        >
          <span className="text-ds-text-brand transition-transform duration-300 group-hover:rotate-[15deg]">
            <GlobeIcon />
          </span>
          <span>{current.short}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[160px] overflow-hidden rounded-2xl border border-ds-border bg-ds-surface p-1.5"
        style={{ boxShadow: 'var(--ds-shadow-overlay)' }}
      >
        {i18n.locales.map((locale) => {
          const info = localeLabels[locale] ?? localeLabels.en;
          const isActive = currentLocale === locale;
          return (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-ds-background-brand-subtle text-ds-text-brand'
                  : 'text-ds-text-subtle hover:bg-ds-surface-raised hover:text-ds-text-heading'
              }`}
            >
              <span className="text-lg leading-none">{info.flag}</span>
              <span className="flex-1">{info.label}</span>
              {isActive && (
                <span className="h-2 w-2 rounded-full bg-ds-background-brand-bold" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
