'use client';

import * as React from 'react';
import { Search, Copy, Check, Palette, Sparkles, Layers, Type, Shield, Sliders } from 'lucide-react';
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

interface TokenItem {
  name: string;
  tier: 'Tier 1 Primitives' | 'Tier 2 Semantic' | 'Tier 3 Component';
  category: 'layers' | 'brand' | 'text' | 'borders' | 'status';
  description: string;
  lightValue: string;
  darkValue: string;
  type: 'color' | 'text' | 'border' | 'measure';
  previewColor?: string;
  previewBorder?: string;
}

const tokensCatalog: TokenItem[] = [
  // Layers & Surfaces
  {
    name: '--ds-layer-01',
    tier: 'Tier 2 Semantic',
    category: 'layers',
    description: 'Application canvas & background base level',
    lightValue: 'oklch(98.5% 0.005 250) · #f8f9fa',
    darkValue: 'oklch(8% 0.012 250) · #0b0d11',
    type: 'color',
  },
  {
    name: '--ds-layer-02',
    tier: 'Tier 2 Semantic',
    category: 'layers',
    description: 'Default card, table row, and container surface',
    lightValue: 'oklch(100% 0 0) · #ffffff',
    darkValue: 'oklch(12% 0.015 250) · #12151c',
    type: 'color',
  },
  {
    name: '--ds-layer-03',
    tier: 'Tier 2 Semantic',
    category: 'layers',
    description: 'Raised headers, sticky navbars, and elevated widgets',
    lightValue: 'oklch(100% 0 0) · #ffffff',
    darkValue: 'oklch(16% 0.018 250) · #191d26',
    type: 'color',
  },
  {
    name: '--ds-layer-04',
    tier: 'Tier 2 Semantic',
    category: 'layers',
    description: 'Modal overlays, dialogs, dropdowns, and flyout sheets',
    lightValue: 'oklch(100% 0 0) · #ffffff',
    darkValue: 'oklch(20% 0.020 250) · #212633',
    type: 'color',
  },

  // Brand & Accents
  {
    name: '--ds-color-primary',
    tier: 'Tier 2 Semantic',
    category: 'brand',
    description: 'Primary brand accent & default CTA fill (Kimchi Vermilion)',
    lightValue: 'oklch(62% 0.22 38) · #ed4b00',
    darkValue: 'oklch(62% 0.22 38) · #ed4b00',
    type: 'color',
  },
  {
    name: '--ds-color-primary-hover',
    tier: 'Tier 2 Semantic',
    category: 'brand',
    description: 'Interactive button hover and pressed highlight',
    lightValue: 'oklch(54% 0.20 38) · #c73800',
    darkValue: 'oklch(67% 0.21 38) · #ff6b2b',
    type: 'color',
  },
  {
    name: '--ds-color-primary-subtle',
    tier: 'Tier 2 Semantic',
    category: 'brand',
    description: 'Translucent active state and chip pill background',
    lightValue: 'oklch(96% 0.02 38) · rgba(237, 75, 0, 0.08)',
    darkValue: 'oklch(26% 0.12 38) · rgba(237, 75, 0, 0.18)',
    type: 'color',
  },
  {
    name: '--ds-color-ai-lab',
    tier: 'Tier 2 Semantic',
    category: 'brand',
    description: 'Virtual Lab & GateAI conversational accent (Orchid)',
    lightValue: 'oklch(58% 0.23 300) · #8b5cf6',
    darkValue: 'oklch(68% 0.22 300) · #a78bfa',
    type: 'color',
  },

  // Typography
  {
    name: '--ds-text-primary',
    tier: 'Tier 2 Semantic',
    category: 'text',
    description: 'Headlines, titles, and high-contrast primary body text',
    lightValue: 'oklch(12% 0.015 250) · Contrast 17.8:1',
    darkValue: 'oklch(98.5% 0.005 250) · Contrast 18.5:1',
    type: 'text',
  },
  {
    name: '--ds-text-subtle',
    tier: 'Tier 2 Semantic',
    category: 'text',
    description: 'Secondary descriptions, labels, and table metadata',
    lightValue: 'oklch(48% 0.022 250) · Contrast 7.6:1',
    darkValue: 'oklch(76% 0.018 250) · Contrast 7.1:1',
    type: 'text',
  },
  {
    name: '--ds-text-subtlest',
    tier: 'Tier 2 Semantic',
    category: 'text',
    description: 'Disabled indicators, placeholders, and subtle captions',
    lightValue: 'oklch(62% 0.020 250) · Contrast 4.6:1',
    darkValue: 'oklch(62% 0.020 250) · Contrast 4.8:1',
    type: 'text',
  },
  {
    name: '--ds-text-brand',
    tier: 'Tier 2 Semantic',
    category: 'text',
    description: 'Branded links, interactive highlights, and active items',
    lightValue: 'oklch(54% 0.20 38) · Contrast 5.3:1',
    darkValue: 'oklch(67% 0.21 38) · Contrast 6.4:1',
    type: 'text',
  },

  // Borders
  {
    name: '--ds-border-subtle',
    tier: 'Tier 2 Semantic',
    category: 'borders',
    description: 'Standard card borders, table dividers, and subtle lines',
    lightValue: 'oklch(92.5% 0.012 250) · Delicate Satin Slate',
    darkValue: 'rgba(255, 255, 255, 0.08) · Satin Rim Shader',
    type: 'border',
    previewBorder: '1px solid var(--ds-border-subtle)',
  },
  {
    name: '--ds-border-bold',
    tier: 'Tier 2 Semantic',
    category: 'borders',
    description: 'Active card outlines, grouped dividers, and inputs',
    lightValue: 'oklch(86.5% 0.015 250) · Defined Neutral',
    darkValue: 'rgba(255, 255, 255, 0.16) · Elevated Rim',
    type: 'border',
    previewBorder: '1px solid var(--ds-border-bold)',
  },
  {
    name: '--ds-border-focused',
    tier: 'Tier 2 Semantic',
    category: 'borders',
    description: 'Accessible keyboard focus ring & active field boundary',
    lightValue: 'oklch(62% 0.22 38) · Kimchi 500',
    darkValue: 'oklch(67% 0.21 38) · Kimchi 400',
    type: 'border',
    previewBorder: '2px solid var(--ds-border-focused)',
  },
  {
    name: '--ds-border-danger',
    tier: 'Tier 2 Semantic',
    category: 'borders',
    description: 'Validation error boundary and invalid input outline',
    lightValue: 'oklch(57% 0.23 25) · Ruby Crimson',
    darkValue: 'oklch(65% 0.22 25) · Ruby 400',
    type: 'border',
    previewBorder: '1px solid var(--ds-border-danger)',
  },

  // Status Colors
  {
    name: '--ds-color-success',
    tier: 'Tier 2 Semantic',
    category: 'status',
    description: 'Access granted, active shift, and verified pass badge',
    lightValue: 'oklch(58% 0.20 150) · #10b981 (Emerald)',
    darkValue: 'oklch(68% 0.18 150) · #34d399',
    type: 'color',
  },
  {
    name: '--ds-color-warning',
    tier: 'Tier 2 Semantic',
    category: 'status',
    description: 'Expiring visitor pass, maintenance notice, and guard alerts',
    lightValue: 'oklch(64% 0.18 80) · #f59e0b (Solar Amber)',
    darkValue: 'oklch(74% 0.16 80) · #fbbf24',
    type: 'color',
  },
  {
    name: '--ds-color-danger',
    tier: 'Tier 2 Semantic',
    category: 'status',
    description: 'Access denied, security breach, and emergency blacklist',
    lightValue: 'oklch(57% 0.23 25) · #ef4444 (Ruby Crimson)',
    darkValue: 'oklch(65% 0.22 25) · #f87171',
    type: 'color',
  },
  {
    name: '--ds-color-info',
    tier: 'Tier 2 Semantic',
    category: 'status',
    description: 'System announcements, telemetry stats, and info logs',
    lightValue: 'oklch(52% 0.23 250) · #0052cc (Electric Cobalt)',
    darkValue: 'oklch(65% 0.20 250) · #388bfd',
    type: 'color',
  },
];

