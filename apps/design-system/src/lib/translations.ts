export const translations = {
  en: {
    sidebar: {
      foundations: 'Foundations',
      tokens: 'Tokens',
      accessibility: 'Accessibility',
      components: 'Components',
      primitives: 'Primitives',
      patterns: 'Patterns',
      aiUi: 'AI UI',
      packages: 'Packages',
      guidelines: 'Guidelines',
      changelog: 'Changelog',
      tokenMaster: 'Token Master Guide',
      color: 'Colors',
      typography: 'Typography',
      iconography: 'Iconography',
      spacing: 'Spacing',
      layering: 'Layering & Depth',
      motion: 'Motion',
    },

    header: {
      search: 'Search documentation...',
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      language: 'Language',
    },
    pages: {
      foundations: {
        title: 'Foundations',
        subtitle:
          'The core principles and core values that define the GateFlow experience.',
      },
      tokens: {
        title: 'Tokens',
        subtitle:
          'The atomic elements of the GateFlow design system. Browsable, previewable, and ready to use in any workspace.',
      },
      accessibility: {
        title: 'Accessibility',
        subtitle: 'Ensuring GateFlow is usable by everyone, everywhere.',
      },
      components: {
        title: 'Components',
        subtitle: 'The building blocks of our user interface.',
      },
      packages: {
        title: 'Packages',
        subtitle:
          'The authoritative catalog of the @gateflow monorepo libraries.',
        table: {
          package: 'Package',
          purpose: 'Purpose',
          npm: 'npm',
          deps: 'Internal Deps',
          status: 'Status',
        },
      },
      guidelines: {
        title: 'Guidelines',
        subtitle: 'Best practices and standards for design and development.',
      },
      changelog: {
        title: 'Changelog',
        subtitle: 'Track the latest updates and improvements to the system.',
      },
    },
  },
  ar: {
    sidebar: {
      foundations: 'الأساسات',
      tokens: 'الرموز (Tokens)',
      accessibility: 'سهولة الوصول',
      components: 'المكونات',
      primitives: 'العناصر الأساسية',
      patterns: 'الأنماط',
      aiUi: 'واجهة الذكاء الاصطناعي',
      packages: 'الحزم',
      guidelines: 'الإرشادات',
      changelog: 'سجل التغييرات',
      tokenMaster: 'دليل نظام الرموز الشامل',
      color: 'الألوان',
      typography: 'الخطوط',
      iconography: 'الأيقونات',
      spacing: 'المساحات',
      layering: 'الطبقات والعمق',
      motion: 'الحركة',
    },

    header: {
      search: 'البحث في نظام التصميم...',
      light: 'فاتح',
      dark: 'داكن',
      system: 'النظام',
      language: 'اللغة',
    },
    pages: {
      foundations: {
        title: 'الأساسات',
        subtitle: 'المبادئ والقيم الجوهرية التي تبني تجربة GateFlow.',
      },
      tokens: {
        title: 'الرموز (Tokens)',
        subtitle:
          'العناصر الذرية لنظام تصميم GateFlow. قابلة للتصفح والمعاينة وجاهزة للاستخدام.',
      },
      accessibility: {
        title: 'سهولة الوصول',
        subtitle:
          'التأكد من أن GateFlow متاح للاستخدام لجميع الأشخاص في كل مكان.',
      },
      components: {
        title: 'المكونات',
        subtitle: 'اللبنات الأساسية لواجهة المستخدم الخاصة بنا.',
      },
      packages: {
        title: 'الحزم',
        subtitle:
          'كتالوج الحزم الرسمي لمكتبات GateFlow. يتم إدارتها عبر Turborepo.',
        table: {
          package: 'الحزمة',
          purpose: 'الغرض',
          npm: 'npm',
          deps: 'التبعيات الداخلية',
          status: 'الحالة',
        },
      },
      guidelines: {
        title: 'الإرشادات',
        subtitle: 'أفضل الممارسات والمعايير للتصميم والتطوير.',
      },
      changelog: {
        title: 'سجل التغييرات',
        subtitle: 'تتبع آخر التحديثات والتحسينات على النظام.',
      },
    },
  },
};

export type TranslationKey = keyof typeof translations.en;
