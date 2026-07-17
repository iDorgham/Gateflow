import { NextResponse } from 'next/server';
import { prisma, ensureBoard } from '@gate-access/db';
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

    const { topic, keywords, tone, wordCount, organizationId } =
      await req.json();
    const targetOrgId = organizationId || adminUser.organizationId;

    if (!targetOrgId) {
      return NextResponse.json(
        { error: 'No target organization identified' },
        { status: 400 }
      );
    }

    // 1. Mock AI Generation (Logic would call Gemini here)
    const mockResult = {
      title: topic || 'The Future of Gate Access',
      excerpt: `An insightful exploration into ${topic} and its impact on modern PropTech.`,
      blocks: [
        {
          id: 'hero-1',
          type: 'hero',
          content: {
            titleEn: topic,
            titleAr: 'مستقبل الوصول عبر البوابات',
            subtitleEn: 'Revolutionizing security with AI',
            subtitleAr: 'إحداث ثورة في الأمن باستخدام الذكاء الاصطناعي',
          },
        },
        {
          id: 'text-1',
          type: 'features', // Reusing block types
          content: {
            titleEn: 'Key Insights',
            features: [
              {
                titleEn: 'Enhanced Security',
                descriptionEn: 'AI-powered threat detection.',
              },
              {
                titleEn: 'Seamless Access',
                descriptionEn: 'Zero-friction entry for residents.',
              },
            ],
          },
        },
        {
          id: 'cta-1',
          type: 'cta',
          content: {
            titleEn: 'Ready to upgrade?',
            buttonTextEn: 'Contact Sales',
          },
        },
      ],
    };

    // 2. Create the Draft Blog Post
    const blogPost = await prisma.blogPost.create({
      data: {
        titleEn: mockResult.title,
        // Schema requires titleAr; leave empty until a real AR translation exists
        // so Arabic surfaces don't show mislabeled English.
        titleAr: '',
        slugEn: (
          mockResult.title.toLowerCase().replace(/ /g, '-') +
          '-' +
          Date.now()
        ).substring(0, 50),
        slugAr: 'post-' + Date.now(),
        excerptEn: mockResult.excerpt,
        contentJson: mockResult.blocks,
        status: 'DRAFT',
        aiGenerated: true,
        aiTopicSuggestion: topic,
        aiDraftContent: JSON.stringify(mockResult),
        authorId: adminUser.id,
        organizationId: targetOrgId,
      },
    });

    // Lazily provision a default MARKETING board per org — there's no
    // board-management UI, so no real board is guaranteed to exist.
    const board = await ensureBoard(targetOrgId, 'MARKETING', 'Marketing');

    // 3. Create the Task for Review
    const task = await prisma.task.create({
      data: {
        title: `Review AI Blog: ${mockResult.title}`,
        description: `AI Bot "Blog Writer" generated a draft based on: ${topic}. Please review and publish.`,
        status: 'TODO',
        priority: 'MEDIUM',
        department: 'MARKETING',
        organizationId: targetOrgId,
        boardId: board.id,
        createdById: adminUser.id,
        linkedType: 'BLOG_POST',
        linkedId: blogPost.id,
      },
    });

    // 4. Log Bot Run
    await prisma.taskBotRun.create({
      data: {
        botId: 'blog-writer-id', // Assuming static ID for now or lookup
        taskId: task.id,
        input: { topic, keywords, tone, wordCount },
        output: { postId: blogPost.id, taskId: task.id },
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      draft: blogPost,
      task,
    });
  } catch (error) {
    console.error('[BLOG_WRITER_BOT_API]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
