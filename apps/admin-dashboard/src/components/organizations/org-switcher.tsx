'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Check,
  ChevronsUpDown,
  PlusCircle,
  ArrowLeftRight,
} from 'lucide-react';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from '@gateflow/ui';
import { useOrganization } from '@/providers/organization-provider';
import { useTranslation } from 'react-i18next';

interface Organization {
  id: string;
  name: string;
  type: string;
}

export function OrgSwitcher({ isCollapsed }: { isCollapsed?: boolean }) {
  const { orgId } = useOrganization();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [organizations, setOrganizations] = React.useState<Organization[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchOrgs() {
      try {
        const response = await fetch('/api/admin/organizations');
        if (response.ok) {
          const data = await response.json();
          setOrganizations(data.organizations || []);
        }
      } catch (error) {
        console.error('Failed to fetch orgs:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrgs();
  }, []);

  const currentOrg = organizations.find((o) => o.id === orgId);

  if (isCollapsed) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-xl bg-ds-background-brand-bold text-ds-icon-inverse shadow-primary/20"
        onClick={() => router.push(`/${i18n.language}/organizations`)}
      >
        <ArrowLeftRight className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={t('admin:org.switch_label', 'Switch Organization')}
          className={cn(
            'w-full justify-between bg-card/50 backdrop-blur-sm border-border/50 hover:bg-muted hover:border-border transition-all h-12 pl-3 pr-2',
            !orgId && 'text-muted-foreground italic font-normal'
          )}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ds-background-brand-bold text-ds-icon-inverse shadow-sm group-hover:scale-105 transition-transform">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-start min-w-0 leading-tight">
              <span className="text-[11px] font-black uppercase tracking-widest text-ds-text-subtler opacity-70">
                {currentOrg?.type?.replace('_', ' ') ||
                  t('admin:org.context_title', 'Organization')}
              </span>
              <span className="text-sm font-bold truncate max-w-[140px] text-ds-text group-hover:text-primary">
                {currentOrg?.name ||
                  t('admin:org.select_org', 'Select Context')}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[260px] p-0 shadow-2xl border-border/50 backdrop-blur-xl bg-card/95"
        align="start"
      >
        <Command className="rounded-xl border-none">
          <CommandInput
            placeholder={t(
              'admin:org.search_placeholder',
              'Search organizations...'
            )}
            className="h-11"
          />
          <CommandList className="max-h-[300px] custom-scrollbar">
            <CommandEmpty>
              {isLoading
                ? t('common:loading', 'Loading...')
                : t('admin:org.no_org_found', 'No organization found.')}
            </CommandEmpty>
            <CommandGroup
              heading={t('admin:org.group_accessible', 'Accessible Units')}
            >
              {organizations.map((org) => (
                <CommandItem
                  key={org.id}
                  onSelect={() => {
                    setOpen(false);
                    router.push(`/${i18n.language}/organizations/${org.id}`);
                  }}
                  className="flex items-center justify-between gap-2 px-3 py-2.5 aria-selected:bg-primary/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center border border-border/50 shadow-sm shrink-0">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold truncate text-ds-text">
                        {org.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                        {org.type}
                      </span>
                    </div>
                  </div>
                  {orgId === org.id && (
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check
                        className="h-3.5 w-3.5 text-primary"
                        strokeWidth={3}
                      />
                    </div>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator className="bg-border/50" />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  router.push(`/${i18n.language}/organizations/create`);
                }}
                className="flex items-center gap-3 px-3 py-2.5 text-primary-foreground bg-primary hover:bg-primary/90 m-1 rounded-lg cursor-pointer transition-all active:scale-[0.98]"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wide">
                  {t('admin:org.create_new', 'Create New Org')}
                </span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
