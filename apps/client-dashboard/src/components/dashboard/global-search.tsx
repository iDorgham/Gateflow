'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Contact2,
  Building,
  QrCode,
  Shield,
  Loader2,
} from 'lucide-react';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@gate-access/ui';

export function GlobalSearch({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<{
    contacts: any[];
    units: any[];
    qrs: any[];
    gates: any[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="relative h-9 w-full justify-start rounded-lg bg-secondary/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-[300px] lg:w-[400px] border-border/50 hover:bg-secondary transition-colors"
        >
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <span className="hidden lg:inline-flex">Search workspace...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[calc(100vw-2rem)] sm:w-[300px] md:w-[400px] p-0 shadow-2xl rounded-xl border border-border/60"
        align="start"
        sideOffset={8}
      >
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-4 [&_[cmdk-item]_svg]:w-4">
          <CommandInput
            placeholder="Search contacts, units, QRs..."
            value={query}
            onValueChange={setQuery}
            autoFocus
          />
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
                        <Contact2 className="mr-2 h-4 w-4 text-blue-500" />
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
                        <Building className="mr-2 h-4 w-4 text-emerald-500" />
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
                        <QrCode className="mr-2 h-4 w-4 text-purple-500" />
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
                        <Shield className="mr-2 h-4 w-4 text-orange-500" />
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
        </Command>
      </PopoverContent>
    </Popover>
  );
}
