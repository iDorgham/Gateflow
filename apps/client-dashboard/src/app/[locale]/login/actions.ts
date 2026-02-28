'use server';

import { cookies } from 'next/headers';
import { prisma } from '@gate-access/db';
import {
  verifyPassword,
  signAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
} from '@/lib/auth';
import { setAuthCookies } from '@/lib/auth-cookies';
// import { UserRole } from '@gate-access/db';
import { CSRF_COOKIE, generateCsrfToken } from '@/lib/csrf';
// import { castUserRole } from '@/lib/types';
import { LOCALE_COOKIE, i18n } from '@/lib/i18n-config';

const SECURE = process.env.NODE_ENV === 'production';

export type LoginState = {
  error?: string;
  success?: boolean;
  locale?: string;
} | null;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) return { error: 'Email and password are required.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: 'Enter a valid email address.' };
  if (password.length < 8)
    return { error: 'Password must be at least 8 characters.' };

  // Fetch user — constant-time error path regardless of existence
  const user = await prisma.user
    .findFirst({
      where: { email, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        role: true,
        organizationId: true,
      },
    })
    .catch(() => null);

  const passwordValid = user
    ? await verifyPassword(user.passwordHash, password).catch(() => false)
    : false;

  if (!user || !passwordValid) return { error: 'Invalid email or password.' };

  // Issue tokens
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(user.id, user.email, user.organizationId, user.role),
    Promise.resolve(generateRefreshToken()),
  ]);

  // Persist refresh token
  await prisma.refreshToken
    .create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    })
    .catch(() => {});

  // Set httpOnly cookies — must happen before redirect()
  setAuthCookies(accessToken, refreshToken);

  // Set CSRF cookie for this session
  const csrfToken = generateCsrfToken();
  cookies().set(CSRF_COOKIE, csrfToken, {
    httpOnly: false,
    secure: SECURE,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });

  const localeCookie = cookies().get(LOCALE_COOKIE)?.value;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locale = i18n.locales.includes(localeCookie as any)
    ? (localeCookie as (typeof i18n.locales)[number])
    : i18n.defaultLocale;

  return { success: true, locale };
}
