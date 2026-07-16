import { notFound } from 'next/navigation';
import { getLandingPage } from '@/lib/cms';
import { Metadata } from 'next';
import { Hero } from '@/components/sections/hero';
import { FeaturesSection } from '@/components/sections/features-section';
import { BottomCTA } from '@/components/sections/bottom-cta';
import { SocialProof } from '@/components/sections/social-proof';
import type { Locale } from '@/i18n-config';

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = await getLandingPage(params.slug, params.locale);

  if (!page) return {};

  return {
    title: `${page.title} | GateFlow`,
    description: `Learn more about ${page.title} on GateFlow.`,
    alternates: {
      canonical: `/${params.locale}/${params.slug}`,
      languages: {
        en: `/en/${params.slug}`,
        ar: `/ar/${params.slug}`,
      },
    },
  };
}

export default async function LandingPage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const params = await props.params;
  const page = await getLandingPage(params.slug, params.locale);

  if (!page) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      {page.sections.map((section) => {
        const { type, content, id } = section;

        switch (type) {
          case 'HERO':
            return <Hero key={id} locale={params.locale as Locale} />;
          case 'FEATURES':
            return (
              <FeaturesSection
                key={id}
                sectionTitle={content.title}
                featuresTitle={content.title}
                features={content.features}
              />
            );
          case 'CTA':
            return <BottomCTA key={id} locale={params.locale as Locale} />;
          case 'SOCIAL_PROOF':
            return <SocialProof key={id} locale={params.locale as Locale} />;
          default:
            return (
              <div key={id} className="py-20 text-center text-slate-400">
                Unknown section type: {type}
              </div>
            );
        }
      })}
    </div>
  );
}
