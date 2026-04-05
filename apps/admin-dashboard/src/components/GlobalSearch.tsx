'use client';

import { Search, Command } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@gate-access/ui';
import { useTranslation } from 'react-i18next';

export function GlobalSearch() {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative flex items-center group max-w-sm w-full">
      <div
        className={cn(
          'flex h-9 w-full items-center gap-2 rounded-full border border-ds-border bg-ds-background-neutral-subtle/30 px-3 py-2 transition-all duration-300',
          isFocused &&
            'ring-2 ring-primary/20 border-primary bg-background shadow-lg scale-[1.02]'
        )}
      >
        <Search
          className={cn(
            'h-4 w-4 shrink-0 transition-colors',
            isFocused ? 'text-primary' : 'text-ds-text-subtlest'
          )}
        />
        <input
          type="text"
          placeholder={t(
            'admin:header.search',
            'Search projects, users, orgs...'
          )}
          className="flex-1 bg-transparent text-[13px] font-medium outline-none placeholder:text-ds-text-subtlest text-ds-text"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border border-ds-border bg-ds-background-default shadow-sm opacity-60 group-hover:opacity-100 transition-opacity">
          <Command className="h-2.5 w-2.5 text-ds-text-subtle" />
          <span className="text-[10px] font-black tracking-tight text-ds-text-subtle">
            K
          </span>
        </div>
      </div>
    </div>
  );
}
