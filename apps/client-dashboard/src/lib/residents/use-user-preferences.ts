'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface UserPreferences {
  tableViews?: {
    contacts?: {
      columnOrder?: string[];
      columnVisibility?: Record<string, boolean>;
      activeView?: string;
      savedViews?: Record<string, { columnOrder?: string[]; columnVisibility?: Record<string, boolean> }>;
    };
    units?: {
      columnOrder?: string[];
      columnVisibility?: Record<string, boolean>;
      activeView?: string;
      savedViews?: Record<string, { columnOrder?: string[]; columnVisibility?: Record<string, boolean> }>;
    };
  };
}

async function fetchPreferences(): Promise<UserPreferences> {
  const res = await fetch('/api/users/me/preferences');
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message ?? 'Failed to fetch preferences');
  return json.data ?? {};
}

async function patchPreferences(data: Partial<UserPreferences>): Promise<UserPreferences> {
  const res = await fetch('/api/users/me/preferences', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message ?? 'Failed to save preferences');
  return json.data;
}

export function useUserPreferences() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['user', 'preferences'],
    queryFn: fetchPreferences,
    staleTime: 5 * 60 * 1000,
  });
  const mutation = useMutation({
    mutationFn: patchPreferences,
    onSuccess: (data) => {
      queryClient.setQueryData(['user', 'preferences'], data);
    },
  });
  return {
    preferences: query.data ?? {},
    isLoading: query.isLoading,
    refetch: query.refetch,
    updatePreferences: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
}
