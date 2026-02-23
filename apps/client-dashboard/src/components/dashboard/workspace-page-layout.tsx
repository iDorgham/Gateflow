'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface WorkspacePageLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  maxWidth?: '3xl' | '4xl' | '5xl' | '6xl' | 'full';
}

export function WorkspacePageLayout({
  children,
  sidebar,
  header,
  maxWidth = 'full',
}: WorkspacePageLayoutProps) {
  const maxWidthClass = {
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    'full': 'max-w-none',
  }[maxWidth];

  return (
    <div className={cn("mx-auto space-y-8", maxWidthClass)}>
      {header && <div className="space-y-1">{header}</div>}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main Content */}
        <div className={cn(sidebar ? "lg:col-span-8 xl:col-span-9" : "lg:col-span-12")}>
          {children}
        </div>

        {/* Sidebar */}
        {sidebar && (
          <aside className="space-y-6 lg:col-span-4 xl:col-span-3">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  );
}

export function SidebarSection({ title, children, icon: Icon }: { title: string; children: React.ReactNode, icon?: React.ElementType }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
        <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {title}
        </h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}
