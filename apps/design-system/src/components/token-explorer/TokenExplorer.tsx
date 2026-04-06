'use client';

import * as React from 'react';
import { Search, Copy, Check, Palette, Settings2 } from 'lucide-react';
import {
  cn,
  Button,
  Input,
  Card,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  Badge,
  useToast,
} from '@gateflow/ui';

// Mock token data based on gateflow/tokens system
const tokenGroups = [
  {
    name: 'Background',
    tokens: [
      {
        name: '--ds-background',
        value: 'var(--ds-background)',
        desc: 'Surface/Canvas background.',
      },
      {
        name: '--ds-background-neutral-subtle',
        value: 'var(--ds-background-neutral-subtle)',
        desc: 'Secondary/Sidebar background.',
      },
      {
        name: '--ds-background-brand-bold',
        value: 'var(--ds-background-brand-bold)',
        desc: 'Primary brand action background.',
      },
      {
        name: '--ds-background-selected',
        value: 'var(--ds-background-selected)',
        desc: 'Selection/Active state surface.',
      },
    ],
  },
  {
    name: 'Text',
    tokens: [
      {
        name: '--ds-text',
        value: 'var(--ds-text)',
        desc: 'Primary body text.',
      },
      {
        name: '--ds-text-subtle',
        value: 'var(--ds-text-subtle)',
        desc: 'Secondary/Support text.',
      },
      {
        name: '--ds-text-brand',
        value: 'var(--ds-text-brand)',
        desc: 'Brand-colored text.',
      },
      {
        name: '--ds-text-selected',
        value: 'var(--ds-text-selected)',
        desc: 'Text color on selected backgrounds.',
      },
    ],
  },
  {
    name: 'Border',
    tokens: [
      {
        name: '--ds-border',
        value: 'var(--ds-border)',
        desc: 'Standard structure divider.',
      },
      {
        name: '--ds-border-subtle',
        value: 'var(--ds-border-subtle)',
        desc: 'Lightest structural divider.',
      },
      {
        name: '--ds-border-brand',
        value: 'var(--ds-border-brand)',
        desc: 'Brand-focused accent border.',
      },
      {
        name: '--ds-border-focused',
        value: 'var(--ds-border-focused)',
        desc: 'Focus state/Ring color.',
      },
    ],
  },
  {
    name: 'Status',
    tokens: [
      {
        name: '--ds-text-information',
        value: 'var(--ds-text-information)',
        desc: 'Informational message text.',
      },
      {
        name: '--ds-background-information-subtle',
        value: 'var(--ds-background-information-subtle)',
        desc: 'Informational banner surface.',
      },
      {
        name: '--ds-text-success',
        value: 'var(--ds-text-success)',
        desc: 'Success message text.',
      },
      {
        name: '--ds-text-danger',
        value: 'var(--ds-text-danger)',
        desc: 'Critical/Error message text.',
      },
    ],
  },
];

export function TokenExplorer() {
  const [search, setSearch] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('Background');
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    toast({
      title: 'Token Copied',
      description: `${token} has been copied to your clipboard.`,
      duration: 2000,
    });
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const filteredTokens =
    tokenGroups
      .find((g) => g.name === activeTab)
      ?.tokens.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.desc.toLowerCase().includes(search.toLowerCase())
      ) || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-[var(--ds-background-neutral-subtle)] p-1 rounded-xl h-10">
            {tokenGroups.map((group) => (
              <TabsTrigger
                key={group.name}
                value={group.name}
                className="rounded-lg px-4 text-xs font-black uppercase tracking-tight data-[state=active]:bg-white data-[state=active]:text-[var(--ds-text-selected)] data-[state=active]:shadow-sm"
              >
                {group.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative group w-full md:w-72">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ds-icon-subtle)]"
          />
          <Input
            placeholder="Search tokens..."
            className="pl-9 h-10 rounded-xl border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)] text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTokens.map((token) => (
          <Card
            key={token.name}
            className="border-[var(--ds-border-subtle)] bg-[var(--ds-background-neutral-subtle)] hover:border-[var(--ds-border-brand)] transition-all group overflow-hidden"
          >
            <CardContent className="p-0 flex items-stretch h-32">
              <div className="w-32 shrink-0 border-r border-[var(--ds-border-subtle)] flex items-center justify-center bg-white dark:bg-[#09090b] relative overflow-hidden">
                {/* Light/Dark side-by-side preview */}
                <div className="absolute inset-0 flex">
                  <div className="flex-1 bg-white flex items-center justify-center">
                    <div
                      className={cn(
                        'h-12 w-12 rounded-xl border border-[var(--ds-border-subtle)] shadow-sm',
                        token.name.includes('text')
                          ? 'bg-transparent flex items-center justify-center font-bold text-lg'
                          : 'bg-current'
                      )}
                      style={{
                        color: `var(${token.name})`,
                        backgroundColor: token.name.includes('background')
                          ? `var(${token.name})`
                          : undefined,
                      }}
                    >
                      {token.name.includes('text') ? 'Aa' : ''}
                    </div>
                  </div>
                  <div className="flex-1 bg-[#09090b] flex items-center justify-center border-l border-[var(--ds-border-subtle)]">
                    <div
                      className={cn(
                        'h-12 w-12 rounded-xl border border-[var(--ds-border-subtle)] shadow-sm',
                        token.name.includes('text')
                          ? 'bg-transparent flex items-center justify-center font-bold text-lg'
                          : 'bg-current'
                      )}
                      style={{
                        color: `var(${token.name})`,
                        backgroundColor: token.name.includes('background')
                          ? `var(${token.name})`
                          : undefined,
                      }}
                    >
                      {token.name.includes('text') ? 'Aa' : ''}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 flex gap-1">
                  <Badge
                    variant="outline"
                    className="text-[8px] px-1 py-0 bg-white/80 text-black border-none uppercase font-black"
                  >
                    Light
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[8px] px-1 py-0 bg-black/80 text-white border-none uppercase font-black"
                  >
                    Dark
                  </Badge>
                </div>
              </div>

              <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-sm font-mono font-bold text-[var(--ds-text)] truncate">
                      {token.name}
                    </code>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => handleCopy(token.name)}
                      >
                        {copiedToken === token.name ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-7 w-7 rounded-lg"
                      >
                        <Settings2 size={14} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-[10px] uppercase font-black tracking-tight text-[var(--ds-text-subtlest)] leading-none">
                    {token.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-mono px-2 py-0 h-5 bg-[var(--ds-background-neutral-pressed)] text-[var(--ds-text-subtle)] border-none"
                  >
                    {token.value}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[9px] font-black uppercase px-2 py-0 h-5 border-[var(--ds-border-subtle)] text-[var(--ds-text-subtlest)]"
                  >
                    Semantic
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTokens.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-[var(--ds-background-neutral-subtle)] border-2 border-dashed border-[var(--ds-border-subtle)] rounded-3xl">
          <Palette
            className="text-[var(--ds-icon-subtlest)] mb-4"
            size={48}
            strokeWidth={1}
          />
          <p className="text-sm font-bold text-[var(--ds-text-subtle)]">
            No tokens found matching &quot;{search}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
