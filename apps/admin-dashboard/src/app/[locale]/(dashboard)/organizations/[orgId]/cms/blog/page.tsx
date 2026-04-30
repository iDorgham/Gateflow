import { use } from 'react';
import { PenTool, Rocket, Clock, Sparkles } from 'lucide-react';

export default function BlogStudioPage(props: {
  params: Promise<{ locale: string; orgId: string }>;
}) {
  const params = use(props.params);
  const { locale, orgId } = params;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="relative">
          <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
          <div className="relative w-24 h-24 rounded-3xl bg-ds-background-neutral-subtle flex items-center justify-center text-blue-600 border border-ds-border/40 shadow-2xl">
            <PenTool className="w-12 h-12" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tight italic">
            Blog Studio
          </h1>
          <p className="text-ds-text-subtle max-w-md mx-auto text-lg">
            Our high-performance AI content engine is currently being optimized
            for your organization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {[
            {
              icon: Sparkles,
              label: 'AI Writing',
              desc: 'Context-aware drafts',
            },
            { icon: Clock, label: 'Scheduling', desc: 'Automated publishing' },
            {
              icon: Rocket,
              label: 'SEO Engine',
              desc: 'MENA market optimization',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-ds-border/40 bg-white shadow-sm flex flex-col items-center gap-3"
            >
              <feature.icon className="w-6 h-6 text-blue-600" />
              <div className="font-bold text-sm uppercase tracking-wider">
                {feature.label}
              </div>
              <div className="text-xs text-ds-text-subtle">{feature.desc}</div>
            </div>
          ))}
        </div>

        <div className="pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest border border-blue-100">
            Coming Soon to {orgId.substring(0, 8)}...
          </div>
        </div>
      </div>
    </div>
  );
}
