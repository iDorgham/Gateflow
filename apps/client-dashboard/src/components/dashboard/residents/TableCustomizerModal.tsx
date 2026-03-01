'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Checkbox,
  Label,
} from '@gate-access/ui';
import { GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import type { TableViewState } from '@/lib/residents/table-views';

export interface TableColumnConfig {
  id: string;
  label: string;
  canHide: boolean;
}

interface TableCustomizerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: TableColumnConfig[];
  view: TableViewState;
  onSave: (view: TableViewState) => void;
  presetNames?: string[];
  getPresetVisibility?: (preset: string) => Record<string, boolean>;
}

export function TableCustomizerModal({
  open,
  onOpenChange,
  columns,
  view,
  onSave,
  presetNames = ['Default', 'Marketing', 'Security'],
  getPresetVisibility,
}: TableCustomizerModalProps) {
  const { t } = useTranslation('dashboard');
  const [columnOrder, setColumnOrder] = useState<string[]>(view.columnOrder);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>(view.columnVisibility);

  useEffect(() => {
    if (open) {
      setColumnOrder(view.columnOrder);
      setColumnVisibility(view.columnVisibility);
    }
  }, [open, view.columnOrder, view.columnVisibility]);

  const orderSet = new Set(columnOrder);
  const missingFromOrder = columns.filter((c) => !orderSet.has(c.id)).map((c) => c.id);
  const fullOrder = [...columnOrder.filter((id) => columns.some((c) => c.id === id)), ...missingFromOrder];

  const move = (index: number, dir: 1 | -1) => {
    const next = [...fullOrder];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setColumnOrder(next);
  };

  const handleToggle = (id: string, checked: boolean) => {
    const col = columns.find((c) => c.id === id);
    if (col?.canHide) setColumnVisibility((prev) => ({ ...prev, [id]: checked }));
  };

  const handlePreset = (preset: string) => {
    if (preset === 'Default') {
      const vis: Record<string, boolean> = {};
      columns.forEach((c) => (vis[c.id] = true));
      setColumnVisibility(vis);
    } else if (getPresetVisibility) {
      const vis = getPresetVisibility(preset);
      setColumnVisibility((prev) => ({ ...prev, ...vis }));
    }
  };

  const handleApply = () => {
    onSave({ columnOrder: fullOrder, columnVisibility: { ...columnVisibility } });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('residents.customizeColumns', 'Customize columns')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {presetNames.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {presetNames.map((name) => (
                <Button
                  key={name}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreset(name)}
                >
                  {t(`residents.preset.${name}`, name)}
                </Button>
              ))}
            </div>
          )}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {fullOrder.map((id, index) => {
              const col = columns.find((c) => c.id === id);
              if (!col) return null;
              return (
                <div
                  key={id}
                  className="flex items-center gap-2 rounded-lg border p-2"
                >
                  <span className="text-muted-foreground" aria-hidden>
                    <GripVertical className="h-4 w-4" />
                  </span>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label={t('residents.moveUp', 'Move up')}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => move(index, 1)}
                      disabled={index === fullOrder.length - 1}
                      aria-label={t('residents.moveDown', 'Move down')}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <Label className="flex-1 text-sm">{col.label}</Label>
                  <Checkbox
                    checked={columnVisibility[id] !== false}
                    onChange={(e) => handleToggle(id, (e.target as HTMLInputElement).checked)}
                    disabled={!col.canHide}
                    aria-label={col.label}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button onClick={handleApply}>{t('residents.applyColumns', 'Apply')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
