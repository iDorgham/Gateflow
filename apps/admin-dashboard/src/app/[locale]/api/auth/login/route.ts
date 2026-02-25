import { NextRequest, NextResponse } from 'next/server';
import { LoginPayloadSchema, TokenResponseSchema } from '@gate-access/types';

const MOCK_ADMIN = {
  id: 'clx_admin_123',
  email: 'admin@gateaccess.io',
  name: 'Super Admin',
  passwordHash: 'hashed_admin_password',
  role: 'ADMIN' as const,
  organizationId: null,
};

function generateMockToken(): string {
  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify({
    sub: MOCK_ADMIN.id,
    email: MOCK_ADMIN.email,
    role: MOCK_ADMIN.role,
    organizationId: MOCK_ADMIN.organizationId,
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

    if (email === MOCK_ADMIN.email && password === 'admin123') {
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
