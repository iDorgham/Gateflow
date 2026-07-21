import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/require-admin-api';

export async function POST(req: Request) {
  const denied = await requireAdminApi(req);
  if (denied) return denied;

  try {
    const { topic } = await req.json();

    // Simulate complex AI content generation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const draft = {
      title: topic,
      excerpt: `An in-depth exploration of ${topic}, analyzing the impact on modern infrastructure and security protocols.`,
      metaDescription: `Read our latest expert analysis on ${topic}. Discover trends, challenges, and solutions for 2026.`,
      sections: [
        {
          type: 'HERO',
          content: {
            en: {
              headline: topic,
              subheadline: 'Expert Analysis & Future Roadmap',
            },
            ar: {
              headline: topic, // In real app, translate here
              subheadline: 'تحليل الخبراء وخارطة الطريق المستقبلية',
            },
          },
        },
        {
          type: 'TEXT',
          content: {
            en: {
              body: 'Introduction: The landscape of security is changing rapidly. As we look towards 2026, the integration of sovereign AI protocols is no longer optional—it is the foundation of modern trust architecture.',
            },
            ar: {
              body: 'المقدمة: يتغير مشهد الأمن بسرعة. وبينما نتطلع نحو عام 2026، لم يعد دمج بروتوكولات الذكاء الاصطناعي السيادية اختيارياً - بل هو أساس بنية الثقة الحديثة.',
            },
          },
        },
        {
          type: 'QUOTE',
          content: {
            en: {
              text: 'Sovereignty in digital access is the final frontier of property management.',
              author: 'GateFlow AI Research',
            },
            ar: {
              text: 'السيادة في الوصول الرقمي هي الحدود النهائية لإدارة الممتلكات.',
              author: 'أبحاث جيت فلو للذكاء الاصطناعي',
            },
          },
        },
        {
          type: 'CTA',
          content: {
            en: {
              headline: 'Ready to Secure Your Perimeter?',
              ctaText: 'Get a Free Audit',
            },
            ar: {
              headline: 'جاهز لتأمين محيطك؟',
              ctaText: 'احصل على تدقيق مجاني',
            },
          },
        },
      ],
    };

    return NextResponse.json({ draft });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
