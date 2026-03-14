'use client';

import { cn } from '@gate-access/ui';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@gate-access/ui';
import { ThemeToggle } from './theme-toggle';
import {
  Building,
  CreditCard,
  PowerIcon,
  ShieldCheckIcon,
  StackIcon,
  User,
} from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

interface HeaderUserMenuProps {
  user: { id: string; name: string; email: string; role: string };
  org: { id: string; name: string; plan: string } | null;
  locale: string;
  variant?: 'header' | 'sidebar';
  isCollapsed?: boolean;
}

export function HeaderUserMenu({ 
  user, 
  org, 
  locale, 
  variant = 'header',
  isCollapsed = false 
}: HeaderUserMenuProps) {
  const router = useRouter();
  const { t } = useTranslation('dashboard');

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const base = `/${locale}/dashboard`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all",
            variant === 'header' 
              ? "gap-2 rounded-xl p-1.5 hover:bg-sidebar-accent" 
              : cn(
                  "w-full rounded-2xl hover:bg-sidebar-accent/50 group",
                  isCollapsed ? "justify-center p-2" : "gap-3 p-3 text-left"
                )
          )}
          aria-label={t('sidebar.profile', 'Profile menu')}
        >
          <Avatar className={cn(
            "border-2 border-sidebar-border transition-all",
            variant === 'header' ? "h-9 w-9 hover:border-primary/50" : "h-10 w-10 group-hover:border-primary/50"
          )}>
            <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          {variant === 'sidebar' && !isCollapsed && (
            <div className="flex-1 min-w-0 flex flex-col items-start">
              <span className="text-xs font-bold text-foreground truncate w-full tracking-tight">
                {user.name}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground truncate w-full uppercase tracking-widest opacity-60">
                {user.role.toLowerCase().replace('_', ' ')}
              </span>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={variant === 'header' ? 'end' : 'start'}
        side={variant === 'header' ? 'bottom' : 'right'}
        sideOffset={variant === 'header' ? 8 : 12}
        className="w-64 p-2 rounded-2xl border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl animate-in fade-in zoom-in-95"
      >
        <DropdownMenuLabel className="p-3 mb-1">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-bold leading-none text-foreground truncate">
              {user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground font-medium truncate">
              {user.email}
            </p>
            {org && (
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary w-fit">
                <StackIcon className="h-3 w-3" />
                <span>{org.plan}</span>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-sidebar-border/50 mx-1" />
        <div className="p-1">
          <DropdownMenuItem asChild>
            <Link
              href={`${base}/profile`}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-sidebar-accent transition-colors"
            >
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t('sidebar.profile', 'Profile')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`${base}/settings?tab=workspace`}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-sidebar-accent transition-colors"
            >
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t('sidebar.workspace', 'Workspace')}</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`${base}/settings?tab=billing`}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-sidebar-accent transition-colors"
            >
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t('sidebar.billing', 'Billing & payments')}</span>
            </Link>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator className="bg-sidebar-border/50 mx-1" />
        <div className="p-1">
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer transition-colors"
            onClick={() => router.push(`/${locale}/logout`)}
          >
            <PowerIcon className="h-4 w-4" />
            <span className="text-sm font-bold">{t('sidebar.signout', 'Sign out')}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
