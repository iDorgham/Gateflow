import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/require-admin-api';

export async function GET(req: Request) {
  const denied = await requireAdminApi(req);
  if (denied) return denied;

  // Mock data for menus
  const menus = [
    {
      id: 'main',
      name: 'Main Navigation',
      slug: 'main',
      itemsCount: 5,
      updatedAt: '2 hours ago',
    },
    {
      id: 'footer',
      name: 'Footer Menu',
      slug: 'footer',
      itemsCount: 12,
      updatedAt: '1 day ago',
    },
    {
      id: 'mobile',
      name: 'Mobile Sidebar',
      slug: 'mobile',
      itemsCount: 4,
      updatedAt: '2 days ago',
    },
  ];
  return NextResponse.json({ menus });
}

export async function POST(req: Request) {
  const denied = await requireAdminApi(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    // Mock create logic
    console.log('[API] Creating menu:', body.name);
    return NextResponse.json({ success: true, id: `menu_${Date.now()}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
