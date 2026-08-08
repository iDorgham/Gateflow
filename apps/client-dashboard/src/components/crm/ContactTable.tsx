'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AdvancedTable, Button, Badge, cn, EmptyState } from '@gateflow/ui';
import { useDataTable } from '@/hooks/use-data-table';
import { useUserPreferences } from '@/lib/residents/use-user-preferences';
import {
  UserPlus,
  Download,
  Trash2,
  Pencil,
  Mail,
  Phone,
  Building,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { EditPanel } from '../dashboard/EditPanel';
import { ContactForm } from './ContactForm';
import { SavedViewManager } from './SavedViewManager';
import { csrfFetch } from '@/lib/csrf';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  jobTitle: string | null;
  company: string | null;
  units: { id: string; name: string }[];
}

interface ContactTableProps {
  projectId?: string;
  locale: string;
}

export function ContactTable({
  projectId,
  locale: _locale,
}: ContactTableProps) {
  const { t } = useTranslation('dashboard');
  const queryClient = useQueryClient();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const { preferences, updatePreferences } = useUserPreferences();
  const tableViews = preferences.tableViews?.contacts;
  const [density, setDensity] = useState<'compact' | 'comfortable'>(
    (tableViews?.density as 'compact' | 'comfortable') || 'comfortable'
  );
  const [activeView, setActiveView] = useState<string | undefined>(
    tableViews?.activeView
  );

  useEffect(() => {
    if (tableViews?.density) {
      setDensity(tableViews.density as 'compact' | 'comfortable');
    }
  }, [tableViews?.density]);

  const handleDensityChange = async (newDensity: 'compact' | 'comfortable') => {
    setDensity(newDensity);
    await updatePreferences({
      tableViews: {
        contacts: { ...tableViews, density: newDensity },
      },
    });
  };

  const handleViewSelect = (viewId: string | undefined) => {
    setActiveView(viewId);
    if (viewId && tableViews?.savedViews?.[viewId]) {
      const view = tableViews.savedViews[viewId];
      console.log('Applying saved view:', view);
    }
  };

  const handleViewSave = async (name: string) => {
    const newViewId = `view_${Date.now()}`;
    const currentSavedViews =
      (tableViews?.savedViews as Record<
        string,
        {
          name: string;
          columnOrder?: string[];
          columnVisibility?: Record<string, boolean>;
        }
      >) || {};
    const newView = {
      name,
      columnOrder: [] as string[],
      columnVisibility: {} as Record<string, boolean>,
    };
    await updatePreferences({
      tableViews: {
        contacts: {
          ...tableViews,
          savedViews: {
            ...currentSavedViews,
            [newViewId]: newView,
          },
          activeView: newViewId,
        },
      },
    });
    setActiveView(newViewId);
    toast.success(t('crm.tables.viewSaved', 'View saved'));
  };

  const handleViewDelete = async (viewId: string) => {
    const remaining = { ...(tableViews?.savedViews || {}) };
    delete remaining[viewId];
    await updatePreferences({
      tableViews: {
        contacts: {
          ...tableViews,
          savedViews: remaining,
          activeView: activeView === viewId ? undefined : activeView,
        },
      },
    });
    if (activeView === viewId) {
      setActiveView(undefined);
    }
  };

  const {
    state,
    onPageChange,
    onPageSizeChange,
    onSortingChange,
    onGlobalFilterChange,
  } = useDataTable({
    defaultPageSize: 25,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['crm', 'contacts', projectId, state],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(state.pageIndex + 1),
        pageSize: String(state.pageSize),
        search: state.globalFilter,
        sort: state.sorting[0]?.id || 'firstName',
        sortDir: state.sorting[0]?.desc ? 'desc' : 'asc',
        ...(projectId && { projectId }),
      });
      const res = await fetch(`/api/crm/contacts?${params}`);
      if (!res.ok) throw new Error('Failed to fetch contacts');
      return res.json();
    },
  });

  const { data: unitsData } = useQuery({
    queryKey: ['crm', 'units-lookup', projectId],
    queryFn: async () => {
      const res = await fetch(
        `/api/crm/units?pageSize=100${projectId ? `&projectId=${projectId}` : ''}`
      );
      if (!res.ok) throw new Error('Failed to fetch units');
      return res.json();
    },
  });

  const unitOptions = useMemo(
    () =>
      (unitsData?.data as Array<{ name: string; id: string }>)?.map((u) => ({
        label: u.name,
        value: u.id,
      })) || [],
    [unitsData]
  );

  const saveMutation = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      const url = selectedContact
        ? `/api/crm/contacts/${selectedContact.id}`
        : '/api/crm/contacts';
      const res = await csrfFetch(url, {
        method: selectedContact ? 'PATCH' : 'POST',
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Failed to save contact');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'contacts'] });
      toast.success(
        selectedContact ? t('crm.contacts.updated') : t('crm.contacts.created')
      );
      setIsPanelOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.all(
        ids.map((id) =>
          csrfFetch(`/api/crm/contacts/${id}`, { method: 'DELETE' })
        )
      );
      const failures = results.filter((res) => !res.ok);
      if (failures.length > 0) {
        throw new Error(
          `Failed to delete ${failures.length} of ${ids.length} contact(s)`
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'contacts'] });
      toast.success(
        t('crm.contacts.batchDeleted', 'Contacts deleted successfully')
      );
      setSelectedIds([]);
    },
    onError: (error: Error) => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'contacts'] });
      toast.error(error.message);
    },
  });

  const handleCreate = () => {
    setSelectedContact(null);
    setIsPanelOpen(true);
  };

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setIsPanelOpen(true);
  };

  const handleExport = () => {
    // Basic CSV export logic
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Company',
      'Units',
    ];
    const rows = data?.data?.map((c: Contact) => [
      c.firstName,
      c.lastName,
      c.email || '',
      c.phone || '',
      c.company || '',
      c.units.map((u) => u.name).join('; '),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const columns = [
    {
      key: 'name',
      label: t('crm.contacts.name', 'Contact Name'),
      isSortable: true,
      render: (c: Contact) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[var(--ds-background-neutral-subtle)] flex items-center justify-center text-xs font-bold text-[var(--ds-text-subtle)]">
            {c.firstName[0]}
            {c.lastName[0]}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[var(--ds-text)]">
              {c.firstName} {c.lastName}
            </span>
            <span className="text-[10px] text-[var(--ds-text-subtle)] uppercase tracking-wider">
              {c.jobTitle || 'No Title'}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'contactInfo',
      label: t('crm.contacts.info', 'Contact Info'),
      render: (c: Contact) => (
        <div className="flex flex-col gap-1">
          {c.email && (
            <div className="flex items-center gap-2 text-xs text-[var(--ds-text-subtle)]">
              <Mail className="h-3 w-3" />
              {c.email}
            </div>
          )}
          {c.phone && (
            <div className="flex items-center gap-2 text-xs text-[var(--ds-text-subtle)]">
              <Phone className="h-3 w-3" />
              {c.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'units',
      label: t('crm.contacts.units', 'Units'),
      render: (c: Contact) => (
        <div className="flex flex-wrap gap-1">
          {c.units.length > 0 ? (
            c.units.map((u) => (
              <Badge
                key={u.id}
                variant="secondary"
                className={cn(
                  'text-[10px] font-bold border-none',
                  'bg-[var(--ds-background-selected)] text-[var(--ds-text-selected)]'
                )}
              >
                {u.name}
              </Badge>
            ))
          ) : (
            <span className="text-[var(--ds-text-subtlest)] text-xs italic">
              Unassigned
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'company',
      label: t('crm.contacts.company', 'Association'),
      isSortable: true,
      render: (c: Contact) =>
        c.company ? (
          <div className="flex items-center gap-2 text-sm font-medium">
            <Building className="h-3.5 w-3.5 text-[var(--ds-icon-subtle)]" />
            {c.company}
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCreate}
            className="h-10 rounded-xl bg-[var(--primary)] font-bold gap-2"
          >
            <UserPlus className="h-4 w-4" />
            {t('crm.contacts.addNew', 'Add Contact')}
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            className="h-10 rounded-xl border-border/60 font-bold gap-2"
          >
            <Download className="h-4 w-4" />
            {t('common.export', 'Export')}
          </Button>
        </div>
        <SavedViewManager
          activeView={activeView}
          savedViews={
            tableViews?.savedViews as
              | Record<
                  string,
                  {
                    id: string;
                    name: string;
                    columnOrder?: string[];
                    columnVisibility?: Record<string, boolean>;
                  }
                >
              | undefined
          }
          onViewSelect={handleViewSelect}
          onViewSave={handleViewSave}
          onViewDelete={handleViewDelete}
        />
      </div>

      <AdvancedTable
        columns={columns as never}
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
        density={density}
        onDensityChange={handleDensityChange}
        activeView={activeView}
        emptyState={
          <EmptyState
            icon={UserPlus}
            title={t('crm.contacts.emptyTitle', 'No contacts yet')}
            description={t(
              'crm.contacts.emptyDescription',
              'Add your first contact to start managing residents.'
            )}
            className="min-h-[240px]"
          />
        }
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
        rowActions={(c) => (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => handleEdit(c)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        )}
      />

      <EditPanel
        open={isPanelOpen}
        onOpenChange={setIsPanelOpen}
        title={
          selectedContact
            ? t('crm.contacts.editTitle', 'Edit Contact')
            : t('crm.contacts.addTitle', 'Add New Contact')
        }
        onSave={() => {
          document
            .getElementById('contact-form')
            ?.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true })
            );
        }}
        isSaving={saveMutation.isPending}
      >
        <ContactForm
          initialData={
            selectedContact
              ? {
                  firstName: selectedContact.firstName,
                  lastName: selectedContact.lastName,
                  email: selectedContact.email || '',
                  phone: selectedContact.phone || '',
                  jobTitle: selectedContact.jobTitle || '',
                  company: selectedContact.company || '',
                  unitIds: selectedContact.units.map((u) => u.id),
                }
              : undefined
          }
          unitOptions={unitOptions}
          onSubmit={async (vals) => {
            saveMutation.mutate(vals);
          }}
        />
      </EditPanel>
    </div>
  );
}
