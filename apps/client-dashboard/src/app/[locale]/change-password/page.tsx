import { redirect } from 'next/navigation';
import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { ChangePasswordForm } from './change-password-form';

export default async function ChangePasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const claims = await getSessionClaims();
  if (!claims) redirect(`/${locale}/login`);

  const user = await prisma.user.findFirst({
    where: { id: claims.sub, deletedAt: null },
    select: { mustChangePassword: true },
  });

  if (!user?.mustChangePassword) {
    redirect(`/${locale}/dashboard`);
  }

  return <ChangePasswordForm />;
}
