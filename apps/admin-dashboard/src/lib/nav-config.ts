/**
 * Navigation configuration and route matching logic for Admin Dashboard (V10).
 */

export interface AdminNavItem {
  key: string;
  href: string;
  titleEn: string;
  titleAr: string;
  iconName: string;
  badge?: string;
  category?: 'OPERATIONS' | 'INTELLIGENCE' | 'SYSTEM';
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    key: 'organizations',
    href: '/organizations',
    titleEn: 'Organizations',
    titleAr: 'المؤسسات والشركات',
    iconName: 'BuildingOfficeIcon',
    category: 'OPERATIONS',
  },
  {
    key: 'crm',
    href: '/crm',
    titleEn: 'CRM & Pipeline',
    titleAr: 'إدارة العملاء والمبيعات',
    iconName: 'UserGroupIcon',
    category: 'OPERATIONS',
  },
  {
    key: 'intelligence',
    href: '/intelligence',
    titleEn: 'AI & Intelligence',
    titleAr: 'الذكاء الاصطناعي',
    iconName: 'SparklesIcon',
    category: 'INTELLIGENCE',
  },
  {
    key: 'team-roles',
    href: '/team-roles',
    titleEn: 'Team & RBAC',
    titleAr: 'فريق العمل والصلاحيات',
    iconName: 'ShieldCheckIcon',
    category: 'SYSTEM',
  },
  {
    key: 'settings',
    href: '/settings',
    titleEn: 'Platform Settings',
    titleAr: 'إعدادات المنصة',
    iconName: 'Cog6ToothIcon',
    category: 'SYSTEM',
  },
  {
    key: 'support',
    href: '/support',
    titleEn: 'Audit & Logs',
    titleAr: 'سجلات التدقيق',
    iconName: 'DocumentTextIcon',
    category: 'SYSTEM',
  },
];

/**
 * Determines whether a nav item is active given the current pathname.
 */
export function isActiveAdminRoute(
  pathname: string,
  targetHref: string
): boolean {
  if (!pathname || !targetHref) return false;

  // Normalize leading/trailing slashes and remove locale prefix if present (e.g. /en/organizations -> /organizations)
  const cleanPath = pathname.replace(/^\/(en|ar)/, '') || '/';
  const cleanTarget = targetHref.replace(/^\/(en|ar)/, '') || '/';

  if (cleanTarget === '/') {
    return cleanPath === '/';
  }

  return cleanPath === cleanTarget || cleanPath.startsWith(`${cleanTarget}/`);
}

/**
 * Returns localized navigation items with formatted labels.
 */
export function getLocalizedNavItems(
  locale: 'en' | 'ar' = 'en'
): Array<AdminNavItem & { label: string }> {
  const isAr = locale === 'ar';
  return ADMIN_NAV_ITEMS.map((item) => ({
    ...item,
    label: isAr ? item.titleAr : item.titleEn,
  }));
}
