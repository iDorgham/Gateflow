import {
  Layout,
  Box,
  Star,
  MousePointerClick,
  HelpCircle,
  FileText,
  Quote,
  CreditCard,
  PanelBottom,
} from 'lucide-react';
import { HeroBlock } from './hero-block';
import { FeaturesBlock } from './features-block';
import { CtaBlock } from './cta-block';
import { SocialProofBlock } from './social-proof-block';
import { FaqBlock } from './faq-block';
import { BlogGridBlock } from './blog-grid-block';
import { TestimonialsBlock } from './testimonials-block';
import { PricingBlock } from './pricing-block';
import { FooterBlock } from './footer-block';
import { BlockType } from './types';

export const BLOCK_REGISTRY: Record<BlockType, any> = {
  HERO: {
    component: HeroBlock,
    label: 'Hero Section',
    icon: Layout,
    defaultContent: {
      headline: 'Welcome to GateFlow',
      subheadline: 'The ultimate access platform.',
      ctaText: 'Get Started',
    },
  },
  FEATURES: {
    component: FeaturesBlock,
    label: 'Features Grid',
    icon: Box,
    defaultContent: {
      headline: 'Our Features',
      items: [
        { title: 'Secure', description: 'Bank-grade security.' },
        { title: 'Fast', description: 'Lightning fast.' },
        { title: 'Reliable', description: '99.9% uptime.' },
      ],
    },
  },
  CTA: {
    component: CtaBlock,
    label: 'Call to Action',
    icon: MousePointerClick,
    defaultContent: {
      headline: 'Ready to get started?',
      subheadline: 'Join thousands of users today.',
      ctaText: 'Sign Up Now',
    },
  },
  SOCIAL_PROOF: {
    component: SocialProofBlock,
    label: 'Social Proof',
    icon: Star,
    defaultContent: { headline: 'Trusted by innovative companies' },
  },
  FAQ: {
    component: FaqBlock,
    label: 'FAQ Accordion',
    icon: HelpCircle,
    defaultContent: {
      headline: 'Frequently Asked Questions',
      items: [
        { title: 'How does it work?', description: 'It is very simple.' },
        { title: 'Is it free?', description: 'Yes, for basic usage.' },
      ],
    },
  },
  BLOG_GRID: {
    component: BlogGridBlock,
    label: 'Blog Grid',
    icon: FileText,
    defaultContent: { headline: 'Latest News' },
  },
  TESTIMONIALS: {
    component: TestimonialsBlock,
    label: 'Testimonials',
    icon: Quote,
    defaultContent: {
      headline: 'What our customers say',
      items: [
        { title: 'Alice', description: 'Amazing tool.' },
        { title: 'Bob', description: 'Saved me hours.' },
      ],
    },
  },
  PRICING: {
    component: PricingBlock,
    label: 'Pricing Table',
    icon: CreditCard,
    defaultContent: {
      headline: 'Simple, transparent pricing',
      subheadline: 'Choose the plan that best fits your needs.',
      items: [
        { title: 'Starter', description: '$29/mo' },
        { title: 'Pro', description: '$99/mo' },
        { title: 'Enterprise', description: 'Custom' },
      ],
    },
  },
  FOOTER: {
    component: FooterBlock,
    label: 'Site Footer',
    icon: PanelBottom,
    defaultContent: { body: '© 2026 GateFlow. All rights reserved.' },
  },
};
