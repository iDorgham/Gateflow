'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { 
  Database, 
  ShieldCheck, 
  Key, 
  Globe, 
  Lock, 
  Settings, 
  FileText,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  cn, 
  Card, 
  ScrollArea,
  PageHeader
} from '@gate-access/ui';
import Link from 'next/link';

interface SettingsSidebarItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

/**
 * Settings Layout
 * 
 * Provides a secondary sidebar navigation for the platform settings area.
 * Segments complex global configuration into manageable, domain-specific pages.
 */
export default function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const locale = params.locale;

  const sidebarItems: SettingsSidebarItem[] = [
    { href: `/settings`, label: t('admin:settings.nav.overview', 'Overview'), icon: Info },
    { href: `/settings/database`, label: t('admin:settings.nav.database', 'Database'), icon: Database },
    { href: `/settings/auth`, label: t('admin:settings.nav.auth', 'Authentication'), icon: ShieldCheck },
    { href: `/settings/security`, label: t('admin:settings.nav.security', 'Security & QR'), icon: Lock },
    { href: `/settings/infrastructure`, label: t('admin:settings.nav.infra', 'Infrastructure'), icon: Globe },
    { href: `/settings/compliance`, label: t('admin:settings.nav.compliance', 'Compliance'), icon: FileText },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader 
        title={t('admin:nav.settings', 'Platform Settings')}
        subtitle={t('admin:settings.subtitle', 'Configure global environment variables, security policies, and infrastructure keys.')}
        showBackButton
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Secondary Settings Sidebar */}
        <Card className="lg:col-span-3 border-ds-border/40 overflow-hidden sticky top-24">
          <div className="p-4 border-b border-ds-border/10 bg-ds-background-subtle/20">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtle">
              Settings Configuration
            </h3>
          </div>
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <nav className="p-2 space-y-1">
              {sidebarItems.map((item) => {
                const fullHref = `/${locale}${item.href}`;
                const isActive = pathname === fullHref || (item.href === '/settings' && pathname === `/${locale}/settings`);
                
                return (
                  <Link
                    key={item.href}
                    href={fullHref}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                      isActive 
                        ? "bg-ds-background-brand-bold text-white shadow-md shadow-primary/20" 
                        : "text-ds-text-subtle hover:bg-ds-background-neutral-subtle/50 hover:text-ds-text"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-ds-icon-subtle group-hover:text-ds-icon")} />
                    <span className="text-xs font-bold truncate flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/70 ml-auto" />}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
        </Card>

        {/* Content Area */}
        <div className="lg:col-span-9 animate-in fade-in slide-in-from-right-4 duration-500">
          {children}
        </div>
      </div>
    </div>
  );
}
