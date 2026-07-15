import { notFound } from 'next/navigation';
import { getLandingPage } from '@/lib/cms';
import { Metadata } from 'next';
import { Hero } from '@/components/sections/hero';
import { FeaturesSection } from '@/components/sections/features-section';
import { BottomCta } from '@/components/sections/bottom-cta';
import { SocialProof } from '@/components/sections/social-proof';

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
            return (
              <Hero
                key={id}
                title={content.heroTitle}
                subtitle={content.heroSubtitle}
                ctaText={content.ctaText}
              />
            );
          case 'FEATURES':
            return (
              <FeaturesSection
                key={id}
                title={content.title}
                features={content.features}
              />
            );
          case 'CTA':
            return (
              <BottomCta
                key={id}
                title={content.title}
                subtitle={content.subtitle}
                ctaText={content.buttonText}
              />
            );
          case 'SOCIAL_PROOF':
            return (
              <SocialProof
                key={id}
                // Mapping depends on component props
              />
            );
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
