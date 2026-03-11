'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@gate-access/ui';
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Power,
  MapPin,
  DoorOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { csrfFetch } from '@/lib/csrf';
import { GateSheet } from './gate-sheet';

export interface GateRow {
  id: string;
  name: string;
  location: string | null;
  isActive: boolean;
  projectId: string | null;
  projectName: string | null;
  latitude: number | null;
  longitude: number | null;
  locationRadiusMeters: number | null;
  locationEnforced: boolean | null;
  requiredIdentityLevel: number | null;
  _count: { qrCodes: number; scanLogs: number };
}

interface Project {
  id: string;
  name: string;
}

interface GateTableProps {
  gates: GateRow[];
  projects: Project[];
}

export function GateTable({ gates: initial, projects }: GateTableProps) {
  const { t } = useTranslation('dashboard');
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [gates, setGates] = useState(initial);
  const [isPending, startTransition] = useTransition();

  const filtered = gates.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.location ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (g.projectName ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const refresh = () => startTransition(() => router.refresh());

  const handleToggle = async (gate: GateRow) => {
    const res = await csrfFetch(`/api/gates`, {
      method: 'PATCH',
      body: JSON.stringify({ id: gate.id, isActive: !gate.isActive }),
    });
    if (res.ok) {
      setGates((prev) =>
        prev.map((g) => (g.id === gate.id ? { ...g, isActive: !g.isActive } : g))
      );
      toast.success(gate.isActive ? 'Gate deactivated' : 'Gate activated');
    } else {
      toast.error('Failed to update gate status');
    }
  };

  const handleDelete = async (gate: GateRow) => {
    if (
      !confirm(
        t(
          'settings.gates.deleteConfirm',
          `Delete "${gate.name}"? This cannot be undone.`
        )
      )
    )
      return;

    const res = await csrfFetch(`/api/gates`, {
      method: 'DELETE',
      body: JSON.stringify({ id: gate.id }),
    });
    if (res.ok) {
      setGates((prev) => prev.filter((g) => g.id !== gate.id));
      toast.success(t('settings.gates.deleted', 'Gate deleted'));
      refresh();
    } else {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      toast.error(body.error ?? t('common.error', 'An error occurred'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('settings.gates.search', 'Search gates...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 rounded-xl"
          />
        </div>
        <GateSheet mode="create" projects={projects} onSuccess={refresh}>
          <Button className="w-full sm:w-auto gap-2 rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[11px]">
            <DoorOpen className="h-4 w-4" />
            {t('settings.gates.addGate', 'Add Gate')}
          </Button>
        </GateSheet>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t('settings.gates.name', 'Gate Name')}</TableHead>
              <TableHead>{t('settings.gates.project', 'Project')}</TableHead>
              <TableHead>{t('settings.gates.location', 'Location')}</TableHead>
              <TableHead className="text-center">{t('settings.gates.status', 'Status')}</TableHead>
              <TableHead className="text-center">{t('settings.gates.scans', 'Scans')}</TableHead>
              <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40 text-center text-muted-foreground italic">
                  {gates.length === 0
                    ? t('settings.gates.empty', 'No gates yet. Add your first gate.')
                    : t('settings.gates.noResults', 'No gates match your search.')}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((gate) => (
                <TableRow
                  key={gate.id}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{gate.name}</span>
                      {gate.locationEnforced && gate.latitude != null && (
                        <span className="text-[10px] text-primary font-bold flex items-center gap-1 mt-0.5">
                          <MapPin className="h-2.5 w-2.5" />
                          GPS enforced · {gate.locationRadiusMeters}m
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {gate.projectName ? (
                      <Badge
                        variant="outline"
                        className="font-bold uppercase tracking-tight text-[10px] bg-primary/5 border-primary/20 text-primary"
                      >
                        {gate.projectName}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground/50 italic">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {gate.location ?? '—'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={gate.isActive ? 'default' : 'outline'}
                      className={
                        gate.isActive
                          ? 'bg-success/10 text-success border-success/20 font-bold text-[10px] uppercase'
                          : 'text-muted-foreground font-bold text-[10px] uppercase opacity-60'
                      }
                    >
                      {gate.isActive
                        ? t('settings.gates.active', 'Active')
                        : t('settings.gates.inactive', 'Inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center tabular-nums font-bold text-sm">
                    {gate._count.scanLogs}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isPending}
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 rounded-xl">
                        <GateSheet mode="edit" gate={gate} projects={projects} onSuccess={refresh}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Pencil className="h-4 w-4 mr-2" />
                            {t('common.edit', 'Edit')}
                          </DropdownMenuItem>
                        </GateSheet>
                        <DropdownMenuItem onClick={() => handleToggle(gate)} disabled={isPending}>
                          <Power className="h-4 w-4 mr-2" />
                          {gate.isActive
                            ? t('settings.gates.deactivate', 'Deactivate')
                            : t('settings.gates.activate', 'Activate')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(gate)}
                          disabled={isPending}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('common.delete', 'Delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
