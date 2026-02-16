import { NextRequest, NextResponse } from 'next/server';
import { LoginPayloadSchema, TokenResponseSchema } from '@gate-access/types';

const MOCK_USER = {
  id: 'clx1234567890',
  email: 'tenant@example.com',
  name: 'Tenant User',
  passwordHash: 'hashed_password',
  role: 'TENANT_ADMIN' as const,
  organizationId: 'org_1234567890',
};

function generateMockToken(): string {
  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
    sub: MOCK_USER.id,
    email: MOCK_USER.email,
    role: MOCK_USER.role,
    organizationId: MOCK_USER.organizationId,
    iat: Date.now(),
    exp: Date.now() + 3600000,
  }))}.mock_signature`;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    const validation = LoginPayloadSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request body',
          error: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    if (email === MOCK_USER.email && password === 'password123') {
      const tokenResponse = {
        accessToken: generateMockToken(),
        refreshToken: `refresh_${generateMockToken()}`,
        expiresIn: 3600,
        tokenType: 'Bearer' as const,
      };

      return NextResponse.json({
        success: true,
        data: TokenResponseSchema.parse(tokenResponse),
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Invalid credentials',
      },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
