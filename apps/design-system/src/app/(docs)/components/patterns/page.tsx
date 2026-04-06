'use client';

import * as React from 'react';
import { PageHeader, EntityCard, FilterBar } from '@gateflow/components';
import {
  Button,
  Badge,
  Card,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@gateflow/ui';
import { GalleryItem } from '../../../../components/gallery/GalleryItem';
import {
  Building2,
  Users,
  ShieldCheck,
  MoreHorizontal,
  Search,
  Plus,
  ArrowDownRight,
  TrendingUp,
  Activity,
  UserCheck,
} from 'lucide-react';

export default function PatternsPage() {
  return (
    <div className="flex flex-col gap-12">
      <PageHeader
        title="Patterns"
        subtitle="High-level compositions from @gateflow/components. Used to build consistent product interfaces efficiently."
        breadcrumbs={[
          { label: 'Documentation', href: '/' },
          { label: 'Components', href: '/components' },
          { label: 'Patterns' },
        ]}
      />

      <section className="flex flex-col gap-6">
        <GalleryItem
          title="PageHeader"
          description="The standard header for top-level pages. Includes breadcrumbs, title, subtitle, and primary actions."
          packageName="@gateflow/components"
          code={`import { PageHeader } from '@gateflow/components';
import { Button, Badge } from '@gateflow/ui';
import { Plus } from 'lucide-react';

export default function Demo() {
  return (
    <PageHeader
      title="Compound Management"
      subtitle="Configure gate policies, resident permits, and security patrol shifts."
      breadcrumbs={[
        { label: 'Admin', href: '#' },
        { label: 'Infrastructure', href: '#' },
        { label: 'Compounds' }
      ]}
    >
       <div className="flex items-center gap-3">
         <Badge variant="outline">Live: 42 Gates</Badge>
         <Button className="h-10 px-4 rounded-xl font-black uppercase tracking-tight">
           <Plus size={16} className="mr-2" /> Add Compound
         </Button>
       </div>
    </PageHeader>
  );
}`}
        >
          <div className="w-full bg-white border border-[var(--ds-border-subtle)] rounded-3xl p-8 shadow-sm">
            <PageHeader
              title="Compound Management"
              subtitle="Configure gate policies, resident permits, and security patrol shifts."
              breadcrumbs={[
                { label: 'Admin', href: '#' },
                { label: 'Infrastructure', href: '#' },
                { label: 'Compounds' },
              ]}
            >
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="rounded-lg uppercase font-black tracking-tight text-[9px] border-[var(--ds-border-subtle)]"
                >
                  Live: 42 Gates
                </Badge>
                <Button className="h-10 px-6 rounded-xl font-black uppercase tracking-tight bg-[var(--ds-background-brand-bold)]">
                  <Plus size={14} className="mr-2" /> Add Compound
                </Button>
              </div>
            </PageHeader>
          </div>
        </GalleryItem>

        <GalleryItem
          title="EntityCard"
          description="A versatile card for displaying primary objects like compounds, residents, or devices. Supports complex status and metadata."
          packageName="@gateflow/components"
          code={`import { EntityCard } from '@gateflow/components';
import { Building2, ShieldCheck, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback, Button } from '@gateflow/ui';

export default function Demo() {
  return (
    <EntityCard
      title="Zayed City South"
      subtitle="Premium Residential Compound"
      type="Compound"
      status="Active"
      icon={<Building2 />}
      avatar={<Avatar><AvatarImage src="..." /><AvatarFallback>ZC</AvatarFallback></Avatar>}
      actions={<Button size="icon" variant="ghost"><MoreHorizontal /></Button>}
      metadata={[
        { label: 'Guard Count', value: '12' },
        { label: 'Total Gates', value: '4' },
        { label: 'Security Level', value: <ShieldCheck size={14} className="text-green-500" /> }
      ]}
    />
  );
}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <EntityCard
              title="Zayed City North"
              subtitle="Phase 01 | Operations"
              type="Compound"
              status="Live"
              icon={<Building2 size={16} />}
              avatar={
                <Avatar className="rounded-xl">
                  <AvatarImage src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=128&q=80" />
                  <AvatarFallback>ZN</AvatarFallback>
                </Avatar>
              }
              actions={
                <Button size="icon-sm" variant="ghost" className="rounded-lg">
                  <MoreHorizontal size={14} />
                </Button>
              }
              metadata={[
                { label: 'Guards', value: '8' },
                { label: 'Gates', value: '3' },
                {
                  label: 'Priority',
                  value: <ShieldCheck size={14} className="text-green-500" />,
                },
              ]}
              className="rounded-3xl border-[var(--ds-border-subtle)] bg-white shadow-lg p-6"
            />
            <EntityCard
              title="Ahmadi Residential"
              subtitle="Maintenance Required"
              type="Zone"
              status="Warning"
              icon={<Users size={16} />}
              avatar={
                <Avatar className="rounded-xl">
                  <AvatarImage src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&q=80" />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
              }
              actions={
                <Button size="icon-sm" variant="ghost" className="rounded-lg">
                  <MoreHorizontal size={14} />
                </Button>
              }
              metadata={[
                { label: 'Residents', value: '42k' },
                { label: 'Uptime', value: '98%' },
                {
                  label: 'Health',
                  value: <span className="text-amber-500">76/100</span>,
                },
              ]}
              className="rounded-3xl border-[var(--ds-border-subtle)] bg-white shadow-lg p-6 border-l-4 border-l-amber-500"
            />
          </div>
        </GalleryItem>

        <GalleryItem
          title="FilterBar"
          description="A composition of search inputs, selects, and tabs for filtering large datasets. Common in dashboards."
          packageName="@gateflow/components"
          code={`import { FilterBar } from '@gateflow/components';
import { Search, Plus } from 'lucide-react';
import { Button, Input, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Tabs, TabsList, TabsTrigger } from '@gateflow/ui';

export default function Demo() {
  return (
    <FilterBar
      search={<div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search residents..." className="pl-9" /></div>}
      tabs={<Tabs defaultValue="all"><TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="active">Active</TabsTrigger></TabsList></Tabs>}
      actions={<Button><Plus size={16} className="mr-2" /> Invite</Button>}
      filters={<Select><SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger><SelectContent><SelectItem value="admin">Admin</SelectItem></SelectContent></Select>}
    />
  );
}`}
        >
          <div className="w-full bg-white border border-[var(--ds-border-subtle)] rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            <FilterBar
              search={
                <div className="relative group w-72">
                  <Search
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ds-text-subtlest)]"
                  />
                  <Input
                    placeholder="Search residents..."
                    className="pl-11 rounded-xl h-11 bg-[var(--ds-background-neutral-subtle)] border-none"
                  />
                </div>
              }
              tabs={
                <Tabs defaultValue="all">
                  <TabsList className="bg-[var(--ds-background-neutral-subtle)] p-1 rounded-xl h-11 border border-[var(--ds-border-subtle)]">
                    <TabsTrigger
                      value="all"
                      className="rounded-lg text-[10px] font-black uppercase tracking-tight px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      All Records
                    </TabsTrigger>
                    <TabsTrigger
                      value="active"
                      className="rounded-lg text-[10px] font-black uppercase tracking-tight px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      Permitted
                    </TabsTrigger>
                    <TabsTrigger
                      value="blocked"
                      className="rounded-lg text-[10px] font-black uppercase tracking-tight px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm text-red-500"
                    >
                      Blocked
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              }
              filters={
                <div className="flex gap-2">
                  <Select defaultValue="all-guards">
                    <SelectTrigger className="w-36 rounded-xl h-11 border-[var(--ds-border-subtle)]">
                      <SelectValue placeholder="Shift" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-[var(--ds-border-subtle)]">
                      <SelectItem value="morning" className="rounded-lg">
                        Morning Shift
                      </SelectItem>
                      <SelectItem value="night" className="rounded-lg">
                        Night Shift
                      </SelectItem>
                      <SelectItem value="all-guards" className="rounded-lg">
                        All Records
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              }
              actions={
                <Button className="rounded-xl h-11 px-6 font-black uppercase tracking-tight bg-[var(--ds-background-brand-bold)]">
                  <Plus size={14} className="mr-2" /> New Permitee
                </Button>
              }
            />
          </div>
        </GalleryItem>

        <GalleryItem
          title="StatGrid"
          description="A balanced layout for displaying key performance indicators (KPIs) with trend indicators and status colors."
          packageName="@gateflow/components"
          code={`import { StatGrid } from '@gateflow/components';
import { TrendingUp, Activity, UserCheck } from 'lucide-react';

export default function Demo() {
  return (
    <StatGrid
      stats={[
        { label: 'Total Scans', value: '14,2k', trend: '+12%', status: 'success', icon: <Activity /> },
        { label: 'New Residents', value: '482', trend: '+5%', status: 'info', icon: <UserCheck /> },
        { label: 'Blocked Entry', value: '12', trend: '-2%', status: 'danger', icon: <ShieldCheck /> }
      ]}
    />
  );
}`}
        >
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="rounded-3xl p-6 border-[var(--ds-border-subtle)] bg-white shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                  <Activity size={20} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-green-500 bg-green-500/5 px-2 py-1 rounded-lg">
                  <TrendingUp size={10} /> +12.4%
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-[var(--ds-text)]">
                  14,2k
                </span>
                <span className="text-[10px] uppercase font-black tracking-widest text-[var(--ds-text-subtlest)]">
                  Total Live Scans
                </span>
              </div>
            </Card>
            <Card className="rounded-3xl p-6 border-[var(--ds-border-subtle)] bg-white shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <UserCheck size={20} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-blue-500 bg-blue-500/5 px-2 py-1 rounded-lg">
                  <TrendingUp size={10} /> +5.2%
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-[var(--ds-text)]">
                  482
                </span>
                <span className="text-[10px] uppercase font-black tracking-widest text-[var(--ds-text-subtlest)]">
                  New Registrations
                </span>
              </div>
            </Card>
            <Card className="rounded-3xl p-6 border-[var(--ds-border-subtle)] border-l-4 border-l-red-500 bg-white shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-red-500 bg-red-500/5 px-2 py-1 rounded-lg">
                  <ArrowDownRight size={10} /> -2.1%
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-[var(--ds-text)]">
                  12
                </span>
                <span className="text-[10px] uppercase font-black tracking-widest text-[var(--ds-text-subtlest)]">
                  Security Anomalies
                </span>
              </div>
            </Card>
          </div>
        </GalleryItem>
      </section>
    </div>
  );
}
