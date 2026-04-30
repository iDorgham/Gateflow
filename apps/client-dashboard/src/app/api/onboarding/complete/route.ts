import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '../../../../lib/auth-cookies';
import { z } from 'zod';
import { signAccessToken } from '../../../../lib/auth';

const OnboardingCompleteSchema = z.object({
  name: z.string().min(2),
  orgName: z.string().min(2),
  orgEmail: z.string().email(),
});

const ACCESS_COOKIE = 'gf_access_token';
const SECURE = process.env.NODE_ENV === 'production';

export async function POST(request: NextRequest) {
  try {
    const claims = await getSessionClaims();
    if (!claims) {
      console.error('Onboarding Error: No session claims found');
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = OnboardingCompleteSchema.safeParse(body);

    if (!validation.success) {
      console.error('Validation Error:', validation.error.flatten());
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name, orgName, orgEmail } = validation.data;

    // 1. Ensure the TENANT_ADMIN role exists (built-in)
    let tenantAdminRole = await prisma.role.findFirst({
      where: { name: 'TENANT_ADMIN', organizationId: null },
    });

    if (!tenantAdminRole) {
      console.log('Onboarding: TENANT_ADMIN role missing, seeding it now.');
      tenantAdminRole = await prisma.role.create({
        data: {
          name: 'TENANT_ADMIN',
          description: 'Default administrative role for organization owners',
          isBuiltIn: true,
          organizationId: null,
          permissions: {
            'gates:manage': true,
            'qr:create': true,
            'qr:manage': true,
            'scans:view': true,
            'scans:override': true,
            'workspace:manage': true,
            'roles:manage': true,
            'users:manage': true,
            'analytics:view': true,
            'projects:manage': true,
            'units:manage': true,
            'contacts:manage': true,
          },
        },
      });
    }

    // 2. Transaction to create org, default project, and update user
    const { org, user, defaultProject } = await prisma.$transaction(
      async (tx) => {
        // Create organization
        const org = await tx.organization.create({
          data: {
            name: orgName,
            email: orgEmail,
          },
        });

        // Create default project for this org
        const defaultProject = await tx.project.create({
          data: {
            name: orgName,
            organizationId: org.id,
          },
        });

        // Update user
        const user = await tx.user.update({
          where: { id: claims.sub },
          data: {
            name: name,
            organizationId: org.id,
            roleId: tenantAdminRole.id,
          },
          include: { role: true },
        });

        return { org, user, defaultProject };
      }
    );

    // 3. Rotate access token to include the new orgId
    const newAccessToken = await signAccessToken(
      user.id,
      user.email,
      user.organizationId,
      null, // New org has no type yet
      {
        id: user.role.id,
        name: user.role.name,
        permissions: user.role.permissions as Record<string, boolean>,
      }
    );

    const response = NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        orgId: org.id,
      },
    });

    // Set updated session cookie
    response.cookies.set(ACCESS_COOKIE, newAccessToken, {
      httpOnly: true,
      secure: SECURE,
      sameSite: 'lax',
      maxAge: 60 * 15,
      path: '/',
    });

    // Set current project cookie to the new default project
    response.cookies.set('gf_current_project', defaultProject.id, {
      httpOnly: true,
      secure: SECURE,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Detailed Onboarding error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
