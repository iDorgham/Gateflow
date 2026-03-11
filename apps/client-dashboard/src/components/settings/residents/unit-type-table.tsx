'use client';

import { useState, useTransition } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  Input,
  Label,
  Switch,
} from '@gate-access/ui';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { upsertResidentLimit } from '../../../app/[locale]/dashboard/settings/residents/actions';
import { UnitType } from '@gate-access/db';
import { Pencil, Info } from 'lucide-react';

interface ResidentLimit {
  unitType: UnitType;
  monthlyQuota: number;
  canCreateOpenQR: boolean;
}

interface UnitTypeTableProps {
  limits: ResidentLimit[];
}

export function UnitTypeTable({ limits }: UnitTypeTableProps) {
  const { t } = useTranslation('dashboard');
  const [editingLimit, setEditingLimit] = useState<ResidentLimit | null>(null);
  const [isPending, startTransition] = useTransition();

  // Temporary form state
  const [quota, setQuota] = useState(0);
  const [canOpen, setCanOpen] = useState(false);

  // All known unit types
  const unitTypes = Object.values(UnitType);

  const handleEdit = (type: UnitType) => {
    const existing = limits.find((l) => l.unitType === type) || {
      unitType: type,
      monthlyQuota: 10,
      canCreateOpenQR: false,
    };
    setEditingLimit(existing);
    setQuota(existing.monthlyQuota);
    setCanOpen(existing.canCreateOpenQR);
  };

  const handleSave = () => {
    if (!editingLimit) return;
    startTransition(async () => {
      const result = await upsertResidentLimit(editingLimit.unitType, quota, canOpen);
      if (result.success) {
        toast.success(t('settings.residents.limitUpdated', 'Quota for {{type}} updated.', { type: editingLimit.unitType }));
        setEditingLimit(null);
      } else {
        toast.error(result.error || t('common.error', 'An error occurred'));
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 text-xs">
        <Info className="h-4 w-4 shrink-0" />
        <p>{t('settings.residents.quotaInfo', 'Defines the default monthly visitor quota for residents in this unit type.')}</p>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t('settings.residents.unitType', 'Unit Type')}</TableHead>
              <TableHead className="text-center">{t('settings.residents.monthlyQuota', 'Monthly Quota')}</TableHead>
              <TableHead className="text-center">{t('settings.residents.openQR', 'Open QR Support')}</TableHead>
              <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unitTypes.map((type) => {
              const limit = limits.find((l) => l.unitType === type);
              return (
                <TableRow key={type} className="group hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <span className="font-bold text-foreground tracking-tight">{type}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-bold tabular-nums">
                      {limit?.monthlyQuota ?? 10}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {limit?.canCreateOpenQR ? (
                        <Badge className="bg-success/10 text-success border-success/20">Enabled</Badge>
                      ) : (
                        <Badge variant="outline" className="opacity-50">Disabled</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(type)}
                      className="h-8 gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      {t('common.edit', 'Edit')}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Sheet open={!!editingLimit} onOpenChange={() => setEditingLimit(null)}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t('settings.residents.editLimitTitle', 'Edit Limit: {{type}}', { type: editingLimit?.unitType })}</SheetTitle>
            <SheetDescription>
              {t('settings.residents.editLimitDesc', 'Set the monthly visitor quota and features for this unit type.')}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="quota">{t('settings.residents.monthlyQuotaLabel', 'Monthly Visitor Quota')}</Label>
              <Input
                id="quota"
                type="number"
                value={quota}
                onChange={(e) => setQuota(parseInt(e.target.value, 10) || 0)}
                className="font-bold"
              />
              <p className="text-xs text-muted-foreground">Total unique visitor keys authorized per month.</p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
              <div className="space-y-0.5">
                <Label>{t('settings.residents.enableOpenQR', 'Enable Open QR')}</Label>
                <p className="text-xs text-muted-foreground">Allow residents to create non-identity verified keys.</p>
              </div>
              <Switch checked={canOpen} onCheckedChange={setCanOpen} />
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleSave} disabled={isPending} className="w-full">
              {isPending ? t('common.saving', 'Saving...') : t('common.save', 'Save Limit')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
