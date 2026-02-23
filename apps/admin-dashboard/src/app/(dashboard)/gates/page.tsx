import { requireAdmin } from '../../../lib/admin-auth';
import { prisma } from '@gate-access/db';
import { revalidatePath } from 'next/cache';
import {
  DoorOpen,
  Search,
  Building2,
  ScanLine,
  Filter,
  X,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  FolderOpen,
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

export const metadata = { title: 'Gates' };

// ─── Server actions ────────────────────────────────────────────────────────────

async function setGateActive(formData: FormData) {
  'use server';
  requireAdmin();
  const id = formData.get('id') as string;
  const active = formData.get('active') === 'true';
  if (!id) return;
  await prisma.gate.update({ where: { id }, data: { isActive: active } });
  revalidatePath('/gates');
}

async function softDeleteGate(formData: FormData) {
  'use server';
  requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return;
  await prisma.gate.update({ where: { id }, data: { deletedAt: new Date() } });
  revalidatePath('/gates');
}

async function restoreGate(formData: FormData) {
  'use server';
  requireAdmin();
  const id = formData.get('id') as string;
  if (!id) return;
  await prisma.gate.update({ where: { id }, data: { deletedAt: null } });
  revalidatePath('/gates');
}

// ─── Page ──────────────────────────────────────────────────────────────────────

interface SearchParams { q?: string; org?: string; status?: string }

export default async function GatesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  requireAdmin();

  const search = searchParams.q?.trim() ?? '';
  const orgFilter = searchParams.org?.trim() ?? '';
  const statusFilter = searchParams.status ?? 'active';

  const gates = await prisma.gate.findMany({
    where: {
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
      ...(orgFilter
        ? { organization: { name: { contains: orgFilter, mode: 'insensitive' } } }
        : {}),
      ...(statusFilter === 'active'
        ? { deletedAt: null }
        : statusFilter === 'deleted'
        ? { NOT: { deletedAt: null } }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
    select: {
      id: true,
      name: true,
      location: true,
      isActive: true,
      deletedAt: true,
      createdAt: true,
      lastAccessedAt: true,
      organization: { select: { id: true, name: true, plan: true } },
      project: { select: { id: true, name: true } },
      _count: { select: { scanLogs: true } },
    },
  });

  const [totalActive, totalInactive, totalDeleted] = await Promise.all([
    prisma.gate.count({ where: { deletedAt: null, isActive: true } }),
    prisma.gate.count({ where: { deletedAt: null, isActive: false } }),
    prisma.gate.count({ where: { NOT: { deletedAt: null } } }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gates</h1>
          <p className="text-muted-foreground mt-1">
            All physical access points across every organization.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800 px-3 py-1 font-bold">
            {totalActive} Active
          </Badge>
          {totalInactive > 0 && (
            <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800 px-3 py-1 font-bold">
              {totalInactive} Inactive
            </Badge>
          )}
          {totalDeleted > 0 && (
            <Badge variant="outline" className="bg-muted text-muted-foreground px-3 py-1 font-bold">
              {totalDeleted} Deleted
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
                placeholder="Search by gate name..."
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
                <option value="active">Active (not deleted)</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                Filter
              </Button>
              <Button variant="outline" size="sm" asChild className="font-bold">
                <Link href="/gates">
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
                  <th className="px-6 py-4 text-left">Gate</th>
                  <th className="px-6 py-4 text-left">Organization / Project</th>
                  <th className="px-6 py-4 text-center">Scans</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {gates.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <DoorOpen className="h-8 w-8 opacity-20" />
                        <p className="font-medium">No gates found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  gates.map((gate) => {
                    const deleted = gate.deletedAt !== null;
                    return (
                      <tr
                        key={gate.id}
                        className={cn(
                          'group transition-colors',
                          deleted ? 'bg-muted/30 opacity-70' : 'hover:bg-primary/5'
                        )}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-lg shadow-sm transition-transform group-hover:scale-110',
                              deleted
                                ? 'bg-muted text-muted-foreground'
                                : gate.isActive
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            )}>
                              <DoorOpen className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground leading-none">{gate.name}</p>
                              {gate.location && (
                                <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                  <MapPin className="h-2.5 w-2.5" />
                                  {gate.location}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <p className="text-foreground font-bold text-xs">{gate.organization.name}</p>
                            {gate.project ? (
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <FolderOpen className="h-2.5 w-2.5" />
                                {gate.project.name}
                              </p>
                            ) : (
                              <p className="text-[10px] text-muted-foreground italic">No project</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <ScanLine className="h-3 w-3 text-muted-foreground mb-1" />
                            <span className="text-[11px] font-bold text-foreground">
                              {gate._count.scanLogs.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {deleted ? (
                            <Badge className="bg-muted text-muted-foreground border-none text-[10px] font-bold uppercase">
                              Deleted
                            </Badge>
                          ) : gate.isActive ? (
                            <Badge className="bg-emerald-500 text-white border-none text-[10px] font-bold uppercase flex items-center gap-1 w-fit mx-auto">
                              <CheckCircle2 className="h-2.5 w-2.5" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-300 border-none text-[10px] font-bold uppercase flex items-center gap-1 w-fit mx-auto">
                              <XCircle className="h-2.5 w-2.5" />
                              Inactive
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 translate-x-2 group-hover:translate-x-0 transition-transform">
                            {deleted ? (
                              <form action={restoreGate}>
                                <input type="hidden" name="id" value={gate.id} />
                                <Button
                                  type="submit"
                                  size="sm"
                                  variant="outline"
                                  className="h-8 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-[11px] font-bold shadow-sm"
                                >
                                  Restore
                                </Button>
                              </form>
                            ) : (
                              <>
                                <form action={setGateActive}>
                                  <input type="hidden" name="id" value={gate.id} />
                                  <input type="hidden" name="active" value={String(!gate.isActive)} />
                                  <Button
                                    type="submit"
                                    size="sm"
                                    variant="outline"
                                    className={cn(
                                      'h-8 text-[11px] font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity',
                                      gate.isActive
                                        ? 'border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                                        : 'border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                    )}
                                  >
                                    {gate.isActive ? 'Deactivate' : 'Activate'}
                                  </Button>
                                </form>
                                <form action={softDeleteGate}>
                                  <input type="hidden" name="id" value={gate.id} />
                                  <Button
                                    type="submit"
                                    size="sm"
                                    variant="outline"
                                    className="h-8 border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-[11px] font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    Delete
                                  </Button>
                                </form>
                              </>
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
        Showing up to 200 records. Scan counts are all-time totals per gate.
      </p>
    </div>
  );
}
