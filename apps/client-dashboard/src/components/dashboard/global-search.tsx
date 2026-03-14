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
    <div className="relative w-full md:w-[300px] lg:w-[400px]">
      <Command className="border border-border/50 rounded-lg overflow-visible bg-transparent">
        <CommandInput
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
          className="h-9 outline-none border-none bg-secondary/50 focus:bg-secondary focus:ring-0 transition-colors w-full"
        />
        
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
          </div>
        )}
      </Command>
    </div>
  );
}
