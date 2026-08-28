'use client';

import React, { useState } from 'react';
import { Button, cn } from '@gateflow/ui';
import { LayoutTemplate, Save, ChevronDown, Trash2, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface SavedView {
  id?: string;
  name?: string;
  columnOrder?: string[];
  columnVisibility?: Record<string, boolean>;
  filters?: Record<string, unknown>;
  sorting?: { id: string; desc: boolean }[];
}

interface SavedViewManagerProps {
  /** Current active view ID */
  activeView?: string;
  /** List of saved views for this table type */
  savedViews?: Record<string, SavedView>;
  /** Callback when a view is selected */
  onViewSelect?: (viewId: string | undefined) => void;
  /** Callback to save current state as new view */
  onViewSave?: (name: string) => void;
  /** Callback to delete a saved view */
  onViewDelete?: (viewId: string) => void;
  /** Whether the manager is disabled */
  disabled?: boolean;
}

export function SavedViewManager({
  activeView,
  savedViews = {},
  onViewSelect,
  onViewSave,
  onViewDelete,
  disabled,
}: SavedViewManagerProps) {
  const { t } = useTranslation('dashboard');
  const [isOpen, setIsOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  const savedViewsList = Object.entries(savedViews).map(([id, view]) => ({
    id,
    ...view,
  }));

  const handleSave = () => {
    if (newViewName.trim()) {
      onViewSave?.(newViewName.trim());
      setNewViewName('');
      setIsSaveModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        {/* Saved Views Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg gap-1.5 text-xs font-medium border-[var(--ds-border)]"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
          >
            <LayoutTemplate className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {activeView
                ? savedViews[activeView]?.name || 'View'
                : t('crm.tables.savedViews', 'Views')}
            </span>
            <ChevronDown className="h-3 w-3 text-[var(--ds-icon-subtle)]" />
          </Button>

          {isOpen && savedViewsList.length > 0 && (
            <div className="absolute end-0 top-full mt-1 z-50 min-w-[160px] rounded-md border border-[var(--ds-border)] bg-[var(--ds-background-input)] shadow-lg">
              {savedViewsList.map((view) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => {
                    onViewSelect?.(view.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--ds-text)]',
                    'hover:bg-[var(--ds-background-neutral-subtle)]',
                    activeView === view.id &&
                      'bg-[var(--ds-background-selected)]'
                  )}
                >
                  {activeView === view.id && (
                    <Check className="h-3.5 w-3.5 text-[var(--ds-text-selected)]" />
                  )}
                  <span className={activeView === view.id ? 'font-medium' : ''}>
                    {view.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDelete?.(view.id);
                    }}
                    className="ms-auto text-[var(--ds-icon-subtle)] hover:text-[var(--ds-text-danger)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </button>
              ))}
              <div className="border-t border-[var(--ds-border)]">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsSaveModalOpen(true);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--ds-text)] hover:bg-[var(--ds-background-neutral-subtle)]"
                >
                  <Save className="h-3.5 w-3.5" />
                  {t('crm.tables.saveCurrentView', 'Save Current View')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save View Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg border border-[var(--ds-border)] bg-[var(--ds-background-input)] p-4 shadow-xl">
            <h3 className="mb-3 text-sm font-semibold text-[var(--ds-text)]">
              {t('crm.tables.saveViewTitle', 'Save Current View')}
            </h3>
            <input
              type="text"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              placeholder={t('crm.tables.viewNamePlaceholder', 'View name')}
              className="mb-3 w-full rounded-md border border-[var(--ds-border-input)] bg-[var(--ds-background-input)] px-3 py-2 text-sm text-[var(--ds-text)] outline-none focus:ring-2 focus:ring-[var(--ds-border-focused)]"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSaveModalOpen(false)}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!newViewName.trim()}
              >
                {t('common.save', 'Save')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
