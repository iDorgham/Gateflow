import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';

export async function POST(req: Request) {
  try {
    if (!(await isAdminAuthorized(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticketId, content } = await req.json();

    // 1. Mock AI Triage Analysis
    // In production, this would use Gemini to analyze ticket content, history, and system logs.
    const triage = {
      suggestedCategory: 'INFRASTRUCTURE_SYNC',
      suggestedPriority: 'URGENT',
      suggestedAssigneeId: 'regional-admin-01',
      confidence: 0.94,
      reasoning:
        "Subject mentions 'Scanner Sync Timeout' and 'Hub Dubai-A', which aligns with known regional firmware desync issues reported in the last 24 hours.",
      recommendedActions: [
        'Initiate Remote Reset Hub Dubai-A',
        'Check regional firmware version consistency',
        'Escalate to Regional Ops if reset fails',
      ],
    };

    return NextResponse.json({
      success: true,
      triage,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[SUPPORT_TRIAGE_API]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
