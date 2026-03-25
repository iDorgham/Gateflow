'use client';

import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  Badge,
  Button,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gate-access/ui';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  Users,
  QrCode,
  ScrollText,
  Shield,
  Search,
  Building,
  User,
  ArrowRight,
  Activity,
  UserCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ProjectDetailActions,
  type ProjectDetailActionsRef,
} from './ProjectDetailActions';
import { GatesCardWithEdit } from './GatesCardWithEdit';
import { ProjectLiveLogs } from '../../operations/ProjectLiveLogs';
import { ProjectTeamTable } from '../../operations/ProjectTeamTable';

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
  aggregates,
  locale,
  canManageGates,
}: ProjectDetailContentProps) {
  const { t } = useTranslation('dashboard');
  const actionsRef = useRef<ProjectDetailActionsRef>(null);

  const [unitSearch, setUnitSearch] = useState('');

  const filteredUnits = units
    .filter(
      (u) =>
        u.name.toLowerCase().includes(unitSearch.toLowerCase()) ||
        u.building?.toLowerCase().includes(unitSearch.toLowerCase())
    )
    .slice(0, 10);

  return (
    <div className="py-8 space-y-8 animate-in fade-in duration-500">
      {/* Actions Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2
            className={cn(
              'text-2xl font-bold tracking-tight',
              'text-[var(--ds-text,#172B4D)]'
            )}
          >
            Command Center
          </h2>
          <p className={cn('text-sm', 'text-[var(--ds-text-subtle,#6B778C)]')}>
            Real-time project operations and access management.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="h-10 rounded-xl border-border/60 hover:bg-secondary font-bold gap-2"
          >
            <Link href={`/${locale}/dashboard/projects/${project.id}/crm`}>
              <Users className="h-4 w-4 text-[var(--primary)]" />
              CRM Hub
            </Link>
          </Button>
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

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            label: 'Contacts',
            value: aggregates.contactsCount,
            icon: Users,
            color: 'var(--primary)',
            bg: 'var(--ds-background-selected,#DEEBFF)',
          },
          {
            label: 'Unit Types',
            value: aggregates.unitTypes.length,
            icon: Building,
            color: 'var(--ds-text-success,#006644)',
            bg: 'var(--ds-background-success-subtle,#E3FCEF)',
          },
          {
            label: 'QR Codes',
            value: aggregates.qrCount,
            icon: QrCode,
            color: 'var(--ds-text-warning,#B65C02)',
            bg: 'var(--ds-background-warning-subtle,#FFF0B3)',
          },
          {
            label: '30d Access',
            value: aggregates.access30d,
            icon: Shield,
            color: 'var(--ds-text-danger,#AE2A19)',
            bg: 'var(--ds-background-danger-subtle,#FFEBE6)',
          },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card
              className={cn(
                'bg-background rounded-xl shadow-sm hover:shadow-md transition-all h-full',
                'border-[var(--ds-border,#DFE1E6)]'
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        'text-[11px] font-bold uppercase tracking-wider',
                        'text-[var(--ds-text-subtle,#6B778C)]'
                      )}
                    >
                      {kpi.label}
                    </span>
                    <span
                      className={cn(
                        'text-3xl font-bold tabular-nums',
                        'text-[var(--ds-text,#172B4D)]'
                      )}
                    >
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
          </motion.div>
        ))}
      </motion.div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList
          className={cn(
            'h-12 p-1 rounded-xl mb-8',
            'bg-[var(--ds-background-neutral-subtle,#F4F5F7)]'
          )}
        >
          <TabsTrigger
            value="overview"
            className="flex-1 rounded-lg font-bold gap-2"
          >
            <Activity className="h-4 w-4" />
            Live Activity
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="flex-1 rounded-lg font-bold gap-2"
          >
            <UserCheck className="h-4 w-4" />
            Access Team
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className="flex-1 rounded-lg font-bold gap-2"
          >
            <ScrollText className="h-4 w-4" />
            Project About
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProjectLiveLogs projectId={project.id} locale={locale} />
            </div>
            <div className="space-y-8">
              <GatesCardWithEdit
                gates={gates}
                locale={locale}
                lastAccessLabel={t('projectDetail.lastAccess', 'Last access')}
                noGatesLabel={t('projectDetail.noGates', 'No gates')}
                actionsRef={actionsRef}
              />
              {/* Resources Card integrated in Sidebar */}
              <Card
                className={cn(
                  'bg-background rounded-2xl overflow-hidden shadow-sm',
                  'border-[var(--ds-border,#DFE1E6)]'
                )}
              >
                <CardHeader
                  className={cn(
                    'px-6 py-4 flex flex-row items-center justify-between',
                    'border-b border-[var(--ds-border,#DFE1E6)] bg-[var(--ds-background-neutral-subtle,#FAFBFC)]'
                  )}
                >
                  <h3
                    className={cn(
                      'text-sm font-bold uppercase tracking-widest',
                      'text-[var(--ds-text-subtle,#6B778C)]'
                    )}
                  >
                    Project Resources
                  </h3>
                </CardHeader>
                <CardContent className="p-0">
                  <div
                    className={cn(
                      'p-6 space-y-4',
                      'divide-y divide-[var(--ds-border,#DFE1E6)]'
                    )}
                  >
                    <div className="flex items-center justify-between pt-4 first:pt-0">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'h-8 w-8 rounded-lg flex items-center justify-center',
                            'bg-[var(--ds-background-selected,#DEEBFF)] text-[var(--primary)]'
                          )}
                        >
                          <Building className="h-4 w-4" />
                        </div>
                        <span
                          className={cn(
                            'text-sm font-bold',
                            'text-[var(--ds-text,#172B4D)]'
                          )}
                        >
                          Units
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px]',
                          'border-[var(--ds-border,#DFE1E6)] text-[var(--ds-text-subtle,#6B778C)]'
                        )}
                      >
                        {units.length}
                      </Badge>
                    </div>
                    <div className="pt-4">
                      <div className="relative">
                        <Search
                          className={cn(
                            'absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5',
                            'text-[var(--ds-text-subtle,#6B778C)]'
                          )}
                        />
                        <Input
                          placeholder="Search units..."
                          value={unitSearch}
                          onChange={(e) => setUnitSearch(e.target.value)}
                          className={cn(
                            'ps-9 h-8 text-xs bg-secondary border-none',
                            'bg-[var(--ds-background-neutral-subtle,#F4F5F7)]'
                          )}
                        />
                      </div>
                    </div>
                    <div className="pt-4 space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                      {filteredUnits.length > 0 ? (
                        filteredUnits.map((u) => (
                          <div
                            key={u.id}
                            className={cn(
                              'flex items-center justify-between p-2 rounded-lg transition-colors group cursor-default',
                              'hover:bg-[var(--ds-background-neutral-subtle,#F4F5F7)]'
                            )}
                          >
                            <div className="min-w-0">
                              <p
                                className={cn(
                                  'text-xs font-semibold truncate',
                                  'text-[var(--ds-text,#172B4D)]'
                                )}
                              >
                                {u.name}
                              </p>
                              <p
                                className={cn(
                                  'text-[10px] uppercase tracking-tighter',
                                  'text-[var(--ds-text-subtle,#6B778C)]'
                                )}
                              >
                                {u.type.replace('_', ' ')}
                              </p>
                            </div>
                            <ArrowRight className="h-3 w-3 text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 rtl:translate-x-2 group-hover:translate-x-0" />
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-center text-[var(--ds-text-subtlest)] py-2">
                          No units found
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <ProjectTeamTable
            projectId={project.id}
            locale={locale}
            canManage={canManageGates}
          />
        </TabsContent>

        <TabsContent value="about" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card
                className={cn(
                  'bg-background rounded-2xl overflow-hidden shadow-sm',
                  'border-[var(--ds-border,#DFE1E6)]'
                )}
              >
                <CardHeader
                  className={cn(
                    'px-8 py-5',
                    'border-b border-[var(--ds-border,#DFE1E6)]'
                  )}
                >
                  <h2
                    className={cn(
                      'text-[18px] font-semibold',
                      'text-[var(--ds-text,#172B4D)]'
                    )}
                  >
                    About Project
                  </h2>
                </CardHeader>
                <CardContent className="p-8">
                  {project.description ? (
                    <p
                      className={cn(
                        'text-[15px] leading-relaxed whitespace-pre-wrap font-medium',
                        'text-[var(--ds-text-subtle,#42526E)]'
                      )}
                    >
                      {project.description}
                    </p>
                  ) : (
                    <div
                      className={cn(
                        'flex flex-col items-center justify-center py-6',
                        'text-[var(--ds-text-subtle,#6B778C)]'
                      )}
                    >
                      <ScrollText className="h-12 w-12 opacity-10 mb-3" />
                      <p className="text-sm italic">
                        No description provided for this project.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {project.galleryJson && project.galleryJson.length > 0 && (
                <Card
                  className={cn(
                    'bg-background rounded-2xl overflow-hidden shadow-sm',
                    'border-[var(--ds-border,#DFE1E6)]'
                  )}
                >
                  <CardHeader
                    className={cn(
                      'px-8 py-5',
                      'border-b border-[var(--ds-border,#DFE1E6)]'
                    )}
                  >
                    <h2
                      className={cn(
                        'text-[18px] font-semibold',
                        'text-[var(--ds-text,#172B4D)]'
                      )}
                    >
                      Project Gallery
                    </h2>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.galleryJson.map((url, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            'group relative aspect-video rounded-xl overflow-hidden bg-muted shadow-sm transition-all hover:ring-2 hover:ring-[var(--primary)]',
                            'border-[var(--ds-border,#DFE1E6)]'
                          )}
                        >
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
            </div>
            <div className="space-y-8">
              <Card
                className={cn(
                  'bg-background rounded-2xl overflow-hidden shadow-sm',
                  'border-[var(--ds-border,#DFE1E6)]'
                )}
              >
                <CardHeader
                  className={cn(
                    'px-6 py-4 bg-[var(--ds-background-neutral-subtle,#FAFBFC)]',
                    'border-b border-[var(--ds-border,#DFE1E6)]'
                  )}
                >
                  <h3
                    className={cn(
                      'text-sm font-bold uppercase tracking-widest',
                      'text-[var(--ds-text-subtle,#6B778C)]'
                    )}
                  >
                    Metadata
                  </h3>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex flex-col gap-1">
                    <span
                      className={cn(
                        'text-[10px] font-black uppercase',
                        'text-[var(--ds-text-subtle,#6B778C)]'
                      )}
                    >
                      Location
                    </span>
                    <span
                      className={cn(
                        'text-sm font-bold',
                        'text-[var(--ds-text,#172B4D)]'
                      )}
                    >
                      {project.location || 'Not set'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span
                      className={cn(
                        'text-[10px] font-black uppercase',
                        'text-[var(--ds-text-subtle,#6B778C)]'
                      )}
                    >
                      Gate Mode
                    </span>
                    <Badge
                      className={cn(
                        'w-fit border-none font-bold uppercase text-[9px] tracking-widest',
                        'bg-[var(--ds-background-neutral-bold,#44546F)] text-[var(--ds-text-inverse,#FFFFFF)]'
                      )}
                    >
                      {project.gateMode || 'MULTI'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
