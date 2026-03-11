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
  Textarea,
  RadioGroup,
  RadioGroupItem,
  MultiSelect,
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { createProject, updateProject, getResources } from '@/app/[locale]/dashboard/settings/projects/actions';
import { GateMode } from '@gate-access/db';
import { useRouter } from 'next/navigation';

interface ProjectSheetProps {
  mode: 'create' | 'edit';
  project?: {
    id: string;
    name: string;
    description: string | null;
    gateMode: string;
  };
  children: React.ReactNode;
}

export function ProjectSheet({ mode, project, children }: ProjectSheetProps) {
  const { t } = useTranslation('dashboard');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Form State
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [gateMode, setGateMode] = useState<GateMode>((project?.gateMode as GateMode) || GateMode.MULTI);
  const [selectedGates, setSelectedGates] = useState<string[]>([]);
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  
  // Resource Options
  const [gateOptions, setGateOptions] = useState<{ label: string; value: string }[]>([]);
  const [unitOptions, setUnitOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    if (open) {
      // Reset form on open
      setName(project?.name || '');
      setDescription(project?.description || '');
      setGateMode((project?.gateMode as GateMode) || GateMode.MULTI);
      
      // Fetch resources
      const fetchResources = async () => {
        // We need orgId, but server actions get it from session. 
        // We'll pass a dummy or handle it in the action.
        const res = await getResources(''); // orgId is ignored in the action as it uses claims
        setGateOptions(res.gates.map(g => ({ label: g.name, value: g.id })));
        setUnitOptions(res.units.map(u => ({ label: u.name, value: u.id })));
        
        // If editing, set initial selections
        if (mode === 'edit' && project) {
          setSelectedGates(res.gates.filter(g => g.projectId === project.id).map(g => g.id));
          setSelectedUnits(res.units.filter(u => u.projectId === project.id).map(u => u.id));
        } else {
          setSelectedGates([]);
          setSelectedUnits([]);
        }
      };
      
      fetchResources();
    }
  }, [open, mode, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(t('projects.errors.nameRequired', 'Project name is required'));
      return;
    }

    startTransition(async () => {
      let result;
      if (mode === 'create') {
        result = await createProject(name, description, gateMode, selectedGates, selectedUnits);
      } else {
        result = await updateProject(project!.id, {
          name,
          description,
          gateMode,
          gateIds: selectedGates,
          unitIds: selectedUnits,
        });
      }

      if (result.success) {
        toast.success(mode === 'create' ? t('projects.created', 'Project created') : t('projects.updated', 'Project updated'));
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || t('projects.saveError', 'Failed to save project'));
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {mode === 'create' ? t('projects.addTitle', 'Add New Project') : t('projects.editTitle', 'Edit Project')}
          </SheetTitle>
          <SheetDescription>
            {t('projects.sheetDescription', 'Define project scope and map physical resources.')}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('projects.fields.name', 'Project Name')}</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder={t('projects.fields.namePlaceholder', 'e.g. West Wing')}
              className="font-bold"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('projects.fields.description', 'Description')}</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder={t('projects.fields.descriptionPlaceholder', 'Briefly describe this project scope...')}
              className="resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label>{t('projects.fields.gateMode', 'Gate Mode')}</Label>
            <RadioGroup value={gateMode} onValueChange={(v) => setGateMode(v as GateMode)} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={GateMode.SINGLE} id="mode-single" />
                <Label htmlFor="mode-single" className="font-medium">{t('projects.modes.single', 'Single Gate')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={GateMode.MULTI} id="mode-multi" />
                <Label htmlFor="mode-multi" className="font-medium">{t('projects.modes.multi', 'Multi-Gate')}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>{t('projects.fields.assignGates', 'Map Gates')}</Label>
            <MultiSelect 
              options={gateOptions} 
              selected={selectedGates} 
              onChange={setSelectedGates} 
              placeholder={t('projects.fields.selectGates', 'Select gates for this project...')}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('projects.fields.assignUnits', 'Map Units')}</Label>
            <MultiSelect 
              options={unitOptions} 
              selected={selectedUnits} 
              onChange={setSelectedUnits} 
              placeholder={t('projects.fields.selectUnits', 'Select units for this project...')}
            />
          </div>

          <SheetFooter className="pt-4">
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? t('common.saving', 'Saving...') : t('common.save', 'Save Changes')}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
