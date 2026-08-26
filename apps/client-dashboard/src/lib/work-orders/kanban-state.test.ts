import {
  groupWorkOrdersByColumn,
  filterKanbanWorkOrders,
  getAssetServiceHistory,
  KanbanWorkOrder,
} from './kanban-state';

describe('kanban-state', () => {
  const MOCK_WORK_ORDERS: KanbanWorkOrder[] = [
    {
      id: 'wo-1',
      title: 'North Gate Barrier Jam',
      priority: 'URGENT',
      category: 'GATE_HARDWARE',
      status: 'OPEN',
      assetType: 'GATE',
      assetId: 'gate-north-01',
      assetName: 'North Gate 01',
      createdAt: '2026-08-24T08:00:00Z',
    },
    {
      id: 'wo-2',
      title: 'Villa 104 AC Leakage',
      priority: 'HIGH',
      category: 'HVAC',
      status: 'ASSIGNED',
      assetType: 'UNIT',
      assetId: 'unit-104',
      assetName: 'Villa 104',
      assignedTechnicianName: 'Ahmed Hassan',
      createdAt: '2026-08-24T09:00:00Z',
    },
    {
      id: 'wo-3',
      title: 'North Gate Sensor Replacement',
      priority: 'MEDIUM',
      category: 'GATE_HARDWARE',
      status: 'IN_PROGRESS',
      assetType: 'GATE',
      assetId: 'gate-north-01',
      assetName: 'North Gate 01',
      assignedTechnicianName: 'Khaled Omar',
      createdAt: '2026-08-23T14:00:00Z',
    },
    {
      id: 'wo-4',
      title: 'Clubhouse Lighting Fixture',
      priority: 'LOW',
      category: 'ELECTRICAL',
      status: 'RESOLVED',
      assetType: 'COMMON_AREA',
      assetId: 'area-clubhouse',
      assetName: 'Central Clubhouse',
      assignedTechnicianName: 'Ahmed Hassan',
      createdAt: '2026-08-22T10:00:00Z',
    },
  ];

  describe('groupWorkOrdersByColumn', () => {
    it('accurately groups tickets across the 5 Kanban columns', () => {
      const columns = groupWorkOrdersByColumn(MOCK_WORK_ORDERS);
      expect(columns).toHaveLength(5);

      const openCol = columns.find((c) => c.key === 'OPEN');
      const assignedCol = columns.find((c) => c.key === 'ASSIGNED');
      const inProgressCol = columns.find((c) => c.key === 'IN_PROGRESS');
      const resolvedCol = columns.find((c) => c.key === 'RESOLVED');

      expect(openCol?.items).toHaveLength(1);
      expect(assignedCol?.items).toHaveLength(1);
      expect(inProgressCol?.items).toHaveLength(1);
      expect(resolvedCol?.items).toHaveLength(1);
    });
  });

  describe('filterKanbanWorkOrders', () => {
    it('filters by priority levels', () => {
      const urgentTickets = filterKanbanWorkOrders(MOCK_WORK_ORDERS, {
        priorities: ['URGENT'],
      });
      expect(urgentTickets).toHaveLength(1);
      expect(urgentTickets[0].id).toBe('wo-1');
    });

    it('filters by technician name', () => {
      const ahmedTickets = filterKanbanWorkOrders(MOCK_WORK_ORDERS, {
        technicianName: 'Ahmed Hassan',
      });
      expect(ahmedTickets).toHaveLength(2);
    });

    it('searches by query text', () => {
      const searchResults = filterKanbanWorkOrders(MOCK_WORK_ORDERS, {
        searchQuery: 'Barrier Jam',
      });
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].id).toBe('wo-1');
    });
  });

  describe('getAssetServiceHistory', () => {
    it('retrieves chronological maintenance logs for a specific gate', () => {
      const gateHistory = getAssetServiceHistory(
        MOCK_WORK_ORDERS,
        'GATE',
        'gate-north-01'
      );
      expect(gateHistory).toHaveLength(2);
      expect(gateHistory[0].id).toBe('wo-1'); // Newer ticket first
      expect(gateHistory[1].id).toBe('wo-3');
    });
  });
});
