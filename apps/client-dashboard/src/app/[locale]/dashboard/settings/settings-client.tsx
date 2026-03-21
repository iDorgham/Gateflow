'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import {
  Building2,
  Layers,
  KeyRound,
  Webhook,
  Users,
  Settings2,
  Bell,
  ShieldAlert,
  FolderKanban,
  CreditCard,
  Target,
} from 'lucide-react';

// Import Tabs (Profile & Billing are user settings — avatar menu)
import { WorkspaceTab } from './tabs/workspace-tab';
import { ApiKeysTab } from './tabs/api-keys-tab';
import { WebhooksTab } from './tabs/webhooks-tab';
import { TeamTab } from './tabs/team-tab';
import { IntegrationsTab } from './tabs/integrations-tab';
import { NotificationsTab } from './tabs/notifications-tab';
import { RolesTab } from './tabs/roles-tab';
import { ProjectsTab } from './tabs/projects-tab';
import { BillingTab } from './tabs/billing-tab';
import { MarketingTab } from './tabs/marketing-tab';

interface SettingsUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt: string;
}

interface SettingsOrg {
  id: string;
  name: string;
  email: string | null;
  logoUrl?: string | null;
  domain: string;
  plan: string;
  stripeCustomerId?: string | null;
  createdAt: string;
  requiredIdentityLevel: number;
  scanLogRetentionMonths: number | null;
  visitorHistoryRetentionMonths: number | null;
  idArtifactRetentionMonths: number | null;
  incidentRetentionMonths: number | null;
  maskResidentNameOnLandingPage: boolean;
  showUnitOnLandingPage: boolean;
  pixelMetaId?: string | null;
  pixelGtmId?: string | null;
}

interface SettingsProject {
  id: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  website?: string | null;
  createdAt: Date;
  _count: { gates: number; qrCodes: number; units: number; contacts: number };
}

interface SettingsApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  createdBy: string | null;
}

interface SettingsWebhookDelivery {
  id: string;
  event: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'RETRYING';
  statusCode: number | null;
  attemptCount: number;
  lastAttemptAt: string | null;
  createdAt: string;
}

interface SettingsWebhook {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
  deliveries: SettingsWebhookDelivery[];
}