export function TokenExplorer() {
  const [search, setSearch] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<string>('all');
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);
  const { addToast } = useToast();

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(`var(${token})`);
    setCopiedToken(token);
    addToast({
      title: 'CSS Token Copied',
      description: `var(${token}) copied to clipboard.`,
    });
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const categories = [
    { id: 'all', label: 'All Tokens', icon: Sliders },
    { id: 'layers', label: 'Layers & Surfaces', icon: Layers },
    { id: 'brand', label: 'Brand & Accents', icon: Sparkles },
    { id: 'text', label: 'Typography', icon: Type },
    { id: 'borders', label: 'Borders & Focus', icon: Shield },
    { id: 'status', label: 'Status & Badges', icon: Palette },
  ];

  const filteredTokens = tokensCatalog.filter((token) => {
    const matchesCategory = activeTab === 'all' || token.category === activeTab;
    const matchesSearch =
      token.name.toLowerCase().includes(search.toLowerCase()) ||
      token.description.toLowerCase().includes(search.toLowerCase()) ||
      token.lightValue.toLowerCase().includes(search.toLowerCase()) ||
      token.darkValue.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Search & Filter Header */}
      <div className="flex flex-col gap-4 p-4 rounded-xl bg-[var(--ds-layer-02)] border border-[var(--ds-border-subtle)] shadow-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 border',
                  isActive
                    ? 'bg-[var(--ds-background-brand-subtle)] text-[var(--ds-text-brand)] font-bold border-[var(--ds-border-brand)] shadow-sm'
                    : 'text-[var(--ds-text-subtle)] border-transparent hover:text-[var(--ds-text-primary)] hover:bg-[var(--ds-layer-01)] hover:border-[var(--ds-border-subtle)]'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[var(--ds-border-subtle)]">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ds-text-subtlest)] pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tokens by name, CSS variable, or hex value..."
              className="!pl-11 h-11 text-sm rounded-lg bg-[var(--ds-layer-01)] border-[var(--ds-border-subtle)] placeholder:text-[var(--ds-text-subtlest)] focus:border-[var(--ds-border-brand)]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[var(--ds-text-subtle)] self-end sm:self-center">
            <span className="w-2 h-2 rounded-full bg-[var(--ds-color-success)]" />
            <span>Showing {filteredTokens.length} tokens</span>
          </div>
        </div>
      </div>

      {/* Token Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTokens.map((token) => {
          const isCopied = copiedToken === token.name;

          return (
            <Card
              key={token.name}
              className="group p-5 bg-[var(--ds-layer-02)] border border-[var(--ds-border-subtle)] hover:border-[var(--ds-border-bold)] rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              {/* Card Header & Preview */}
              <div className="flex items-start justify-between gap-4">
                {/* Visual Swatch */}
                <div className="shrink-0 flex items-center justify-center">
                  {token.type === 'color' && (
                    <div
                      className="w-12 h-12 rounded-lg border border-[var(--ds-border-subtle)] shadow-inner transition-transform group-hover:scale-105"
                      style={{ backgroundColor: `var(${token.name})` }}
                    />
                  )}

                  {token.type === 'text' && (
                    <div
                      className="w-12 h-12 rounded-xl border border-[var(--ds-border-subtle)] bg-[var(--ds-layer-01)] flex items-center justify-center font-bold text-base shadow-inner group-hover:scale-105 transition-transform"
                      style={{ color: `var(${token.name})` }}
                    >
                      Aa
                    </div>
                  )}

                  {token.type === 'border' && (
                    <div
                      className="w-12 h-12 rounded-xl bg-[var(--ds-layer-01)] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform"
                      style={{ border: token.previewBorder || `1px solid var(${token.name})` }}
                    >
                      <div className="w-4 h-4 rounded-md bg-[var(--ds-text-brand)]/20" />
                    </div>
                  )}
                </div>

                {/* Token Details */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono font-bold text-[var(--ds-text-primary)] group-hover:text-[var(--ds-text-brand)] transition-colors truncate">
                      {token.name}
                    </code>
                    <Badge variant="outline" tone="neutral" className="text-[10px] px-1.5 py-0">
                      {token.tier.replace('Tier ', 'T')}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--ds-text-subtle)] leading-relaxed">
                    {token.description}
                  </p>
                </div>

                {/* Copy Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(token.name)}
                  className={cn(
                    'h-8 px-2.5 rounded-lg text-xs gap-1.5 shrink-0 border-[var(--ds-border-subtle)] transition-all',
                    isCopied
                      ? 'bg-[var(--ds-color-success)] text-white border-transparent'
                      : 'hover:border-[var(--ds-border-brand)] hover:text-[var(--ds-text-brand)]'
                  )}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Light & Dark Spec Strip */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--ds-border-subtle)] text-[11px]">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-[var(--ds-text-subtlest)]">
                    Light Mode
                  </span>
                  <span className="font-mono text-[var(--ds-text-subtle)] truncate">
                    {token.lightValue}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-[var(--ds-text-subtlest)]">
                    Dark Mode
                  </span>
                  <span className="font-mono text-[var(--ds-text-subtle)] truncate">
                    {token.darkValue}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTokens.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 rounded-2xl border border-dashed border-[var(--ds-border-subtle)] bg-[var(--ds-layer-02)] text-center gap-3">
          <Palette className="w-8 h-8 text-[var(--ds-text-subtlest)]" />
          <p className="text-sm font-semibold text-[var(--ds-text-primary)]">
            No tokens matching &quot;{search}&quot;
          </p>
          <p className="text-xs text-[var(--ds-text-subtle)]">
            Try searching for another token name, hex code, or semantic layer.
          </p>
        </div>
      )}
    </div>
  );
}
