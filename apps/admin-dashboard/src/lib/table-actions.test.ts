import {
  filterAdminRecords,
  getAvailableRowActions,
  AdminEntityRecord,
} from './table-actions';

describe('table-actions', () => {
  const MOCK_RECORDS: AdminEntityRecord[] = [
    {
      id: 'org-1',
      name: 'Palm Hills Compound',
      slug: 'palm-hills',
      status: 'ACTIVE',
      contactEmail: 'admin@palmhills.eg',
      createdAt: '2026-01-01',
    },
    {
      id: 'org-2',
      name: 'Smart Village Towers',
      slug: 'smart-village',
      status: 'TRIAL',
      contactEmail: 'ops@smartvillage.eg',
      createdAt: '2026-02-01',
    },
    {
      id: 'org-3',
      name: 'Cairo Festival City',
      slug: 'cfc',
      status: 'SUSPENDED',
      contactEmail: 'security@cfc.eg',
      createdAt: '2026-03-01',
    },
  ];

  describe('filterAdminRecords', () => {
    it('returns all records when filter is default', () => {
      const filtered = filterAdminRecords(MOCK_RECORDS, {
        searchQuery: '',
        statusFilter: 'ALL',
      });
      expect(filtered).toHaveLength(3);
    });

    it('filters by status correctly', () => {
      const active = filterAdminRecords(MOCK_RECORDS, {
        searchQuery: '',
        statusFilter: 'ACTIVE',
      });
      expect(active).toHaveLength(1);
      expect(active[0].id).toBe('org-1');

      const suspended = filterAdminRecords(MOCK_RECORDS, {
        searchQuery: '',
        statusFilter: 'SUSPENDED',
      });
      expect(suspended).toHaveLength(1);
      expect(suspended[0].id).toBe('org-3');
    });

    it('searches across name, slug, id, and email fields', () => {
      const byName = filterAdminRecords(MOCK_RECORDS, {
        searchQuery: 'Palm Hills',
        statusFilter: 'ALL',
      });
      expect(byName).toHaveLength(1);
      expect(byName[0].id).toBe('org-1');

      const byEmail = filterAdminRecords(MOCK_RECORDS, {
        searchQuery: 'cfc.eg',
        statusFilter: 'ALL',
      });
      expect(byEmail).toHaveLength(1);
      expect(byEmail[0].id).toBe('org-3');
    });
  });

  describe('getAvailableRowActions', () => {
    it('provides emulation and suspend options for active orgs to super admins', () => {
      const actions = getAvailableRowActions(MOCK_RECORDS[0], true);
      const actionTypes = actions.map((a) => a.action);

      expect(actionTypes).toContain('VIEW');
      expect(actionTypes).toContain('EDIT');
      expect(actionTypes).toContain('EMULATE');
      expect(actionTypes).toContain('SUSPEND');
      expect(actionTypes).toContain('DELETE');
    });

    it('offers reactivate option for suspended organizations', () => {
      const actions = getAvailableRowActions(MOCK_RECORDS[2], true);
      const actionTypes = actions.map((a) => a.action);

      expect(actionTypes).toContain('ACTIVATE');
      expect(actionTypes).not.toContain('SUSPEND');
    });
  });
});
