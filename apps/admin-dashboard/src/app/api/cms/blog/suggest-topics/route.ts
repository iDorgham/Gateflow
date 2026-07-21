import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/require-admin-api';

export async function POST(req: Request) {
  const denied = await requireAdminApi(req);
  if (denied) return denied;

  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const topics = [
    {
      title: 'The 2026 Shift: AI-Powered Perimeter Security',
      excerpt:
        'Why traditional gate access is becoming obsolete and how neural-sync gates are taking over high-end residential complexes.',
      keywords: ['AI Security', 'Smart Gates', '2026 Trends', 'IoT'],
    },
    {
      title: 'Sustainable PropTech: Greener Access Solutions',
      excerpt:
        'Reducing the carbon footprint of security infrastructure through solar-powered automated systems and digital identity fabric.',
      keywords: [
        'Sustainability',
        'PropTech',
        'Solar Security',
        'Green Energy',
      ],
    },
    {
      title: 'The Psychology of Sovereign Spaces',
      excerpt:
        'How seamless, non-intrusive security enhances the feeling of belonging and safety in modern gated communities.',
      keywords: ['UX Design', 'Community', 'Psychology', 'Safety'],
    },
    {
      title: "MENA's Digital Transformation in Real Estate",
      excerpt:
        'A deep dive into how Gulf nations are leading the world in implementing sovereign digital access protocols.',
      keywords: [
        'MENA',
        'Digital Transformation',
        'Real Estate',
        'Sovereignty',
      ],
    },
  ];

  return NextResponse.json({ topics });
}
