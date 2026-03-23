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
  UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ProjectDetailActions, type ProjectDetailActionsRef } from './ProjectDetailActions';
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
            Command Center
          </h2>
          <p className="text-sm text-[#6B778C] dark:text-[#97A0AF]">
            Real-time project operations and access management.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="h-10 rounded-xl border-border/60 hover:bg-secondary font-bold gap-2">
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
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { label: 'Contacts', value: aggregates.contactsCount, icon: Users, color: 'var(--primary)', bg: '#DEEBFF' },
          { label: 'Unit Types', value: aggregates.unitTypes.length, icon: Building, color: '#00875A', bg: '#E3FCEF' },
          { label: 'QR Codes', value: aggregates.qrCount, icon: QrCode, color: '#FF991F', bg: '#FFF0B3' },
          { label: '30d Access', value: aggregates.access30d, icon: Shield, color: '#BF2600', bg: '#FFEBE6' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 }
            }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="border border-[#DFE1E6] dark:border-[#343A46] bg-background rounded-xl shadow-sm hover:shadow-md transition-all h-full">
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
          </motion.div>
        ))}
      </motion.div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="h-12 p-1 bg-[#F4F5F7] dark:bg-[#091E42]/20 rounded-xl mb-8">
          <TabsTrigger value="overview" className="flex-1 rounded-lg font-bold gap-2">
            <Activity className="h-4 w-4" />
            Live Activity
          </TabsTrigger>
          <TabsTrigger value="team" className="flex-1 rounded-lg font-bold gap-2">
            <UserCheck className="h-4 w-4" />
            Access Team
          </TabsTrigger>
          <TabsTrigger value="about" className="flex-1 rounded-lg font-bold gap-2">
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
              <Card className="border border-[#DFE1E6] dark:border-[#343A46] bg-background rounded-2xl overflow-hidden shadow-sm">
                <CardHeader className="border-b border-[#DFE1E6] dark:border-[#343A46] px-6 py-4 flex flex-row items-center justify-between bg-[#FAFBFC] dark:bg-[#091E42]/20">
                  <h3 className="text-sm font-bold text-[#6B778C] uppercase tracking-widest">Project Resources</h3>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-[#DFE1E6] dark:divide-[#343A46]">
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
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6B778C]" />
                        <Input
                          placeholder="Search units..."
                          value={unitSearch}
                          onChange={(e) => setUnitSearch(e.target.value)}
                          className="ps-9 h-8 text-xs bg-[#F4F5F7] bg-secondary border-none"
                        />
                      </div>
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                        {filteredUnits.map((u) => (
                          <div key={u.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F4F5F7] dark:hover:bg-[var(--secondary)] transition-colors group cursor-default">
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#172B4D] dark:text-white truncate">{u.name}</p>
                              <p className="text-[10px] text-[#6B778C] uppercase tracking-tighter">{u.type.replace('_', ' ')}</p>
                            </div>
                            <ArrowRight className="h-3 w-3 text-[var(--primary)] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 rtl:translate-x-2 group-hover:translate-x-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <ProjectTeamTable projectId={project.id} locale={locale} canManage={canManageGates} />
        </TabsContent>

        <TabsContent value="about" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="border border-[#DFE1E6] dark:border-[#343A46] bg-background rounded-2xl overflow-hidden shadow-sm">
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

              {project.galleryJson && project.galleryJson.length > 0 && (
                <Card className="border border-[#DFE1E6] dark:border-[#343A46] bg-background rounded-2xl overflow-hidden shadow-sm">
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
            </div>
            <div className="space-y-8">
               <Card className="border border-[#DFE1E6] dark:border-[#343A46] bg-background rounded-2xl overflow-hidden shadow-sm">
                <CardHeader className="border-b border-[#DFE1E6] dark:border-[#343A46] px-6 py-4 bg-[#FAFBFC] dark:bg-[#091E42]/20">
                  <h3 className="text-sm font-bold text-[#6B778C] uppercase tracking-widest">Metadata</h3>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-[#6B778C] uppercase">Location</span>
                      <span className="text-sm font-bold text-[#172B4D] dark:text-white">{project.location || 'Not set'}</span>
                   </div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black text-[#6B778C] uppercase">Gate Mode</span>
                      <Badge className="w-fit bg-[#020035] text-white border-none font-bold uppercase text-[9px] tracking-widest">
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
