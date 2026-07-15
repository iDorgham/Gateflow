'use client';

import React from 'react';
import Link from 'next/link';
import {
  Buildings,
  CaretUpDown,
  Check,
  PlusCircle,
  Gear,
} from '@phosphor-icons/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  cn,
  Avatar,
  AvatarFallback,
} from '@gateflow/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';

export interface OrgSwitcherProps {
  currentOrg: {
    id: string;
    name: string;
    logoUrl?: string | null;
  } | null;
  userOrgs?: {
    id: string;
    name: string;
    logoUrl?: string | null;
  }[];
  collapsed?: boolean;
}

export function OrgSwitcher({
  currentOrg,
  userOrgs = [],
  collapsed = false,
}: OrgSwitcherProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  if (!currentOrg) return null;

  const handleOrgSwitch = (orgId: string) => {
    router.push(`/${locale}/dashboard/organizations/${orgId}`);
  };

  const initials = currentOrg.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'flex w-full items-center gap-3 rounded-lg p-2 transition-all hover:bg-[var(--ds-background-neutral-subtle)] focus-visible:ring-2 focus-visible:ring-primary/50 outline-none',
            collapsed && 'justify-center'
          )}
          aria-label="Switch organization"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--ds-background-neutral)] shadow-sm">
            {currentOrg.logoUrl ? (
              <img
                src={currentOrg.logoUrl}
                alt={currentOrg.name}
                className="h-6 w-6 object-contain"
              />
            ) : (
              <Buildings weight="duotone" className="h-5 w-5 text-primary" />
            )}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-1 flex-col items-start overflow-hidden text-left"
              >
                <span className="text-sm font-bold tracking-tight text-[var(--ds-text)] truncate w-full">
                  {currentOrg.name}
                </span>
                <span className="text-[10px] font-medium text-[var(--ds-text-subtle)] uppercase tracking-wider">
                  Workspace
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {!collapsed && (
            <CaretUpDown className="h-4 w-4 text-[var(--ds-icon-subtle)]" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-64 p-2 bg-sidebar/95 backdrop-blur-lg border-border/40"
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--ds-text-subtlest)]">
          Organizations
        </DropdownMenuLabel>

        <div className="space-y-1 my-1">
          <DropdownMenuItem
            className="flex items-center gap-3 p-2 cursor-pointer focus:bg-primary/10"
            onClick={() => handleOrgSwitch(currentOrg.id)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">
                {currentOrg.name}
              </span>
              <span className="text-[10px] text-muted-foreground">Current</span>
            </div>
          </DropdownMenuItem>

          {userOrgs
            .filter((o) => o.id !== currentOrg.id)
            .map((org) => (
              <DropdownMenuItem
                key={org.id}
                className="flex items-center gap-3 p-2 cursor-pointer"
                onClick={() => handleOrgSwitch(org.id)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                  <Buildings className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex flex-1 flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate">
                    {org.name}
                  </span>
                </div>
              </DropdownMenuItem>
            ))}
        </div>

        <DropdownMenuSeparator className="bg-border/40" />

        <DropdownMenuItem asChild>
          <Link
            href={`/${locale}/dashboard/onboarding/new`}
            className="flex items-center gap-3 p-2 cursor-pointer text-primary hover:text-primary-focus"
          >
            <PlusCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Create New Organization</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href={`/${locale}/dashboard/settings/workspace`}
            className="flex items-center gap-3 p-2 cursor-pointer"
          >
            <Gear className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Workspace Settings</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
