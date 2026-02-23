'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Badge } from '@gate-access/ui';
import { Plus, Pencil, Trash2, Check, X, Loader2, QrCode, ScrollText, Layers, Settings2, ExternalLink, Info, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  name: string;
  createdAt: Date;
  _count: { gates: number; qrCodes: number };
}

export function ProjectsTab({ projects: initial }: { projects: Project[] }) {
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
        setProjects((prev) => [...prev, { ...data.project, createdAt: new Date(data.project.createdAt), _count: { gates: 0, qrCodes: 0 } }]);
        setNewName('');
        setShowCreate(false);
        toast.success('Project created');
        refreshProjects();
      } else {
        toast.error(data.message ?? data.error ?? 'Failed to create project');
      }
    } catch {
      toast.error('Network error');
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
        toast.error(data.message ?? data.error ?? 'Failed to rename');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this project? Unlinked gates will remain active but loose categorization.')) return;
    setDeletingId(id);
    try {
      const res = await csrfFetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        toast.success('Project purged');
        refreshProjects();
      } else {
        toast.error(data.message ?? data.error ?? 'Failed to delete');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Project Management</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Categorize your securable resources into distinct operations.</p>
        </div>
        {!showCreate && (
            <Button onClick={() => setShowCreate(true)} disabled={isPending} className="w-full sm:w-auto gap-2 rounded-xl bg-primary font-black uppercase tracking-widest text-[10px] h-10 px-6 shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5">
                <Plus className="h-4 w-4" />
                Initialize Project
            </Button>
        )}
      </div>

      {showCreate && (
        <Card className="rounded-2xl border-2 border-primary/20 bg-primary/5 dark:bg-primary/10 shadow-sm overflow-hidden animate-in zoom-in-95 duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-black uppercase tracking-tight">New Project Allocation</CardTitle>
            <CardDescription className="font-medium">Define a logical grouping for your hardware and keys.</CardDescription>
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
                placeholder="e.g. North Gate Hub, Client X, Global Operations"
                disabled={isCreating}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white shadow-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
              />
              <div className="flex gap-2">
                <Button onClick={handleCreate} disabled={!newName.trim() || isCreating} className="flex-1 sm:flex-none gap-2 rounded-xl bg-primary font-black uppercase tracking-widest text-[10px] h-10 px-6">
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Create
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowCreate(false)} disabled={isCreating} className="rounded-xl font-black uppercase tracking-widest text-[10px] h-10 border-slate-200 dark:border-slate-700">
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <Card className="col-span-full rounded-2xl border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shadow-none">
            <CardContent className="py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-slate-300 mx-auto mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <Layers className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">System Empty</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-[200px] mx-auto font-medium">
                No active projects detected in this workspace. Initializing a project is required for categorization.
              </p>
              <Button className="mt-8 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary h-10 px-8 shadow-lg shadow-primary/10" onClick={() => setShowCreate(true)}>
                + New Allocation
              </Button>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="group relative flex flex-col overflow-hidden rounded-2xl border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/30 bg-white dark:bg-slate-800 border-2">
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
                          className="w-full h-8 rounded-lg border-2 border-primary/20 px-2 py-0.5 text-sm font-black focus:outline-none bg-slate-50 dark:bg-slate-900"
                        />
                      </div>
                    ) : (
                      <CardTitle className="truncate text-base font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors uppercase tracking-tight">
                        {project.name}
                      </CardTitle>
                    )}
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        EST. {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex shrink-0 gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 transform lg:translate-y-2 lg:group-hover:translate-y-0">
                    <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-primary"
                    onClick={() => { 
                        if (editingId === project.id) {
                            handleRename(project.id);
                        } else {
                            setEditingId(project.id); 
                            setEditName(project.name);
                        }
                    }}
                    >
                    {editingId === project.id ? <Check className="h-4 w-4 text-green-500" /> : <Pencil className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    >
                    {deletingId === project.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="mt-auto bg-slate-50/50 dark:bg-slate-900/30 p-6 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                        <QrCode className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{project._count.qrCodes}</span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Keys</span>
                  </div>
                  <div className="flex flex-col">
                     <div className="flex items-center gap-2 mb-1">
                        <ScrollText className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{project._count.gates}</span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Gates</span>
                  </div>
                </div>
                <div className="mt-6">
                   <Button variant="outline" asChild className="w-full rounded-xl font-black uppercase tracking-widest text-[10px] h-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-primary hover:text-white hover:border-primary shadow-sm transition-all group/btn active:scale-95">
                    <a href={`/dashboard/projects/${project.id}`} className="flex items-center justify-center gap-2">
                      Access Node
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Re-using ArrowRight which I'll add to imports
import { ArrowRight } from 'lucide-react';
