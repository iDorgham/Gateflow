import { requireAdmin } from '@/lib/admin-auth';
import { Locale } from '@/lib/i18n/i18n-config';
import { Button, Badge } from '@gateflow/ui';
import { PageHeader } from '@gateflow/components';
import { BrainCircuit, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = { title: 'Intelligence Hub' };

export default async function GlobalIntelligencePage(props: {
  params: Promise<{ locale: Locale }>;
}) {
  const params = await props.params;
  const { locale } = params;

  await requireAdmin(locale);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-8 animate-in fade-in duration-700">
      <div className="relative">
        <div className="absolute -inset-4 bg-ds-background-brand-bold/10 rounded-full blur-2xl animate-pulse" />
        <div className="relative bg-ds-background-default border-2 border-ds-border p-8 rounded-[2.5rem] shadow-xl">
          <BrainCircuit className="h-20 w-20 text-ds-text-brand" />
        </div>
      </div>

      <div className="max-w-md space-y-4">
        <PageHeader
          title="Intelligence Hub"
          subtitle="Advanced AI analysis and vertical intelligence requires an active organization context."
          className="text-center"
        />
        <p className="text-sm text-ds-text-subtlest font-medium uppercase tracking-widest">
          Select an organization to access its knowledge base and AI tools.
        </p>
      </div>

      <Button
        size="lg"
        variant="primary"
        className="h-14 px-10 rounded-full font-black italic shadow-lg shadow-ds-background-brand-bold/20 group"
        asChild
      >
        <Link href={`/${locale}/organizations`}>
          SELECT ORGANIZATION
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Button>

      <div className="flex gap-4 pt-8">
        <Badge
          variant="subtle"
          className="h-8 px-4 font-bold border-ds-border bg-ds-background-neutral text-ds-text-subtle"
        >
          <Building2 className="mr-2 h-3.5 w-3.5" />
          CONTEXT REQUIRED
        </Badge>
      </div>
    </div>
  );
}
