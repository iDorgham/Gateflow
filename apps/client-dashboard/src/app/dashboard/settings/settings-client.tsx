'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  Settings2
} from 'lucide-react';

// Import Tabs
import { ProfileTab } from './tabs/profile-tab';
import { WorkspaceTab } from './tabs/workspace-tab';
import { ProjectsTab } from './tabs/projects-tab';
import { ApiKeysTab } from './tabs/api-keys-tab';
import { WebhooksTab } from './tabs/webhooks-tab';
import { BillingTab } from './tabs/billing-tab';
import { TeamTab } from './tabs/team-tab';

interface SettingsClientProps {
  user: any;
  org: any;
  projects: any[];
  apiKeys: any[];
  webhooks: any[];
  teamMembers: any[];
  billing: any;
  currentUserId: string;
}

export function SettingsClient(props: SettingsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const initialTab = searchParams.get('tab') || 'profile';
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
    { id: 'profile', label: 'Profile', icon: User, component: <ProfileTab user={props.user} /> },
    { id: 'workspace', label: 'Workspaces', icon: Building2, component: <WorkspaceTab org={props.org} /> },
    { id: 'projects', label: 'Projects', icon: Layers, component: <ProjectsTab projects={props.projects} /> },
    { id: 'team', label: 'Team', icon: Users, component: <TeamTab members={props.teamMembers} currentUserId={props.currentUserId} /> },
    { id: 'api-keys', label: 'API Keys', icon: KeyRound, component: <ApiKeysTab initialKeys={props.apiKeys} /> },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook, component: <WebhooksTab initialWebhooks={props.webhooks} /> },
    { id: 'billing', label: 'Billing', icon: CreditCard, component: <BillingTab org={props.org} gateCount={props.billing.gateCount} qrCount={props.billing.qrCount} /> },
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-1 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Settings2 className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase">System Control</h1>
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 pl-1">
            Global configuration and administrative nodes for <span className="text-primary font-bold">{props.org.name}</span>.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full flex justify-start overflow-x-auto h-auto mb-6 p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-2 whitespace-nowrap px-4 py-2"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-0 outline-none">
            {tab.component}
          </TabsContent>
        ))}
      </Tabs>

    </div>
  );
}
