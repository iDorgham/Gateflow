import {
  isActiveAdminRoute,
  getLocalizedNavItems,
  ADMIN_NAV_ITEMS,
} from './nav-config';

describe('nav-config', () => {
  describe('isActiveAdminRoute', () => {
    it('matches exact routes accurately', () => {
      expect(isActiveAdminRoute('/organizations', '/organizations')).toBe(true);
      expect(isActiveAdminRoute('/settings', '/settings')).toBe(true);
      expect(isActiveAdminRoute('/crm', '/settings')).toBe(false);
    });

    it('matches nested sub-routes correctly', () => {
      expect(
        isActiveAdminRoute('/organizations/org-123/edit', '/organizations')
      ).toBe(true);
      expect(isActiveAdminRoute('/settings/security', '/settings')).toBe(true);
      expect(isActiveAdminRoute('/intelligence/prompts', '/intelligence')).toBe(
        true
      );
    });

    it('handles locale-prefixed pathnames seamlessly', () => {
      expect(isActiveAdminRoute('/en/organizations', '/organizations')).toBe(
        true
      );
      expect(isActiveAdminRoute('/ar/settings/general', '/settings')).toBe(
        true
      );
      expect(isActiveAdminRoute('/ar/crm', '/organizations')).toBe(false);
    });
  });

  describe('getLocalizedNavItems', () => {
    it('returns English labels for en locale', () => {
      const items = getLocalizedNavItems('en');
      expect(items).toHaveLength(ADMIN_NAV_ITEMS.length);
      expect(items[0].label).toBe('Organizations');
      expect(items[4].label).toBe('Platform Settings');
    });

    it('returns Arabic labels for ar locale', () => {
      const items = getLocalizedNavItems('ar');
      expect(items).toHaveLength(ADMIN_NAV_ITEMS.length);
      expect(items[0].label).toBe('المؤسسات والشركات');
      expect(items[4].label).toBe('إعدادات المنصة');
    });
  });
});
