/**
 * Table view state: column order and visibility.
 * Persisted in User.preferences.tableViews.contacts | .units
 */

export interface TableViewState {
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
  activeView?: string;
  savedViews?: Record<
    string,
    {
      columnOrder?: string[];
      columnVisibility?: Record<string, boolean>;
    }
  >;
}

export const CONTACTS_COLUMN_IDS = [
  'avatar',
  'firstName',
  'lastName',
  'birthday',
  'company',
  'phone',
  'email',
  'tags',
  'units',
  'visitsInRange',
  'lastVisitInRange',
  'actions',
] as const;

export const UNITS_COLUMN_IDS = [
  'name',
  'type',
  'size',
  'residents',
  'linkedResident',
  'qrQuota',
  'project',
  'visitsInRange',
  'passesInRange',
  'lastVisitInRange',
  'tagSummary',
  'linkedContactCount',
  'actions',
] as const;

/** Columns that cannot be hidden (id/name) */
export const CONTACTS_PINNED = new Set(['avatar', 'firstName', 'lastName', 'actions']);
export const UNITS_PINNED = new Set(['name', 'actions']);

export const PRESET_VIEWS: Record<string, Record<string, boolean>> = {
  Default: {}, // all visible
  Marketing: {
    firstName: true,
    lastName: true,
    email: true,
    company: true,
    visitsInRange: true,
    lastVisitInRange: true,
  },
  Security: {
    firstName: true,
    lastName: true,
    units: true,
    visitsInRange: true,
    lastVisitInRange: true,
  },
};

export function getDefaultTableView(columnIds: readonly string[], _pinned: Set<string>): TableViewState {
  const columnOrder = [...columnIds];
  const columnVisibility: Record<string, boolean> = {};
  for (const id of columnIds) {
    columnVisibility[id] = true;
  }
  return { columnOrder, columnVisibility };
}
