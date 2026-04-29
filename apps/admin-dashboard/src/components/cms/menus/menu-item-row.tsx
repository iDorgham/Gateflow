import React, { useState } from 'react';
import {
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  Label,
  cn,
} from '@gateflow/ui';
import {
  Trash2,
  ChevronDown,
  GripVertical,
  ExternalLink,
  FileText,
  Minus,
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  labelAr: string;
  url: string;
  type: 'page' | 'external' | 'divider';
  children?: MenuItem[];
  openInNewTab?: boolean;
}

interface MenuItemRowProps {
  item: MenuItem;
  onUpdate: (updated: MenuItem) => void;
  onDelete: () => void;
  level?: number;
}

export function MenuItemRow({
  item,
  onUpdate,
  onDelete,
  level = 0,
}: MenuItemRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'flex items-center gap-3 p-3 bg-ds-surface border border-ds-border rounded-lg shadow-sm hover:border-ds-border-brand transition-colors',
          level > 0 && 'ml-8 bg-ds-surface-subtle'
        )}
      >
        <div className="cursor-grab active:cursor-grabbing text-ds-icon-subtle">
          <GripVertical className="h-4 w-4" />
        </div>

        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-[10px] uppercase text-ds-text-subtle font-bold">
              Label (EN)
            </Label>
            <Input
              placeholder="Home"
              value={item.label}
              onChange={(e) => onUpdate({ ...item, label: e.target.value })}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] uppercase text-ds-text-subtle font-bold text-right w-full block">
              Label (AR)
            </Label>
            <Input
              placeholder="الرئيسية"
              value={item.labelAr}
              onChange={(e) => onUpdate({ ...item, labelAr: e.target.value })}
              className="h-8 text-sm text-right"
              dir="rtl"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <Label className="text-[10px] uppercase text-ds-text-subtle font-bold">
              Type
            </Label>
            <Select
              value={item.type}
              onValueChange={(type) =>
                onUpdate({
                  ...item,
                  type: type as 'page' | 'external' | 'divider',
                })
              }
            >
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="page">CMS Page</SelectItem>
                <SelectItem value="external">External URL</SelectItem>
                <SelectItem value="divider">Divider</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] uppercase text-ds-text-subtle font-bold">
              Target URL / Page
            </Label>
            {item.type === 'divider' ? (
              <div className="w-48 h-8 flex items-center justify-center border border-dashed border-ds-border rounded text-ds-text-subtlest">
                <Minus className="h-4 w-4" />
              </div>
            ) : (
              <div className="relative w-48">
                <Input
                  placeholder={
                    item.type === 'page' ? 'Select page...' : 'https://...'
                  }
                  value={item.url}
                  onChange={(e) => onUpdate({ ...item, url: e.target.value })}
                  className="h-8 text-xs pr-8"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-ds-icon-subtler">
                  {item.type === 'page' ? (
                    <FileText className="h-3.3 w-3" />
                  ) : (
                    <ExternalLink className="h-3 w-3" />
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-1 mt-4">
            <input
              type="checkbox"
              id={`tab-${item.id}`}
              checked={item.openInNewTab}
              onChange={(e) =>
                onUpdate({ ...item, openInNewTab: e.target.checked })
              }
              className="h-3 w-3 rounded-sm border-ds-border"
            />
            <Label
              htmlFor={`tab-${item.id}`}
              className="text-[8px] uppercase font-black text-ds-text-subtle"
            >
              New Tab
            </Label>
          </div>

          <div className="flex items-center gap-1 mt-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-ds-text-danger hover:bg-ds-background-danger-subtle"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {item.type !== 'divider' && level < 1 && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'h-8 w-8 transition-transform',
                  isExpanded && 'rotate-180'
                )}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {isExpanded && item.children && (
        <div className="space-y-2">
          {item.children.map((child, idx) => (
            <MenuItemRow
              key={child.id}
              item={child}
              level={level + 1}
              onUpdate={(updated) => {
                const newChildren = [...(item.children || [])];
                newChildren[idx] = updated;
                onUpdate({ ...item, children: newChildren });
              }}
              onDelete={() => {
                const newChildren = item.children?.filter((_, i) => i !== idx);
                onUpdate({ ...item, children: newChildren });
              }}
            />
          ))}
          <Button
            variant="outline"
            size="sm"
            className="ml-8 text-[10px] h-7 border-dashed border-ds-border hover:border-ds-border-brand"
            onClick={() => {
              const newChild: MenuItem = {
                id: `child_${Date.now()}`,
                label: '',
                labelAr: '',
                url: '',
                type: 'page',
              };
              onUpdate({
                ...item,
                children: [...(item.children || []), newChild],
              });
            }}
          >
            + Add Sub-item
          </Button>
        </div>
      )}
    </div>
  );
}
