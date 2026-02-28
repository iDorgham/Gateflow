import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';

export const dynamic = 'force-dynamic';

const BulkTagsSchema = z.object({
  contactIds: z.array(z.string().min(1)).min(1),
  tagIds: z.array(z.string().min(1)).min(1),
  action: z.enum(['add', 'remove']),
});

/** POST /api/contacts/tags/bulk — add or remove tags for multiple contacts */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }
    const validation = BulkTagsSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', error: validation.error.flatten() },
        { status: 400 }
      );
    }
    const { contactIds, tagIds, action } = validation.data;

    const contactsInOrg = await prisma.contact.findMany({
      where: { id: { in: contactIds }, organizationId: claims.orgId, deletedAt: null },
      select: { id: true },
    });
    const validContactIds = contactsInOrg.map((c) => c.id);
    const tagsInOrg = await prisma.tag.findMany({
      where: { id: { in: tagIds }, organizationId: claims.orgId, deletedAt: null },
      select: { id: true },
    });
    const validTagIds = tagsInOrg.map((t) => t.id);

    if (action === 'add') {
      const existing = await prisma.contactTag.findMany({
        where: { contactId: { in: validContactIds }, tagId: { in: validTagIds } },
        select: { contactId: true, tagId: true },
      });
      const existingSet = new Set(existing.map((e) => `${e.contactId}:${e.tagId}`));
      const toCreate: { contactId: string; tagId: string }[] = [];
      for (const contactId of validContactIds) {
        for (const tagId of validTagIds) {
          if (!existingSet.has(`${contactId}:${tagId}`)) toCreate.push({ contactId, tagId });
        }
      }
      if (toCreate.length > 0) {
        await prisma.contactTag.createMany({ data: toCreate });
      }
    } else {
      await prisma.contactTag.deleteMany({
        where: {
          contactId: { in: validContactIds },
          tagId: { in: validTagIds },
        },
      });
    }

    return NextResponse.json({ success: true, updated: validContactIds.length });
  } catch (error) {
    console.error('POST /api/contacts/tags/bulk error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
