/**
 * GET /api/cron/retention
 * Nightly PII purge & anonymization scheduler.
 * Guarded by CRON_SECRET (fail closed) — never exposed publicly.
 */
import { NextRequest, NextResponse } from 'next/server';
import { runRetentionBatch } from '@gate-access/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Fail closed: missing CRON_SECRET must not expose the purge publicly.
  if (!cronSecret || cronSecret.length < 16) {
    return NextResponse.json(
      { success: false, message: 'Cron endpoint misconfigured' },
      { status: 503 }
    );
  }
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const summary = await runRetentionBatch();
    const changed = summary.totals.deleted + summary.totals.anonymized;
    return NextResponse.json({
      success: true,
      generatedAt: summary.generatedAt,
      totals: summary.totals,
      changed,
      organizations: summary.organizations.length,
    });
  } catch (error) {
    console.error('GET /api/cron/retention error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
