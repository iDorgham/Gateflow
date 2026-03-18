'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { ScrollArea } from '../ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

export interface SideNavItemProps {
  label: string;
  href: string;
  icon?: React.ElementType;
  isActive?: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
}

export function SideNavItem({
  label,
  href,
  icon: Icon,
  isActive,
  onClick,
  isCollapsed,
}: SideNavItemProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            href={href}
            onClick={onClick}
            className={cn(
              'group flex items-center gap-3 rounded-[3px] px-3 py-2 text-sm transition-colors duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-selected)]',
              isActive
                ? 'bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)] font-semibold'
                : 'text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle-hovered)] hover:text-[var(--ds-text)]',
              isCollapsed && 'justify-center px-0'
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0 transition-all duration-200',
                  isActive
                    ? 'text-[var(--ds-text-selected)]'
                    : 'text-[var(--ds-icon-subtle)]'
                )}
              />
            )}
            {!isCollapsed && <span className="truncate">{label}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" sideOffset={10}>
            {label}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

export function NavGroup({
  label,
  children,
  isCollapsed,
}: {
  label?: string;
  children: React.ReactNode;
  isCollapsed?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 pt-8 first:pt-0">
      {label && !isCollapsed && (
        <h3 className="px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[var(--ds-text-subtlest)]">
          {label}
        </h3>
      )}
      {isCollapsed && label && (
        <div className="h-px bg-[var(--ds-border)] mx-4 my-2 opacity-50" />
      )}
      {children}
    </div>
  );
}

export function NavNestedGroup({
  label,
  icon: Icon,
  children,
  isCollapsed,
  defaultOpen = false,
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  isCollapsed?: boolean;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  if (isCollapsed) return <>{children}</>;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="group flex w-full items-center gap-3 rounded-[3px] px-3 py-2 text-sm text-[var(--ds-text-subtle)] hover:bg-[var(--ds-background-neutral-subtle-hovered)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-selected)]">
        {Icon && (
          <Icon className="h-4 w-4 shrink-0 text-[var(--ds-icon-subtle)]" />
        )}
        <span className="flex-1 text-left truncate">{label}</span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 shrink-0 transition-transform duration-200 text-[var(--ds-icon-subtlest)]',
            isOpen && 'rotate-180'
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-7 pr-1 pt-0.5 space-y-0.5">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function SideNavigationShell({
  header,
  children,
  footer,
  isCollapsed,
  className,
}: {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  isCollapsed?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex h-full flex-col bg-[var(--ds-background-neutral-subtle)] border-r border-[var(--ds-border)] transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[64px]' : 'w-64',
        className
      )}
    >
      {header && <div className="shrink-0">{header}</div>}
      <ScrollArea className="flex-1 px-3 py-4">
        <TooltipProvider>
          <nav className="flex flex-col gap-1.5">{children}</nav>
        </TooltipProvider>
      </ScrollArea>
      {footer && (
        <div className="shrink-0 border-t border-[var(--ds-border)]">
          {footer}
        </div>
      )}
    </div>
  );
}
