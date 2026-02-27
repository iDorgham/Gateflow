'use client';

import { usePathname, useRouter } from 'next/navigation';
import { i18n, type Locale } from '@/lib/i18n-config';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@gate-access/ui';
import { Languages } from 'lucide-react';

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[10px] font-bold ring-offset-background transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-7 px-2 text-primary-foreground/80"
          aria-label="Toggle language"
        >
          <Languages className="h-3 w-3" />
          <span>{currentLocale === 'ar-EG' ? 'العربية' : 'English'}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18n.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={currentLocale === locale ? 'bg-accent' : ''}
          >
            {localeLabels[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
