'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Contact2, Building, QrCode, Shield, Loader2, X } from 'lucide-react';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  cn,
} from '@gateflow/ui';

interface SearchContact {
  id: string;
  name: string;
  email: string | null;
}

interface SearchUnit {
  id: string;
  identifier: string;
  type: string;
}

interface SearchQR {
  id: string;
  code: string;
  guestName: string;
  status: string;
}

interface SearchGate {
  id: string;
  name: string;
  status: string;
}

interface SearchResults {
  contacts: SearchContact[];
  units: SearchUnit[];
  qrs: SearchQR[];
  gates: SearchGate[];
}

export function GlobalSearch({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const clearQuery = () => {
    setQuery('');
    setResults(null);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setResults(null);
        });
    } else {
      setResults(null);
      setLoading(false);
    }
  }, [debouncedQuery]);

  const handleSelect = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <div className="relative w-full">
      <Command
        className={cn(
          'rounded-lg overflow-visible bg-transparent',
          '[&_[cmdk-input-wrapper]]:h-8 [&_[cmdk-input-wrapper]]:border',
          '[&_[cmdk-input-wrapper]]:border-[var(--ds-border-selected)]/10',
          '[&_[cmdk-input-wrapper]]:bg-[var(--ds-background-neutral)]',
          'dark:[&_[cmdk-input-wrapper]]:bg-[var(--ds-background-neutral)]',
          '[&_[cmdk-input-wrapper]]:rounded-lg [&_[cmdk-input-wrapper]]:shadow-sm',
          'hover:[&_[cmdk-input-wrapper]]:bg-[var(--ds-background-neutral-hovered)]',
          'dark:hover:[&_[cmdk-input-wrapper]]:bg-[var(--ds-background-neutral-hovered)]',
          'focus-within:[&_[cmdk-input-wrapper]]:bg-[var(--ds-background-input)]',
          'dark:focus-within:[&_[cmdk-input-wrapper]]:bg-[var(--ds-background-input)]',
          'focus-within:[&_[cmdk-input-wrapper]]:border-[var(--ds-border-focused)]',
          'dark:focus-within:[&_[cmdk-input-wrapper]]:border-[var(--ds-border-focused)]',
          '[&_[cmdk-input-wrapper]]:transition-colors'
        )}
      >
        <div className="relative">
          <CommandInput
            ref={inputRef}
            placeholder="Search workspace..."
            value={query}
            onValueChange={(v) => {
              setQuery(v);
              if (!open && v.trim()) setOpen(true);
            }}
            onFocus={() => {
              if (query.trim()) setOpen(true);
            }}
            onBlur={() => {
              // small delay so clicks on the dropdown list register
              setTimeout(() => setOpen(false), 200);
            }}
            className="h-8 py-0 pe-10 outline-none border-none bg-transparent focus:bg-transparent dark:focus:bg-transparent focus:ring-0 w-full"
          />

          <div className="pointer-events-none absolute inset-y-0 end-3 flex items-center">
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onMouseDown={(e) => e.preventDefault()}
                onClick={clearQuery}
                className="pointer-events-auto rounded-md p-0.5 text-muted-foreground/70 transition-colors hover:bg-[var(--ds-background-neutral-hovered)] hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="hidden select-none items-center gap-0.5 rounded border border-[var(--ds-border-selected)]/20 bg-[var(--ds-surface-raised)] px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground/70 sm:inline-flex">
                <span className="text-[11px] leading-none">⌘</span>K
              </kbd>
            )}
          </div>
        </div>

        {open && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-popover rounded-xl border border-border/60 shadow-2xl overflow-hidden">
            <CommandList className="max-h-[50vh] sm:max-h-[400px]">
              <CommandEmpty>
                {loading ? (
                  <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </div>
                ) : debouncedQuery.trim().length < 2 ? (
                  'Type at least 2 characters to search.'
                ) : (
                  'No results found.'
                )}
              </CommandEmpty>

              {!loading && results && (
                <>
                  {results.contacts?.length > 0 && (
                    <CommandGroup heading="Contacts">
                      {results.contacts.map((c) => (
                        <CommandItem
                          key={c.id}
                          onSelect={() =>
                            handleSelect(
                              `/${locale}/dashboard/residents/contacts?search=${encodeURIComponent(c.name)}`
                            )
                          }
                        >
                          <Contact2 className="mr-2 h-4 w-4 text-info" />
                          <span>{c.name}</span>
                          {c.email && (
                            <span className="ml-2 text-xs text-muted-foreground truncate max-w-[150px]">
                              — {c.email}
                            </span>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  {results.units?.length > 0 && (
                    <CommandGroup heading="Units">
                      {results.units.map((u) => (
                        <CommandItem
                          key={u.id}
                          onSelect={() =>
                            handleSelect(
                              `/${locale}/dashboard/residents/units?search=${encodeURIComponent(u.identifier)}`
                            )
                          }
                        >
                          <Building className="mr-2 h-4 w-4 text-success" />
                          <span>Unit {u.identifier}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  {results.qrs?.length > 0 && (
                    <CommandGroup heading="QR Codes">
                      {results.qrs.map((q) => (
                        <CommandItem
                          key={q.id}
                          onSelect={() =>
                            handleSelect(
                              `/${locale}/dashboard/qrcodes?q=${encodeURIComponent(q.code)}`
                            )
                          }
                        >
                          <QrCode className="mr-2 h-4 w-4 text-[var(--gf-color-discovery)]" />
                          <span>{q.guestName || q.code}</span>
                          <span className="ml-2 text-xs text-muted-foreground capitalize">
                            — {q.status.toLowerCase()}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  {results.gates?.length > 0 && (
                    <CommandGroup heading="Gates">
                      {results.gates.map((g) => (
                        <CommandItem
                          key={g.id}
                          onSelect={() =>
                            handleSelect(`/${locale}/dashboard/gates`)
                          }
                        >
                          <Shield className="mr-2 h-4 w-4 text-warning" />
                          <span>{g.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground capitalize">
                            — {g.status.toLowerCase()}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )}
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  );
}
