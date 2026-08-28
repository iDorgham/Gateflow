/**
 * Table view state: column order, visibility, active view, and density.
 * Persisted in User.preferences.tableViews.contacts | .units | .qrcodes
 */

export type TableDensity = 'compact' | 'default' | 'comfortable';

export interface TableViewState {
  columnOrder: string[];
  columnVisibility: Record<string, boolean>;
  activeView?: string;
  density?: TableDensity;
  savedViews?: Record<
    string,
    {
      name?: string;
      columnOrder?: string[];
      columnVisibility?: Record<string, boolean>;
    }
  >;
}

export const CONTACTS_COLUMN_IDS = [
  'select',
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
  'select',
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

export const QR_COLUMN_IDS = [
  'select',
  'guestName',
  'guestPhone',
  'guestEmail',
  'code',
  'type',
  'status',
  'createdAt',
  'expiresAt',
  'scansCount',
  'lastScanAt',
  'gateName',
  'projectName',
] as const;

/** Columns that cannot be hidden (id/name) */
export const CONTACTS_PINNED = new Set([
  'select',
  'avatar',
  'firstName',
  'lastName',
  'actions',
]);
export const UNITS_PINNED = new Set(['select', 'name', 'actions']);
export const QR_PINNED = new Set(['select', 'code']);

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

/**
 * Creates the default view configuration for a table's columns.
 *
 * @param columnIds - The column identifiers to include in the default order
 * @returns A table view with all columns visible and default density
 */
export function getDefaultTableView(
  columnIds: readonly string[],
  _pinned: Set<string>
): TableViewState {
  const columnOrder = [...columnIds];
  const columnVisibility: Record<string, boolean> = {};
  for (const id of columnIds) {
    columnVisibility[id] = true;
  }
  return { columnOrder, columnVisibility, density: 'default' };
}
