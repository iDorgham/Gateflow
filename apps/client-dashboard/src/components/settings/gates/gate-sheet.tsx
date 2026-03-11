'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  Button,
  Input,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Switch,
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { csrfFetch } from '@/lib/csrf';
import { MapPin, DoorOpen } from 'lucide-react';
import type { GateRow } from './gate-table';

interface Project {
  id: string;
  name: string;
}

interface GateSheetProps {
  mode: 'create' | 'edit';
  gate?: GateRow;
  projects: Project[];
  onSuccess: () => void;
  children: React.ReactNode;
}

export function GateSheet({ mode, gate, projects, onSuccess, children }: GateSheetProps) {
  const { t } = useTranslation('dashboard');
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [projectId, setProjectId] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radiusMeters, setRadiusMeters] = useState('');
  const [locationEnforced, setLocationEnforced] = useState(false);
  const [identityLevel, setIdentityLevel] = useState('');

  useEffect(() => {
    if (open) {
      setName(gate?.name ?? '');
      setLocation(gate?.location ?? '');
      setProjectId(gate?.projectId ?? '');
      setLatitude(gate?.latitude != null ? String(gate.latitude) : '');
      setLongitude(gate?.longitude != null ? String(gate.longitude) : '');
      setRadiusMeters(gate?.locationRadiusMeters != null ? String(gate.locationRadiusMeters) : '');
      setLocationEnforced(gate?.locationEnforced ?? false);
      setIdentityLevel(gate?.requiredIdentityLevel != null ? String(gate.requiredIdentityLevel) : '');
    }
  }, [open, gate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(t('settings.gates.nameRequired', 'Gate name is required'));
      return;
    }

    // Validate GPS if location enforcement is on
    const lat = latitude ? parseFloat(latitude) : null;
    const lng = longitude ? parseFloat(longitude) : null;
    const radius = radiusMeters ? parseInt(radiusMeters, 10) : null;

    if (locationEnforced && (lat == null || lng == null || radius == null)) {
      toast.error(t('settings.gates.gpsRequired', 'GPS coordinates and radius are required when enforcement is enabled'));
      return;
    }
    if (lat != null && (lat < -90 || lat > 90)) {
      toast.error(t('settings.gates.latInvalid', 'Latitude must be between -90 and 90'));
      return;
    }
    if (lng != null && (lng < -180 || lng > 180)) {
      toast.error(t('settings.gates.lngInvalid', 'Longitude must be between -180 and 180'));
      return;
    }

    startTransition(async () => {
      const body: Record<string, unknown> = {
        name: name.trim(),
        location: location.trim() || null,
        projectId: projectId || null,
        latitude: lat,
        longitude: lng,
        locationRadiusMeters: radius,
        locationEnforced,
        requiredIdentityLevel: identityLevel !== '' ? parseInt(identityLevel, 10) : null,
      };

      let res: Response;
      if (mode === 'create') {
        res = await csrfFetch('/api/gates', { method: 'POST', body: JSON.stringify(body) });
      } else {
        body.id = gate!.id;
        res = await csrfFetch('/api/gates', { method: 'PATCH', body: JSON.stringify(body) });
      }

      if (res.ok) {
        toast.success(
          mode === 'create'
            ? t('settings.gates.created', 'Gate created successfully')
            : t('settings.gates.updated', 'Gate updated successfully')
        );
        setOpen(false);
        onSuccess();
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        toast.error(data.error ?? t('common.error', 'An error occurred'));
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-8 bg-primary/5 space-y-2 shrink-0">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
            <DoorOpen className="h-6 w-6 text-primary" />
          </div>
          <SheetTitle className="text-xl font-black uppercase tracking-tight">
            {mode === 'create'
              ? t('settings.gates.addTitle', 'Add Gate')
              : t('settings.gates.editTitle', 'Edit Gate')}
          </SheetTitle>
          <SheetDescription>
            {t('settings.gates.sheetDesc', 'Configure gate details, project assignment, and GPS enforcement.')}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-8 space-y-6 flex-1">
            {/* Gate name */}
            <div className="space-y-2">
              <Label htmlFor="gate-name" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                {t('settings.gates.nameLabel', 'Gate Name')} *
              </Label>
              <Input
                id="gate-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. North Entrance"
                className="h-11 rounded-xl font-bold"
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="gate-location" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                {t('settings.gates.locationLabel', 'Location Description')}
              </Label>
              <Input
                id="gate-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Building A, Ground Floor"
                className="h-11 rounded-xl"
              />
            </div>

            {/* Project */}
            <div className="space-y-2">
              <Label htmlFor="gate-project" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                {t('settings.gates.projectLabel', 'Project')}
              </Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger id="gate-project" className="h-11 rounded-xl">
                  <SelectValue placeholder={t('settings.gates.noProject', 'No project (global)')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="" className="rounded-lg text-xs font-bold">
                    — {t('settings.gates.noProject', 'No project')}
                  </SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="rounded-lg text-xs font-bold">
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* GPS Section */}
            <div className="space-y-4 p-5 rounded-2xl border border-border bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-xs font-black uppercase tracking-widest text-foreground">
                    {t('settings.gates.gpsTitle', 'GPS Enforcement')}
                  </span>
                </div>
                <Switch checked={locationEnforced} onCheckedChange={setLocationEnforced} />
              </div>

              {locationEnforced && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {t('settings.gates.lat', 'Latitude')}
                      </Label>
                      <Input
                        type="number"
                        step="any"
                        min="-90"
                        max="90"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        placeholder="25.2048"
                        className="h-10 rounded-xl text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {t('settings.gates.lng', 'Longitude')}
                      </Label>
                      <Input
                        type="number"
                        step="any"
                        min="-180"
                        max="180"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        placeholder="55.2708"
                        className="h-10 rounded-xl text-sm font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {t('settings.gates.radius', 'Allowed Radius (meters)')}
                    </Label>
                    <Input
                      type="number"
                      min="10"
                      max="5000"
                      value={radiusMeters}
                      onChange={(e) => setRadiusMeters(e.target.value)}
                      placeholder="100"
                      className="h-10 rounded-xl text-sm font-bold"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Scanner must be within this radius to process a scan.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Identity level override */}
            <div className="space-y-2">
              <Label htmlFor="gate-identity" className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                {t('settings.gates.identityLevel', 'Identity Level Override')}
              </Label>
              <Select value={identityLevel} onValueChange={setIdentityLevel}>
                <SelectTrigger id="gate-identity" className="h-11 rounded-xl">
                  <SelectValue placeholder={t('settings.gates.identityDefault', 'Use org default')} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="" className="rounded-lg text-xs font-bold">Use org default</SelectItem>
                  <SelectItem value="0" className="rounded-lg text-xs font-bold">0 — Name & phone only</SelectItem>
                  <SelectItem value="1" className="rounded-lg text-xs font-bold">1 — ID photo capture</SelectItem>
                  <SelectItem value="2" className="rounded-lg text-xs font-bold">2 — ID OCR verification</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <SheetFooter className="p-8 pt-0 border-t border-border">
            <Button type="submit" disabled={isPending} className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[11px]">
              {isPending
                ? t('common.saving', 'Saving...')
                : mode === 'create'
                ? t('settings.gates.createBtn', 'Create Gate')
                : t('common.saveChanges', 'Save Changes')}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
