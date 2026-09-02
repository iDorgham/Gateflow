import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { requireAdminApi } from '@/lib/require-admin-api';

/**
 * GET /api/admin/integrations/health
 *
 * Admin-only: global integration health snapshot. Aggregates non-deleted
 * IntegrationCredential rows across all organizations, grouped by provider,
 * with per-provider credential counts, distinct org coverage, recency, and a
 * derived health status. Serves the admin "Integration Health" observability
 * view (Phase 5, Task 5.4).
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const authError = await requireAdminApi(request);
  if (authError) return authError;

  try {
    const rows = await prisma.integrationCredential.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        provider: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    type ProviderBucket = {
      provider: string;
      count: number;
      orgCount: number;
      orgs: Set<string>;
      createdAt: Date;
      updatedAt: Date;
    };

    const byProvider = new Map<string, ProviderBucket>();
    const orgs = new Set<string>();

    for (const row of rows) {
      orgs.add(row.organizationId);
      const bucket =
        byProvider.get(row.provider) ??
        ({
          provider: row.provider,
          count: 0,
          orgCount: 0,
          orgs: new Set<string>(),
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        } as ProviderBucket);
      bucket.count += 1;
      bucket.orgs.add(row.organizationId);
      if (row.createdAt < bucket.createdAt) bucket.createdAt = row.createdAt;
      if (row.updatedAt > bucket.updatedAt) bucket.updatedAt = row.updatedAt;
      byProvider.set(row.provider, bucket);
    }

    const now = Date.now();
    const STALE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

    const providers = Array.from(byProvider.values()).map((b) => {
      const healthy = b.count > 0 && now - b.updatedAt.getTime() <= STALE_MS;
      return {
        provider: b.provider,
        count: b.count,
        orgCount: b.orgs.size,
        lastUpdated: b.updatedAt.toISOString(),
        health: healthy ? 'healthy' : 'stale',
      };
    });

    providers.sort(
      (a, b) => b.count - a.count || a.provider.localeCompare(b.provider)
    );

    const totalCredentials = rows.length;
    const healthyProviders = providers.filter(
      (p) => p.health === 'healthy'
    ).length;

    return NextResponse.json({
      success: true,
      generatedAt: new Date().toISOString(),
      totals: {
        totalCredentials,
        providerCount: providers.length,
        orgCount: orgs.size,
        healthyProviders,
      },
      providers,
    });
  } catch (err) {
    console.error('[integrations/health] GET error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to compute integration health' },
      { status: 500 }
    );
  }
}
