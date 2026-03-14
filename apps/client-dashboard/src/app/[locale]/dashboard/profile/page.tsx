import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { ProfileTab } from '../settings/tabs/profile-tab';

export const metadata = { title: 'Profile | GateFlow' };

export default async function ProfilePage() {
  const claims = await getSessionClaims();
  if (!claims?.sub) redirect('/login');

  const user = await prisma.user.findFirst({
    where: { id: claims.sub, deletedAt: null },
    select: {
      id: true,
      name: true,
      email: true,
      role: { select: { name: true } },
      avatarUrl: true,
      bio: true,
      phone: true,
      company: true,
      website: true,
      socialLinks: true,
      createdAt: true,
    },
  });

  if (!user) redirect('/login');

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-1 border-b border-border pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase">
          Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Your account and identity. For organization settings, use GateFlow settings from the header menu.
        </p>
      </div>
      <ProfileTab
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.name,
          avatarUrl: user.avatarUrl ?? null,
          bio: user.bio ?? null,
          phone: user.phone ?? null,
          company: user.company ?? null,
          website: user.website ?? null,
          socialLinks: user.socialLinks ?? null,
          createdAt: user.createdAt.toISOString(),
        }}
      />
    </div>
  );
}
