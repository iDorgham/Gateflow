import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@gate-access/db';
import { getSessionClaims } from '@/lib/auth-cookies';
import { ALL_PROJECTS_VALUE } from '@/lib/project-cookie';
import { validateCsrfToken } from '@/lib/csrf';

const SECURE = process.env.NODE_ENV === 'production';
const COOKIE_NAME = 'gf_current_project';
const COOKIE_OPTS = {
  httpOnly: true,
  secure: SECURE,
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 365,
  path: '/',
};

export async function POST(request: NextRequest) {
  const claims = await getSessionClaims();
  if (!claims?.orgId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // CSRF Protection
  if (!(await validateCsrfToken(request))) {
    return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
  }

  const body = await request.json();
  const { projectId } = body;

  if (!projectId || typeof projectId !== 'string') {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
  }

  // "All Projects" is a special value — skip DB validation
  if (projectId === ALL_PROJECTS_VALUE) {
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, ALL_PROJECTS_VALUE, COOKIE_OPTS);
    return response;
  }

  // Validate specific project belongs to this org
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId: claims.orgId, deletedAt: null },
    select: { id: true },
  });

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, projectId, COOKIE_OPTS);
  return response;
}
