'use client';

import { usePathname, useRouter } from 'next/navigation';
import { i18n, type Locale } from '@/lib/i18n-config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gate-access/ui';
import { Languages, ChevronDown } from 'lucide-react';

export function LanguageSwitcher({
  currentLocale,
  variant = 'default',
}: {
  currentLocale: Locale;
  variant?: 'default' | 'mini';
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale: Locale) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPathname = segments.join('/');
    router.push(newPathname);
  };

  const localeLabels: Record<Locale, string> = {
    en: 'English',
    'ar-EG': 'العربية',
  };

  const isMini = variant === 'mini';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={
            isMini
              ? 'inline-flex items-center gap-1.5 rounded px-2 py-0.5 h-5 text-[10px] font-medium text-primary-foreground/90 hover:bg-white/15 hover:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-primary disabled:pointer-events-none'
              : 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[10px] font-bold ring-offset-background transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-7 px-2 text-primary-foreground/80'
          }
          aria-label="Toggle language"
        >
          <Languages className={isMini ? 'h-3 w-3 opacity-90' : 'h-3 w-3'} />
          <span>{currentLocale === 'ar-EG' ? 'العربية' : 'English'}</span>
          {isMini && <ChevronDown className="h-2.5 w-2.5 opacity-70" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={isMini ? 'min-w-[100px] py-1 text-[10px]' : undefined}
      >
        {i18n.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={currentLocale === locale ? 'bg-accent font-medium' : ''}
          >
            {localeLabels[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
