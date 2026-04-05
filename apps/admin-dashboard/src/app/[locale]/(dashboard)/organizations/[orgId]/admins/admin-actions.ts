'use server';

import { randomBytes } from 'crypto';
import { hash as argon2Hash } from '@node-rs/argon2';
import { prisma } from '@gate-access/db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Locale } from '@/lib/i18n/i18n-config';
import { requireAdmin } from '@/lib/admin-auth';

function localeFromFormData(formData: FormData): Locale {
  const raw = String(formData.get('locale') ?? '');
  if (raw === 'ar-EG' || raw === 'en') return raw;
  return 'en';
}

export async function createAdmin(formData: FormData) {
  const locale = localeFromFormData(formData);
  await requireAdmin(locale);

  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;
  if (!name || !email || !password) return;

  const passwordHash = await argon2Hash(password);

  let adminRole = await prisma.role.findFirst({
    where: { name: 'ADMIN', organizationId: null },
  });

  if (!adminRole) {
    const { BUILT_IN_ROLES, DEFAULT_PERMISSIONS } =
      await import('@gate-access/types');
    adminRole = await prisma.role.create({
      data: {
        id: 'role-admin',
        name: 'ADMIN',
        description: 'Platform super-admin',
        isBuiltIn: true,
        permissions: DEFAULT_PERMISSIONS[BUILT_IN_ROLES.SUPER_ADMIN],
      },
    });
  }

  await prisma.user.upsert({
    where: { email },
    create: { name, email, passwordHash, roleId: adminRole.id },
    update: { name, passwordHash, roleId: adminRole.id, deletedAt: null },
  });

  revalidatePath(`/${locale}/admins`);
  redirect(`/${locale}/admins`);
}

export async function resetAdminPassword(formData: FormData) {
  const locale = localeFromFormData(formData);
  await requireAdmin(locale);

  const id = formData.get('id') as string;
  if (!id) return;

  const tempPassword = randomBytes(10).toString('hex');
  const passwordHash = await argon2Hash(tempPassword);

  await prisma.user.update({ where: { id }, data: { passwordHash } });

  (await cookies()).set(
    '_adminpwflash',
    JSON.stringify({ id, pw: tempPassword }),
    {
      path: '/',
      maxAge: 120,
      sameSite: 'lax',
    }
  );

  revalidatePath(`/${locale}/admins`);
  redirect(`/${locale}/admins`);
}

export async function toggleSuspend(formData: FormData) {
  const locale = localeFromFormData(formData);
  await requireAdmin(locale);

  const id = formData.get('id') as string;
  const isSuspended = formData.get('suspended') === 'true';
  if (!id) return;

  await prisma.user.update({
    where: { id },
    data: { deletedAt: isSuspended ? null : new Date() },
  });

  revalidatePath(`/${locale}/admins`);
}
