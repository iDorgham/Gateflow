'use client';

import * as React from 'react';
import { Search as SearchIcon, Command, X } from 'lucide-react';
import { searchIndex } from '../../lib/search';
import { cn } from '@gateflow/ui';
import Link from 'next/link';
import { useLocale } from '../providers/LocaleProvider';

export function Search() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const { isRTL } = useLocale();

  // Handle keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const results = React.useMemo(() => {
    if (!query) return [];
    return searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <>
      <div className="relative group max-w-sm flex-1 hidden md:block">
        <SearchIcon
          size={16}
          className={cn(
            'absolute top-1/2 -translate-y-1/2 text-[var(--ds-icon-subtle)]',
            isRTL ? 'right-3' : 'left-3'
          )}
        />
        <input
          type="text"
          className="h-10 w-full rounded-lg border border-[var(--ds-border-subtle)] bg-[var(--ds-layer-01)] hover:bg-[var(--ds-layer-02)] ps-10 pe-4 text-xs font-medium text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-subtlest)] focus:outline-none focus:ring-2 focus:ring-[var(--ds-border-focused)] focus:border-[var(--ds-border-focused)] transition-all cursor-pointer shadow-sm"
          placeholder={
            isRTL
              ? 'البحث في نظام التصميم (⌘K)...'
              : 'Search design system (⌘K)...'
          }
          onFocus={() => setOpen(true)}
          readOnly
        />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh] bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={() => setOpen(false)} />
          <div
            dir={isRTL ? 'rtl' : 'ltr'}
            className="relative w-full max-w-xl bg-[var(--ds-layer-02)] rounded-xl border border-[var(--ds-border-subtle)] shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-150"
          >
            <div className="flex items-center px-4 border-b border-[var(--ds-border-subtle)] h-14">
              <SearchIcon size={18} className="text-[var(--ds-icon-subtle)] shrink-0" />
              <input
                autoFocus
                type="text"
                className="flex-1 px-3.5 h-full bg-transparent outline-none text-sm text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-subtlest)]"
                placeholder={
                  isRTL
                    ? 'ابحث عن مكون أو مستند...'
                    : 'Search for a component or doc...'
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <kbd className="hidden md:inline-flex items-center gap-1 rounded-md border border-[var(--ds-border-subtle)] px-2 py-1 font-mono text-[10px] uppercase font-bold text-[var(--ds-text-subtlest)] bg-[var(--ds-layer-01)]">
                  ESC
                </kbd>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-[var(--ds-layer-01)] rounded-md transition-colors text-[var(--ds-icon-subtle)]"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {results.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setOpen(false);
                        setQuery('');
                      }}
                      className="flex flex-col p-3.5 rounded-lg border border-transparent hover:border-[var(--ds-border-subtle)] hover:bg-[var(--ds-layer-01)] transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold uppercase tracking-tight text-[var(--ds-text-primary)] group-hover:text-[var(--ds-text-brand)] transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--ds-text-subtlest)] bg-[var(--ds-layer-03)] px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--ds-text-subtle)] line-clamp-1">
                        {item.content}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : query ? (
                <div className="py-10 text-center flex flex-col items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[var(--ds-background-neutral-subtle)] flex items-center justify-center text-[var(--ds-icon-subtle)]">
                    <Command size={24} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-[var(--ds-text)]">
                      {isRTL ? 'لم يتم العثور على نتائج' : 'No results found'}
                    </p>
                    <p className="text-xs text-[var(--ds-text-subtlest)] font-medium">
                      {isRTL
                        ? 'حاول البحث عن شيء آخر...'
                        : 'Try searching for something else...'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-xs text-[var(--ds-text-subtlest)] font-black uppercase tracking-widest leading-loose">
                    {isRTL
                      ? 'ادخل كلمة البحث للعثور على النتائج...'
                      : 'Type something to search...'}
                  </p>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-[var(--ds-border-subtle)] bg-[var(--ds-layer-01)] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--ds-text-subtlest)]">
                  <kbd className="border border-[var(--ds-border-subtle)] px-1.5 py-0.5 rounded-md bg-[var(--ds-layer-02)] text-[var(--ds-text-primary)] shadow-sm">
                    ↵
                  </kbd>
                  <span>{isRTL ? 'للاختيار' : 'to select'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--ds-text-subtlest)]">
                  <kbd className="border border-[var(--ds-border-subtle)] px-1.5 py-0.5 rounded-md bg-[var(--ds-layer-02)] text-[var(--ds-text-primary)] shadow-sm">
                    ↑↓
                  </kbd>
                  <span>{isRTL ? 'للتنقل' : 'to navigate'}</span>
                </div>
              </div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--ds-text-brand)]">
                GateFlow Engine
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
