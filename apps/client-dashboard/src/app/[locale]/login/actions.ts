'use server';

import { cookies } from 'next/headers';
import { prisma } from '@gate-access/db';
import { verifyPassword } from '@/lib/password';
import {
  signAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} from '@/lib/auth';
import { resolveAuthCookieDomain, setAuthCookies } from '@/lib/auth-cookies';
// import { UserRole } from '@gate-access/db';
import { CSRF_COOKIE, generateCsrfToken } from '@/lib/csrf';
// import { castUserRole } from '@/lib/types';
import { LOCALE_COOKIE, i18n } from '@/lib/i18n-config';

const SECURE = process.env.NODE_ENV === 'production';

export type LoginState = {
  error?: string;
  success?: boolean;
  locale?: string;
  email?: string;
} | null;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password)
    return { error: 'Email and password are required.', email };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: 'Enter a valid email address.', email };
  if (password.length < 8)
    return { error: 'Password must be at least 8 characters.', email };

  // Fetch user — constant-time error path regardless of existence
  const userData = await prisma.user
    .findFirst({
      where: { email, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: {
          select: {
            id: true,
            name: true,
            permissions: true,
          },
        },
        organizationId: true,
        organization: { select: { type: true } },
      },
    })
    .catch(() => null);

  const passwordValid = userData
    ? await verifyPassword(userData.passwordHash, password).catch(() => false)
    : false;

  if (!userData || !passwordValid)
    return { error: 'Invalid email or password.', email };

  // Issue tokens
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(
      userData.id,
      userData.email,
      userData.organizationId,
      userData.organization?.type ?? null,
      {
        id: userData.role.id,
        name: userData.role.name,
        permissions: userData.role.permissions as Record<string, boolean>,
      }
    ),
    Promise.resolve(generateRefreshToken()),
  ]);

  // Persist refresh token
  await prisma.refreshToken
    .create({
      data: {
        token: refreshToken,
        userId: userData.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    })
    .catch(() => {});

  // Set httpOnly cookies — must happen before redirect()
  await setAuthCookies(accessToken, refreshToken);

  // Set CSRF cookie for this session (same parent domain as auth cookies)
  const csrfToken = generateCsrfToken();
  const cookieDomain = resolveAuthCookieDomain();
  (await cookies()).set(CSRF_COOKIE, csrfToken, {
    httpOnly: false,
    secure: SECURE,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
    ...(cookieDomain ? { domain: cookieDomain } : {}),
  });

  const localeCookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locale = i18n.locales.includes(localeCookie as any)
    ? (localeCookie as (typeof i18n.locales)[number])
    : i18n.defaultLocale;

  return { success: true, locale };
}
