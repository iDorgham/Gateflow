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
import { Users, DoorOpen, QrCode, ScrollText, Shield, Search, Building, User } from 'lucide-react';
import { ProjectDetailActions, type ProjectDetailActionsRef } from './ProjectDetailActions';
import { GatesCardWithEdit } from './GatesCardWithEdit';
import { useState } from 'react';
import { Input } from '@gate-access/ui';

const SCAN_STATUS_STYLES: Record<string, string> = {
  SUCCESS: 'bg-success/20 text-success',
  FAILED: 'bg-destructive/20 text-destructive',
  EXPIRED: 'bg-warning/20 text-warning',
  MAX_USES_REACHED: 'bg-warning/20 text-warning',
  INACTIVE: 'bg-muted text-muted-foreground',
  DENIED: 'bg-destructive/20 text-destructive',
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
    <div className="p-4 md:p-8 space-y-6">
      {/* Actions + Manage link */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
        <Link
          href={`/${locale}/dashboard/team/gate-assignments?project=${project.id}`}
          className="text-sm font-medium text-primary hover:underline self-end sm:self-center"
        >
          {t('projectDetail.manage', 'Manage')} → {t('projectDetail.fullPage', 'Full page')}
        </Link>
      </div>

      {/* About */}
      <Card className="border border-border bg-card rounded-xl shadow-sm">
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold text-foreground">{t('projectDetail.about', 'About')}</h2>
        </CardHeader>
        <CardContent className="pt-0">
          {project.description ? (
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {t('projectDetail.noDescription', 'No description yet.')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Gallery */}
      {project.galleryJson && project.galleryJson.length > 0 && (
        <Card className="border border-border bg-card rounded-xl shadow-sm overflow-hidden">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold text-foreground">{t('projectDetail.gallery', 'Gallery')}</h2>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-1 px-1">
              {project.galleryJson.map((url, idx) => (
                <div key={idx} className="relative h-40 w-64 shrink-0 rounded-lg overflow-hidden border border-border bg-muted group">
                  <img
                    src={url}
                    alt={`${project.name} gallery image ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border bg-card rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{aggregates.contactsCount}</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('projectDetail.contacts', 'Contacts')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-2/20 text-chart-2">
              <DoorOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{aggregates.unitTypes.length}</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('projectDetail.unitTypes', 'Unit types')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/20 text-success">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{aggregates.qrCount}</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('projectDetail.qrCodes', 'QR Codes')}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border bg-card rounded-xl shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-info/20 text-info">
              <ScrollText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold text-foreground">{aggregates.access30d}</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t('projectDetail.access30d', 'Access (30d)')}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                1d: {aggregates.access1d} · 7d: {aggregates.access7d}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gates + Team + Shift */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GatesCardWithEdit
          gates={gates}
          locale={locale}
          lastAccessLabel={t('projectDetail.lastAccess', 'Last access')}
          noGatesLabel={t('projectDetail.noGates', 'No gates')}
          actionsRef={actionsRef}
        />

        {/* Team */}
        <Card className="border border-border bg-card rounded-xl shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">{t('projectDetail.team', 'Team')}</h2>
            <Link
              href={`/${locale}/dashboard/team/gate-assignments?project=${project.id}`}
              className="text-xs font-medium text-primary hover:underline"
            >
              {t('projectDetail.manage', 'Manage')}
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            {teamUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('projectDetail.noTeam', 'No team assigned')}</p>
            ) : (
              <ul className="space-y-2">
                {teamUsers.map((user) => (
                  <li key={user.id} className="text-sm text-foreground">
                    <span className="font-medium">{user.name ?? '—'}</span>
                    {user.email && (
                      <span className="text-muted-foreground ml-1">({user.email})</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Shift placeholder */}
        <Card className="border border-border bg-card rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold text-foreground">
              {t('projectDetail.shiftStatus', 'Shift status')}
            </h2>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-5 w-5 shrink-0" />
              <span>{t('projectDetail.shiftPlaceholder', '—')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Units List */}
        <Card className="border border-border bg-card rounded-xl shadow-sm">
          <CardHeader className="pb-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                {t('projectDetail.units', 'Units')}
              </h2>
              <span className="text-xs text-muted-foreground">{units.length} total</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                placeholder={t('common.search', 'Search...')}
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value)}
                className="pl-9 h-9 border-border/50 bg-muted/20"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredUnits.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">{t('common.noResults', 'No results found')}</p>
            ) : (
              <div className="space-y-2">
                {filteredUnits.map((unit) => (
                  <div key={unit.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{unit.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {unit.building ? `${unit.building} · ` : ''}{unit.type}
                      </p>
                    </div>
                    <div className="text-right">
                       <Badge variant="secondary" className="text-[10px]">{unit.contactsCount} {t('projectDetail.contacts', 'Contacts')}</Badge>
                    </div>
                  </div>
                ))}
                {units.length > 10 && !unitSearch && <p className="text-[10px] text-center text-muted-foreground pt-2">Showing first 10 units</p>}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contacts List */}
        <Card className="border border-border bg-card rounded-xl shadow-sm">
          <CardHeader className="pb-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {t('projectDetail.contacts', 'Contacts')}
              </h2>
              <span className="text-xs text-muted-foreground">{contacts.length} total</span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <Input
                placeholder={t('common.search', 'Search...')}
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                className="pl-9 h-9 border-border/50 bg-muted/20"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredContacts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">{t('common.noResults', 'No results found')}</p>
            ) : (
              <div className="space-y-2">
                {filteredContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                      {contact.avatarUrl ? <img src={contact.avatarUrl} className="h-full w-full rounded-full object-cover" /> : contact.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{contact.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {contact.email || contact.phone || '—'}
                      </p>
                    </div>
                  </div>
                ))}
                {contacts.length > 10 && !contactSearch && <p className="text-[10px] text-center text-muted-foreground pt-2">Showing first 10 contacts</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gate logs */}
      <Card className="border border-border bg-card rounded-xl shadow-sm">
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold text-foreground">
            {t('projectDetail.gateLogs', 'Recent access logs')}
          </h2>
        </CardHeader>
        <CardContent className="pt-0">
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">{t('projectDetail.noLogs', 'No scans yet')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">Gate</TableHead>
                  <TableHead className="text-muted-foreground">QR Code</TableHead>
                  <TableHead className="text-muted-foreground">Time</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium text-foreground">{log.gate.name}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {log.qrCode.code?.slice(0, 16)}…
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(log.scannedAt).toLocaleString(locale)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] ${
                          SCAN_STATUS_STYLES[log.status] ?? 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {t(`overview.scanStatus.${log.status}`, {
                          defaultValue: log.status.replace(/_/g, ' '),
                        })}
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
  );
}
