'use client';

import { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  MultiSelect,
} from '@gate-access/ui';
import { EditPanel } from '@/components/dashboard/EditPanel';
import { csrfFetch } from '@/lib/csrf';
import { Pencil, UserPlus, Building2, DoorOpen, UsersRound, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

const UNIT_TYPES = [
  'STUDIO',
  'ONE_BR',
  'TWO_BR',
  'THREE_BR',
  'FOUR_BR',
  'VILLA',
  'PENTHOUSE',
  'COMMERCIAL',
] as const;

type PanelMode =
  | 'project'
  | 'contact'
  | 'unit'
  | 'gate'
  | 'gate-edit'
  | 'gate-assignments'
  | 'watchlist'
  | 'watchlist-edit'
  | null;

interface Gate {
  id: string;
  name: string;
  location?: string | null;
  isActive?: boolean;
}

interface Project {
  id: string;
  name: string;
  description?: string | null;
  location?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  website?: string | null;
}

export interface ProjectDetailActionsRef {
  openGateEdit: (gate: Gate) => void;
}

interface ProjectDetailActionsProps {
  project: Project;
  gates: Gate[];
  locale: string;
  canManageGates: boolean;
}

export const ProjectDetailActions = forwardRef<ProjectDetailActionsRef, ProjectDetailActionsProps>(function ProjectDetailActions({
  project,
  gates,
  locale: _locale,
  canManageGates,
}, ref) {
  const router = useRouter();

  const openGateEdit = useCallback((gate: Gate) => {
    setGateEditId(gate.id);
    setGateEditForm({
      name: gate.name,
      location: gate.location ?? '',
      isActive: gate.isActive ?? true,
    });
    setPanelMode('gate-edit');
    setPanelOpen(true);
  }, []);

  useImperativeHandle(ref, () => ({
    openGateEdit,
  }), [openGateEdit]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<PanelMode>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state: project
  const [projForm, setProjForm] = useState({
    name: project.name,
    description: project.description ?? '',
    location: project.location ?? '',
    logoUrl: project.logoUrl ?? '',
    coverUrl: project.coverUrl ?? '',
    website: project.website ?? '',
  });

  // Form state: contact
  const [contactForm, setContactForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
  });

  // Form state: unit
  const [unitForm, setUnitForm] = useState({
    name: '',
    type: 'STUDIO' as (typeof UNIT_TYPES)[number],
  });

  // Form state: gate (add)
  const [gateForm, setGateForm] = useState({
    name: '',
    location: '',
    isActive: true,
  });

  // Form state: gate edit
  const [gateEditId, setGateEditId] = useState<string | null>(null);
  const [gateEditForm, setGateEditForm] = useState({ name: '', location: '', isActive: true });

  // Form state: gate assignments
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [assignments, setAssignments] = useState<
    { id: string; userId: string; gateId: string; user: { id: string; name: string | null; email: string }; gate: { id: string; name: string } }[]
  >([]);
  const [assignForm, setAssignForm] = useState({ userId: '', gateIds: [] as string[] });
  const [allOrgGates, setAllOrgGates] = useState<Gate[]>([]);

  // Form state: watchlist
  const [watchlistEntries, setWatchlistEntries] = useState<
    { id: string; name: string; idNumber?: string | null; phone?: string | null; notes?: string | null }[]
  >([]);
  const [watchlistForm, setWatchlistForm] = useState({
    name: '',
    idNumber: '',
    phone: '',
    notes: '',
  });
  const [watchlistEditId, setWatchlistEditId] = useState<string | null>(null);
  const [watchlistLoaded, setWatchlistLoaded] = useState(false);

  const refresh = useCallback(() => router.refresh(), [router]);

  const openPanel = (mode: PanelMode) => {
    setPanelMode(mode);
    if (mode === 'project') {
      setProjForm({
        name: project.name,
        description: project.description ?? '',
        location: project.location ?? '',
        logoUrl: project.logoUrl ?? '',
        coverUrl: project.coverUrl ?? '',
        website: project.website ?? '',
      });
    } else if (mode === 'contact') {
      setContactForm({ firstName: '', lastName: '', email: '', phone: '', company: '' });
    } else if (mode === 'unit') {
      setUnitForm({ name: '', type: 'STUDIO' });
    } else if (mode === 'gate') {
      setGateForm({ name: '', location: '', isActive: true });
    } else if (mode === 'gate-edit') {
      // Set by caller when opening with gate
    } else if (mode === 'gate-assignments') {
      setAssignForm({ userId: '', gateIds: [] });
      Promise.all([
        fetch('/api/users').then((r) => r.json()),
        fetch(`/api/gates/assignments?project=${project.id}`).then((r) => r.json()),
        fetch('/api/gates').then((r) => r.json()),
      ]).then(([uRes, aRes, gRes]) => {
        if (uRes.success && Array.isArray(uRes.data)) setUsers(uRes.data);
        if (aRes.success && Array.isArray(aRes.data)) setAssignments(aRes.data);
        if (gRes.success && Array.isArray(gRes.data)) {
          setAllOrgGates(gRes.data);
        }
      });
    } else if (mode === 'watchlist' || mode === 'watchlist-edit') {
      setWatchlistForm({ name: '', idNumber: '', phone: '', notes: '' });
      setWatchlistEditId(null);
      if (!watchlistLoaded) {
        fetch('/api/watchlist')
          .then((r) => r.json())
          .then((res) => {
            if (res.success && Array.isArray(res.data)) setWatchlistEntries(res.data);
            setWatchlistLoaded(true);
          });
      }
    }
    setPanelOpen(true);
  };


  const openWatchlistEdit = (entry: { id: string; name: string; idNumber?: string | null; phone?: string | null; notes?: string | null }) => {
    setWatchlistEditId(entry.id);
    setWatchlistForm({
      name: entry.name,
      idNumber: entry.idNumber ?? '',
      phone: entry.phone ?? '',
      notes: entry.notes ?? '',
    });
    setPanelMode('watchlist-edit');
    setPanelOpen(true);
  };

  const handleSaveProject = async () => {
    setIsSaving(true);
    try {
      const res = await csrfFetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: projForm.name,
          description: projForm.description || null,
          location: projForm.location || null,
          logoUrl: projForm.logoUrl || null,
          coverUrl: projForm.coverUrl || null,
          website: projForm.website || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update project');
      }
      toast.success('Project updated');
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContact = async () => {
    setIsSaving(true);
    try {
      const res = await csrfFetch('/api/contacts', {
        method: 'POST',
        body: JSON.stringify({
          firstName: contactForm.firstName,
          lastName: contactForm.lastName,
          email: contactForm.email || null,
          phone: contactForm.phone || null,
          company: contactForm.company || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add contact');
      }
      toast.success('Contact added');
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveUnit = async () => {
    setIsSaving(true);
    try {
      const res = await csrfFetch('/api/units', {
        method: 'POST',
        body: JSON.stringify({
          name: unitForm.name,
          type: unitForm.type,
          projectId: project.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add unit');
      }
      toast.success('Unit added');
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveGate = async () => {
    setIsSaving(true);
    try {
      const res = await csrfFetch('/api/gates', {
        method: 'POST',
        body: JSON.stringify({
          name: gateForm.name,
          location: gateForm.location || null,
          projectId: project.id,
          isActive: gateForm.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to add gate');
      }
      toast.success('Gate added');
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveGateEdit = async () => {
    if (!gateEditId) return;
    setIsSaving(true);
    try {
      const res = await csrfFetch('/api/gates', {
        method: 'PATCH',
        body: JSON.stringify({
          id: gateEditId,
          name: gateEditForm.name,
          location: gateEditForm.location || null,
          isActive: gateEditForm.isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update gate');
      }
      toast.success('Gate updated');
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAssignments = async () => {
    if (!assignForm.userId || assignForm.gateIds.length === 0) {
      toast.error('Select a user and at least one gate');
      return;
    }
    setIsSaving(true);
    try {
      const res = await csrfFetch('/api/gates/assignments', {
        method: 'POST',
        body: JSON.stringify({
          userId: assignForm.userId,
          gateIds: assignForm.gateIds,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to assign');
      }
      toast.success('Assignment added');
      setAssignForm({ userId: '', gateIds: [] });
      fetch(`/api/gates/assignments?project=${project.id}`)
        .then((r) => r.json())
        .then((aRes) => {
          if (aRes.success && Array.isArray(aRes.data)) setAssignments(aRes.data);
        });
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnassign = async (userId: string, gateId: string) => {
    try {
      const res = await csrfFetch('/api/gates/assignments', {
        method: 'DELETE',
        body: JSON.stringify({ userId, gateId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to unassign');
      }
      toast.success('Unassigned');
      const aRes = await fetch(`/api/gates/assignments?project=${project.id}`).then((r) => r.json());
      if (aRes.success && Array.isArray(aRes.data)) setAssignments(aRes.data);
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const handleSaveWatchlist = async () => {
    setIsSaving(true);
    try {
      if (watchlistEditId) {
        const res = await csrfFetch(`/api/watchlist/${watchlistEditId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            name: watchlistForm.name,
            idNumber: watchlistForm.idNumber || null,
            phone: watchlistForm.phone || null,
            notes: watchlistForm.notes || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update');
        toast.success('Watchlist entry updated');
      } else {
        const res = await csrfFetch('/api/watchlist', {
          method: 'POST',
          body: JSON.stringify({
            name: watchlistForm.name,
            idNumber: watchlistForm.idNumber || null,
            phone: watchlistForm.phone || null,
            notes: watchlistForm.notes || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to add');
        toast.success('Watchlist entry added');
      }
      setWatchlistForm({ name: '', idNumber: '', phone: '', notes: '' });
      setWatchlistEditId(null);
      const wRes = await fetch('/api/watchlist').then((r) => r.json());
      if (wRes.success && Array.isArray(wRes.data)) setWatchlistEntries(wRes.data);
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const getPanelConfig = () => {
    switch (panelMode) {
      case 'project':
        return {
          title: 'Edit project',
          onSave: handleSaveProject,
          children: (
            <div className="space-y-4">
              <div>
                <Label htmlFor="proj-name" className="text-foreground">
                  Name
                </Label>
                <Input
                  id="proj-name"
                  value={projForm.name}
                  onChange={(e) => setProjForm((p) => ({ ...p, name: e.target.value }))}
                  className="mt-1 border-border bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="proj-desc" className="text-foreground">
                  Description
                </Label>
                <textarea
                  id="proj-desc"
                  value={projForm.description}
                  onChange={(e) => setProjForm((p) => ({ ...p, description: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="proj-location" className="text-foreground">
                  Location
                </Label>
                <Input
                  id="proj-location"
                  value={projForm.location}
                  onChange={(e) => setProjForm((p) => ({ ...p, location: e.target.value }))}
                  className="mt-1 border-border bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="proj-cover" className="text-foreground">
                  Cover URL
                </Label>
                <Input
                  id="proj-cover"
                  type="url"
                  value={projForm.coverUrl}
                  onChange={(e) => setProjForm((p) => ({ ...p, coverUrl: e.target.value }))}
                  className="mt-1 border-border bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="proj-website" className="text-foreground">
                  Website
                </Label>
                <Input
                  id="proj-website"
                  type="url"
                  value={projForm.website}
                  onChange={(e) => setProjForm((p) => ({ ...p, website: e.target.value }))}
                  className="mt-1 border-border bg-background text-foreground"
                />
              </div>
            </div>
          ),
        };
      case 'contact':
        return {
          title: 'Add contact',
          onSave: handleSaveContact,
          children: (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cont-first" className="text-foreground">
                    First name
                  </Label>
                  <Input
                    id="cont-first"
                    value={contactForm.firstName}
                    onChange={(e) => setContactForm((c) => ({ ...c, firstName: e.target.value }))}
                    className="mt-1 border-border bg-background text-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="cont-last" className="text-foreground">
                    Last name
                  </Label>
                  <Input
                    id="cont-last"
                    value={contactForm.lastName}
                    onChange={(e) => setContactForm((c) => ({ ...c, lastName: e.target.value }))}
                    className="mt-1 border-border bg-background text-foreground"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cont-email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="cont-email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm((c) => ({ ...c, email: e.target.value }))}
                  className="mt-1 border-border bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="cont-phone" className="text-foreground">
                  Phone
                </Label>
                <Input
                  id="cont-phone"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm((c) => ({ ...c, phone: e.target.value }))}
                  className="mt-1 border-border bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="cont-company" className="text-foreground">
                  Company
                </Label>
                <Input
                  id="cont-company"
                  value={contactForm.company}
                  onChange={(e) => setContactForm((c) => ({ ...c, company: e.target.value }))}
                  className="mt-1 border-border bg-background text-foreground"
                />
              </div>
            </div>
          ),
        };
      case 'unit':
        return {
          title: 'Add unit',
          onSave: handleSaveUnit,
          children: (
            <div className="space-y-4">
              <div>
                <Label htmlFor="unit-name" className="text-foreground">
                  Name
                </Label>
                <Input
                  id="unit-name"
                  value={unitForm.name}
                  onChange={(e) => setUnitForm((u) => ({ ...u, name: e.target.value }))}
                  className="mt-1 border-border bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="unit-type" className="text-foreground">
                  Type
                </Label>
                <Select
                  value={unitForm.type}
                  onValueChange={(v) => setUnitForm((u) => ({ ...u, type: v as (typeof UNIT_TYPES)[number] }))}
                >
                  <SelectTrigger id="unit-type" className="mt-1 border-border bg-background text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ),
        };
      case 'gate':
        return {
          title: 'Add gate',
          onSave: handleSaveGate,
          children: (
            <div className="space-y-4">
              <div>
                <Label htmlFor="gate-name" className="text-foreground">
                  Name
                </Label>
                <Input
                  id="gate-name"
                  value={gateForm.name}
                  onChange={(e) => setGateForm((g) => ({ ...g, name: e.target.value }))}
                  className="mt-1 border-border bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="gate-location" className="text-foreground">
                  Location
                </Label>
                <Input
                  id="gate-location"
                  value={gateForm.location}
                  onChange={(e) => setGateForm((g) => ({ ...g, location: e.target.value }))}
                  className="mt-1 border-border bg-background text-foreground"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="gate-active"
                  checked={gateForm.isActive}
                  onChange={(e) => setGateForm((g) => ({ ...g, isActive: e.target.checked }))}
                  className="rounded border-border"
                />
                <Label htmlFor="gate-active" className="text-foreground">
                  Active
                </Label>
              </div>
            </div>
          ),
        };
      case 'gate-edit':
        return {
          title: 'Edit gate',
          onSave: handleSaveGateEdit,
          children: (
            <div className="space-y-4">
              <div>
                <Label htmlFor="gate-edit-name" className="text-foreground">
                  Name
                </Label>
                <Input
                  id="gate-edit-name"
                  value={gateEditForm.name}
                  onChange={(e) => setGateEditForm((g) => ({ ...g, name: e.target.value }))}
                  className="mt-1 border-border bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="gate-edit-location" className="text-foreground">
                  Location
                </Label>
                <Input
                  id="gate-edit-location"
                  value={gateEditForm.location}
                  onChange={(e) => setGateEditForm((g) => ({ ...g, location: e.target.value }))}
                  className="mt-1 border-border bg-background text-foreground"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="gate-edit-active"
                  checked={gateEditForm.isActive}
                  onChange={(e) => setGateEditForm((g) => ({ ...g, isActive: e.target.checked }))}
                  className="rounded border-border"
                />
                <Label htmlFor="gate-edit-active" className="text-foreground">
                  Active
                </Label>
              </div>
            </div>
          ),
        };
      case 'gate-assignments':
        return {
          title: 'Manage gate assignments',
          onSave: handleSaveAssignments,
          children: (
            <div className="space-y-4">
              <div>
                <Label className="text-foreground">Assign user to gates</Label>
                <div className="mt-2 flex gap-2">
                  <Select value={assignForm.userId} onValueChange={(v) => setAssignForm((a) => ({ ...a, userId: v }))}>
                    <SelectTrigger className="flex-1 border-border bg-background text-foreground">
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name || u.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <MultiSelect
                    options={(allOrgGates.length ? allOrgGates : gates).map((g) => ({ label: g.name, value: g.id }))}
                    selected={assignForm.gateIds}
                    onChange={(ids) => setAssignForm((a) => ({ ...a, gateIds: ids }))}
                    placeholder="Select gates"
                  />
                </div>
              </div>
              {assignments.length > 0 && (
                <div>
                  <Label className="text-foreground">Current assignments</Label>
                  <ul className="mt-2 space-y-1">
                    {assignments.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center justify-between rounded border border-border bg-muted/30 px-2 py-1 text-sm text-foreground"
                      >
                        <span>
                          {a.user.name || a.user.email} → {a.gate.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleUnassign(a.userId, a.gateId)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ),
        };
      case 'watchlist':
      case 'watchlist-edit':
        return {
          title: watchlistEditId ? 'Edit watchlist entry' : 'Add watchlist entry',
          onSave: handleSaveWatchlist,
          children: (
            <div className="space-y-4">
              {panelMode === 'watchlist-edit' && watchlistEntries.length > 0 && (
                <div>
                  <Label className="text-foreground">Or select another entry to edit</Label>
                  <Select
                    value={watchlistEditId ?? ''}
                    onValueChange={(v) => {
                      const entry = watchlistEntries.find((e) => e.id === v);
                      if (entry) openWatchlistEdit(entry);
                    }}
                  >
                    <SelectTrigger className="mt-1 border-border bg-background text-foreground">
                      <SelectValue placeholder="Select entry" />
                    </SelectTrigger>
                    <SelectContent>
                      {watchlistEntries.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor="wl-name" className="text-foreground">
                  Name
                </Label>
                <Input
                  id="wl-name"
                  value={watchlistForm.name}
                  onChange={(e) => setWatchlistForm((w) => ({ ...w, name: e.target.value }))}
                  className="mt-1 border-border bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="wl-id" className="text-foreground">
                  ID number
                </Label>
                <Input
                  id="wl-id"
                  value={watchlistForm.idNumber}
                  onChange={(e) => setWatchlistForm((w) => ({ ...w, idNumber: e.target.value }))}
                  className="mt-1 border-border bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="wl-phone" className="text-foreground">
                  Phone
                </Label>
                <Input
                  id="wl-phone"
                  value={watchlistForm.phone}
                  onChange={(e) => setWatchlistForm((w) => ({ ...w, phone: e.target.value }))}
                  className="mt-1 border-border bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="wl-notes" className="text-foreground">
                  Notes
                </Label>
                <textarea
                  id="wl-notes"
                  value={watchlistForm.notes}
                  onChange={(e) => setWatchlistForm((w) => ({ ...w, notes: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground"
                  rows={2}
                />
              </div>
            </div>
          ),
        };
      default:
        return { title: '', onSave: undefined, children: null };
    }
  };

  const config = panelMode ? getPanelConfig() : null;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-border text-foreground"
          onClick={() => openPanel('project')}
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit project
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-border text-foreground"
          onClick={() => openPanel('contact')}
        >
          <UserPlus className="h-3.5 w-3.5" />
          Add contact
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-border text-foreground"
          onClick={() => openPanel('unit')}
        >
          <Building2 className="h-3.5 w-3.5" />
          Add unit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-border text-foreground"
          onClick={() => openPanel('gate')}
        >
          <DoorOpen className="h-3.5 w-3.5" />
          Add gate
        </Button>
        {canManageGates && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-border text-foreground"
              onClick={() => openPanel('gate-assignments')}
            >
              <UsersRound className="h-3.5 w-3.5" />
              Manage assignments
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-border text-foreground"
              onClick={() => openPanel('watchlist')}
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              Watchlist
            </Button>
          </>
        )}
      </div>

      {config && (
        <EditPanel
          open={panelOpen}
          onOpenChange={setPanelOpen}
          title={config.title}
          onSave={config.onSave}
          isSaving={isSaving}
          saveLabel="Save"
        >
          {config.children}
        </EditPanel>
      )}

    </>
  );
});
