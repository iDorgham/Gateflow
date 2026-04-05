'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  Badge,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gate-access/ui';
import {
  ExternalLink,
  ShieldAlert,
  X,
  FolderOpen,
  Building2,
  DoorOpen,
  QrCode,
  Trash2,
  RotateCcw,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProjectDetailSheetProps {
  projectId: string | null;
  onClose: () => void;
}

interface Project {
  id: string;
  name: string;
  organization: { name: string; plan: string };
  counts: { gates: number; qrCodes: number };
  createdAt: string;
  status: 'ACTIVE' | 'ARCHIVED';
}

export function ProjectDetailSheet({
  projectId,
  onClose,
}: ProjectDetailSheetProps) {
  const [loading, setLoading] = React.useState(false);
  const [project, setProject] = React.useState<Project | null>(null);

  React.useEffect(() => {
    if (projectId) {
      // Mock fetch project details
      setLoading(true);
      setTimeout(() => {
        setProject({
          id: projectId,
          name: 'Modern Skyline Resident',
          organization: { name: 'GateFlow Global', plan: 'PRO' },
          counts: { gates: 14, qrCodes: 245 },
          createdAt: new Date().toISOString(),
          status: 'ACTIVE',
        });
        setLoading(false);
      }, 500);
    } else {
      setProject(null);
    }
  }, [projectId]);

  const handleArchive = () => {
    toast.success('Project archived successfully');
    onClose();
  };

  const handleRestore = () => {
    toast.success('Project restored successfully');
    onClose();
  };

  return (
    <Sheet open={!!projectId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-xl p-0 flex flex-col overflow-hidden border-l border-ds-border">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-ds-border border-t-ds-background-brand-bold" />
          </div>
        ) : project ? (
          <>
            <div className="flex flex-col space-y-2 text-center sm:text-left p-6 border-b border-ds-border bg-ds-background-neutral-subtle/20 shrink-0">
              <div className="flex items-center gap-3 mb-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ds-background-brand-bold text-ds-text-inverse font-bold text-sm shadow-sm">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div className="min-w-0 text-left">
                  <h2 className="text-ds-text text-base font-black uppercase tracking-tight truncate leading-tight">
                    {project.name}
                  </h2>
                  <p className="text-xs text-ds-text-subtle truncate">
                    {project.organization.name}
                  </p>
                </div>
                <div className="flex-1" />
                <Button
                  variant="subtle"
                  size="icon"
                  className="rounded-full h-8 w-8 hover:bg-ds-background-neutral transition-colors shrink-0"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant={project.status === 'ACTIVE' ? 'success' : 'subtle'}
                  className="font-bold uppercase text-[9px] h-5 px-1.5 tracking-wider"
                >
                  {project.status === 'ACTIVE' ? 'PROJECT ACTIVE' : 'ARCHIVED'}
                </Badge>
                <div className="flex items-center gap-1.5 ltr:ml-2 rtl:mr-2">
                  <ShieldAlert className="h-3 w-3 text-ds-text-subtle" />
                  <span className="text-[10px] font-bold text-ds-text-subtle uppercase tracking-tighter">
                    ID: {project.id.slice(0, 8)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <Tabs defaultValue="overview" className="w-full">
                <div className="px-8 border-b border-ds-border bg-ds-background-default sticky top-0 z-10">
                  <TabsList className="h-14 bg-transparent p-0 gap-8">
                    <TabsTrigger
                      value="overview"
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-ds-background-brand-bold data-[state=active]:bg-transparent px-0 font-bold uppercase text-[10px] tracking-widest transition-all"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="resources"
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-ds-background-brand-bold data-[state=active]:bg-transparent px-0 font-bold uppercase text-[10px] tracking-widest transition-all"
                    >
                      Resources
                    </TabsTrigger>
                    <TabsTrigger
                      value="audit"
                      className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-ds-background-brand-bold data-[state=active]:bg-transparent px-0 font-bold uppercase text-[10px] tracking-widest transition-all"
                    >
                      Audit Logs
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="p-8 space-y-8 m-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-ds-background-neutral-subtle rounded-2xl p-6 border border-ds-border flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtlest">
                        Owner Organization
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <Building2 className="h-4 w-4 text-ds-text-brand" />
                        <span className="font-bold text-ds-text">
                          {project.organization.name}
                        </span>
                      </div>
                    </div>
                    <div className="bg-ds-background-neutral-subtle rounded-2xl p-6 border border-ds-border flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-ds-text-subtlest">
                        Tier Status
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="primary"
                          className="font-black uppercase text-[9px] h-5"
                        >
                          {project.organization.plan}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtlest border-b border-ds-border pb-3">
                      Operational Metrics
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center justify-between p-4 rounded-xl border border-ds-border bg-ds-background-default hover:border-ds-background-selected transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-ds-background-neutral text-ds-text-subtle">
                            <DoorOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-ds-text">
                              Commissioned Gates
                            </p>
                            <p className="text-xs text-ds-text-subtle">
                              Active hardware units in project
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-black text-ds-text tabular-nums">
                          {project.counts.gates}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl border border-ds-border bg-ds-background-default hover:border-ds-background-selected transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-ds-background-neutral text-ds-text-subtle">
                            <QrCode className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-ds-text">
                              Generated QR Identities
                            </p>
                            <p className="text-xs text-ds-text-subtle">
                              Total visitor and resident passes
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-black text-ds-text tabular-nums">
                          {project.counts.qrCodes}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-ds-text-subtlest border-b border-ds-border pb-3">
                      Danger Zone
                    </h4>
                    <div className="flex gap-4">
                      {project.status === 'ACTIVE' ? (
                        <Button
                          variant="destructive"
                          onClick={handleArchive}
                          className="flex-1 bg-ds-background-danger-bold hover:bg-ds-background-danger-bold/90 text-ds-text-inverse font-bold uppercase text-[10px] tracking-widest h-12 rounded-xl"
                        >
                          <Trash2 className="ltr:mr-2 rtl:ml-2 h-4 w-4" />{' '}
                          Archive Project
                        </Button>
                      ) : (
                        <Button
                          onClick={handleRestore}
                          className="flex-1 bg-ds-background-brand-bold hover:bg-ds-background-brand-bold/90 text-ds-text-inverse font-bold uppercase text-[10px] tracking-widest h-12 rounded-xl"
                        >
                          <RotateCcw className="ltr:mr-2 rtl:ml-2 h-4 w-4" />{' '}
                          Restore Project
                        </Button>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="resources"
                  className="p-8 m-0 flex flex-col items-center justify-center h-64 opacity-40"
                >
                  <ExternalLink className="h-12 w-12 mb-4 text-ds-text-subtlest" />
                  <p className="font-bold uppercase tracking-widest text-[10px]">
                    Resource Details Coming Soon
                  </p>
                </TabsContent>

                <TabsContent
                  value="audit"
                  className="p-8 m-0 flex flex-col items-center justify-center h-64 opacity-40"
                >
                  <ShieldAlert className="h-12 w-12 mb-4 text-ds-text-subtlest" />
                  <p className="font-bold uppercase tracking-widest text-[10px]">
                    Audit Logs Coming Soon
                  </p>
                </TabsContent>
              </Tabs>
            </div>

            <div className="p-8 border-t border-ds-border bg-ds-background-neutral-subtle/50 shrink-0">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-ds-text-subtlest">
                <Calendar className="h-3 w-3" />
                Created on {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-ds-text-subtle">No project found.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
