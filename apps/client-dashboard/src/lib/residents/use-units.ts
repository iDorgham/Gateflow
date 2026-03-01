'use client';

import { useQuery } from '@tanstack/react-query';
import type { ResidentsFilters } from './residents-filters';

export interface UnitContact {
  id: string;
  firstName: string;
  lastName: string;
}

export interface UnitRow {
  id: string;
  name: string;
  type: string;
  sizeSqm: number | null;
  qrQuota: number;
  projectId: string | null;
  projectName: string | null;
  userId: string | null;
  user: { id: string; name: string; email: string } | null;
  contacts: UnitContact[];
  visitsInRange: number;
  passesInRange: number;
  lastVisitInRange: string | null;
  linkedContactCount: number;
  potentialVacancy?: boolean;
  tagSummary?: string | null;
}

interface UnitsResponse {
  success: boolean;
  data: UnitRow[];
  total?: number;
  page?: number;
  pageSize?: number;
}

const UNITS_SORT_FIELDS = ['name', 'type', 'visitsInRange', 'passesInRange', 'lastVisitInRange'] as const;

function buildUnitsQueryParams(filters: ResidentsFilters): URLSearchParams {
  const sp = new URLSearchParams();
  if (filters.from) sp.set('from', filters.from);
  if (filters.to) sp.set('to', filters.to);
  if (filters.search) sp.set('search', filters.search);
  if (filters.unitType) sp.set('unitType', filters.unitType);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.contactId) sp.set('contactId', filters.contactId);
  const sort = UNITS_SORT_FIELDS.includes(filters.sort as (typeof UNITS_SORT_FIELDS)[number])
    ? filters.sort
    : 'name';
  sp.set('sort', sort);
  if (filters.sortDir) sp.set('sortDir', filters.sortDir);
  sp.set('page', String(filters.page));
  sp.set('pageSize', String(filters.pageSize));
  return sp;
}

async function fetchUnits(filters: ResidentsFilters): Promise<UnitsResponse> {
  const params = buildUnitsQueryParams(filters);
  const res = await fetch(`/api/units?${params.toString()}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Failed to fetch units');
  }
  return json;
}

export function useUnits(filters: ResidentsFilters) {
  return useQuery({
    queryKey: ['units', filters],
    queryFn: () => fetchUnits(filters),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
