'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  ShieldCheck,
  Database,
  Key,
  Globe,
  Lock,
  RefreshCw,
  FileText,
  KeyRound,
  LayoutDashboard,
} from 'lucide-react';
import { cn } from '@gate-access/ui';

interface SettingsSidebarProps {
  locale: string;
}

export function SettingsSidebar({ locale }: SettingsSidebarProps) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const groups = [
    {
      label: t('admin:settings.sections.general', 'General'),
      items: [
        {
          href: `/settings`,
          label: t('admin:settings.sections.overview', 'Overview'),
          icon: LayoutDashboard,
          exact: true,
        },
        {
          href: `/settings/activity`,
          label: t('admin:settings.sections.activity', 'Activity Logs'),
          icon: FileText,
        },
      ],
    },
    {
      label: t('admin:settings.sections.configuration', 'Configuration'),
      items: [
        {
          href: `/settings/database`,
          label: t('admin:settings.database', 'Database'),
          icon: Database,
        },
        {
          href: `/settings/authentication`,
          label: t('admin:settings.authentication', 'Authentication'),
          icon: ShieldCheck,
        },
        {
          href: `/settings/qr-signing`,
          label: t('admin:settings.qrSigning', 'QR Signing'),
          icon: Key,
        },
      ],
    },
    {
      label: t('admin:settings.sections.infrastructure', 'Infrastructure'),
      items: [
        {
          href: `/settings/rate-limiting`,
          label: t('admin:settings.rateLimiting', 'Rate Limiting'),
          icon: RefreshCw,
        },
        {
          href: `/settings/app-urls`,
          label: t('admin:settings.appUrls', 'Application URLs'),
          icon: Globe,
        },
      ],
    },
    {
      label: t('admin:settings.sections.security', 'Security'),
      items: [
        {
          href: `/settings/policies`,
          label: t('admin:settings.securityPolicies', 'Security Policies'),
          icon: Lock,
        },
        {
          href: `/settings/secrets`,
          label: t('admin:settings.secrets', 'Secrets & Keys'),
          icon: KeyRound,
        },
      ],
    },
  ];

  const localePrefix = `/${locale}`;

  return (
    <div className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          <h3 className="px-3 text-[10px] font-black uppercase tracking-widest text-ds-text-subtlest/70">
            {group.label}
          </h3>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const href = `${localePrefix}${item.href}`;
              const isActive = item.exact
                ? pathname === href || pathname === `${href}/`
                : pathname.startsWith(href);

              return (
                <Link
                  key={item.href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-bold transition-all duration-200 group',
                    isActive
                      ? 'bg-ds-background-selected text-ds-text-selected shadow-sm'
                      : 'text-ds-text-subtle hover:bg-ds-background-subtle hover:text-ds-text'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-3.5 w-3.5 shrink-0 transition-colors',
                      isActive
                        ? 'text-ds-text-selected'
                        : 'text-ds-text-subtle group-hover:text-ds-text'
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
