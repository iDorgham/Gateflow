import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';

export async function POST(req: Request) {
  try {
    if (!(await isAdminAuthorized(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leadId, context } = await req.json();

    // 1. Mock AI Draft Generation
    // In production, this would use Gemini to draft a context-aware follow-up email.
    const draft = {
      subject: 'Revolutionizing Security Operations at [Organization]',
      body: `Hi [Name],\n\nFollowing our recent interaction, I've analyzed your current infrastructure requirements. GateFlow's OMEGA-tier scanner hub seems like a perfect fit for your regional hubs in Dubai.\n\nI've prepared a draft proposal that addresses your concerns regarding regional data residency and Law 151 compliance.\n\nWould you be open to a 15-minute briefing on Thursday?\n\nBest regards,\nGateFlow Enterprise Team`,
      metadata: {
        tone: 'PROFESSIONAL_HIGH_INTENT',
        goal: 'SCHEDULE_MEETING',
        aiModel: 'gemini-1.5-pro',
      },
    };

    return NextResponse.json({
      success: true,
      draft,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[CRM_GENERATE_FOLLOW_UP_API]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
