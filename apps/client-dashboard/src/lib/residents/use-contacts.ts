'use client';

import { useQuery } from '@tanstack/react-query';
import type { ResidentsFilters } from './residents-filters';

export interface ContactUnit {
  id: string;
  name: string;
}

export interface ContactTag {
  id: string;
  name: string;
  color: string | null;
}

export interface ContactRow {
  id: string;
  firstName: string;
  lastName: string;
  birthday: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
  avatarUrl: string | null;
  units: ContactUnit[];
  tags?: ContactTag[];
  visitsInRange: number;
  passesInRange: number;
  lastVisitInRange: string | null;
}

interface ContactsResponse {
  success: boolean;
  data: ContactRow[];
  total?: number;
  page?: number;
  pageSize?: number;
}

function buildContactsQueryParams(filters: ResidentsFilters): URLSearchParams {
  const sp = new URLSearchParams();
  if (filters.from) sp.set('from', filters.from);
  if (filters.to) sp.set('to', filters.to);
  if (filters.search) sp.set('search', filters.search);
  if (filters.unitType) sp.set('unitType', filters.unitType);
  if (filters.gateId) sp.set('gateId', filters.gateId);
  if (filters.projectId) sp.set('projectId', filters.projectId);
  if (filters.tagIds) sp.set('tagIds', filters.tagIds);
  if (filters.unitId) sp.set('unitId', filters.unitId);
  if (filters.sort) sp.set('sort', filters.sort);
  if (filters.sortDir) sp.set('sortDir', filters.sortDir);
  sp.set('page', String(filters.page));
  sp.set('pageSize', String(filters.pageSize));
  return sp;
}

async function fetchContacts(filters: ResidentsFilters): Promise<ContactsResponse> {
  const params = buildContactsQueryParams(filters);
  const res = await fetch(`/api/contacts?${params.toString()}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Failed to fetch contacts');
  }
  return json;
}

export function useContacts(filters: ResidentsFilters) {
  return useQuery({
    queryKey: ['contacts', filters],
    queryFn: () => fetchContacts(filters),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
