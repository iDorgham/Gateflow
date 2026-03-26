'use client';

import { usePathname, useRouter } from 'next/navigation';
import { i18n, type Locale } from '@/lib/i18n-config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
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
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg h-8 text-[11px] font-bold transition-all disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
            isMini
              ? 'px-3 text-[var(--ds-text-subtle,#42526E)] hover:bg-[var(--ds-background-neutral-subtle,#091E420F)] hover:text-[var(--ds-text,#172B4D)]'
              : 'justify-center whitespace-nowrap px-3 text-[var(--ds-text-subtle,#42526E)] opacity-80 hover:opacity-100 hover:bg-[var(--ds-background-neutral-subtle,#091E420F)]'
          )}
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
