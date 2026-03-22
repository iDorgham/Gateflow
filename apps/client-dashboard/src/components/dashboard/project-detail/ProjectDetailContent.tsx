'use client';

import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@gate-access/ui';
import Link from 'next/link';
import { Users, DoorOpen, QrCode, ScrollText, Shield, Search, Building, User, ArrowRight } from 'lucide-react';
import { ProjectDetailActions, type ProjectDetailActionsRef } from './ProjectDetailActions';
import { GatesCardWithEdit } from './GatesCardWithEdit';
import { useState } from 'react';
import { Input } from '@gate-access/ui';
import { cn } from '@/lib/utils';

const SCAN_STATUS_STYLES: Record<string, string> = {
  SUCCESS: 'bg-[#E3FCEF] text-[#006644] dark:bg-[#E3FCEF]/10 dark:text-[#E3FCEF] border-none',
  FAILED: 'bg-[#FFEBE6] text-[#BF2600] dark:bg-[#FFEBE6]/10 dark:text-[#FF8F73] border-none',
  EXPIRED: 'bg-[#FFF0B3] text-[#172B4D] dark:bg-[#FFF0B3]/10 dark:text-[#FFF0B3] border-none',
  MAX_USES_REACHED: 'bg-[#DEEBFF] text-[#0747A6] dark:bg-[#DEEBFF]/10 dark:text-[#DEEBFF] border-none',
  INACTIVE: 'bg-[#F4F5F7] text-[#42526E] dark:bg-[#F4F5F7]/10 dark:text-[#A5ADBA] border-none',
  DENIED: 'bg-[#FFEBE6] text-[#BF2600] dark:bg-[#FFEBE6]/10 dark:text-[#FF8F73] border-none',
};

interface Gate {
  id: string;
  name: string;
  location?: string | null;
  isActive?: boolean;
  lastAccessedAt?: Date | string | null;
  _count?: { scanLogs?: number; qrCodes?: number };
}

interface Project {
  id: string;
  name: string;
  description?: string | null;
  location?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  website?: string | null;
  externalUrl?: string | null;
  galleryJson?: string[] | null;
  gateMode?: 'SINGLE' | 'MULTI' | null;
}

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface ScanLog {
  id: string;
  gate: { id: string; name: string };
  qrCode: { id: string; code: string | null };
  scannedAt: Date;
  status: string;
}

interface Unit {
  id: string;
  name: string;
  type: string;
  building: string | null;
  contactsCount: number;
}

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
}

interface ProjectDetailContentProps {
  project: Project;
  gates: Gate[];
  units: Unit[];
  contacts: Contact[];
  aggregates: {
    contactsCount: number;
    unitTypes: string[];
    qrCount: number;
    access1d: number;
    access7d: number;
    access30d: number;
  };
  teamUsers: User[];
  recentLogs: ScanLog[];
  locale: string;
  canManageGates: boolean;
}

