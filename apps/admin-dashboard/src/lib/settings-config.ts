/**
 * Categorized platform settings schemas, tab navigation, and validation for Admin Dashboard.
 */

export type SettingsTabKey =
  'general' | 'security' | 'organizations' | 'integrations';

export interface SettingsTabItem {
  key: SettingsTabKey;
  href: string;
  labelEn: string;
  labelAr: string;
  descriptionEn: string;
  descriptionAr: string;
}

export const SETTINGS_TABS: SettingsTabItem[] = [
  {
    key: 'general',
    href: '/settings/general',
    labelEn: 'General',
    labelAr: 'الإعدادات العامة',
    descriptionEn:
      'Platform branding, default localization, and operating timezone.',
    descriptionAr: 'هوية المنصة، اللغة الافتراضية، والمنطقة الزمنية.',
  },
  {
    key: 'security',
    href: '/settings/security',
    labelEn: 'Security & Auth',
    labelAr: 'الأمان والمصادقة',
    descriptionEn:
      'Global 2FA enforcement, guard session timeouts, and IP allowlists.',
    descriptionAr:
      'فرض المصادقة الثنائية، مهلة الجلسات، وقوائم IP المسموح بها.',
  },
  {
    key: 'organizations',
    href: '/settings/organizations',
    labelEn: 'Tenant Defaults',
    labelAr: 'الحصص والاشتراكات',
    descriptionEn:
      'Default gate and scanner quotas assigned to new client organizations.',
    descriptionAr:
      'الحصص الافتراضية للبوابات وأجهزة المسح المخصصة للمؤسسات الجديدة.',
  },
  {
    key: 'integrations',
    href: '/settings/integrations',
    labelEn: 'Integrations & APIs',
    labelAr: 'التكامل والربط البرمجي',
    descriptionEn:
      'Outbound sales webhooks, SMS delivery providers, and audit exports.',
    descriptionAr:
      'ربط Webhook للمبيعات، مزودي الرسائل النصية، وتصدير السجلات.',
  },
];

export interface GeneralSettingsInput {
  platformName: string;
  defaultLocale: 'en' | 'ar';
  defaultTimezone: string;
}

export interface SecuritySettingsInput {
  enforceGlobal2FA: boolean;
  sessionTimeoutMinutes: number;
  ipAllowlist: string[];
}

export interface TenantDefaultSettingsInput {
  defaultMaxGates: number;
  defaultMaxScanners: number;
  allowOfflineSync: boolean;
}

/**
 * Validates General Settings inputs.
 */
export function validateGeneralSettings(input: Partial<GeneralSettingsInput>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.platformName || input.platformName.trim().length < 2) {
    errors.platformName = 'Platform name must be at least 2 characters';
  }

  if (!input.defaultLocale || !['en', 'ar'].includes(input.defaultLocale)) {
    errors.defaultLocale = 'Valid default locale (en or ar) is required';
  }

  if (!input.defaultTimezone || input.defaultTimezone.trim().length === 0) {
    errors.defaultTimezone = 'Timezone is required';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * Validates Security Settings inputs.
 */
export function validateSecuritySettings(
  input: Partial<SecuritySettingsInput>
): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (
    input.sessionTimeoutMinutes === undefined ||
    input.sessionTimeoutMinutes < 5 ||
    input.sessionTimeoutMinutes > 1440
  ) {
    errors.sessionTimeoutMinutes =
      'Session timeout must be between 5 and 1440 minutes (24 hours)';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * Validates Tenant Quota Defaults.
 */
export function validateTenantDefaultSettings(
  input: Partial<TenantDefaultSettingsInput>
): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (input.defaultMaxGates === undefined || input.defaultMaxGates < 1) {
    errors.defaultMaxGates = 'Default max gates must be at least 1';
  }

  if (input.defaultMaxScanners === undefined || input.defaultMaxScanners < 1) {
    errors.defaultMaxScanners = 'Default max scanners must be at least 1';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * Returns localized settings tab items.
 */
export function getLocalizedSettingsTabs(
  locale: 'en' | 'ar' = 'en'
): Array<SettingsTabItem & { label: string; description: string }> {
  const isAr = locale === 'ar';
  return SETTINGS_TABS.map((tab) => ({
    ...tab,
    label: isAr ? tab.labelAr : tab.labelEn,
    description: isAr ? tab.descriptionAr : tab.descriptionEn,
  }));
}
