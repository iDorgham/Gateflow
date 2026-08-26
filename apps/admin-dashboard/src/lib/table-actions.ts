/**
 * High-density operational table actions, filtering, and row menus for Admin Dashboard.
 */

export type AdminRowAction =
  'VIEW' | 'EDIT' | 'EMULATE' | 'SUSPEND' | 'ACTIVATE' | 'DELETE';

export interface AdminEntityRecord {
  id: string;
  name: string;
  slug?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'ARCHIVED';
  contactEmail?: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface TableFilterState {
  searchQuery: string;
  statusFilter: 'ALL' | 'ACTIVE' | 'SUSPENDED' | 'TRIAL' | 'ARCHIVED';
}

export interface RowActionItem {
  action: AdminRowAction;
  labelEn: string;
  labelAr: string;
  isDestructive?: boolean;
}

/**
 * Filters operational records based on text search and status criteria.
 */
export function filterAdminRecords<T extends AdminEntityRecord>(
  records: T[],
  filters: TableFilterState
): T[] {
  const query = filters.searchQuery.trim().toLowerCase();
  const status = filters.statusFilter;

  return records.filter((rec) => {
    // Status filter matching
    if (status !== 'ALL' && rec.status !== status) {
      return false;
    }

    // Text search query matching (name, slug, id, contactEmail)
    if (query.length > 0) {
      const matchName = rec.name.toLowerCase().includes(query);
      const matchSlug = rec.slug
        ? rec.slug.toLowerCase().includes(query)
        : false;
      const matchId = rec.id.toLowerCase().includes(query);
      const matchEmail = rec.contactEmail
        ? rec.contactEmail.toLowerCase().includes(query)
        : false;

      return matchName || matchSlug || matchId || matchEmail;
    }

    return true;
  });
}

/**
 * Returns available contextual actions for a specific row entity.
 */
export function getAvailableRowActions(
  record: AdminEntityRecord,
  isSuperAdmin: boolean = true
): RowActionItem[] {
  const actions: RowActionItem[] = [
    { action: 'VIEW', labelEn: 'View Details', labelAr: 'عرض التفاصيل' },
    { action: 'EDIT', labelEn: 'Edit Properties', labelAr: 'تعديل البيانات' },
  ];

  if (isSuperAdmin) {
    actions.push({
      action: 'EMULATE',
      labelEn: 'Emulate Organization',
      labelAr: 'محاكاة / تسجيل كالمؤسسة',
    });
  }

  if (record.status === 'SUSPENDED') {
    actions.push({
      action: 'ACTIVATE',
      labelEn: 'Reactivate Access',
      labelAr: 'إعادة التفعيل',
    });
  } else {
    actions.push({
      action: 'SUSPEND',
      labelEn: 'Suspend Access',
      labelAr: 'إيقاف مؤقت',
    });
  }

  actions.push({
    action: 'DELETE',
    labelEn: 'Delete Record',
    labelAr: 'حذف السجل',
    isDestructive: true,
  });

  return actions;
}
