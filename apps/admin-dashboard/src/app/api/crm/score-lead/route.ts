import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

export async function POST(req: Request) {
  try {
    if (!(await isAdminAuthorized(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leadId } = await req.json();

    // 1. Analyze lead/contact data
    const contact = await prisma.contact?.findUnique({
      where: { id: leadId },
      include: { organization: true },
    });

    // 2. Mock AI Analysis Logic
    // In production, this would use Gemini to analyze interaction history, company profile, and market fit.
    const score = Math.floor(Math.random() * (100 - 40 + 1)) + 40;

    const insights = [
      'High vertical alignment with Industrial Security sector.',
      'Multiple touchpoints in the last 72 hours indicating strong intent.',
      'Decision maker seniority level: VP/Director level.',
      'Market fit score: 9.4/10 based on regional presence.',
    ];

    const nextBestAction =
      score > 80
        ? 'Direct outreach for Enterprise Demo.'
        : "Enroll in nurture sequence: 'GateFlow Foundations'.";

    // 3. Update Lead Score in DB (if model supports it, otherwise log)
    // For now, we return the analysis result

    return NextResponse.json({
      success: true,
      score,
      insights,
      nextBestAction,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[CRM_SCORE_LEAD_API]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
