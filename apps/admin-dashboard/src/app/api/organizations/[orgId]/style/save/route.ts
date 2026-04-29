import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ orgId: string }> }
) {
  const params = await props.params;
  const { orgId } = params;

  if (!(await isAdminAuthorized(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { variables } = await req.json();

    // 1. Transaction to update variables and create snapshot
    const result = await prisma.$transaction(async (tx) => {
      // Update individual theme variables
      for (const v of variables) {
        await tx.themeVariable.upsert({
          where: {
            organizationId_key: {
              organizationId: orgId,
              key: v.key
            }
          },
          update: { value: v.value },
          create: {
            organizationId: orgId,
            key: v.key,
            value: v.value,
            category: 'UI'
          }
        });
      }

      // Create snapshot
      const cssTokens = variables.reduce((acc: any, v: any) => {
        acc[v.key] = v.value;
        return acc;
      }, {});

      const snapshot = await tx.styleSnapshot.create({
        data: {
          organizationId: orgId,
          name: `Snapshot ${new Date().toISOString()}`,
          cssTokens,
          createdById: 'SYSTEM', // TODO: Get actual user ID
        }
      });

      // Update active style
      await tx.organization.update({
        where: { id: orgId },
        data: { activeStyleId: snapshot.id }
      });

      return snapshot;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[STYLE_SAVE_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
