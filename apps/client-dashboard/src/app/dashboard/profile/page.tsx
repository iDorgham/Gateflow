import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { ProfileClient } from './profile-client';

export const metadata = { title: 'Profile' };

export default async function ProfilePage() {
  const claims = await getSessionClaims();
  if (!claims) redirect('/login');

  const user = await prisma.user.findFirst({
    where: { id: claims.sub, deletedAt: null },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) redirect('/login');

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
      <ProfileClient
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
        }}
      />
    </div>
  );
}