export function ProjectDetailContent({
  project,
  gates,
  units,
  contacts,
  aggregates,
  teamUsers,
  recentLogs,
  locale,
  canManageGates,
}: ProjectDetailContentProps) {
  const { t } = useTranslation('dashboard');
  const actionsRef = useRef<ProjectDetailActionsRef>(null);

  const [contactSearch, setContactSearch] = useState('');
  const [unitSearch, setUnitSearch] = useState('');

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.email?.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.phone?.includes(contactSearch)
  ).slice(0, 10);

  const filteredUnits = units.filter(u => 
    u.name.toLowerCase().includes(unitSearch.toLowerCase()) ||
    u.building?.toLowerCase().includes(unitSearch.toLowerCase())
  ).slice(0, 10);

  return (
    <div className="py-8 space-y-8 animate-in fade-in duration-500">
      {/* Actions Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-[#172B4D] dark:text-[#E3E6E8] tracking-tight">
            Overview
          </h2>
          <p className="text-sm text-[#6B778C] dark:text-[#97A0AF]">
            Project performance and resource distribution.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ProjectDetailActions
            ref={actionsRef}
            project={project}
            gates={gates.map((g) => ({
              id: g.id,
              name: g.name,
              location: g.location,
              isActive: g.isActive,
            }))}
            locale={locale}
            canManageGates={canManageGates}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Contacts', value: aggregates.contactsCount, icon: Users, color: 'var(--primary)', bg: '#DEEBFF' },
          { label: 'Unit Types', value: aggregates.unitTypes.length, icon: Building, color: '#00875A', bg: '#E3FCEF' },
          { label: 'QR Codes', value: aggregates.qrCount, icon: QrCode, color: '#FF991F', bg: '#FFF0B3' },
          { label: '30d Access', value: aggregates.access30d, icon: Shield, color: '#BF2600', bg: '#FFEBE6' },
        ].map((kpi, i) => (
          <Card key={i} className="border border-[#DFE1E6] dark:border-[#343A46] bg-background bg-background rounded-xl shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B778C] dark:text-[#97A0AF] mb-1">
                    {kpi.label}
                  </span>
                  <span className="text-3xl font-bold text-[#172B4D] dark:text-white tabular-nums">
                    {kpi.value}
                  </span>
                </div>
                <div 
                  className="h-12 w-12 rounded-xl flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: kpi.bg, color: kpi.color }}
                >
                  <kpi.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: About & Gallery */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <Card className="border border-[#DFE1E6] dark:border-[#343A46] bg-background bg-background rounded-2xl overflow-hidden shadow-sm">
            <CardHeader className="border-b border-[#DFE1E6] dark:border-[#343A46] px-8 py-5">
              <h2 className="text-[18px] font-semibold text-[#172B4D] dark:text-[#E3E6E8]">About Project</h2>
            </CardHeader>
            <CardContent className="p-8">
              {project.description ? (
                <p className="text-[15px] text-[#42526E] dark:text-[#A5ADBA] leading-relaxed whitespace-pre-wrap font-medium">
                  {project.description}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-[#6B778C]">
                  <ScrollText className="h-12 w-12 opacity-10 mb-3" />
                  <p className="text-sm italic">No description provided for this project.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gallery */}
          {project.galleryJson && project.galleryJson.length > 0 && (
            <Card className="border border-[#DFE1E6] dark:border-[#343A46] bg-background bg-background rounded-2xl overflow-hidden shadow-sm">
              <CardHeader className="border-b border-[#DFE1E6] dark:border-[#343A46] px-8 py-5">
                <h2 className="text-[18px] font-semibold text-[#172B4D] dark:text-[#E3E6E8]">Project Gallery</h2>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.galleryJson.map((url, idx) => (
                    <div key={idx} className="group relative aspect-video rounded-xl overflow-hidden border border-[#DFE1E6] dark:border-[#343A46] bg-muted shadow-sm transition-all hover:ring-2 hover:ring-[var(--primary)]">
                      <img
                        src={url}
                        alt={`${project.name} gallery image ${idx + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card className="border border-[#DFE1E6] dark:border-[#343A46] bg-background bg-background rounded-2xl overflow-hidden shadow-sm">
            <CardHeader className="border-b border-[#DFE1E6] dark:border-[#343A46] px-8 py-5 flex flex-row items-center justify-between">
              <h2 className="text-[18px] font-semibold text-[#172B4D] dark:text-[#E3E6E8]">Recent Access Logs</h2>
              <Link
                href={`/${locale}/dashboard/scans?project=${project.id}`}
                className="text-xs font-bold text-[var(--primary)] hover:underline uppercase tracking-wider"
              >
                View All Logs
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {recentLogs.length === 0 ? (
                <div className="p-12 text-center text-[#6B778C]">
                  <p className="text-sm font-medium">No access logs found for this project.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-[#FAFBFC] dark:bg-[#091E42]/20">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-8 text-[#6B778C] font-bold uppercase text-[11px] tracking-wider">Gate</TableHead>
                      <TableHead className="text-[#6B778C] font-bold uppercase text-[11px] tracking-wider">Code</TableHead>
                      <TableHead className="text-[#6B778C] font-bold uppercase text-[11px] tracking-wider">Time</TableHead>
                      <TableHead className="px-8 text-[#6B778C] font-bold uppercase text-[11px] tracking-wider text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentLogs.map((log) => (
                      <TableRow key={log.id} className="border-b border-[#DFE1E6] dark:border-[#343A46] hover:bg-[#F4F5F7] dark:hover:bg-[var(--secondary)] transition-colors">
                        <TableCell className="px-8 py-4 font-semibold text-[#172B4D] dark:text-[#E3E6E8]">{log.gate.name}</TableCell>
                        <TableCell className="py-4 font-mono text-xs text-[#6B778C] dark:text-[#97A0AF]">
                          {log.qrCode.code?.slice(0, 8)}...{log.qrCode.code?.slice(-4)}
                        </TableCell>
                        <TableCell className="py-4 text-[#42526E] dark:text-[#A5ADBA] text-sm tabular-nums">
                          {new Date(log.scannedAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                        </TableCell>
                        <TableCell className="px-8 py-4 text-right">
                          <Badge
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                              SCAN_STATUS_STYLES[log.status] ?? 'bg-[#F4F5F7] text-[#42526E]'
                            )}
                          >
                            {log.status.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Gates, Team, Sidebar Stats */}
        <div className="space-y-8">
          {/* Gates Card */}
          <GatesCardWithEdit
            gates={gates}
            locale={locale}
            lastAccessLabel={t('projectDetail.lastAccess', 'Last access')}
            noGatesLabel={t('projectDetail.noGates', 'No gates')}
            actionsRef={actionsRef}
          />

          {/* Quick Stats: Units & Contacts */}
          <Card className="border border-[#DFE1E6] dark:border-[#343A46] bg-background bg-background rounded-2xl overflow-hidden shadow-sm">
            <CardHeader className="border-b border-[#DFE1E6] dark:border-[#343A46] px-6 py-4 flex flex-row items-center justify-between bg-[#FAFBFC] dark:bg-[#091E42]/20">
              <h3 className="text-sm font-bold text-[#6B778C] uppercase tracking-widest">Resources</h3>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[#DFE1E6] dark:border-[#343A46]">
                {/* Units */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#DEEBFF] text-[var(--primary)] flex items-center justify-center">
                        <Building className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-[#172B4D] dark:text-white">Units</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-[#DFE1E6] text-[#6B778C]">{units.length}</Badge>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B778C]" />
                    <Input
                      placeholder="Search units..."
                      value={unitSearch}
                      onChange={(e) => setUnitSearch(e.target.value)}
                      className="pl-9 h-8 text-xs bg-[#F4F5F7] bg-secondary border-none"
                    />
                  </div>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {filteredUnits.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F4F5F7] dark:hover:bg-[var(--secondary)] transition-colors group">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#172B4D] dark:text-white truncate">{u.name}</p>
                          <p className="text-[10px] text-[#6B778C] uppercase tracking-tighter">{u.type}</p>
                        </div>
                        <ArrowRight className="h-3 w-3 text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contacts */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-[#E3FCEF] text-[#00875A] flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-[#172B4D] dark:text-white">Contacts</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-[#DFE1E6] text-[#6B778C]">{contacts.length}</Badge>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B778C]" />
                    <Input
                      placeholder="Search contacts..."
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                      className="pl-9 h-8 text-xs bg-[#F4F5F7] bg-secondary border-none"
                    />
                  </div>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {filteredContacts.map((c) => (
                      <div key={c.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F4F5F7] dark:hover:bg-[var(--secondary)] transition-colors group">
                        <div className="h-6 w-6 rounded-full bg-[#EBECF0] bg-secondary flex items-center justify-center text-[10px] font-bold text-[#42526E] dark:text-[#A5ADBA] shrink-0">
                          {c.avatarUrl ? <img src={c.avatarUrl} className="h-full w-full rounded-full object-cover" /> : c.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#172B4D] dark:text-white truncate">{c.name}</p>
                          <p className="text-[10px] text-[#6B778C] truncate">{c.email || c.phone || '—'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Card */}
          <Card className="border border-[#DFE1E6] dark:border-[#343A46] bg-background bg-background rounded-2xl overflow-hidden shadow-sm">
            <CardHeader className="border-b border-[#DFE1E6] dark:border-[#343A46] px-6 py-4 flex flex-row items-center justify-between bg-[#FAFBFC] dark:bg-[#091E42]/20">
              <h3 className="text-sm font-bold text-[#6B778C] uppercase tracking-widest">Active Team</h3>
              <Link
                href={`/${locale}/dashboard/team/gate-assignments?project=${project.id}`}
                className="text-[10px] font-bold text-[var(--primary)] hover:underline uppercase"
              >
                Manage
              </Link>
            </CardHeader>
            <CardContent className="p-6">
              {teamUsers.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-[#6B778C] italic">No team members assigned.</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {teamUsers.map((user) => (
                    <div 
                      key={user.id} 
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#EBECF0] bg-secondary rounded-full group cursor-default hover:bg-[#DEEBFF] transition-colors"
                      title={user.email}
                    >
                      <div className="h-4 w-4 rounded-full bg-[var(--primary)] text-[8px] flex items-center justify-center text-white font-bold">
                        {user.name?.slice(0, 1).toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-[#172B4D] dark:text-[#E3E6E8] group-hover:text-[var(--primary)]">
                        {user.name?.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