interface SettingsRole {
  id: string;
  name: string;
  description?: string | null;
  permissions: Record<string, boolean>;
  isBuiltIn: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

interface SettingsBilling {
  gateCount: number;
  qrCount: number;
}

interface SettingsClientProps {
  user: SettingsUser;
  org: SettingsOrg;
  projects: SettingsProject[];
  apiKeys: SettingsApiKey[];
  webhooks: SettingsWebhook[];
  teamMembers: SettingsUser[];
  billing: SettingsBilling;
  roles: SettingsRole[];
  currentUserId: string;
  canManageRoles?: boolean;
  canManageUsers?: boolean;
}

export function SettingsClient(props: SettingsClientProps) {
  const router = useRouter();
  const { t } = useTranslation('dashboard');
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const tabParam = searchParams.get('tab') || 'workspace';
  const validIds = [
    'workspace',
    'projects',
    'team',
    'roles',
    'notifications',
    'api-keys',
    'webhooks',
    'integrations',
    'billing',
    'marketing',
  ];
  const initialTab = validIds.includes(tabParam) ? tabParam : 'workspace';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const TABS = [
    {
      id: 'workspace',
      label: t('settings.tabs.workspace', 'Workspace'),
      icon: Building2,
      component: <WorkspaceTab org={props.org} />,
    },
    {
      id: 'projects',
      label: t('settings.tabs.projects', 'Projects'),
      icon: FolderKanban,
      component: <ProjectsTab projects={props.projects} />,
    },
    {
      id: 'team',
      label: t('settings.tabs.team', 'Team'),
      icon: Users,
      component: (
        <TeamTab
          members={props.teamMembers}
          currentUserId={props.currentUserId}
        />
      ),
    },
    {
      id: 'roles',
      label: t('settings.tabs.roles', 'Roles'),
      icon: ShieldAlert,
      component: (
        <RolesTab roles={props.roles} canManageRoles={props.canManageRoles} />
      ),
    },
    {
      id: 'notifications',
      label: t('settings.tabs.notifications', 'Notifications'),
      icon: Bell,
      component: <NotificationsTab />,
    },
    {
      id: 'api-keys',
      label: t('settings.tabs.apiKeys', 'API Keys'),
      icon: KeyRound,
      component: <ApiKeysTab initialKeys={props.apiKeys} />,
    },
    {
      id: 'webhooks',
      label: t('settings.tabs.webhooks', 'Webhooks'),
      icon: Webhook,
      component: <WebhooksTab initialWebhooks={props.webhooks} />,
    },
    {
      id: 'integrations',
      label: t('settings.tabs.integrations', 'Integrations'),
      icon: Layers,
      component: <IntegrationsTab />,
    },
    {
      id: 'billing',
      label: t('settings.tabs.billing', 'Billing'),
      icon: CreditCard,
      component: (
        <BillingTab
          org={props.org}
          gateCount={props.billing.gateCount}
          qrCount={props.billing.qrCount}
        />
      ),
    },
    {
      id: 'marketing',
      label: t('settings.tabs.marketing', 'Marketing'),
      icon: Target,
      component: <MarketingTab org={props.org} />,
    },
  ];

  const activeTabData = TABS.find((tab) => tab.id === activeTab);

  const isRtl =
    searchParams.get('locale') === 'ar-EG' ||
    searchParams.get('locale') === 'ar-SA' ||
    pathname.includes('/ar-EG') ||
    pathname.includes('/ar-SA');

  return (
    <div className="space-y-0 pb-20" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Page header */}
      <div className="border-b border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-surface-raised,#FFFFFF)] dark:bg-[#1D2125] px-6 py-5 mb-0">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-9 w-9 rounded-md bg-[var(--ds-background-brand-subtle,#DEEBFF)] flex items-center justify-center border border-[var(--ds-border-focused,#4C9AFF)]/30">
            <Settings2 className="h-4 w-4 text-[var(--ds-text-brand,#0052CC)]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--ds-text,#172B4D)] uppercase">
            {t('settings.gateflowTitle', 'GateFlow Setup')}
          </h1>
        </div>
        <p className="text-sm text-[var(--ds-text-subtle,#42526E)]">
          <Trans
            t={t}
            i18nKey="settings.gateflowDescription"
            values={{ orgName: props.org.name }}
            defaults="Core operational parameters and administrative nodes for <1>{{orgName}}</1>."
            components={[
              <span key="org" className="text-[var(--ds-text-brand,#0052CC)] font-semibold" />,
            ]}
          />
        </p>
      </div>

      {/* Tab nav bar */}
      <div className="border-b border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-surface,#FFFFFF)] dark:bg-[#161A1D] sticky top-0 z-20">
        <LayoutGroup id="settings-tabs">
          <nav
            className="flex overflow-x-auto scrollbar-hide gap-0 px-6"
            role="tablist"
            aria-label="Settings sections"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(tab.id)}
                  className="relative flex items-center gap-2 whitespace-nowrap px-4 py-3.5 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-focused,#4C9AFF)] focus-visible:ring-offset-1 rounded-sm"
                  style={{
                    color: isActive
                      ? 'var(--ds-text-selected, #0052CC)'
                      : 'var(--ds-text-subtle, #42526E)',
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="settings-tab-indicator"
                      className="absolute bottom-0 start-0 end-0 h-0.5 rounded-full bg-[var(--ds-border-selected,#0052CC)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </LayoutGroup>
      </div>

      {/* Tab content with AnimatePresence */}
      <div className="pt-6 px-0">
        <AnimatePresence mode="wait">
          {activeTabData && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              {activeTabData.component}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
