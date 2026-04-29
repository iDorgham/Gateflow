'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Check,
  ChevronsUpDown,
  PlusCircle,
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
} from '@gate-access/ui';
import { useOrganization } from '../providers/OrganizationProvider';
import { useTranslation } from 'react-i18next';

export function OrgSwitcher({ isCollapsed }: { isCollapsed?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [orgs, setOrgs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { organization, orgId } = useOrganization();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    if (open && orgs.length === 0) {
      setLoading(true);
      fetch('/api/admin/organizations?pageSize=10')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrgs(data.data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [open, orgs.length]);

  const onSelect = (id: string) => {
    setOpen(false);
    router.push(`/${i18n.language}/organizations/${id}`);
  };

  if (isCollapsed) {
    return (
      <div className="flex justify-center p-2 border-b border-border/40 pb-4 mb-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 w-9 p-0 rounded-xl bg-ds-background-brand-bold text-white flex items-center justify-center shadow-lg hover:bg-ds-background-brand-bold-hovered"
            >
              <Building2 className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[280px] p-0 shadow-2xl border-ds-border"
            align="start"
            side="right"
            sideOffset={10}
          >
            <Command className="bg-popover">
              <CommandInput
                placeholder="Search organizations..."
                className="h-11 font-medium"
              />
              <CommandList className="max-h-[300px]">
                <CommandEmpty>No organization found.</CommandEmpty>
                <CommandGroup heading="Active Contexts">
                  {orgs.map((org) => (
                    <CommandItem
                      key={org.id}
                      value={org.name}
                      onSelect={() => onSelect(org.id)}
                      className="flex items-center justify-between py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-ds-text-subtle" />
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{org.name}</span>
                          <span className="text-[10px] text-ds-text-subtlest uppercase font-black">
                            {org.plan}
                          </span>
                        </div>
                      </div>
                      {orgId === org.id && (
                        <Check className="h-4 w-4 text-ds-text-brand" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      router.push(`/${i18n.language}/organizations`);
                    }}
                    className="py-3 cursor-pointer text-ds-text-brand font-bold"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Manage Organizations
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-3 h-14 hover:bg-ds-background-neutral-subtle border-b border-border/40 rounded-none group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ds-background-brand-bold text-white shadow-md transition-transform group-hover:scale-105">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm font-black italic tracking-tighter text-ds-text uppercase truncate w-full">
                {organization?.name ?? 'Select Organization'}
              </span>
              <span className="text-[10px] font-black text-ds-text-brand tracking-widest uppercase opacity-90">
                {organization ? `${organization.plan} PLAN` : 'Global Admin'}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-0 shadow-2xl border-ds-border"
        align="start"
      >
        <Command className="bg-popover">
          <CommandInput
            placeholder="Search organizations..."
            className="h-11 font-medium"
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup heading="Active Contexts">
              {orgs.map((org) => (
                <CommandItem
                  key={org.id}
                  value={org.name}
                  onSelect={() => onSelect(org.id)}
                  className="flex items-center justify-between py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-ds-text-subtle" />
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{org.name}</span>
                      <span className="text-[10px] text-ds-text-subtlest uppercase font-black">
                        {org.plan}
                      </span>
                    </div>
                  </div>
                  {orgId === org.id && (
                    <Check className="h-4 w-4 text-ds-text-brand" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  router.push(`/${i18n.language}/organizations`);
                }}
                className="py-3 cursor-pointer text-ds-text-brand font-bold"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Manage Organizations
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
