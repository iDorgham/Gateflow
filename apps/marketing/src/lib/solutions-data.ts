/**
 * Vertical industry solutions data for GateFlow marketing pages.
 */

export interface SolutionVertical {
  slug: 'compounds' | 'commercial' | 'events';
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  keyBenefitsEn: string[];
  keyBenefitsAr: string[];
  metricsEn: { value: string; label: string }[];
  metricsAr: { value: string; label: string }[];
}

export const SOLUTIONS_DATA: Record<string, SolutionVertical> = {
  compounds: {
    slug: 'compounds',
    titleEn: 'Residential Compounds & Luxury Gated Communities',
    titleAr: 'المجمعات السكنية والمجتمعات المغلقة الفاخرة',
    subtitleEn:
      'Seamless 3-tap resident visitor passes, fast vehicle queue clearance, and total perimeter peace of mind.',
    subtitleAr:
      'تصاريح زيارة للمقيمين في 3 خطوات، سرعة مرور المركبات، وأعلى درجات الأمان والخصوصية.',
    keyBenefitsEn: [
      'Zero paper visitor logs at security guardhouses',
      'Instant resident mobile app with WhatsApp pass sharing',
      'Offline-first QR scanner app that works without internet drops',
    ],
    keyBenefitsAr: [
      'استغناء تام عن الدفاتر الورقية في غرف الأمن',
      'تطبيق هاتف ذكي للسكان مع إمكانية مشاركة التصاريح عبر واتساب',
      'تطبيق مسح يعمل بدون انقطاع حتى عند ضعف شبكة الإنترنت',
    ],
    metricsEn: [
      { value: '< 4s', label: 'Gate Scan Clearance' },
      { value: '99.9%', label: 'Uptime Reliability' },
      { value: '100%', label: 'MENA Privacy Compliance' },
    ],
    metricsAr: [
      { value: '< ٤ ثوانٍ', label: 'سرعة مسح وتصريح الدخول' },
      { value: '٩٩.٩٪', label: 'جاهزية واستقرار النظام' },
      { value: '١٠٠٪', label: 'امتثال لخصوصية البيانات' },
    ],
  },
  commercial: {
    slug: 'commercial',
    titleEn: 'Commercial Towers & Business Parks',
    titleAr: 'الأبراج التجارية ومجمعات الأعمال',
    subtitleEn:
      'Enterprise multi-tenant visitor pre-registration, turnstile integration, and audit-ready reporting.',
    subtitleAr:
      'تسجيل مسبق لزوار الشركات، تكامل مع البوابات الإلكترونية، وتقارير تدقيقية فورية.',
    keyBenefitsEn: [
      'Corporate host auto-notifications upon visitor arrival',
      'Multi-gate zone access restrictions by department',
      'Full cryptographic HMAC security against screenshot forgery',
    ],
    keyBenefitsAr: [
      'إشعارات فورية للمستضيف عند وصول الزائر',
      'تحديد صلاحيات الدخول حسب المبنى والطابق',
      'تشفير رقمي كامل يمنع تزوير أو إعادة استخدام الصور',
    ],
    metricsEn: [
      { value: '85%', label: 'Queue Time Reduction' },
      { value: '10k+', label: 'Daily Scans Handled' },
      { value: '0', label: 'Hardware Vendor Lock-in' },
    ],
    metricsAr: [
      { value: '٨٥٪', label: 'انخفاض في وقت الانتظار' },
      { value: '+١٠ آلاف', label: 'عملية مسح يومية' },
      { value: 'صفر', label: 'تقييد بأجهزة محددة' },
    ],
  },
  events: {
    slug: 'events',
    titleEn: 'High-Throughput Events, Stadiums & Exhibitions',
    titleAr: 'الفعاليات الكبرى، الملاعب والمعارض',
    subtitleEn:
      'Bulk guest pass generation, VIP fast-lanes, and live gate admission counters.',
    subtitleAr:
      'إصدار جماعي للتصاريح، مسارات سريعة لكبار الزوار، ولوحة تحكم حية لأعداد الدخول.',
    keyBenefitsEn: [
      'Instant bulk CSV invite uploads with batch WhatsApp links',
      'Live concurrency counter per entry gate and parking zone',
      'Rapid deployment with Android/iOS camera phones — zero special scanners needed',
    ],
    keyBenefitsAr: [
      'رفع جماعي لقوائم الزوار وإرسال الروابط تلقائياً',
      'عداد حي لعدد الحاضرين في كل بوابة ومنطقة مواقف',
      'تشغيل فوري عبر الهواتف الذكية دون الحاجة لأجهزة خاصة',
    ],
    metricsEn: [
      { value: '25k+', label: 'Attendees Managed' },
      { value: '< 2s', label: 'Camera Scan Speed' },
      { value: '5 min', label: 'Guard Setup Time' },
    ],
    metricsAr: [
      { value: '+٢٥ ألف', label: 'طاقة استيعاب الحضور' },
      { value: '< ثانيتين', label: 'سرعة قراءة الكاميرا' },
      { value: '٥ دقائق', label: 'وقت تدريب أفراد الأمن' },
    ],
  },
};
