import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { prisma } from '@gate-access/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  if (!isAdminAuthenticated()) {
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
    return NextResponse.json(
      { success: false, message: 'Failed to revoke authorization key' },
      { status: 500 }
    );
  }
}
