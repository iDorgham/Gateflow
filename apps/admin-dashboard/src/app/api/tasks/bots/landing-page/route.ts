import { NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { isAdminAuthorized } from '@/lib/admin-auth';

export async function POST(req: Request) {
  try {
    if (!(await isAdminAuthorized(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For single-admin dashboard, we find the primary admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: { name: 'TENANT_ADMIN' } },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: 'No admin user found in database' },
        { status: 500 }
      );
    }

    const { pageType, audience, propositions, ctaGoal, organizationId } =
      await req.json();
    const targetOrgId = organizationId || adminUser.organizationId;

    if (!targetOrgId) {
      return NextResponse.json(
        { error: 'No target organization identified' },
        { status: 400 }
      );
    }

    // 1. Mock AI Generation for Landing Page
    const mockResult = {
      title: `${pageType.charAt(0).toUpperCase() + pageType.slice(1)} for ${audience}`,
      blocks: [
        {
          id: 'hero-lp',
          type: 'hero',
          content: {
            titleEn: `Smart Access for ${audience}`,
            subtitleEn: `The ultimate ${pageType} solution powered by GateFlow.`,
          },
        },
        {
          id: 'features-lp',
          type: 'features',
          content: {
            titleEn: 'Why Choose GateFlow?',
            features: propositions.map((p: string, i: number) => ({
              titleEn: `Feature ${i + 1}`,
              descriptionEn: p,
            })),
          },
        },
        {
          id: 'cta-lp',
          type: 'cta',
          content: {
            titleEn: `Ready to start with ${ctaGoal}?`,
            buttonTextEn: ctaGoal || 'Get Started',
          },
        },
      ],
    };

    // 2. Create the Draft Landing Page
    const landingPage = await prisma.landingPage.create({
      data: {
        title: mockResult.title,
        slug: (
          mockResult.title.toLowerCase().replace(/ /g, '-') +
          '-' +
          Date.now()
        ).substring(0, 50),
        contentJson: mockResult.blocks,
        status: 'DRAFT',
        aiGenerated: true,
        organizationId: targetOrgId,
      },
    });

    // 3. Create the Task for Review
    const task = await prisma.task.create({
      data: {
        title: `Review AI Landing Page: ${mockResult.title}`,
        description: `AI Bot "LP Generator" synthesized a conversion architecture for: ${audience}. Goal: ${ctaGoal}.`,
        status: 'TODO',
        priority: 'HIGH',
        department: 'MARKETING',
        organizationId: targetOrgId,
        boardId: 'marketing-board',
        createdById: adminUser.id,
        linkedType: 'LANDING_PAGE',
        linkedId: landingPage.id,
      },
    });

    // 4. Log Bot Run
    await prisma.taskBotRun.create({
      data: {
        botId: 'lp-generator-id',
        taskId: task.id,
        input: { pageType, audience, propositions, ctaGoal },
        output: { pageId: landingPage.id, taskId: task.id },
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      draft: landingPage,
      task,
    });
  } catch (error) {
    console.error('[LP_GENERATOR_BOT_API]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
