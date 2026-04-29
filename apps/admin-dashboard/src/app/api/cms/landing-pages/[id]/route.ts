import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { blocks } = await req.json();

    // Mock save logic
    console.log(`[CMS] Saving draft for ${id}`);

    return NextResponse.json({ success: true, id, blocks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { confirmed } = await req.json();

    if (!confirmed) {
      return NextResponse.json(
        { error: 'Confirmation required' },
        { status: 400 }
      );
    }

    // Mock publish logic
    console.log(`[CMS] Published ${id}`);
    console.log(`[AI_AUDIT] LANDING_PAGE_PUBLISHED for ${id}`);

    return NextResponse.json({ success: true, id, status: 'PUBLISHED' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
