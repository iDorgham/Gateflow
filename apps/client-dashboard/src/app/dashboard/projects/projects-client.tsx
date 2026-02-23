'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Badge } from '@gate-access/ui';
import { FolderKanban, Plus, Pencil, Trash2, Check, X, Loader2, QrCode, ScrollText, Layers, Settings2, ExternalLink, Info, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';
import { cn } from '@/lib/utils';
import { WorkspacePageLayout, SidebarSection } from '@/components/dashboard/workspace-page-layout';

interface Project {
  id: string;
  name: string;
  createdAt: Date;
  _count: { gates: number; qrCodes: number };
}

export function ProjectsClient({ projects: initial }: { projects: Project[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [projects, setProjects] = useState(initial);
  const [newName, setNewName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refreshProjects = () => {
    startTransition(() => { router.refresh(); });
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setIsCreating(true);
    try {
      const res = await csrfFetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setProjects((prev) => [...prev, { ...data.project, _count: { gates: 0, qrCodes: 0 } }]);
        setNewName('');
        setShowCreate(false);
        toast.success('Project created');
        refreshProjects();
      } else {
        toast.error(data.message ?? data.error ?? 'Failed to create project');
      }
    } catch {
      toast.error('Network error — could not create project');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    setIsRenaming(true);
    try {
      const res = await csrfFetch(`/api/projects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: editName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, name: editName.trim() } : p))
        );
        setEditingId(null);
        toast.success('Project renamed');
        refreshProjects();
      } else {
        toast.error(data.message ?? data.error ?? 'Failed to rename project');
      }
    } catch {
      toast.error('Network error — could not rename project');
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? Gates and QR codes will be unlinked.')) return;
    setDeletingId(id);
    try {
      const res = await csrfFetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        toast.success('Project deleted');
        refreshProjects();
      } else {
        toast.error(data.message ?? data.error ?? 'Failed to delete project');
      }
    } catch {
      toast.error('Network error — could not delete project');
    } finally {
      setDeletingId(null);
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Projects</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Organize your workspace resources into logical groups.</p>
          </div>
          {!showCreate && (
            <Button onClick={() => setShowCreate(true)} disabled={isPending} className="w-full sm:w-auto gap-2 rounded-xl bg-blue-600 font-bold shadow-sm hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          )}
        </div>
      }
      sidebar={sidebar}
    >
      <div className="space-y-6">

      {showCreate && (
        <Card className="rounded-2xl border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10 shadow-sm overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Create New Project</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">Projects help you organize gates and QR codes for different clients or locations.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                  if (e.key === 'Escape') setShowCreate(false);
                }}
                placeholder="e.g. Campus A, Client X, Marketing Campaign"
                disabled={isCreating}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50"
              />
              <div className="flex gap-2">
                <Button onClick={handleCreate} disabled={!newName.trim() || isCreating} className="flex-1 sm:flex-none gap-2 rounded-xl bg-blue-600 font-bold shadow-sm hover:bg-blue-700">
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      Create
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowCreate(false)} disabled={isCreating} className="rounded-xl font-bold border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        {projects.length === 0 ? (
          <Card className="col-span-full rounded-2xl border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <CardContent className="py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-700 text-slate-300 mx-auto mb-6">
                <Layers className="h-8 w-8" />
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">No projects yet</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Projects help you organize your gates and QR codes. Create one to get started.
              </p>
              <Button className="mt-8 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-sm" onClick={() => setShowCreate(true)}>
                + Create your first project
              </Button>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="group relative flex flex-col overflow-hidden rounded-2xl border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800">
              <CardHeader className="pb-4 pt-6">
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
                          className="h-8 rounded-lg border-slate-200 px-2 py-0.5 text-sm font-bold focus:ring-blue-500/20"
                        />
                        <button onClick={() => handleRename(project.id)} disabled={isRenaming} className="text-green-600 hover:text-green-700">
                          {isRenaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </button>
                      </div>
                    ) : (
                      <CardTitle className="truncate text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.name}
                      </CardTitle>
                    )}
                    <CardDescription className="mt-1 text-xs font-medium text-slate-400">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  
                  {!editingId && (
                    <div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600"
                        onClick={() => { setEditingId(project.id); setEditName(project.name); }}
                      >
                        <Settings2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                      >
                        {deletingId === project.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="mt-auto bg-slate-50/50 dark:bg-slate-900/30 p-6 pt-5">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 shadow-sm">
                      <QrCode className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{project._count.qrCodes}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">QR Codes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 shadow-sm">
                      <ScrollText className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{project._count.gates}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Gates</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                   <Button variant="outline" asChild className="w-full rounded-xl font-bold border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-700 shadow-sm transition-all group/btn">
                    <a href={`/dashboard/projects/${project.id}`} className="flex items-center justify-center gap-2">
                      View Project
                      <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      </div>
    </WorkspacePageLayout>
  );
}
