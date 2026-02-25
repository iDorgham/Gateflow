import { getSessionClaims } from '@/lib/auth-cookies';
import { prisma } from '@gate-access/db';
import { redirect } from 'next/navigation';
import { SettingsClient } from './settings-client';

export const metadata = { title: 'Settings | GateFlow' };

export default async function SettingsPage() {
  const claims = await getSessionClaims();
  if (!claims?.orgId) redirect('/login');

  const [user, org, projects, apiKeys, webhooks, teamMembers, counts] = await Promise.all([
    // Profile
    prisma.user.findFirst({
      where: { id: claims.sub, deletedAt: null },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true, bio: true, createdAt: true },
    }),
    // Workspace
    prisma.organization.findFirst({
      where: { id: claims.orgId, deletedAt: null },
      select: { id: true, name: true, email: true, domain: true, plan: true, logoUrl: true, createdAt: true },
    }),
    // Projects
    prisma.project.findMany({
      where: { organizationId: claims.orgId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
      include: { 
        _count: { select: { gates: true, qrCodes: true, units: true } },
        units: {
          select: {
            contacts: { select: { contactId: true } }
          }
        }
      },
    }),
    // API Keys
    prisma.apiKey.findMany({
      where: { organizationId: claims.orgId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        scopes: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
        createdBy: true,
      },
    }),
    // Webhooks
    prisma.webhook.findMany({
      where: { organizationId: claims.orgId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        url: true,
        events: true,
        isActive: true,
        createdAt: true,
        deliveries: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    }),
    // Team
    prisma.user.findMany({
      where: { organizationId: claims.orgId, deletedAt: null },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    }),
    // Billing stats
    Promise.all([
      prisma.gate.count({ where: { organizationId: claims.orgId } }),
      prisma.qRCode.count({ where: { organizationId: claims.orgId } }),
    ]),
  ]);

  if (!user || !org) redirect('/login');

  return (
    <SettingsClient
      user={{
        ...user,
        avatarUrl: user.avatarUrl ?? null,
        bio: user.bio ?? null,
        createdAt: user.createdAt.toISOString(),
      }}
      org={{
        ...org,
        logoUrl: org.logoUrl ?? null,
        domain: org.domain ?? '',
        createdAt: org.createdAt.toISOString(),
      }}
      projects={projects.map(p => {
        const uniqueContacts = new Set(
          p.units.flatMap((u) => u.contacts.map((c) => c.contactId))
        );
        return {
          ...p,
          createdAt: p.createdAt,
          _count: {
            gates: p._count.gates,
            qrCodes: p._count.qrCodes,
            units: p._count.units,
            contacts: uniqueContacts.size,
          }
        };
      })}
      apiKeys={apiKeys.map(k => ({
        ...k,
        lastUsedAt: k.lastUsedAt?.toISOString() ?? null,
        expiresAt: k.expiresAt?.toISOString() ?? null,
        createdAt: k.createdAt.toISOString(),
      }))}
      webhooks={webhooks.map(wh => ({
        ...wh,
        createdAt: wh.createdAt.toISOString(),
        deliveries: wh.deliveries.map(d => ({
          ...d,
          lastAttemptAt: d.lastAttemptAt?.toISOString() ?? null,
          createdAt: d.createdAt.toISOString(),
        })),
      }))}
      teamMembers={teamMembers.map(m => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
      }))}
      billing={{
        gateCount: counts[0],
        qrCount: counts[1],
      }}
      currentUserId={claims.sub}
    />
  );
}
