/**
 * Kanban Dispatch Board state, filtering, column grouping, and asset history aggregator.
 */

import {
  WorkOrderPriority,
  WorkOrderCategory,
  WorkOrderStatus,
} from './work-order-state';

export type KanbanColumnKey =
  'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'PENDING_PARTS' | 'RESOLVED';

export interface KanbanWorkOrder {
  id: string;
  title: string;
  priority: WorkOrderPriority;
  category: WorkOrderCategory;
  status: WorkOrderStatus;
  assetType: 'GATE' | 'UNIT' | 'COMMON_AREA';
  assetId: string;
  assetName: string;
  assignedTechnicianName?: string;
  createdAt: string;
}

export interface KanbanFilters {
  searchQuery?: string;
  priorities?: WorkOrderPriority[];
  categories?: WorkOrderCategory[];
  technicianName?: string;
}

export interface KanbanColumnGroup {
  key: KanbanColumnKey;
  labelEn: string;
  labelAr: string;
  items: KanbanWorkOrder[];
}

export const KANBAN_COLUMNS: Array<{
  key: KanbanColumnKey;
  labelEn: string;
  labelAr: string;
}> = [
  { key: 'OPEN', labelEn: 'Open Requests', labelAr: 'طلبات مفتوحة' },
  { key: 'ASSIGNED', labelEn: 'Assigned', labelAr: 'تم التعيين' },
  { key: 'IN_PROGRESS', labelEn: 'In Progress', labelAr: 'قيد التنفيذ' },
  {
    key: 'PENDING_PARTS',
    labelEn: 'Pending Parts',
    labelAr: 'بانتظار قطع الغيار',
  },
  { key: 'RESOLVED', labelEn: 'Resolved', labelAr: 'تم الإصلاح' },
];

/**
 * Groups a list of work orders into ordered Kanban status columns.
 */
export function groupWorkOrdersByColumn(
  workOrders: KanbanWorkOrder[]
): KanbanColumnGroup[] {
  const groups: Record<KanbanColumnKey, KanbanWorkOrder[]> = {
    OPEN: [],
    ASSIGNED: [],
    IN_PROGRESS: [],
    PENDING_PARTS: [],
    RESOLVED: [],
  };

  for (const wo of workOrders) {
    if (wo.status in groups) {
      groups[wo.status as KanbanColumnKey].push(wo);
    }
  }

  return KANBAN_COLUMNS.map((col) => ({
    key: col.key,
    labelEn: col.labelEn,
    labelAr: col.labelAr,
    items: groups[col.key],
  }));
}

/**
 * Applies multi-criteria filters (search, priority pills, category, technician) to work orders.
 */
export function filterKanbanWorkOrders(
  workOrders: KanbanWorkOrder[],
  filters: KanbanFilters
): KanbanWorkOrder[] {
  const query = filters.searchQuery
    ? filters.searchQuery.trim().toLowerCase()
    : '';

  return workOrders.filter((wo) => {
    // Priority filter
    if (filters.priorities && filters.priorities.length > 0) {
      if (!filters.priorities.includes(wo.priority)) return false;
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(wo.category)) return false;
    }

    // Technician filter
    if (filters.technicianName && filters.technicianName.trim().length > 0) {
      if (
        !wo.assignedTechnicianName ||
        !wo.assignedTechnicianName
          .toLowerCase()
          .includes(filters.technicianName.toLowerCase())
      ) {
        return false;
      }
    }

    // Text search (title, id, assetName)
    if (query.length > 0) {
      const matchTitle = wo.title.toLowerCase().includes(query);
      const matchId = wo.id.toLowerCase().includes(query);
      const matchAsset = wo.assetName.toLowerCase().includes(query);
      return matchTitle || matchId || matchAsset;
    }

    return true;
  });
}

/**
 * Extracts chronological service logs for a specific physical asset.
 */
export function getAssetServiceHistory(
  workOrders: KanbanWorkOrder[],
  assetType: 'GATE' | 'UNIT' | 'COMMON_AREA',
  assetId: string
): KanbanWorkOrder[] {
  return workOrders
    .filter((wo) => wo.assetType === assetType && wo.assetId === assetId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}
