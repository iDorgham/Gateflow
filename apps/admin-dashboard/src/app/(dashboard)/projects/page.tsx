import { requireAdmin } from '../../../lib/admin-auth';
import { prisma } from '@gate-access/db';
import { revalidatePath } from 'next/cache';
import {
  FolderOpen,
  Search,
  Building2,
  DoorOpen,
  QrCode,
  Filter,
  X,
  Trash2,
  RotateCcw,
  Calendar,
} from 'lucide-react';
import {
  Card,
  CardContent,
  Badge,
  Button,
  Input,
  cn,
} from '@gate-access/ui';
import Link from 'next/link';

export const metadata = { title: 'Projects' };

// ─── Server actions ────────────────────────────────────────────────────────────

async function deleteProject(formData: FormData) {
  'use server';
  requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return;
  await prisma.project.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath('/projects');
}

async function restoreProject(formData: FormData) {
  'use server';
  requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return;
  await prisma.project.update({ where: { id }, data: { deletedAt: null } });
  revalidatePath('/projects');
}

// ─── Page ──────────────────────────────────────────────────────────────────────

interface SearchParams { q?: string; org?: string; status?: string }

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  requireAdmin();

  const search = searchParams.q?.trim() ?? '';
  const orgFilter = searchParams.org?.trim() ?? '';
  const statusFilter = searchParams.status ?? 'active';

  const projects = await prisma.project.findMany({
    where: {
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
      ...(orgFilter
        ? { organization: { name: { contains: orgFilter, mode: 'insensitive' } } }
        : {}),
      ...(statusFilter === 'active'
        ? { deletedAt: null }
        : statusFilter === 'archived'
        ? { NOT: { deletedAt: null } }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      name: true,
      deletedAt: true,
      createdAt: true,
      organization: { select: { id: true, name: true, plan: true } },
      _count: { select: { gates: true, qrCodes: true } },
    },
  });

  const [totalActive, totalArchived] = await Promise.all([
    prisma.project.count({ where: { deletedAt: null } }),
    prisma.project.count({ where: { NOT: { deletedAt: null } } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">
            All projects across the platform — sub-groups within organizations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-800 px-3 py-1 font-bold">
            {totalActive} Active
          </Badge>
          {totalArchived > 0 && (
            <Badge variant="outline" className="bg-muted text-muted-foreground px-3 py-1 font-bold">
              {totalArchived} Archived
            </Badge>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <form method="GET" className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={search}
                placeholder="Search by project name..."
                className="pl-9 h-10"
              />
            </div>
            <div className="relative flex-1 min-w-[200px]">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="org"
                defaultValue={orgFilter}
                placeholder="Filter by organization..."
                className="pl-9 h-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                name="status"
                defaultValue={statusFilter}
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                Filter
              </Button>
              <Button variant="outline" size="sm" asChild className="font-bold">
                <Link href="/projects">
                  <X className="h-3.5 w-3.5 mr-1.5" />
                  Clear
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-md overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-widest border-b border-border">
                  <th className="px-6 py-4 text-left">Project</th>
                  <th className="px-6 py-4 text-left">Organization</th>
                  <th className="px-6 py-4 text-center">Resources</th>
                  <th className="px-6 py-4 text-left">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <FolderOpen className="h-8 w-8 opacity-20" />
                        <p className="font-medium">No projects found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => {
                    const archived = project.deletedAt !== null;
                    return (
                      <tr
                        key={project.id}
                        className={cn(
                          'group transition-colors',
                          archived ? 'bg-muted/30 opacity-70' : 'hover:bg-primary/5'
                        )}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-lg font-bold text-xs uppercase shadow-sm transition-transform group-hover:scale-110',
                              archived
                                ? 'bg-muted text-muted-foreground'
                                : 'bg-violet-500/10 text-violet-700 dark:text-violet-300'
                            )}>
                              <FolderOpen className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground leading-none">{project.name}</p>
                              <p className="text-[10px] font-mono text-muted-foreground mt-1 uppercase">
                                {project.id.slice(0, 10)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <p className="text-foreground font-bold text-xs">{project.organization.name}</p>
                            <PlanBadge plan={project.organization.plan} />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-4">
                            <div className="flex flex-col items-center" title="Gates">
                              <DoorOpen className="h-3 w-3 text-muted-foreground mb-1" />
                              <span className="text-[11px] font-bold text-foreground">{project._count.gates}</span>
                            </div>
                            <div className="flex flex-col items-center" title="QR Codes">
                              <QrCode className="h-3 w-3 text-muted-foreground mb-1" />
                              <span className="text-[11px] font-bold text-foreground">{project._count.qrCodes}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 translate-x-2 group-hover:translate-x-0 transition-transform">
                            {archived ? (
                              <form action={restoreProject}>
                                <input type="hidden" name="id" value={project.id} />
                                <Button
                                  type="submit"
                                  size="sm"
                                  variant="outline"
                                  className="h-8 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-[11px] font-bold shadow-sm"
                                >
                                  <RotateCcw className="h-3 w-3 mr-1.5" />
                                  Restore
                                </Button>
                              </form>
                            ) : (
                              <form action={deleteProject}>
                                <input type="hidden" name="id" value={project.id} />
                                <Button
                                  type="submit"
                                  size="sm"
                                  variant="outline"
                                  className="h-8 border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-[11px] font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-3 w-3 mr-1.5" />
                                  Archive
                                </Button>
                              </form>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <p className="text-[11px] font-medium text-muted-foreground px-1">
        Showing up to 200 records. Archive removes project from tenant view; data is preserved.
      </p>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        'w-fit text-[9px] font-bold uppercase tracking-tight h-4 px-1.5',
        plan === 'ENTERPRISE'
          ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
          : plan === 'PRO'
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
          : 'bg-muted text-muted-foreground'
      )}
    >
      {plan}
    </Badge>
  );
}
