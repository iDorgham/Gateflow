import { Block } from '../blocks/types';

export interface PageTemplate {
  id: string;
  label: string;
  description: string;
  blocks: Partial<Block>[];
}

export const PAGE_TEMPLATES: Record<string, PageTemplate> = {
  blank: {
    id: 'blank',
    label: 'Blank Page',
    description: 'Start from scratch with a clean slate',
    blocks: [],
  },
  about: {
    id: 'about',
    label: 'About Us',
    description: 'Company information and mission',
    blocks: [
      {
        type: 'HERO',
        content: {
          en: {
            headline: 'Our Mission',
            subheadline: 'Building the future of gate access control.',
          },
          ar: {
            headline: 'مهمتنا',
            subheadline: 'بناء مستقبل التحكم في الوصول إلى البوابة.',
          },
        },
      },
      {
        type: 'FEATURES',
        content: {
          en: {
            headline: 'Our Core Values',
            items: [{ title: 'Integrity' }, { title: 'Innovation' }],
          },
          ar: {
            headline: 'قيمنا الأساسية',
            items: [{ title: 'النزاهة' }, { title: 'الابتكار' }],
          },
        },
      },
      {
        type: 'CTA',
        content: {
          en: { headline: 'Join Our Journey', ctaText: 'Contact Us' },
          ar: { headline: 'انضم إلى رحلتنا', ctaText: 'اتصل بنا' },
        },
      },
    ],
  },
  contact: {
    id: 'contact',
    label: 'Contact Us',
    description: 'Contact form and support information',
    blocks: [
      {
        type: 'HERO',
        content: {
          en: {
            headline: 'Get in Touch',
            subheadline: 'We are here to help you.',
          },
          ar: { headline: 'اتصل بنا', subheadline: 'نحن هنا لمساعدتك.' },
        },
      },
      {
        type: 'FAQ',
        content: {
          en: {
            headline: 'Common Questions',
            items: [{ title: 'How to contact support?' }],
          },
          ar: {
            headline: 'أسئلة شائعة',
            items: [{ title: 'كيفية الاتصال بالدعم؟' }],
          },
        },
      },
    ],
  },
  pricing: {
    id: 'pricing',
    label: 'Pricing',
    description: 'Service tiers and pricing tables',
    blocks: [
      {
        type: 'HERO',
        content: {
          en: {
            headline: 'Simple Pricing',
            subheadline: 'Choose the plan that fits your needs.',
          },
          ar: {
            headline: 'تسعير بسيط',
            subheadline: 'اختر الخطة التي تناسب احتياجاتك.',
          },
        },
      },
      {
        type: 'TESTIMONIALS',
        content: {
          en: {
            headline: 'Trusted by Thousands',
            items: [{ title: 'John Doe', description: 'Great service!' }],
          },
          ar: {
            headline: 'يثق بنا الآلاف',
            items: [{ title: 'جون دو', description: 'خدمة رائعة!' }],
          },
        },
      },
      {
        type: 'CTA',
        content: {
          en: { headline: 'Ready to Start?', ctaText: 'Get Started' },
          ar: { headline: 'جاهز للبدء؟', ctaText: 'ابدأ الآن' },
        },
      },
    ],
  },
};
