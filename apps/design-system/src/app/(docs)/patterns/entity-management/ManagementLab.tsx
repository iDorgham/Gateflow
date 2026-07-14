'use client';

import * as React from 'react';
import {
  Users,
  ShieldCheck,
  Clock,
  UserPlus,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Filter as FilterIcon,
  Download,
  LayoutGrid,
  List as ListIcon,
} from 'lucide-react';
import { cn } from '@gateflow/ui/utils';
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Tabs,
  TabsList,
  TabsTrigger,
} from '@gateflow/ui';
import { StatGrid, EntityCard, FilterBar } from '@gateflow/components';

const MOCK_RESIDENTS = [
  {
    id: '1',
    name: 'Sarah Al-Saud',
    role: 'Primary Owner',
    status: 'Active',
    statusVariant: 'success' as const,
    unit: 'Villa 42-A',
    joined: 'Jan 2024',
    phone: '+966 50 123 4567',
  },
  {
    id: '2',
    name: 'Faisal Mansour',
    role: 'Resident',
    status: 'Pending',
    statusVariant: 'warning' as const,
    unit: 'Apt 104',
    joined: 'Mar 2024',
    phone: '+966 55 987 6543',
  },
  {
    id: '3',
    name: 'Noora Ibrahim',
    role: 'Tenant',
    status: 'Active',
    statusVariant: 'success' as const,
    unit: 'Villa 12',
    joined: 'Dec 2023',
    phone: '+966 54 222 3333',
  },
  {
    id: '4',
    name: 'Ahmed Hassan',
    role: 'Staff',
    status: 'Suspended',
    statusVariant: 'danger' as const,
    unit: 'Maintenance B-2',
    joined: 'Feb 2024',
    phone: '+966 56 444 5555',
  },
];

export default function ManagementLab() {
  const [search, setSearch] = React.useState('');
  const [view, setView] = React.useState<'grid' | 'list'>('grid');

  const filteredResidents = MOCK_RESIDENTS.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.unit.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 p-1 rounded-[2.5rem] border border-[var(--ds-border-bold)] bg-[var(--ds-surface-sunken)] shadow-2xl overflow-hidden group">
      {/* Lab Header */}
      <div className="flex flex-col gap-6 p-8 bg-[var(--ds-surface-subtle)] border-b border-[var(--ds-border-bold)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-black uppercase tracking-tight text-[var(--ds-text-primary)]">
              Entity Management Lab
            </h3>
            <p className="text-sm font-bold text-[var(--ds-text-subtle)] opacity-70">
              Testing the &quot;Project List&quot; pattern with high-density
              components.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="bg-[var(--ds-background-brand-bold)] text-white h-9 px-4 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-[var(--ds-background-brand-bold)]/20"
            >
              <UserPlus size={14} className="mr-2" />
              Add Resident
            </Button>
          </div>
        </div>

        <StatGrid
          columns={4}
          stats={[
            {
              label: 'Total Residents',
              value: '1,284',
              icon: Users,
              variant: 'primary',
            },
            {
              label: 'Verified',
              value: '1,120',
              icon: ShieldCheck,
              variant: 'success',
            },
            {
              label: 'Pending Approval',
              value: '42',
              icon: Clock,
              variant: 'warning',
            },
            {
              label: 'Invited (30d)',
              value: '156',
              icon: UserPlus,
              variant: 'info',
            },
          ]}
        />
      </div>

      <div className="flex flex-col gap-6 p-8">
        {/* Filter Section */}
        <FilterBar
          searchValue={search}
          onSearchChange={setSearch}
          onClear={() => setSearch('')}
          placeholder="Search by name, unit, or phone..."
          filters={
            <Tabs
              value={view}
              onValueChange={(v) => setView(v as 'grid' | 'list')}
            >
              <TabsList className="bg-[var(--ds-background-neutral-subtle)] border border-[var(--ds-border-bold)] h-9 p-1">
                <TabsTrigger
                  value="grid"
                  className="h-7 px-3 text-[10px] font-black uppercase"
                >
                  <LayoutGrid size={14} className="mr-2" />
                  Grid
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="h-7 px-3 text-[10px] font-black uppercase"
                >
                  <ListIcon size={14} className="mr-2" />
                  List
                </TabsTrigger>
              </TabsList>
            </Tabs>
          }
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="subtle"
                size="sm"
                className="h-9 px-3 bg-[var(--ds-background-neutral-subtle)] border border-[var(--ds-border-bold)]"
              >
                <Download size={14} className="mr-2 opacity-60" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  Export
                </span>
              </Button>
              <Button
                variant="subtle"
                size="sm"
                className="h-9 w-9 p-0 bg-[var(--ds-background-neutral-subtle)] border border-[var(--ds-border-bold)]"
              >
                <FilterIcon size={14} className="opacity-60" />
              </Button>
            </div>
          }
        />

        {/* Results Section */}
        <div
          className={cn(
            'grid gap-4',
            view === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
              : 'grid-cols-1'
          )}
        >
          {filteredResidents.map((resident) => (
            <EntityCard
              key={resident.id}
              title={resident.name}
              subtitle={resident.role}
              status={resident.status}
              statusVariant={resident.statusVariant}
              icon={Users}
              meta={[
                { label: 'Unit', value: resident.unit },
                { label: 'Joined', value: resident.joined },
                { label: 'Phone', value: resident.phone },
              ]}
              actions={
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="subtle"
                      size="icon"
                      className="h-8 w-8 hover:bg-[var(--ds-background-selected)]"
                    >
                      <MoreVertical size={16} className="opacity-40" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="text-xs font-bold uppercase tracking-wider">
                      <Mail size={14} className="mr-2 opacity-60" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs font-bold uppercase tracking-wider">
                      <Phone size={14} className="mr-2 opacity-60" />
                      Call Resident
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-xs font-bold uppercase tracking-wider">
                      <MapPin size={14} className="mr-2 opacity-60" />
                      View Unit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            />
          ))}
        </div>

        {filteredResidents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-[var(--ds-surface-subtle)] rounded-3xl border-2 border-dashed border-[var(--ds-border-bold)]">
            <div className="p-4 rounded-full bg-[var(--ds-background-neutral-subtle)] text-[var(--ds-text-subtle)] mb-4">
              <Users size={32} strokeWidth={1} />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-[var(--ds-text-primary)] mb-1">
              No Residents Found
            </h4>
            <p className="text-xs font-bold text-[var(--ds-text-subtle)] opacity-60">
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
