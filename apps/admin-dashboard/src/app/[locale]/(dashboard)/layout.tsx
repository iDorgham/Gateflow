import { Sidebar } from '@/components/Sidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Badge, Avatar, AvatarFallback } from '@gate-access/ui';
import TranslationsProvider from '@/components/i18n/TranslationsProvider';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Locale, i18n } from '@/lib/i18n/i18n-config';
import { notFound } from 'next/navigation';

export default function DashboardLayout({ 
  children,
  params
}: { 
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  if (!i18n.locales.includes(params.locale)) {
    notFound();
  }
  return (
    <TranslationsProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6 shadow-sm">
          <div />
          <div className="flex items-center gap-3">
            <LanguageSwitcher currentLocale={params.locale} />
            <ThemeToggle />
            <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/20 transition-colors">
              Super Admin
            </Badge>
            <Avatar className="h-9 w-9 border-2 border-border shadow-sm">
              <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                SA
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-background relative z-0">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
    </TranslationsProvider>
  );
}
