import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { ProfileTab } from '../organizations/[orgId]/settings/tabs/profile-tab';
import { Locale } from '@/lib/i18n-config';

export const metadata = { title: 'Profile | GateFlow' };

export default async function ProfilePage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const claims = await getSessionClaims();
  if (!claims?.sub) redirect(`/${params.locale}/login`);

  const organizationId = claims.orgId;
  const user = await prisma.user.findFirst({
    where: { id: claims.sub, organizationId, deletedAt: null },
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

  if (!user) redirect(`/${params.locale}/login`);

  return (
    <div className="space-y-6 pb-20">
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
