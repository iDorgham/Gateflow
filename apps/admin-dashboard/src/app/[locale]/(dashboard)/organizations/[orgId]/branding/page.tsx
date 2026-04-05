'use client';

import { StyleEditor } from '@/components/theming/StyleEditor';
import { useParams } from 'next/navigation';

/**
 * Branding Hub Page
 * Power user tool for configuring per-organization white-labeling.
 */
export default function BrandingPage() {
  const params = useParams();
  const orgId = params.orgId as string;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-ds-text">
          Style Hub
        </h1>
        <p className="text-xs font-bold text-ds-text-subtler uppercase tracking-widest italic opacity-70">
          White-label this organization with real-time token overrides and live
          preview.
        </p>
      </div>

      <StyleEditor orgId={orgId} />
    </div>
  );
}
