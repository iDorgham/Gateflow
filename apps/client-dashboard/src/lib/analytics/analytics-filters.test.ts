/**
 * Unit tests for analytics filters (getDefaultFilters, parseFiltersFromSearchParams, mergeFilters, buildSearchParams).
 * Phase 6 — analytics rebuild polish.
 */
import {
  getDefaultFilters,
  parseFiltersFromSearchParams,
  mergeFilters,
  buildSearchParams,
  type AnalyticsFilters,
} from './analytics-filters';

describe('analytics-filters', () => {
  describe('getDefaultFilters', () => {
    it('returns filters with 7d range and security mode', () => {
      const f = getDefaultFilters();
      expect(f.range).toBe('7d');
      expect(f.mode).toBe('security');
      expect(f.from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(f.to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(f.projectId).toBe('');
      expect(f.gateId).toBe('');
      expect(f.unitType).toBe('');
    });
  });

  describe('parseFiltersFromSearchParams', () => {
    it('parses dateFrom and dateTo from search params', () => {
      const params = new URLSearchParams('dateFrom=2025-01-01&dateTo=2025-01-31');
      const parsed = parseFiltersFromSearchParams(params);
      expect(parsed.from).toBe('2025-01-01');
      expect(parsed.to).toBe('2025-01-31');
    });
    it('parses projectId, gateId, mode', () => {
      const params = new URLSearchParams('projectId=p1&gateId=g1&mode=marketing');
      const parsed = parseFiltersFromSearchParams(params);
      expect(parsed.projectId).toBe('p1');
      expect(parsed.gateId).toBe('g1');
      expect(parsed.mode).toBe('marketing');
    });
    it('returns empty object for empty params', () => {
      const parsed = parseFiltersFromSearchParams(new URLSearchParams());
      expect(parsed).toEqual({});
    });
  });

  describe('mergeFilters', () => {
    it('merges partial over defaults', () => {
      const merged = mergeFilters({ mode: 'marketing', from: '2025-06-01' });
      expect(merged.mode).toBe('marketing');
      expect(merged.from).toBe('2025-06-01');
      expect(merged.range).toBe('7d');
    });
    it('returns full defaults when given empty partial', () => {
      const merged = mergeFilters({});
      expect(merged.range).toBe('7d');
      expect(merged.mode).toBe('security');
      expect(merged.from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('buildSearchParams', () => {
    it('builds query string from filters', () => {
      const filters: Partial<AnalyticsFilters> = {
        from: '2025-01-01',
        to: '2025-01-31',
        projectId: 'p1',
        mode: 'marketing',
      };
      const sp = buildSearchParams(filters);
      expect(sp.get('from')).toBe('2025-01-01');
      expect(sp.get('to')).toBe('2025-01-31');
      expect(sp.get('projectId')).toBe('p1');
      expect(sp.get('mode')).toBe('marketing');
    });
    it('omits mode when security (default)', () => {
      const sp = buildSearchParams({ mode: 'security' });
      expect(sp.has('mode')).toBe(false);
    });
  });
});
