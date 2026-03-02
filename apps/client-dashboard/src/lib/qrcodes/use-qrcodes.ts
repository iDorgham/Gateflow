'use client';

import { useQuery } from '@tanstack/react-query';

export interface QRCodeRow {
  id: string;
  code: string;
  type: string;
  status: string;
  createdAt: string;
  expiresAt: string | null;
  isActive: boolean;
  currentUses: number;
  maxUses: number | null;
  scansCount: number;
  lastScanAt: string | null;
  gateName: string | null;
  projectName: string | null;
}

interface QRCodesFilters {
  page?: number;
  pageSize?: number;
  projectId?: string;
  gateId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  createdFrom?: string;
  createdTo?: string;
  expiresFrom?: string;
  expiresTo?: string;
  lastScanFrom?: string;
  lastScanTo?: string;
}

interface QRCodesResponse {
  success: boolean;
  data: QRCodeRow[];
  total?: number;
  page?: number;
  pageSize?: number;
}

async function fetchQRCodes(filters: QRCodesFilters): Promise<QRCodesResponse> {
  const params = new URLSearchParams();
  if (filters.page != null) params.set('page', String(filters.page));
  if (filters.pageSize != null) params.set('pageSize', String(filters.pageSize));
  if (filters.projectId) params.set('projectId', filters.projectId);
  if (filters.gateId) params.set('gateId', filters.gateId);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
  if (filters.search) params.set('search', filters.search);
  if (filters.createdFrom) params.set('createdFrom', filters.createdFrom);
  if (filters.createdTo) params.set('createdTo', filters.createdTo);
  if (filters.expiresFrom) params.set('expiresFrom', filters.expiresFrom);
  if (filters.expiresTo) params.set('expiresTo', filters.expiresTo);
  if (filters.lastScanFrom) params.set('lastScanFrom', filters.lastScanFrom);
  if (filters.lastScanTo) params.set('lastScanTo', filters.lastScanTo);
  const res = await fetch(`/api/qrcodes?${params.toString()}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message ?? 'Failed to fetch QR codes');
  }
  return json;
}

export function useQRCodes(filters: QRCodesFilters) {
  return useQuery({
    queryKey: ['qrcodes', filters],
    queryFn: () => fetchQRCodes(filters),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}
