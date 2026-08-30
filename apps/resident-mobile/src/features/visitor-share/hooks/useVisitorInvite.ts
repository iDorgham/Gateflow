import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { residentFetch } from '../../../lib/api';
import {
  type CreateVisitorInviteInput,
  type VisitorInviteRecord,
  type RateLimitState,
} from '../types';

const RATE_LIMIT_KEY = 'resident_invite_rate_timestamps';
const MAX_INVITES_PER_HOUR = 15;
const ONE_HOUR_MS = 60 * 60 * 1000;

export interface UseVisitorInviteResult {
  createInvite: (
    input: CreateVisitorInviteInput
  ) => Promise<VisitorInviteRecord | null>;
  rateLimit: RateLimitState;
  isLoading: boolean;
  error: string | null;
  resetError: () => void;
}

export function useVisitorInvite(): UseVisitorInviteResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimit, setRateLimit] = useState<RateLimitState>({
    remainingQuota: MAX_INVITES_PER_HOUR,
    totalLimit: MAX_INVITES_PER_HOUR,
    isBlocked: false,
    resetsInSeconds: 0,
  });

  const checkRateLimit = useCallback(async (): Promise<RateLimitState> => {
    try {
      const raw = await AsyncStorage.getItem(RATE_LIMIT_KEY);
      const timestamps: number[] = raw ? JSON.parse(raw) : [];
      const now = Date.now();

      // Filter timestamps within last 1 hour
      const validTimestamps = timestamps.filter((t) => now - t < ONE_HOUR_MS);

      // Save pruned timestamps
      if (validTimestamps.length !== timestamps.length) {
        await AsyncStorage.setItem(
          RATE_LIMIT_KEY,
          JSON.stringify(validTimestamps)
        );
      }

      const count = validTimestamps.length;
      const remainingQuota = Math.max(0, MAX_INVITES_PER_HOUR - count);
      const isBlocked = remainingQuota <= 0;

      let resetsInSeconds = 0;
      if (isBlocked && validTimestamps.length > 0) {
        const oldest = validTimestamps[0];
        resetsInSeconds = Math.max(
          0,
          Math.ceil((oldest + ONE_HOUR_MS - now) / 1000)
        );
      }

      const state: RateLimitState = {
        remainingQuota,
        totalLimit: MAX_INVITES_PER_HOUR,
        isBlocked,
        resetsInSeconds,
      };

      setRateLimit(state);
      return state;
    } catch {
      return {
        remainingQuota: MAX_INVITES_PER_HOUR,
        totalLimit: MAX_INVITES_PER_HOUR,
        isBlocked: false,
        resetsInSeconds: 0,
      };
    }
  }, []);

  const recordInviteTimestamp = useCallback(async (): Promise<void> => {
    try {
      const raw = await AsyncStorage.getItem(RATE_LIMIT_KEY);
      const timestamps: number[] = raw ? JSON.parse(raw) : [];
      const now = Date.now();
      const next = [...timestamps.filter((t) => now - t < ONE_HOUR_MS), now];
      await AsyncStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(next));
      await checkRateLimit();
    } catch (e) {
      console.warn('[useVisitorInvite] Rate limit record error:', e);
    }
  }, [checkRateLimit]);

  useEffect(() => {
    checkRateLimit();
  }, [checkRateLimit]);

  const createInvite = useCallback(
    async (
      input: CreateVisitorInviteInput
    ): Promise<VisitorInviteRecord | null> => {
      setError(null);
      const limit = await checkRateLimit();
      if (limit.isBlocked) {
        setError(
          `Rate limit reached (max ${MAX_INVITES_PER_HOUR} invites/hour). Try again in ${Math.ceil(limit.resetsInSeconds / 60)} minutes.`
        );
        return null;
      }

      if (!input.visitorName.trim()) {
        setError('Visitor name is required.');
        return null;
      }

      setIsLoading(true);
      try {
        // 1. Get resident's unit ID
        const meRes = await residentFetch('/resident/me');
        if (!meRes.ok) {
          throw new Error('Failed to resolve resident unit account.');
        }
        const meData = (await meRes.json()) as {
          success?: boolean;
          data?: { id: string; name: string }[];
        };
        if (!meData.success || !meData.data?.length) {
          setError('No unit linked to this account.');
          return null;
        }

        const unit = meData.data[0];

        // 2. Post visitor pass request
        const body: Record<string, unknown> = {
          unitId: unit.id,
          visitorName: input.visitorName.trim(),
          visitorPhone: input.visitorPhone?.trim() || undefined,
          type: input.accessType,
          isOpenQR: false,
        };

        if (input.startDate) body.startDate = input.startDate;
        if (input.endDate) body.endDate = input.endDate;

        const res = await residentFetch('/resident/visitors', {
          method: 'POST',
          body: JSON.stringify(body),
        });

        const data = (await res.json()) as {
          success?: boolean;
          message?: string;
          data?: {
            id: string;
            qrCode?: { id: string; code: string; type: string };
            createdAt?: string;
          };
        };

        if (!res.ok || !data.success) {
          setError(data.message ?? 'Failed to generate visitor pass.');
          return null;
        }

        await recordInviteTimestamp();

        const record: VisitorInviteRecord = {
          id: data.data?.id ?? `vis-${Date.now()}`,
          visitorName: input.visitorName.trim(),
          visitorPhone: input.visitorPhone?.trim(),
          templateType: input.templateType,
          accessType: input.accessType,
          status: 'SENT',
          createdAt: data.data?.createdAt ?? new Date().toISOString(),
          validUntil:
            input.endDate ??
            new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          qrCode: data.data?.qrCode,
          unit: {
            id: unit.id,
            name: unit.name,
          },
        };

        return record;
      } catch (err) {
        const msg =
          (err as Error).message ?? 'Network error. Please try again.';
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [checkRateLimit, recordInviteTimestamp]
  );

  return {
    createInvite,
    rateLimit,
    isLoading,
    error,
    resetError: () => setError(null),
  };
}
