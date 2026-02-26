'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { cn } from '@/lib/utils';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from '@gate-access/ui';
import { 
  User, 
  Building2, 
  Layers, 
  KeyRound, 
  Webhook, 
  CreditCard, 
  Users,
  Settings2,
  Bell,
  ShieldAlert,
  FolderKanban
} from 'lucide-react';

// Import Tabs
import { ProfileTab } from './tabs/profile-tab';
import { WorkspaceTab } from './tabs/workspace-tab';
import { ApiKeysTab } from './tabs/api-keys-tab';
import { WebhooksTab } from './tabs/webhooks-tab';
import { BillingTab } from './tabs/billing-tab';
import { TeamTab } from './tabs/team-tab';
import { GeneralTab } from './tabs/general-tab';
import { IntegrationsTab } from './tabs/integrations-tab';
import { NotificationsTab } from './tabs/notifications-tab';
import { RolesTab } from './tabs/roles-tab';
import { ProjectsTab } from './tabs/projects-tab';

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
  createdAt: string;
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
  
  const initialTab = searchParams.get('tab') || 'general';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const TABS = [
    { id: 'general', label: t('settings.tabs.general', 'General'), icon: Settings2, component: <GeneralTab /> },
    { id: 'profile', label: t('settings.tabs.profile', 'Profile'), icon: User, component: <ProfileTab user={props.user} /> },
    { id: 'workspace', label: t('settings.tabs.workspace', 'Workspace'), icon: Building2, component: <WorkspaceTab org={props.org} /> },
    { id: 'projects', label: t('settings.tabs.projects', 'Projects'), icon: FolderKanban, component: <ProjectsTab projects={props.projects as any} /> },
    { id: 'team', label: t('settings.tabs.team', 'Team'), icon: Users, component: <TeamTab members={props.teamMembers} currentUserId={props.currentUserId} /> },
    { id: 'roles', label: t('settings.tabs.roles', 'Roles'), icon: ShieldAlert, component: <RolesTab roles={props.roles} canManageRoles={props.canManageRoles} /> },
    { id: 'notifications', label: t('settings.tabs.notifications', 'Notifications'), icon: Bell, component: <NotificationsTab /> },
    { id: 'billing', label: t('settings.tabs.billing', 'Billing'), icon: CreditCard, component: <BillingTab org={props.org} gateCount={props.billing.gateCount} qrCount={props.billing.qrCount} /> },
    { id: 'api-keys', label: t('settings.tabs.apiKeys', 'API Keys'), icon: KeyRound, component: <ApiKeysTab initialKeys={props.apiKeys} /> },
    { id: 'webhooks', label: t('settings.tabs.webhooks', 'Webhooks'), icon: Webhook, component: <WebhooksTab initialWebhooks={props.webhooks as any} /> },
    { id: 'integrations', label: t('settings.tabs.integrations', 'Integrations'), icon: Layers, component: <IntegrationsTab /> },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-1 border-b border-border pb-6">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Settings2 className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">{t('settings.title', 'Settings')}</h1>
        </div>
        <p className="text-sm text-muted-foreground">
            <Trans 
              t={t} 
              i18nKey="settings.description" 
              values={{ orgName: props.org.name }}
              defaults="Global configuration and administrative nodes for <1>{{orgName}}</1>."
              components={[<span key="org" className="text-primary font-semibold" />]}
            />
        </p>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="w-full"
        dir={searchParams.get('locale') === 'ar-EG' || pathname.includes('/ar-EG') ? 'rtl' : 'ltr'}
      >
        <TabsList className="w-full flex justify-start overflow-x-auto h-auto mb-6 p-1 bg-transparent border-b border-border rounded-none gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 whitespace-nowrap px-4 py-2 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none transition-all"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent 
            key={tab.id} 
            value={tab.id} 
            forceMount 
            className={cn("mt-0 outline-none", activeTab !== tab.id && "hidden")}
          >
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
