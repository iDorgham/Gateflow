/**
 * Shared filter types for Contacts and Units pages.
 * Synced with URL params: from, to, search, unitType, gateId, projectId, page, pageSize, sort, sortDir.
 */

export type ResidentsSortField =
  | 'firstName'
  | 'lastName'
  | 'name'
  | 'visitsInRange'
  | 'passesInRange'
  | 'lastVisitInRange'
  | 'type';

export interface ResidentsFilters {
  from: string;
  to: string;
  search: string;
  unitType: string;
  gateId: string;
  projectId: string;
  tagIds: string; // comma-separated for contacts filter
  page: number;
  pageSize: number;
  sort: ResidentsSortField;
  sortDir: 'asc' | 'desc';
  unitId: string; // pre-filter contacts by unit
  contactId: string; // pre-filter units by contact
}

const defaultFromTo = (): { from: string; to: string } => {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  const to = now.toISOString().split('T')[0];
  const from = new Date(now);
  from.setDate(from.getDate() - 6);
  from.setHours(0, 0, 0, 0);
  return { from: from.toISOString().split('T')[0], to };
};

export function getDefaultResidentsFilters(): ResidentsFilters {
  const { from, to } = defaultFromTo();
  return {
    from,
    to,
    search: '',
    unitType: '',
    gateId: '',
    projectId: '',
    tagIds: '',
    page: 1,
    pageSize: 25,
    sort: 'firstName',
    sortDir: 'asc',
    unitId: '',
    contactId: '',
  };
}

export function residentsFiltersToSearchParams(f: Partial<ResidentsFilters>): URLSearchParams {
  const sp = new URLSearchParams();
  if (f.from) sp.set('from', f.from);
  if (f.to) sp.set('to', f.to);
  if (f.search) sp.set('search', f.search);
  if (f.unitType) sp.set('unitType', f.unitType);
  if (f.gateId) sp.set('gateId', f.gateId);
  if (f.projectId) sp.set('projectId', f.projectId);
  if (f.tagIds) sp.set('tagIds', f.tagIds);
  if (f.page && f.page > 1) sp.set('page', String(f.page));
  if (f.pageSize && f.pageSize !== 25) sp.set('pageSize', String(f.pageSize));
  if (f.sort) sp.set('sort', f.sort);
  if (f.sortDir) sp.set('sortDir', f.sortDir);
  if (f.unitId) sp.set('unitId', f.unitId);
  if (f.contactId) sp.set('contactId', f.contactId);
  return sp;
}

/** Merge partial filters with defaults */
export function mergeFilters(partial: Partial<ResidentsFilters>): ResidentsFilters {
  const defaults = getDefaultResidentsFilters();
  return {
    ...defaults,
    ...partial,
  };
}

export function parseResidentsFiltersFromSearchParams(params: URLSearchParams): Partial<ResidentsFilters> {
  const from = params.get('from') ?? undefined;
  const to = params.get('to') ?? undefined;
  const search = params.get('search') ?? undefined;
  const unitType = params.get('unitType') ?? undefined;
  const gateId = params.get('gateId') ?? undefined;
  const projectId = params.get('projectId') ?? undefined;
  const tagIds = params.get('tagIds') ?? undefined;
  const page = params.get('page');
  const pageSize = params.get('pageSize');
  const sort = params.get('sort') as ResidentsFilters['sort'] | undefined;
  const sortDir = params.get('sortDir') as 'asc' | 'desc' | undefined;
  const unitId = params.get('unitId') ?? undefined;
  const contactId = params.get('contactId') ?? undefined;

  const result: Partial<ResidentsFilters> = {};
  if (from) result.from = from;
  if (to) result.to = to;
  if (search !== undefined) result.search = search;
  if (unitType !== undefined) result.unitType = unitType;
  if (gateId !== undefined) result.gateId = gateId;
  if (projectId !== undefined) result.projectId = projectId;
  if (tagIds !== undefined) result.tagIds = tagIds;
  if (page) result.page = Math.max(1, parseInt(page, 10) || 1);
  if (pageSize) result.pageSize = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 25));
  if (sort) result.sort = sort;
  if (sortDir === 'asc' || sortDir === 'desc') result.sortDir = sortDir;
  if (unitId) result.unitId = unitId;
  if (contactId) result.contactId = contactId;
  return result;
}
