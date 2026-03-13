import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json(
      { success: false, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    await prisma.adminAuthorizationKey.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Authorization key revoked successfully',
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`DELETE /api/admin/authorization-keys/${(params as any).id} error:`, msg);
    return NextResponse.json(
      { success: false, message: `Failed to revoke authorization key: ${msg}` },
      { status: 500 }
    );
  }
}
