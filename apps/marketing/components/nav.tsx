'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  Button,
} from '@gate-access/ui';
import { Menu, Shield, Zap, Building2, GraduationCap, Calendar, Anchor, ChevronDown } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { I18nLink } from './i18n-link';
import type { Locale } from '../i18n-config';

import { useTranslation } from '../hooks/use-translation';

export function Nav({ locale }: { locale: Locale }) {
  const { t } = useTranslation('navigation');
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  const PRODUCT_ITEMS = [
    { href: '/features', icon: Zap, label: t('header.dropdowns.product.features.label'), desc: t('header.dropdowns.product.features.desc') },
    { href: '/#security', icon: Shield, label: t('header.dropdowns.product.security.label'), desc: t('header.dropdowns.product.security.desc') },
  ];

  const SOLUTIONS_ITEMS = [
    { href: '/solutions#compounds', icon: Building2, label: t('header.dropdowns.solutions.compounds.label'), desc: t('header.dropdowns.solutions.compounds.desc') },
    { href: '/solutions#schools', icon: GraduationCap, label: t('header.dropdowns.solutions.schools.label'), desc: t('header.dropdowns.solutions.schools.desc') },
    { href: '/solutions#events', icon: Calendar, label: t('header.dropdowns.solutions.events.label'), desc: t('header.dropdowns.solutions.events.desc') },
    { href: '/solutions#clubs', icon: Anchor, label: t('header.dropdowns.solutions.clubs.label'), desc: t('header.dropdowns.solutions.clubs.desc') },
  ];

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-border/50 py-3'
          : 'bg-transparent border-transparent py-5'
      )}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-8">
          <I18nLink locale={locale} href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
              <Shield size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight uppercase">
              {t('header.logo')}
            </span>
          </I18nLink>

          <nav className="hidden lg:flex items-center gap-1">
            <NavDropdown label={t('header.menu.product')} items={PRODUCT_ITEMS} locale={locale} />
            <NavDropdown label={t('header.menu.solutions')} items={SOLUTIONS_ITEMS} locale={locale} />
            <I18nLink 
              locale={locale} 
              href="/pricing"
              className={cn(
                "px-4 py-2 text-sm font-medium hover:text-primary transition-colors",
                pathname.includes('/pricing') ? "text-primary" : "text-muted-foreground"
              )}
            >
              {t('header.menu.pricing')}
            </I18nLink>
            <I18nLink 
              locale={locale} 
              href="/contact"
              className={cn(
                "px-4 py-2 text-sm font-medium hover:text-primary transition-colors",
                pathname.includes('/contact') ? "text-primary" : "text-muted-foreground"
              )}
            >
              {t('header.menu.contact')}
            </I18nLink>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle />
          
          <div className="hidden lg:flex items-center gap-2 ml-2">
            <Button variant="ghost" asChild>
              <Link href="https://app.gateflow.com/login">{t('header.actions.signIn')}</Link>
            </Button>
            <Button asChild className="shadow-lg shadow-primary/20">
              <I18nLink locale={locale} href="/contact">{t('header.actions.getStarted')}</I18nLink>
            </Button>
          </div>

          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  );
}

function NavDropdown({ label, items, locale }: { label: string; items: any[]; locale: Locale }) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        {label}
        <ChevronDown size={14} className="opacity-50 group-hover:rotate-180 transition-transform" />
      </button>
      
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
        <div className="bg-popover border rounded-xl shadow-2xl p-2 w-80 grid gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <I18nLink
                key={item.href}
                locale={locale}
                href={item.href}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="bg-primary/5 text-primary p-2 rounded-md">
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-sm font-semibold">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              </I18nLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileNav({ locale }: { locale: Locale }) {
  const { t } = useTranslation('navigation');
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={locale === 'ar-EG' ? 'left' : 'right'} className="flex flex-col">
        <div className="flex items-center gap-2 mt-4 mb-8">
          <Shield className="text-primary" />
          <span className="font-bold text-lg">{t('header.logo')}</span>
        </div>
        
        <div className="grid gap-2">
          <I18nLink locale={locale} href="/" className="px-4 py-3 text-lg font-medium hover:bg-accent rounded-lg">{t('header.logo')}</I18nLink>
          <I18nLink locale={locale} href="/features" className="px-4 py-3 text-lg font-medium hover:bg-accent rounded-lg">{t('footer.links.features')}</I18nLink>
          <I18nLink locale={locale} href="/solutions" className="px-4 py-3 text-lg font-medium hover:bg-accent rounded-lg">{t('header.menu.solutions')}</I18nLink>
          <I18nLink locale={locale} href="/pricing" className="px-4 py-3 text-lg font-medium hover:bg-accent rounded-lg">{t('header.menu.pricing')}</I18nLink>
          <I18nLink locale={locale} href="/contact" className="px-4 py-3 text-lg font-medium hover:bg-accent rounded-lg">{t('header.menu.contact')}</I18nLink>
        </div>

        <div className="mt-auto grid gap-4">
          <Button variant="outline" asChild className="w-full">
            <Link href="https://app.gateflow.com/login">{t('header.actions.signIn')}</Link>
          </Button>
          <Button className="w-full" asChild>
            <I18nLink locale={locale} href="/contact">{t('header.actions.getStarted')}</I18nLink>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
