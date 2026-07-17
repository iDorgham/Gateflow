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
    // LandingPage stores content as ordered LandingPageSection rows rather
    // than a single JSON blob — map each mock block to a section using the
    // flat { headline, body, ctaText, ctaLink } shape PageBuilder.tsx expects
    // uniformly across all section types.
    const SECTION_TYPE_MAP: Record<string, 'HERO' | 'FEATURES' | 'CTA'> = {
      hero: 'HERO',
      features: 'FEATURES',
      cta: 'CTA',
    };

    type MockBlock = (typeof mockResult.blocks)[number];
    const toSectionContent = (block: MockBlock) => {
      const c = block.content as Record<string, unknown>;
      const body =
        typeof c.subtitleEn === 'string'
          ? c.subtitleEn
          : Array.isArray(c.features)
            ? (c.features as { descriptionEn?: string }[])
                .map((f) => f.descriptionEn)
                .filter(Boolean)
                .join(' ')
            : '';
      return {
        headline: typeof c.titleEn === 'string' ? c.titleEn : '',
        body,
        ctaText: typeof c.buttonTextEn === 'string' ? c.buttonTextEn : '',
        ctaLink: '#',
      };
    };

    const landingPage = await prisma.landingPage.create({
      data: {
        titleEn: mockResult.title,
        titleAr: mockResult.title,
        slug: (
          mockResult.title.toLowerCase().replace(/ /g, '-') +
          '-' +
          Date.now()
        ).substring(0, 50),
        status: 'DRAFT',
        organizationId: targetOrgId,
        createdById: adminUser.id,
        sections: {
          create: mockResult.blocks
            .filter((block) => SECTION_TYPE_MAP[block.type])
            .map((block, i) => ({
              type: SECTION_TYPE_MAP[block.type],
              order: i,
              contentEn: toSectionContent(block),
              contentAr: toSectionContent(block),
              aiGenerated: true,
            })),
        },
      },
      include: { sections: true },
    });

    // Lazily provision a default MARKETING board per org — there's no
    // board-management UI, so no real board is guaranteed to exist.
    const board = await prisma.$transaction(
      async (tx) => {
        const existing = await tx.taskBoard.findFirst({
          where: { organizationId: targetOrgId, department: 'MARKETING' },
        });
        if (existing) return existing;
        return tx.taskBoard.create({
          data: {
            organizationId: targetOrgId,
            name: 'Marketing',
            department: 'MARKETING',
          },
        });
      },
      { isolationLevel: 'Serializable' }
    );

    // 3. Create the Task for Review
    const task = await prisma.task.create({
      data: {
        title: `Review AI Landing Page: ${mockResult.title}`,
        description: `AI Bot "LP Generator" synthesized a conversion architecture for: ${audience}. Goal: ${ctaGoal}.`,
        status: 'TODO',
        priority: 'HIGH',
        department: 'MARKETING',
        organizationId: targetOrgId,
        boardId: board.id,
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
