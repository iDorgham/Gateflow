import {
  validateGeneralSettings,
  validateSecuritySettings,
  validateTenantDefaultSettings,
  getLocalizedSettingsTabs,
  SETTINGS_TABS,
} from './settings-config';

describe('settings-config', () => {
  describe('validateGeneralSettings', () => {
    it('validates legitimate general settings', () => {
      const result = validateGeneralSettings({
        platformName: 'GateFlow Enterprise',
        defaultLocale: 'en',
        defaultTimezone: 'Africa/Cairo',
      });
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('rejects empty platform name or invalid locale', () => {
      const result = validateGeneralSettings({
        platformName: '',
        defaultLocale: 'fr' as any,
        defaultTimezone: '',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.platformName).toBeDefined();
      expect(result.errors.defaultLocale).toBeDefined();
      expect(result.errors.defaultTimezone).toBeDefined();
    });
  });

  describe('validateSecuritySettings', () => {
    it('validates compliant session timeout bounds', () => {
      const valid = validateSecuritySettings({
        enforceGlobal2FA: true,
        sessionTimeoutMinutes: 60,
        ipAllowlist: ['192.168.1.1'],
      });
      expect(valid.isValid).toBe(true);

      const tooShort = validateSecuritySettings({
        enforceGlobal2FA: true,
        sessionTimeoutMinutes: 2,
        ipAllowlist: [],
      });
      expect(tooShort.isValid).toBe(false);
      expect(tooShort.errors.sessionTimeoutMinutes).toBeDefined();
    });
  });

  describe('validateTenantDefaultSettings', () => {
    it('validates compliant default tenant quota bounds', () => {
      const valid = validateTenantDefaultSettings({
        defaultMaxGates: 5,
        defaultMaxScanners: 10,
        allowOfflineSync: true,
      });
      expect(valid.isValid).toBe(true);

      const invalid = validateTenantDefaultSettings({
        defaultMaxGates: 0,
        defaultMaxScanners: -1,
        allowOfflineSync: true,
      });
      expect(invalid.isValid).toBe(false);
      expect(invalid.errors.defaultMaxGates).toBeDefined();
      expect(invalid.errors.defaultMaxScanners).toBeDefined();
    });
  });

  describe('getLocalizedSettingsTabs', () => {
    it('provides all 4 localized settings tabs for English and Arabic', () => {
      const enTabs = getLocalizedSettingsTabs('en');
      expect(enTabs).toHaveLength(SETTINGS_TABS.length);
      expect(enTabs[0].label).toBe('General');
      expect(enTabs[1].label).toBe('Security & Auth');

      const arTabs = getLocalizedSettingsTabs('ar');
      expect(arTabs).toHaveLength(SETTINGS_TABS.length);
      expect(arTabs[0].label).toBe('الإعدادات العامة');
      expect(arTabs[1].label).toBe('الأمان والمصادقة');
    });
  });
});
