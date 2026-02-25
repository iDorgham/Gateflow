'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Badge, Label, Input, Textarea, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, Tabs, TabsContent, TabsList, TabsTrigger } from '@gate-access/ui';
import { FolderKanban, Plus, Pencil, Trash2, Check, X, Loader2, QrCode, ScrollText, Layers, Settings2, ExternalLink, Info, HelpCircle, Image as ImageIcon, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { csrfFetch } from '@/lib/csrf';
import { cn } from '@/lib/utils';
import { WorkspacePageLayout, SidebarSection } from '@/components/dashboard/workspace-page-layout';
import { ProjectWizard } from '@/components/project-wizard';

interface Project {
  id: string;
  name: string;
  description?: string | null;
  coverUrl?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  createdAt: Date;
  _count: { gates: number; qrCodes: number; units: number; contacts: number };
}

export function ProjectsClient({ projects: initial }: { projects: Project[] }) {
  const router = useRouter();
  const { t } = useTranslation('dashboard');
  const [isPending, startTransition] = useTransition();
  const [projects, setProjects] = useState(initial);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  
  // Safe Delete State
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshProjects = () => {
    startTransition(() => { router.refresh(); });
  };



  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    setIsRenaming(true);
    try {
      const res = await csrfFetch(`/api/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: editName.trim() }),
      });
      
      let data = {};
      try { data = await res.json(); } catch(e) {}

      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, name: editName.trim() } : p))
        );
        setEditingId(null);
        toast.success(t('settings.projects.success.renamed', 'Project renamed'));
        refreshProjects();
      } else {
        toast.error((data as any).message ?? (data as any).error ?? t('settings.projects.errors.renameFailed', 'Failed to rename project'));
      }
    } catch (error: any) {
      console.error('[Rename Error]', error);
      toast.error(t('settings.projects.errors.networkError', 'Network error — please check connection'));
    } finally {
      setIsRenaming(false);
    }
  };

  const executeDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const res = await csrfFetch(`/api/projects/${projectToDelete.id}`, { method: 'DELETE' });
      
      let data = {};
      try { data = await res.json(); } catch(e) {}

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
        toast.success(t('settings.projects.success.purged', 'Project deleted gracefully'));
        setProjectToDelete(null);
        setDeleteConfirmationText('');
        refreshProjects();
      } else {
        toast.error((data as any).message ?? (data as any).error ?? t('settings.projects.errors.deleteFailed', 'Failed to delete project'));
      }
    } catch (error: any) {
      console.error('[Delete Error]', error);
      toast.error(t('settings.projects.errors.networkError', 'Network error — please check connection'));
    } finally {
      setIsDeleting(false);
    }
  };

  const sidebar = (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <SidebarSection title="Project Structure" icon={Info}>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-100/50 dark:ring-slate-700/50">
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium lowercase first-letter:uppercase">
            Projects help you group Gates and QR Codes by client, location, or campaign. This allows for separate analytics and easier management of large-scale deployments.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700 dark:text-slate-300">
              <span className="h-1 w-1 rounded-full bg-blue-500" />
              Campaign Tracking
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700 dark:text-slate-300">
              <span className="h-1 w-1 rounded-full bg-emerald-500" />
              Client Segregation
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700 dark:text-slate-300">
              <span className="h-1 w-1 rounded-full bg-violet-500" />
              Regional Access
            </div>
          </div>
        </div>
      </SidebarSection>

      <SidebarSection title="Resources" icon={HelpCircle}>
        <div className="rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-900/20 p-6 shadow-sm ring-1 ring-blue-500/5">
          <p className="text-[11px] leading-relaxed text-blue-700/80 dark:text-blue-300/80 font-medium">
            Need help organizing your workspace? Check out our best practices for larger teams.
          </p>
          <Button variant="ghost" size="sm" className="mt-4 w-full gap-2 rounded-xl text-[11px] font-bold text-blue-700 hover:bg-blue-50 hover:text-blue-800">
            Read Best Practices
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </SidebarSection>
    </div>
  );

  return (
    <WorkspacePageLayout
      header={
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{t('settings.projects.title', 'Projects')}</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('settings.projects.description', 'Organize your workspace resources into logical groups.')}</p>
          </div>
          {!showCreate && (
            <Button onClick={() => setShowCreate(true)} disabled={isPending} className="w-full sm:w-auto gap-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              {t('settings.projects.newProject', 'New Project')}
            </Button>
          )}
        </div>
      }
      sidebar={sidebar}
    >
      <div className="space-y-6">

      <ProjectWizard open={showCreate} onOpenChange={setShowCreate} onSuccess={refreshProjects} />

      <div className="flex flex-col space-y-6">
        {projects.length === 0 ? (
          <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
            <CardContent className="py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mx-auto mb-6">
                <Layers className="h-8 w-8" />
              </div>
              <p className="text-lg font-bold text-foreground">No projects yet</p>
              <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
                Projects help you organize your gates and QR codes. Create one to get started.
              </p>
              <Button className="mt-8 rounded-xl font-bold gap-2 shadow-sm" onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" /> {t('settings.projects.newProject', 'New Project')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="group relative flex flex-col sm:flex-row overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/30">
              {/* Image Section (Left side on desktop, top on mobile) */}
              <div className="relative h-48 sm:h-auto sm:w-1/3 shrink-0 overflow-hidden bg-muted/30">
                {project.coverUrl ? (
                  <img src={project.coverUrl} alt={`${project.name} cover`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-muted flex items-center justify-center">
                    <Layers className="h-12 w-12 text-primary/20" />
                  </div>
                )}
                {project.logoUrl && (
                  <div className="absolute bottom-4 left-4 h-16 w-16 rounded-2xl border-4 border-background bg-background shadow-lg overflow-hidden flex items-center justify-center">
                    <img src={project.logoUrl} alt={`${project.name} logo`} className="h-full w-full object-cover" />
                  </div>
                )}
              </div>

              {/* Content Section (Right side on desktop, bottom on mobile) */}
              <div className="flex flex-1 flex-col relative z-10 p-1">
                <CardHeader className="pb-4 pt-6 px-6">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      {editingId === project.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRename(project.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            disabled={isRenaming}
                            className="w-full max-w-md h-10 rounded-xl border border-primary/20 px-3 py-1 text-base font-bold focus:outline-none bg-background focus:ring-4 focus:ring-primary/10 shadow-sm"
                          />
                          <button onClick={() => handleRename(project.id)} disabled={isRenaming} className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
                            {isRenaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <CardTitle className="truncate text-3xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                            {project.name}
                          </CardTitle>
                          {project.description && (
                            <p className="mt-2 text-sm font-medium text-muted-foreground/80 line-clamp-2 pr-8 leading-relaxed">
                              {project.description}
                            </p>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-1.5">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              Est. {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                            </CardDescription>
                          </div>
                          {project.website && (
                             <a href={project.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors">
                               <Link2 className="h-3 w-3" /> Website
                             </a>
                          )}
                      </div>
                    </div>
                  
                    <div className="absolute top-6 right-6 flex shrink-0 gap-1.5 opacity-0 lg:group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl bg-background/50 backdrop-blur-sm shadow-sm text-foreground hover:bg-background hover:text-primary transition-all border border-border/50"
                        onClick={() => { setEditingId(project.id); setEditName(project.name); }}
                      >
                        <Settings2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl bg-background/50 backdrop-blur-sm text-muted-foreground hover:bg-destructive shadow-[0_0_15px_-3px_rgba(239,68,68,0)] hover:shadow-destructive/30 hover:text-destructive-foreground hover:border-destructive transition-all border border-border/50"
                        onClick={() => {
                          setProjectToDelete(project);
                          setDeleteConfirmationText('');
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                </div>
              </CardHeader>

              <CardContent className="mt-auto px-6 pb-6 pt-0">
                <div className="flex flex-col sm:flex-row items-end justify-between gap-6">
                  {/* Stats Clusters */}
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 px-4 shadow-sm group-hover:border-primary/20 transition-colors w-full sm:w-auto">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                        <ScrollText className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-foreground leading-none">{project._count.gates}</span>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 mt-1">Gates</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 px-4 shadow-sm group-hover:border-primary/20 transition-colors w-full sm:w-auto">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <QrCode className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-foreground leading-none">{project._count.qrCodes}</span>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 mt-1">Tokens</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="w-full sm:w-auto shrink-0">
                    <Button asChild className="w-full sm:w-auto px-8 rounded-xl font-black uppercase tracking-widest text-xs h-12 shadow-[0_0_20px_-5px_rgba(14,165,233,0)] hover:shadow-primary/30 transition-all group/btn">
                      <a href={`/dashboard/projects/${project.id}`} className="flex items-center justify-center gap-2">
                        Dashboard
                        <ExternalLink className="h-4 w-4 group-hover/btn:scale-110 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
            </Card>
          ))
        )}
      </div>

      {/* Safe Delete Confirmation Modal */}
      <Dialog 
        open={!!projectToDelete} 
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl border-border bg-background p-0 overflow-hidden">
          <div className="bg-destructive/10 p-6 border-b border-destructive/20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/20 mb-4 ring-8 ring-destructive/5">
              <Trash2 className="h-8 w-8 text-destructive" />
            </div>
            <DialogTitle className="text-xl font-black text-foreground mb-2">Delete Project</DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground/80 max-w-xs mx-auto">
              This action cannot be undone. All unlinked gates and related resources will lose categorization.
            </DialogDescription>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="space-y-2 text-center">
              <Label className="text-sm font-bold text-foreground">
                Type <span className="text-destructive select-all font-mono bg-destructive/10 px-1.5 py-0.5 rounded">{projectToDelete?.name} delete</span> to confirm.
              </Label>
              <Input
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder={`${projectToDelete?.name} delete`}
                className="h-12 text-center text-lg font-bold rounded-xl border-destructive/30 focus-visible:ring-destructive bg-muted/30"
                autoComplete="off"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1 rounded-xl h-12 font-bold" onClick={() => setProjectToDelete(null)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                className="flex-1 rounded-xl h-12 font-black tracking-wide" 
                disabled={deleteConfirmationText !== `${projectToDelete?.name} delete` || isDeleting}
                onClick={executeDelete}
              >
                {isDeleting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </WorkspacePageLayout>
  );
}
