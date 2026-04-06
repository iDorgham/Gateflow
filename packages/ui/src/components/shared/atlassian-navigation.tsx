'use client';

import * as React from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ChevronDown, Search, HelpCircle, Settings, Menu } from 'lucide-react';

export interface NavItem {
  label: string;
  href?: string;
  items?: {
    label: string;
    description?: string;
    href: string;
    icon?: React.ElementType;
  }[];
}

export interface AtlassianNavigationProps {
  logo: React.ReactNode;
  primaryItems: NavItem[];
  actions?: React.ReactNode;
  onSearchClick?: () => void;
  renderLink?: (props: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => React.ReactNode;
}

export function AtlassianNavigation({
  logo,
  primaryItems,
  actions,
  onSearchClick,
  renderLink = ({ href, children, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}: AtlassianNavigationProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--ds-background-default)] border-b border-[var(--ds-border)] h-14 flex items-center px-4">
      <div className="flex items-center gap-2 h-full">
        {/* Logo / Product Switcher */}
        <div className="flex items-center gap-2 px-2 hover:bg-[var(--ds-background-subtle)] rounded-sm cursor-pointer transition-colors h-10">
          {logo}
        </div>

        {/* Primary Items */}
        <nav className="hidden lg:flex items-center h-full ms-2">
          {primaryItems.map((item, index) => (
            <div key={index} className="h-full flex items-center">
              {item.items ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="subtle"
                      size="compact"
                      className="h-9 px-3 gap-1 hover:text-[var(--ds-text-brand)] group"
                    >
                      {item.label}
                      <ChevronDown
                        size={14}
                        className="opacity-60 group-hover:opacity-100 transition-opacity"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-72 p-2">
                    {item.items.map((subItem, subIndex) => (
                      <DropdownMenuItem key={subIndex} asChild className="p-0">
                        {renderLink({
                          href: subItem.href,
                          className: 'flex items-start gap-3 p-3 w-full',
                          children: (
                            <>
                              {subItem.icon && (
                                <div className="bg-[var(--ds-background-selected)] p-2 rounded-sm text-[var(--ds-text-selected)]">
                                  <subItem.icon size={18} />
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold">
                                  {subItem.label}
                                </span>
                                {subItem.description && (
                                  <span className="text-xs text-[var(--ds-text-subtlest)] leading-tight mt-0.5">
                                    {subItem.description}
                                  </span>
                                )}
                              </div>
                            </>
                          ),
                        })}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                renderLink({
                  href: item.href || '#',
                  className:
                    'px-3 py-1.5 text-sm font-medium text-[var(--ds-text-subtle)] hover:text-[var(--ds-text-brand)] hover:bg-[var(--ds-background-subtle)] rounded-sm transition-colors',
                  children: item.label,
                })
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="ms-auto flex items-center gap-2">
        {/* Search */}
        <Button
          variant="subtle"
          size="icon"
          className="h-9 w-9 text-[var(--ds-icon-subtle)]"
          onClick={onSearchClick}
          aria-label="Search"
        >
          <Search size={18} />
        </Button>

        {/* Global Actions (Settings, Help, etc) */}
        <div className="hidden sm:flex items-center gap-1">
          <Button
            variant="subtle"
            size="icon"
            className="h-9 w-9 text-[var(--ds-icon-subtle)]"
            aria-label="Help"
          >
            <HelpCircle size={18} />
          </Button>
          <Button
            variant="subtle"
            size="icon"
            className="h-9 w-9 text-[var(--ds-icon-subtle)]"
            aria-label="Settings"
          >
            <Settings size={18} />
          </Button>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-2 ms-2">{actions}</div>

        {/* Mobile Menu */}
        <Button
          variant="subtle"
          size="icon"
          className="lg:hidden h-9 w-9"
          aria-label="Menu"
        >
          <Menu size={20} />
        </Button>
      </div>
    </header>
  );
}
