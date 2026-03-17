/**
 * GateAI Hub v2.0 — Route Layout (Server Component)
 *
 * Security gate: validates session and org membership via `getSessionClaims`.
 * Any unauthenticated or org-less user is redirected before HTML is sent.
 * Satisfies Contract #1 (multi-tenancy) and Contract #4 (authentication).
 */

import { redirect } from 'next/navigation';
import { getSessionClaims } from '@/lib/auth-cookies';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GateAI Operations Hub | GateFlow',
  description:
    'Transform gate operations with intelligent tagging, canvas analytics, and automated scheduling.',
};

interface GateAIHubRouteLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function GateAIHubRouteLayout({
  children,
  params,
}: GateAIHubRouteLayoutProps) {
  const { locale } = await params;

  // ── Security Gate ──────────────────────────────────────────────────────────
  // Contract §4: verify session before any tenant-scoped access.
  // Contract §1: confirm orgId exists (tenant isolation enforcement).
  const claims = await getSessionClaims();

  if (!claims?.orgId) {
    // Redirect unauthenticated / non-org users to sign-in
    redirect(`/${locale}/auth/sign-in`);
  }

  return <>{children}</>;
}
