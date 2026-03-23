'use client';

import React, { useState, useMemo } from 'react';
import { 
  AdvancedTable, 
  Button, 
  cn,
  Badge,
} from '@gate-access/ui';
import { useDataTable } from '@/hooks/use-data-table';
import { 
  Building, 
  Download, 
  Trash2, 
  Pencil, 
  Users, 
  Maximize2 
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { EditPanel } from '../dashboard/EditPanel';
import { UnitForm } from './UnitForm';

interface Unit {
  id: string;
  name: string;
  type: string;
  building: string | null;
  sizeSqm: number | null;
  project: { id: string; name: string } | null;
  contacts: { contact: { id: string; firstName: string; lastName: string } }[];
}

interface UnitTableProps {
  projectId?: string;
  locale: string;
}

export function UnitTable({ projectId, locale }: UnitTableProps) {
  const { t } = useTranslation('dashboard');
  const queryClient = useQueryClient();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const { state, onPageChange, onPageSizeChange, onSortingChange, onGlobalFilterChange } = useDataTable({
    defaultPageSize: 25,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['crm', 'units', projectId, state],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(state.pageIndex + 1),
        pageSize: String(state.pageSize),
        search: state.globalFilter,
        sort: state.sorting[0]?.id || 'name',
        sortDir: state.sorting[0]?.desc ? 'desc' : 'asc',
        ...(projectId && { projectId }),
      });
      const res = await fetch(`/api/crm/units?${params}`);
      if (!res.ok) throw new Error('Failed to fetch units');
      return res.json();
    },
  });

  const { data: contactsData } = useQuery({
    queryKey: ['crm', 'contacts-lookup', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/crm/contacts?pageSize=100${projectId ? `&projectId=${projectId}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch contacts');
      return res.json();
    },
  });

  const contactOptions = useMemo(() => 
    contactsData?.data?.map((c: any) => ({ label: `${c.firstName} ${c.lastName}`, value: c.id })) || [], 
  [contactsData]);

  const saveMutation = useMutation({
    mutationFn: async (values: any) => {
      const url = selectedUnit 
        ? `/api/crm/units/${selectedUnit.id}` 
        : '/api/crm/units';
      const res = await fetch(url, {
        method: selectedUnit ? 'PATCH' : 'POST',
        body: JSON.stringify({ ...values, projectId }),
      });
      if (!res.ok) throw new Error('Failed to save unit');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'units'] });
      toast.success(selectedUnit ? t('crm.units.updated') : t('crm.units.created'));
      setIsPanelOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map(id => 
        fetch(`/api/crm/units/${id}`, { method: 'DELETE' })
      ));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'units'] });
      toast.success(t('crm.units.batchDeleted', 'Units deleted successfully'));
      setSelectedIds([]);
    },
  });

  const handleCreate = () => {
    setSelectedUnit(null);
    setIsPanelOpen(true);
  };

  const handleEdit = (unit: Unit) => {
    setSelectedUnit(unit);
    setIsPanelOpen(true);
  };

  const handleExport = () => {
    const headers = ['Name', 'Type', 'Building', 'Size (sqm)', 'Project', 'Residents'];
    const rows = data?.data?.map((u: Unit) => [
      u.name,
      u.type,
      u.building || '',
      u.sizeSqm || '',
      u.project?.name || '',
      u.contacts.map(c => `${c.contact.firstName} ${c.contact.lastName}`).join('; ')
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `units-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const columns = [
    {
      key: 'name',
      label: t('crm.units.unitName', 'Unit identifier'),
      isSortable: true,
      render: (u: Unit) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-[var(--ds-background-brand-subtle)] flex items-center justify-center text-[var(--ds-text-brand)]">
            <Building className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[var(--ds-text)]">{u.name}</span>
            <span className="text-[10px] text-[var(--ds-text-subtle)] font-bold uppercase tracking-wider">{u.building || 'Generic Area'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      label: t('crm.units.category', 'Type'),
      isSortable: true,
      render: (u: Unit) => (
        <Badge variant="outline" className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 border-[#DFE1E6] bg-[#FAFBFC] text-[#6B778C]">
          {u.type.replace('_', ' ')}
        </Badge>
      )
    },
    {
      key: 'residents',
      label: t('crm.units.residents', 'Assigned Contacts'),
      render: (u: Unit) => (
        <div className="flex items-center gap-1.5">
           <div className="flex -space-x-2">
             {u.contacts.slice(0, 3).map((c, i) => (
               <div key={i} className="h-6 w-6 rounded-full bg-[var(--ds-background-neutral)] border-2 border-background flex items-center justify-center text-[8px] font-black text-[var(--ds-text-subtle)]">
                 {c.contact.firstName[0]}{c.contact.lastName[0]}
               </div>
             ))}
             {u.contacts.length > 3 && (
               <div className="h-6 w-6 rounded-full bg-[var(--ds-background-neutral-subtle)] border-2 border-background flex items-center justify-center text-[8px] font-black text-[var(--ds-text-subtlest)]">
                 +{u.contacts.length - 3}
               </div>
             )}
           </div>
           {u.contacts.length === 0 && <span className="text-[var(--ds-text-subtlest)] text-xs italic">Vacant</span>}
        </div>
      )
    },
    {
      key: 'sizeSqm',
      label: t('crm.units.area', 'Area (sqm)'),
      isSortable: true,
      render: (u: Unit) => u.sizeSqm ? (
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--ds-text-subtle)]">
          <Maximize2 className="h-3 w-3" />
          {u.sizeSqm}m²
        </div>
      ) : null
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Button onClick={handleCreate} className="h-10 rounded-xl bg-[#00875A] hover:bg-[#00875A]/90 text-white font-bold gap-2 shadow-sm">
             <Building className="h-4 w-4" />
             {t('crm.units.addNew', 'Add Unit')}
           </Button>
           <Button variant="outline" onClick={handleExport} className="h-10 rounded-xl border-border/60 font-bold gap-2">
             <Download className="h-4 w-4" />
             {t('common.export', 'Export')}
           </Button>
        </div>
      </div>

      <AdvancedTable
        columns={columns as any}
        data={data?.data || []}
        pageIndex={state.pageIndex}
        pageSize={state.pageSize}
        pageCount={Math.ceil((data?.total || 0) / state.pageSize)}
        sorting={state.sorting}
        globalFilter={state.globalFilter}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onSortingChange={onSortingChange}
        onGlobalFilterChange={onGlobalFilterChange}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onRowClick={handleEdit}
        bulkActions={
          <Button 
            variant="destructive" 
            size="sm" 
            className="h-8 rounded-lg gap-2"
            onClick={() => deleteMutation.mutate(selectedIds as string[])}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete Selected
          </Button>
        }
        rowActions={(u) => (
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleEdit(u)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        )}
      />

      <EditPanel
        open={isPanelOpen}
        onOpenChange={setIsPanelOpen}
        title={selectedUnit ? t('crm.units.editTitle', 'Edit Unit') : t('crm.units.addTitle', 'Add New Unit')}
        onSave={() => { document.getElementById('unit-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); }}
        isSaving={saveMutation.isPending}
      >
        <UnitForm
          initialData={selectedUnit ? {
            name: selectedUnit.name,
            type: selectedUnit.type as any,
            building: selectedUnit.building,
            sizeSqm: selectedUnit.sizeSqm,
            contactIds: selectedUnit.contacts.map(c => c.contact.id),
          } : undefined}
          contactOptions={contactOptions}
          onSubmit={async (vals) => {
             saveMutation.mutate(vals);
          }}
        />
      </EditPanel>
    </div>
  );
}
