'use client';

import { useState, useTransition } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Label,
  Input,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@gate-access/ui';
import Link from 'next/link';
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  Loader2,
  QrCode,
  ScrollText,
  Layers,
  ArrowRight,
  Building,
  Users,
  Settings,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { csrfFetch } from '@/lib/csrf';
import { ProjectWizard } from '@/components/project-wizard';

interface Project {
  id: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  location?: string | null;
  website?: string | null;
  createdAt: Date;
  _count: {
    gates: number;
    qrCodes: number;
    units: number;
    contacts: number;
  };
}

interface ApiErrorPayload {
  message?: string;
  error?: string;
}

export function ProjectsTab({
  projects: initial,
  allowCreateWhenEmpty = true,
}: {
  projects: Project[];
  /** When false and projects empty, show CTA to Settings instead of New Project (first-project flow). */
  allowCreateWhenEmpty?: boolean;
}) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? 'en';
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
    startTransition(() => {
      router.refresh();
    });
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    setIsRenaming(true);
    try {
      const res = await csrfFetch(`/api/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: editName.trim() }),
      });

      let data: ApiErrorPayload = {};
      try {
        data = (await res.json()) as ApiErrorPayload;
      } catch {
        // Ignore JSON parse errors from non-JSON responses
      }

      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, name: editName.trim() } : p))
        );
        setEditingId(null);
        toast.success(
          t('settings.projects.success.renamed', 'Project renamed')
        );
        refreshProjects();
      } else {
        toast.error(
          data.message ||
            data.error ||
            t('settings.projects.errors.renameFailed', 'Failed to rename')
        );
      }
    } catch (error: unknown) {
      console.error('[Rename Error]', error);
      toast.error(
        t(
          'settings.projects.errors.networkError',
          'Network error. Please check connection.'
        )
      );
    } finally {
      setIsRenaming(false);
    }
  };

  const executeDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const res = await csrfFetch(`/api/projects/${projectToDelete.id}`, {
        method: 'DELETE',
      });

      let data: ApiErrorPayload = {};
      try {
        data = (await res.json()) as ApiErrorPayload;
      } catch {
        // Ignore JSON parse errors from non-JSON responses
      }

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
        toast.success(
          t('settings.projects.success.purged', 'Project purged gracefully.')
        );
        setProjectToDelete(null);
        setDeleteConfirmationText('');
        refreshProjects();
      } else {
        toast.error(
          data.message ||
            data.error ||
            t(
              'settings.projects.errors.deleteFailed',
              'Failed to delete project'
            )
        );
      }
    } catch (error: unknown) {
      console.error('[Delete Error]', error);
      toast.error(
        t(
          'settings.projects.errors.networkError',
          'Network error. Please check connection.'
        )
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground uppercase">
            {t('settings.projects.title', 'Projects')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t(
              'settings.projects.description',
              'Organize your gates and resources by project.'
            )}
          </p>
        </div>
        {!showCreate && (allowCreateWhenEmpty || projects.length > 0) && (
          <Button
            onClick={() => setShowCreate(true)}
            disabled={isPending}
            className="w-full sm:w-auto gap-2 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            {t('settings.projects.newProject', 'New Project')}
          </Button>
        )}
      </div>

      <ProjectWizard
        open={showCreate}
        onOpenChange={setShowCreate}
        onSuccess={refreshProjects}
      />

      <div className="flex flex-col space-y-6">
        {projects.length === 0 ? (
          <Card className="col-span-full rounded-xl border-dashed border-2 border-border bg-muted/30 shadow-none">
            <CardContent className="py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-card text-muted-foreground/30 mx-auto mb-6 shadow-sm border border-border">
                <Layers className="h-8 w-8" />
              </div>
              <p className="text-lg font-bold text-foreground uppercase tracking-tight">
                {t('settings.projects.systemEmpty', 'No Projects')}
              </p>
              <p className="mt-1 text-xs text-muted-foreground max-w-[260px] mx-auto">
                {allowCreateWhenEmpty
                  ? t(
                      'settings.projects.firstProjectEmptyDesc',
                      'Create your first project and add gates to get started.'
                    )
                  : t(
                      'settings.projects.firstProjectCTA',
                      'Create your first project in Settings to get started.'
                    )}
              </p>
              {allowCreateWhenEmpty ? (
                <Button
                  className="mt-8 rounded-xl font-bold bg-primary text-primary-foreground gap-2 shadow-sm"
                  onClick={() => setShowCreate(true)}
                >
                  <Plus className="h-4 w-4" />{' '}
                  {t('settings.projects.newProject', 'New Project')}
                </Button>
              ) : (
                <Button
                  asChild
                  className="mt-8 rounded-xl font-bold bg-primary text-primary-foreground gap-2 shadow-sm"
                >
                  <Link
                    href={`/${locale}/dashboard/settings?tab=projects`}
                    className="inline-flex items-center justify-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    {t(
                      'settings.projects.createFirstInSettings',
                      'Create your first project in Settings'
                    )}
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card
              key={project.id}
              className="group relative flex flex-col sm:flex-row overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/30"
            >
              {/* Image Section */}
              <div className="relative h-48 sm:h-auto sm:w-1/3 shrink-0 overflow-hidden bg-muted/30">
                {project.coverUrl ? (
                  <img
                    src={project.coverUrl}
                    alt={`${project.name} cover`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-muted flex items-center justify-center">
                    <Layers className="h-12 w-12 text-primary/20" />
                  </div>
                )}
                {project.logoUrl && (
                  <div className="absolute bottom-4 left-4 h-16 w-16 rounded-2xl border-4 border-background bg-background shadow-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={project.logoUrl}
                      alt={`${project.name} logo`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="flex flex-1 flex-col relative z-10 p-1">
                <CardHeader className="pb-4 pt-6 px-6">
                  <div className="flex items-start justify-between gap-4">
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
                          <button
                            onClick={() => handleRename(project.id)}
                            disabled={isRenaming}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                          >
                            {isRenaming ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Link
                            href={`/${locale}/dashboard/projects/${project.id}`}
                            className="block focus:outline-none focus:ring-2 focus:ring-primary/20 rounded"
                          >
                            <CardTitle className="truncate text-3xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight">
                              {project.name}
                            </CardTitle>
                          </Link>
                          {project.description && (
                            <p className="mt-2 text-sm font-medium text-muted-foreground/80 line-clamp-2 pr-8 leading-relaxed">
                              {project.description}
                            </p>
                          )}
                          {project.location && (
                            <p className="mt-2 text-xs font-semibold text-muted-foreground/80 flex items-center gap-1.5 bg-muted/30 w-fit px-2 py-0.5 rounded-full">
                              <MapPin className="h-3 w-3 text-primary/60" />
                              <span className="truncate">{project.location}</span>
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-1.5">
                          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            {t('settings.projects.est', {
                              date: new Date(
                                project.createdAt
                              ).toLocaleDateString(undefined, {
                                month: 'short',
                                year: 'numeric',
                              }),
                              defaultValue: `Est. ${new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`,
                            })}
                          </CardDescription>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-6 right-6 flex shrink-0 gap-1.5 opacity-0 lg:group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl bg-background/50 backdrop-blur-sm shadow-sm text-foreground hover:bg-background hover:text-primary transition-all border border-border/50"
                        onClick={() => {
                          if (editingId === project.id) {
                            handleRename(project.id);
                          } else {
                            setEditingId(project.id);
                            setEditName(project.name);
                          }
                        }}
                      >
                        {editingId === project.id ? (
                          <Check className="h-4 w-4 text-success" />
                        ) : (
                          <Pencil className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-xl bg-background/50 backdrop-blur-sm text-muted-foreground hover:bg-destructive shadow-none hover:shadow-destructive/30 hover:text-destructive-foreground hover:border-destructive transition-all border border-border/50"
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
                  <div className="flex flex-col xl:flex-row items-end justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                      <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 px-4 shadow-sm group-hover:border-primary/20 transition-colors w-full sm:w-auto">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                          <ScrollText className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-foreground leading-none">
                            {project._count.gates}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 mt-1">
                            {t('settings.projects.gates', 'Gates')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 px-4 shadow-sm group-hover:border-primary/20 transition-colors w-full sm:w-auto">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <QrCode className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-foreground leading-none">
                            {project._count.qrCodes}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 mt-1">
                            {t('settings.projects.keys', 'Keys')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 px-4 shadow-sm group-hover:border-blue-500/20 transition-colors w-full sm:w-auto">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                          <Building className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-black text-foreground leading-none">
                              {project._count.units}
                            </span>
                            <span className="text-[9px] font-bold text-muted-foreground/60">
                              / {(project as any)._count.unitTypes || 1} types
                            </span>
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 mt-1">
                            Units
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 px-4 shadow-sm group-hover:border-orange-500/20 transition-colors w-full sm:w-auto">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                          <Users className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-foreground leading-none">
                            {project._count.contacts}
                          </span>
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 mt-1">
                            Contacts
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full xl:w-auto shrink-0">
                      <Button
                        asChild
                        className="w-full xl:w-auto px-8 rounded-xl font-black uppercase tracking-widest text-[10px] h-12 shadow-none hover:shadow-primary/30 transition-all group/btn"
                      >
                        <a
                          href={`/${locale}/dashboard/projects/${project.id}`}
                          className="flex items-center justify-center gap-2"
                        >
                          {t('settings.projects.accessNode', 'Dashboard')}
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
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
            <DialogTitle className="text-xl font-black text-foreground mb-2">
              Delete Project
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground/80 max-w-xs mx-auto">
              This action cannot be undone. All unlinked gates and related
              resources will lose categorization.
            </DialogDescription>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-2 text-center">
              <Label className="text-sm font-bold text-foreground">
                Type{' '}
                <span className="text-destructive select-all font-mono bg-destructive/10 px-1.5 py-0.5 rounded">
                  {projectToDelete?.name} delete
                </span>{' '}
                to confirm.
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
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl h-12 font-bold"
                onClick={() => setProjectToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1 rounded-xl h-12 font-black tracking-wide"
                disabled={
                  deleteConfirmationText !==
                    `${projectToDelete?.name} delete` || isDeleting
                }
                onClick={executeDelete}
              >
                {isDeleting ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ArrowRight is imported at the top
