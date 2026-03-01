import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const AddTagsSchema = z.object({
  tagIds: z.array(z.string().min(1)).min(1),
});
const RemoveTagSchema = z.object({
  tagId: z.string().min(1),
});

/** POST /api/contacts/[id]/tags — add tags to a contact */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id: contactId } = await params;
  const contact = await prisma.contact.findFirst({
    where: { id: contactId, organizationId: claims.orgId, deletedAt: null },
  });
  if (!contact) {
    return NextResponse.json({ success: false, message: 'Contact not found' }, { status: 404 });
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }
    const validation = AddTagsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }
    const { tagIds } = validation.data;
    const tagsInOrg = await prisma.tag.findMany({
      where: { id: { in: tagIds }, organizationId: claims.orgId, deletedAt: null },
      select: { id: true },
    });
    const validIds = tagsInOrg.map((t) => t.id);
    const existing = await prisma.contactTag.findMany({
      where: { contactId, tagId: { in: validIds } },
      select: { tagId: true },
    });
    const existingSet = new Set(existing.map((e) => e.tagId));
    const toCreate = validIds.filter((tagId) => !existingSet.has(tagId));
    if (toCreate.length > 0) {
      await prisma.contactTag.createMany({
        data: toCreate.map((tagId) => ({ contactId, tagId })),
      });
    }
    const contactWithTags = await prisma.contact.findFirst({
      where: { id: contactId, organizationId: claims.orgId, deletedAt: null },
      include: {
        contactTags: { include: { tag: { select: { id: true, name: true, color: true } } } },
      },
    });
    const tags = contactWithTags?.contactTags.map((ct) => ({ id: ct.tag.id, name: ct.tag.name, color: ct.tag.color })) ?? [];
    return NextResponse.json({ success: true, data: { tags } });
  } catch (error) {
    console.error('POST /api/contacts/[id]/tags error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

/** DELETE /api/contacts/[id]/tags — remove one tag from a contact */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id: contactId } = await params;
  const contact = await prisma.contact.findFirst({
    where: { id: contactId, organizationId: claims.orgId, deletedAt: null },
  });
  if (!contact) {
    return NextResponse.json({ success: false, message: 'Contact not found' }, { status: 404 });
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }
    const validation = RemoveTagSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.findFirst({
      where: { id: validation.data.tagId, organizationId: claims.orgId, deletedAt: null },
      select: { id: true },
    });
    if (!tag) {
      return NextResponse.json({ success: false, message: 'Tag not found' }, { status: 404 });
    }

    await prisma.contactTag.deleteMany({
      where: { contactId, tagId: validation.data.tagId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/contacts/[id]/tags error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
