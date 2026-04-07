'use client';

import * as React from 'react';
import { PageHeader } from '@gateflow/components';
import { GalleryItem } from '@/components/gallery/GalleryItem';
import {
  Badge,
  Button,
  Card,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@gateflow/ui';
import {
  Sparkles,
  AreaChart,
  Layout,
  MessageSquare,
  ShieldCheck,
  Layers,
  MousePointer2,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Menu,
  Settings,
  User,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function TokenSystemMasterPage() {
  return (
    <div className="flex flex-col gap-24 pb-48">
      <PageHeader
        title="Token System Master Guide"
        subtitle="The unified source of truth for GateFlow's visual grammar. Every component, from AI surfaces to data tables, is governed by these semantic tokens."
        breadcrumbs={[
          { label: 'Documentation', href: '/' },
          { label: 'Foundations', href: '/foundations' },
          { label: 'Token System' },
        ]}
      />

      {/* ─── PROMPTING GUIDE (Top priority for user) ─────────────────── */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--ds-border-brand)]/20 bg-[var(--ds-background-brand-subtle)]/30 p-12">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles
            size={120}
            className="text-[var(--ds-background-brand-bold)]"
          />
        </div>

        <div className="flex flex-col gap-8 relative z-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--ds-text)]">
              AI Prompting Guide
            </h2>
            <p className="text-lg text-[var(--ds-text-subtle)] font-medium max-w-3xl">
              To achieve the best results with Cursor, Claude, or Antigravity,
              use these specific semantic keywords in your prompts. This ensures
              the AI uses our tokens instead of hardcoded values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white/50 dark:bg-black/20 border-white/20">
              <h3 className="font-black uppercase text-sm mb-4 flex gap-2 items-center text-[var(--ds-text)]">
                <MousePointer2 size={16} /> Standard Prompting
              </h3>
              <div className="bg-[#09090b] rounded-xl p-4 text-xs font-mono text-zinc-400">
                <p className="text-blue-400">
                  &quot;Build a card with a light grey border...&quot;
                </p>
                <p className="mt-2 text-zinc-500 italic">
                  {/* Bad: Leads to hardcoded Slate/Zinc colors. */}
                </p>
                <div className="h-px bg-white/10 my-4" />
                <p className="text-green-400">
                  &quot;Build a card using .ds-card-premium and
                  var(--ds-surface) background...&quot;
                </p>
                <p className="mt-2 text-zinc-500 italic">
                  {/* Good: Uses the design system grammar. */}
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-white/50 dark:bg-black/20 border-white/20">
              <h3 className="font-black uppercase text-sm mb-4 flex gap-2 items-center text-[var(--ds-text)]">
                <Sparkles size={16} /> AI & Premium Prompting
              </h3>
              <div className="bg-[#09090b] rounded-xl p-4 text-xs font-mono text-zinc-400">
                <p className="text-blue-400">
                  &quot;Make this sidebar look futuristic and purple...&quot;
                </p>
                <p className="mt-2 text-zinc-500 italic">
                  {/* Bad: Leads to inconsistent violet-500. */}
                </p>
                <div className="h-px bg-white/10 my-4" />
                <p className="text-green-400">
                  &quot;Apply the AI Surface tokens with a mesh gradient using
                  var(--gf-surface-mesh)...&quot;
                </p>
                <p className="mt-2 text-zinc-500 italic">
                  {/* Good: Invokes the premium satin dark mode. */}
                </p>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-black uppercase text-xs tracking-widest text-[var(--ds-text-subtle)]">
              Recommended System Prompt Addition:
            </h4>
            <pre className="bg-[#09090b] rounded-2xl p-6 text-xs text-blue-300 overflow-x-auto border border-white/10">
              {`"Always use @gateflow/tokens. Prefer var(--ds-*) for standard UI and var(--gf-*) for core foundations. 
Avoid hardcoded HSL/Tailwind colors. For dark mode, use the satin-charcoal surfaces (bg-page/subtle/default/raised/overlay). 
For AI, use Orchid accents and Mesh surfaces. Buttons should use rounded-[var(--ds-border-radius-200)]."`}
            </pre>
          </div>
        </div>
      </section>

      {/* ─── TOKEN CATEGORIES ────────────────────────────────────────── */}

      <GalleryItem
        title="AI Surfaces & Virtual Lab"
        description="Premium orchid-tinted surfaces for Artificial Intelligence. Uses mesh gradients and interactive glows."
        code={`<div className="p-space-400 rounded-[2.5rem] border border-[var(--ds-border-brand)]/20 bg-[var(--gf-color-ai-surface)] shadow-ai-glow">
  <div className="flex items-center gap-2 mb-4">
    <Sparkles className="text-[var(--gf-color-ai-accent)]" />
    <span className="font-black uppercase tracking-widest text-xs">GateAI System</span>
  </div>
  <p className="text-[var(--ds-text)]">AI-specific content using orchid accents.</p>
</div>`}
      >
        <div className="p-8 rounded-[2.5rem] border border-[var(--ds-border-brand)]/20 bg-[var(--gf-color-ai-surface)] shadow-2xl relative overflow-hidden group">
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: 'var(--gf-pattern-sentinel)',
              backgroundSize: '16px 16px',
            }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--gf-color-ai-accent)]/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Sparkles
                className="text-[var(--gf-color-ai-accent)] animate-pulse"
                size={24}
              />
              <span className="font-black uppercase tracking-widest text-[10px] text-[var(--ds-text)]">
                Virtual Laboratory
              </span>
            </div>
            <p className="text-sm font-medium text-[var(--ds-text-subtle)] leading-relaxed">
              Welcome to the predictive engine. All intelligence layers are
              governed by the Orchid palette to denote artificial intervention.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-[var(--gf-color-ai-accent)] text-white hover:opacity-90 border-none rounded-xl"
              >
                Generate Insights
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-[var(--gf-color-ai-accent)]/30 text-[var(--gf-color-ai-accent)] rounded-xl"
              >
                View Neural Map
              </Button>
            </div>
          </div>
        </div>
      </GalleryItem>

      <GalleryItem
        title="Analytics & Charts"
        description="The analytics palette is optimized for data clarity. Use chart-1 (Kimchi) for primary data tracks."
        code={`// Chart data using semantic tokens
const data = [
  { name: 'Jan', value: 400, color: 'var(--gf-color-chart-1)' },
  { name: 'Feb', value: 300, color: 'var(--gf-color-chart-2)' },
];

<div className="bg-[var(--ds-background-neutral-subtle)] p-6 rounded-2xl border border-[var(--ds-border-subtle)]">
  {/* Render Chart Here */}
</div>`}
      >
        <div className="w-full flex flex-col gap-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div
                  className="h-24 rounded-2xl shadow-sm"
                  style={{ backgroundColor: `var(--gf-color-chart-${i})` }}
                />
                <span className="text-[10px] font-black uppercase text-center opacity-60">
                  Chart {i}
                </span>
              </div>
            ))}
          </div>
          <div className="p-6 rounded-3xl border border-[var(--ds-border-subtle)] bg-[var(--ds-background-default)] shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-[var(--ds-text-subtle)]">
                  Total Scans Trend
                </span>
                <span className="text-2xl font-black text-[var(--ds-text)]">
                  +12.5%
                </span>
              </div>
              <AreaChart
                className="text-[var(--gf-color-chart-2)] opacity-30"
                size={32}
              />
            </div>
            {/* Mini trend visualization */}
            <div className="flex items-end gap-1 h-32">
              {[40, 60, 30, 90, 100, 70, 85, 45, 95, 110].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  className="flex-1 rounded-t-lg bg-gradient-to-t"
                  style={{
                    backgroundImage: `linear-gradient(to top, var(--gf-color-chart-1), var(--gf-color-chart-2))`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </GalleryItem>

      <GalleryItem
        title="Enterprise Data Tables"
        description="High-density tables use subpixel alignment and semantic surface tokens for header-page contrast."
        code={`<Table>
  <TableHeader className="bg-table-header">
    <TableRow>
      <TableHead>Resident Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="hover:bg-table-row-hover transition-colors">
      <TableCell className="font-bold text-ds-text">Ahmed Al-Sayed</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
      >
        <div className="w-full bg-[var(--ds-background-default)] rounded-2xl border border-[var(--ds-border-subtle)] overflow-hidden shadow-2xl">
          <Table>
            <TableHeader className="bg-[var(--ds-table-header-bg)] border-b border-[var(--ds-border-subtle)]">
              <TableRow>
                <TableHead className="w-[100px] font-black uppercase text-[10px] text-[var(--ds-text-subtle)]">
                  Status
                </TableHead>
                <TableHead className="font-black uppercase text-[10px] text-[var(--ds-text-subtle)]">
                  Subject
                </TableHead>
                <TableHead className="font-black uppercase text-[10px] text-[var(--ds-text-subtle)]">
                  Last Activity
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  status: 'success',
                  subject: 'Gate Access Restored',
                  time: '2 mins ago',
                },
                {
                  status: 'warning',
                  subject: 'Late Departure: Unit 402',
                  time: '14 mins ago',
                },
                {
                  status: 'info',
                  subject: 'Maintenance Ticket #4021',
                  time: '1 hour ago',
                },
              ].map(
                (
                  row: { status: string; subject: string; time: string },
                  i: number
                ) => (
                  <TableRow
                    key={i}
                    className="border-b border-[var(--ds-border-subtle)] last:border-0 hover:bg-[var(--ds-table-row-hover)] cursor-pointer group transition-all duration-300"
                  >
                    <TableCell>
                      <Badge
                        variant={
                          row.status as
                            | 'default'
                            | 'secondary'
                            | 'danger'
                            | 'outline'
                        }
                        className="uppercase text-[9px] font-black border-none rounded-md px-1.5 py-0"
                      >
                        {row.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="font-bold text-sm text-[var(--ds-text)] group-hover:text-[var(--ds-text-brand)] transition-colors">
                      {row.subject}
                    </TableCell>
                    <TableCell className="text-xs text-[var(--ds-text-subtle)] font-medium">
                      {row.time}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </GalleryItem>

      <GalleryItem
        title="Message Boxes & Status"
        description="Unified status trackers for Information, Success, Warning, and Danger. Uses semantic subtle backgrounds."
        code={`<Alert variant="destructive" className="bg-danger-subtle border-none">
  <AlertTriangle className="h-4 w-4 text-danger-bold" />
  <AlertTitle>Critical Error</AlertTitle>
  <AlertDescription>System breach detected at North Gate.</AlertDescription>
</Alert>`}
      >
        <div className="flex flex-col gap-4 w-full max-w-lg">
          <Alert className="bg-[var(--gf-color-success-subtle)] border-none shadow-sm rounded-xl">
            <CheckCircle2 className="h-4 w-4 text-[var(--gf-color-success)]" />
            <AlertTitle className="uppercase font-black text-xs text-[var(--ds-text)]">
              Operation Complete
            </AlertTitle>
            <AlertDescription className="text-xs text-[var(--ds-text-subtle)]">
              The resident pass has been successfully issued.
            </AlertDescription>
          </Alert>

          <Alert className="bg-[var(--gf-color-warning-subtle)] border-none shadow-sm rounded-xl">
            <AlertTriangle className="h-4 w-4 text-[var(--gf-color-warning)]" />
            <AlertTitle className="uppercase font-black text-xs text-[var(--ds-text)]">
              Delayed Sync
            </AlertTitle>
            <AlertDescription className="text-xs text-[var(--ds-text-subtle)]">
              Offline cache is waiting for network restoration.
            </AlertDescription>
          </Alert>

          <Alert className="bg-[var(--gf-color-danger-subtle)] border-none shadow-sm rounded-xl">
            <XCircle className="h-4 w-4 text-[var(--gf-color-danger)]" />
            <AlertTitle className="uppercase font-black text-xs text-[var(--ds-text)]">
              Unauthorized Access
            </AlertTitle>
            <AlertDescription className="text-xs text-[var(--ds-text-subtle)]">
              The attempt was logged and reported to authorities.
            </AlertDescription>
          </Alert>
        </div>
      </GalleryItem>

      <GalleryItem
        title="Layout: Sidebar & Navigation"
        description="The Left Side Menu uses Sidebar-BG and Item-Active tokens for a consistent multi-app feel."
        code={`<aside className="bg-sidebar w-64 border-r border-ds-border">
  <div className="bg-sidebar-active rounded-lg px-4 py-2">
    Active Link
  </div>
</aside>`}
      >
        <div className="flex h-[400px] w-full border border-[var(--ds-border-subtle)] rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Sidebar */}
          <aside className="w-56 bg-[var(--ds-sidebar-bg)] border-r border-[var(--ds-border-subtle)] flex flex-col p-4 gap-4">
            <div className="h-8 w-24 bg-[var(--ds-background-brand-bold)] rounded-lg mb-6 flex items-center justify-center">
              <span className="text-white font-black text-[10px] uppercase tracking-widest">
                GateFlow
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 px-3 py-2 bg-[var(--ds-sidebar-item-active)] rounded-xl text-[var(--ds-text-selected)] font-bold text-xs">
                <Layout size={14} /> Dashboard
              </div>
              {['Analytics', 'Residents', 'Sensors', 'Logs'].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--ds-background-neutral-hovered)] rounded-xl text-[var(--ds-text-subtle)] font-semibold text-xs cursor-pointer transition-colors"
                >
                  <MessageSquare size={14} className="opacity-50" /> {item}
                </div>
              ))}
            </div>
            <div className="mt-auto pt-4 border-t border-[var(--ds-border-subtle)]">
              <div className="flex items-center gap-2 px-3">
                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-blue-500 to-orchid-500" />
                <span className="text-[10px] font-bold text-[var(--ds-text)]">
                  Admin User
                </span>
              </div>
            </div>
          </aside>

          {/* Main Area */}
          <main className="flex-1 bg-[var(--ds-background-default)] flex flex-col">
            <header className="h-14 border-b border-[var(--ds-border-subtle)] flex items-center justify-between px-6 bg-[var(--ds-background-default)]/80 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <Menu size={18} className="text-[var(--ds-text-subtlest)]" />
                <div className="h-8 w-64 bg-[var(--ds-background-neutral-subtle)] rounded-xl flex items-center px-4 gap-2 border border-[var(--ds-border-subtle)]">
                  <Search
                    size={14}
                    className="text-[var(--ds-text-subtlest)]"
                  />
                  <span className="text-[10px] uppercase font-black tracking-widest text-[var(--ds-text-subtlest)]">
                    Quick Search
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-[var(--ds-text-subtle)]" />
                <div className="h-8 w-8 rounded-xl bg-[var(--ds-background-neutral-subtle)] border border-[var(--ds-border-subtle)] flex items-center justify-center">
                  <Settings
                    size={16}
                    className="text-[var(--ds-text-subtle)]"
                  />
                </div>
              </div>
            </header>
            <div className="p-8">
              <div className="h-full w-full border-2 border-dashed border-[var(--ds-border-subtle)] rounded-3xl flex items-center justify-center">
                <span className="text-xs font-black uppercase text-[var(--ds-text-subtlest)] opacity-50">
                  App Canvas
                </span>
              </div>
            </div>
          </main>
        </div>
      </GalleryItem>

      <GalleryItem
        title="Universal UI: Dropdowns & Modals"
        description="Standardizing the 'Raised' surface hierarchy for floating components. Always use high corner radii (rounded-xl or above) for premium depth."
        code={`<DropdownMenu>
  <DropdownMenuContent className="bg-ds-surface-raised rounded-xl shadow-xl border-ds-border">
    <DropdownMenuItem>Profile Settings</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
      >
        <div className="flex gap-8 items-center">
          {/* Dropdown Example */}
          <div className="p-4 bg-[var(--ds-background-default)] rounded-2xl shadow-2xl border border-[var(--ds-border-subtle)]">
            <div className="flex flex-col w-56">
              <div className="px-3 py-2 border-b border-[var(--ds-border-subtle)] mb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase text-[var(--ds-text-subtle)] tracking-wider">
                    Account Settings
                  </span>
                  <Settings size={14} className="opacity-30" />
                </div>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--ds-background-neutral-hovered)] rounded-xl text-xs font-bold text-[var(--ds-text)] transition-colors cursor-pointer group">
                <User
                  size={14}
                  className="text-[var(--ds-text-subtle)] group-hover:text-[var(--ds-text-brand)]"
                />
                View Profile
              </div>
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--ds-background-neutral-hovered)] rounded-xl text-xs font-bold text-[var(--ds-text)] transition-colors cursor-pointer group">
                <Settings
                  size={14}
                  className="text-[var(--ds-text-subtle)] group-hover:text-[var(--ds-text-brand)]"
                />
                Organization Info
                <Badge
                  variant="outline"
                  className="ml-auto rounded-full text-[8px] h-4"
                >
                  Pro
                </Badge>
              </div>
              <div className="h-px bg-[var(--ds-border-subtle)] my-2" />
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--gf-color-danger-subtle)] rounded-xl text-xs font-bold text-[var(--gf-color-danger)] transition-colors cursor-pointer group">
                <LogOut size={14} />
                Sign Out
              </div>
            </div>
          </div>

          {/* Popup Example */}
          <div className="relative group">
            <Button className="rounded-xl shadow-lg shadow-blue-500/20 px-6 font-bold uppercase tracking-widest text-[10px] bg-[var(--ds-background-brand-bold)] flex gap-2">
              Open Menu <ChevronDown size={14} />
            </Button>
            <div className="absolute top-12 left-0 w-64 bg-[var(--ds-background-default)] border border-[var(--ds-border-subtle)] rounded-2xl shadow-[var(--gf-shadow-xl)] p-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-2 space-y-1">
                <div className="rounded-xl px-4 py-2 hover:bg-[var(--ds-background-neutral-subtle)] text-xs font-bold text-[var(--ds-text)] flex items-center justify-between">
                  Analytics <ChevronRight size={12} className="opacity-30" />
                </div>
                <div className="rounded-xl px-4 py-2 hover:bg-[var(--ds-background-neutral-subtle)] text-xs font-bold text-[var(--ds-text)] flex items-center justify-between">
                  Permissions <ChevronRight size={12} className="opacity-30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </GalleryItem>

      <section className="bg-[var(--ds-background-neutral-subtle)] rounded-[3rem] p-16 flex flex-col gap-12 border border-[var(--ds-border-subtle)]">
        <div className="flex flex-col gap-4 text-center items-center">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-[var(--ds-text)]">
            Best UI/UX Refinement Checklist
          </h2>
          <p className="text-[var(--ds-text-subtle)] max-w-2xl font-medium">
            Achieve the GateFlow &apos;Signature Premium Look&apos; by following
            these constraints on every new feature.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Corner Radii',
              desc: 'Never use standard rounded-md. Prefer rounded-xl for small items, rounded-2xl for cards, and rounded-[3rem] for sections.',
              icon: Layers,
            },
            {
              title: 'Depth & Shadow',
              desc: 'Use var(--gf-shadow-lg) for floating items. Add var(--ds-glow-premium) on hover to communicate importance.',
              icon: ShieldCheck,
            },
            {
              title: 'Motion & Springs',
              desc: 'Transitions should be 300ms. Use the expressive easing token for smooth, cinematic component interactions.',
              icon: Zap,
            },
            {
              title: 'Typography Contrast',
              desc: 'Headings must be font-black and uppercase. Body text should use font-medium with increased leading (relaxed).',
              icon: MousePointer2,
            },
            {
              title: 'Satin Dark Mode',
              desc: 'Avoid grey-800. Always use the satin-charcoal hierarchy (12-22% lightness) for a deep, non-stark background.',
              icon: Sparkles,
            },
            {
              title: 'Logical Properties',
              desc: 'Ensure RTL support by using margin-inline and padding-inline instead of left/right values.',
              icon: Layout,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 p-8 rounded-3xl bg-[var(--ds-background-default)] border border-[var(--ds-border-subtle)] shadow-sm group"
            >
              <div className="h-12 w-12 rounded-xl bg-[var(--ds-background-neutral-subtle)] flex items-center justify-center text-[var(--ds-background-brand-bold)] group-hover:scale-110 transition-transform duration-500">
                <item.icon size={24} />
              </div>
              <h3 className="font-black uppercase tracking-tight text-[var(--ds-text)]">
                {item.title}
              </h3>
              <p className="text-xs text-[var(--ds-text-subtle)] leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
