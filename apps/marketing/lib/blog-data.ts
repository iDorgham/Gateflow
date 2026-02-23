export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  date: string;
  author: { name: string; role: string; initials: string };
  tags: string[];
  sections: Array<{ heading?: string; body: string; list?: string[] }>;
}

export const BLOG_CATEGORIES = ['All', 'Industry', 'Security', 'Technical', 'Use Cases', 'Changelog'] as const;

export const blogPosts: BlogPost[] = [
  {
    slug: 'why-compounds-are-upgrading-to-qr-access',
    title: 'Why Gated Communities Are Upgrading from Clipboards to QR Access',
    excerpt:
      "Paper guest books and manual ID checks are costing compounds more than they think. Here's the ROI calculation every security manager should know.",
    category: 'Industry',
    readTime: 6,
    date: 'February 15, 2026',
    author: { name: 'Karim Hassan', role: 'Head of Growth', initials: 'KH' },
    tags: ['compounds', 'digital transformation', 'ROI'],
    sections: [
      {
        heading: 'The Hidden Cost of Manual Gate Management',
        body: "Every compound security manager knows the morning rush. Cars backed up to the main road, guards frantically flipping through paper logs, residents frustrated, and delivery drivers blocking the entrance. The manual process isn't just slow — it's expensive.",
      },
      {
        heading: 'The Math Behind the Problem',
        body: "A mid-size compound with 300 units typically processes 600+ resident vehicles, 150+ delivery vehicles, 80+ visitor vehicles, and 40+ contractor permits daily. At 45 seconds per manual verification, that's 3.9 hours of guard time every single day. At an average security salary of EGP 4,500/month, that's over EGP 1,800/month in labor just spent writing names in books.",
      },
      {
        heading: 'What QR Access Solves',
        body: "GateFlow's QR access system generates cryptographically-signed codes for each visitor. When a guard taps scan: the system reads the HMAC-SHA256 signature — confirming the QR is authentic, checks expiry, usage limits, and gate permissions, and logs the entry with timestamp, gate ID, and operator. The whole process takes under 2 seconds.",
      },
      {
        heading: 'Compound Case Study: Palm View Residences',
        body: 'Palm View (280 units, El Sheikh Zayed) switched from clipboards to GateFlow in October 2025. After 90 days:',
        list: [
          'Gate clearance time: from 45s → 4s per vehicle',
          'Weekend morning rush queue: from 22 cars → under 5',
          'Security manager time spent on audits: down 80%',
          'Contractor disputes resolved via audit trail: 3 prevented',
        ],
      },
      {
        body: 'The system paid for itself in under 6 weeks. GateFlow\'s Starter tier handles 1 gate and 500 scans/month for free. Most compounds upgrade to Pro within 30 days once they see the time savings.',
      },
    ],
  },
  {
    slug: 'how-hmac-sha256-makes-your-qr-codes-unfakeable',
    title: 'How HMAC-SHA256 Makes Your Gate QR Codes Unfakeable',
    excerpt:
      "A screenshot of a QR code won't work at a GateFlow gate. Here's the cryptographic reason why — explained without the jargon.",
    category: 'Security',
    readTime: 8,
    date: 'February 8, 2026',
    author: { name: 'Sara El-Gohary', role: 'Security Engineer', initials: 'SE' },
    tags: ['security', 'cryptography', 'QR codes'],
    sections: [
      {
        heading: 'The Problem with Regular QR Codes',
        body: 'A standard QR code is just a URL. Anyone with a smartphone camera can screenshot your QR code and share it in a WhatsApp group, print it 100 times, or use it weeks after an event ends. For a compound that needs to restrict contractor access to specific days, this is a security failure.',
      },
      {
        heading: 'What HMAC-SHA256 Signing Adds',
        body: 'Every QR code GateFlow generates contains a digital signature — a cryptographic proof that the code was issued by your specific organization. The signature is HMAC(SHA256, secret_key, payload) where the secret_key is your organization\'s unique QR_SIGNING_SECRET (32+ random bytes) and the payload contains the gate ID, expiry, usage limit, and visitor data.',
      },
      {
        heading: 'Why Screenshots Don\'t Work',
        body: 'When a guard scans a QR code, the system extracts the payload and signature, recalculates the expected signature using the same secret key, and if the signatures don\'t match — instant rejection. But the system also checks:',
        list: [
          'Usage count: Single-use codes are marked "used" after first scan',
          'Expiry: Time-limited codes are rejected after their window',
          'Gate scope: A code issued for Gate 2 is rejected at Gate 5',
        ],
      },
      {
        heading: 'Offline Verification',
        body: "Because the verification is cryptographic (not a database lookup), GateFlow's scanner can verify QR codes without any internet connection. The shared secret is pre-loaded on the scanner app. No connectivity needed. Even if your compound's WiFi goes down during a busy morning, scans are verified locally, queued, and synced when connectivity returns.",
      },
    ],
  },
  {
    slug: 'gateflow-changelog-january-2026',
    title: 'GateFlow Changelog: January 2026',
    excerpt:
      'Advanced analytics dashboard, per-gate success rates, QR type breakdown charts, trend indicators, supervisor override PIN provisioning, and more.',
    category: 'Changelog',
    readTime: 3,
    date: 'February 1, 2026',
    author: { name: 'GateFlow Engineering', role: 'Product Team', initials: 'GE' },
    tags: ['changelog', 'analytics', 'new features'],
    sections: [
      {
        heading: 'Advanced Analytics Dashboard',
        body: 'The analytics page has been completely upgraded with five new data streams:',
        list: [
          'Trend indicators: % change vs the prior 30-day window on Success Rate and Total Scans',
          'Avg Scans / Day: computed from scans within your selected date range',
          'Denied (30d): operator-denied scans count, highlighted red when non-zero',
          'Scans by QR Type: pie chart breaking down SINGLE / RECURRING / PERMANENT',
          'Gate Success Rate: per-gate success %, color-coded green/amber/red',
        ],
      },
      {
        heading: 'Scanner App Improvements',
        body: 'Supervisor Override PIN Provisioning — Admins can now set the supervisor PIN directly from the Settings tab in the client dashboard. Override Audit Log — All supervisor overrides are permanently logged to the scan\'s auditTrail on the server.',
      },
      {
        heading: 'Admin Dashboard',
        body: 'New Scan Logs Audit Page with full filtering (date range, status, org) and pagination. Clickable Organization Rows — Click any org name to filter the search instantly.',
      },
      {
        heading: 'Bug Fixes',
        body: '',
        list: [
          'Fixed offline queue sync not draining after reconnect on some Android configurations',
          'Fixed project cookie not updating when switching from scans page with ?project= param',
          'Fixed export CSV not respecting project filter',
        ],
      },
    ],
  },
  {
    slug: '5-ways-schools-use-digital-access-control',
    title: '5 Ways Schools Are Using Digital Access Control in 2026',
    excerpt:
      'From parent pickup lanes to contractor access windows, schools have found creative ways to leverage QR access infrastructure beyond the basic visitor log.',
    category: 'Use Cases',
    readTime: 7,
    date: 'January 22, 2026',
    author: { name: 'Dina Fahmy', role: 'Customer Success', initials: 'DF' },
    tags: ['schools', 'education', 'use cases'],
    sections: [
      {
        heading: '1. Parent Pickup Lane Management',
        body: 'The afternoon dismissal is one of the most operationally complex 45 minutes in a school day. With GateFlow, each family gets a recurring QR code at the start of the year. Guards scan as cars enter the pickup lane — no shouting names across a chaotic parking lot. The system knows who hasn\'t been picked up yet. British School Alexandria reduced afternoon dismissal from 55 minutes to 28 minutes after implementation.',
      },
      {
        heading: '2. Contractor Access Windows',
        body: 'Issue a QR valid for "Tuesday–Thursday, 8am–6pm, Gate 3 only". The code expires automatically at end of contract period. Every entry is logged with timestamp and gate. A school can produce a full contractor access report for any date range in seconds.',
      },
      {
        heading: '3. Event Ticketing',
        body: 'School galas, sports days, and graduation ceremonies are natural fits for event ticketing. Issue family tickets, HMAC-signed single-use codes prevent reprints, works fully offline if the venue WiFi is unreliable, and provides a real-time headcount as guests arrive.',
      },
      {
        heading: '4. Staff Access Separation',
        body: "Not all gates should be accessible to all staff. GateFlow's gate-level permissions let you create PERMANENT codes for specific gates per employee, revoke instantly on termination, and audit exactly which gate any staff member used and when.",
      },
      {
        heading: '5. Emergency Mustering',
        body: "In fire drills and evacuations, knowing who's on campus is critical. GateFlow's scan logs provide a real-time picture of who entered today and hasn't been scanned out, which gates were used during the evacuation window, and an exportable CSV for manual headcount verification.",
      },
    ],
  },
  {
    slug: 'offline-first-architecture',
    title: 'Offline-First: How GateFlow Scans 2,000 Tickets Without WiFi',
    excerpt:
      "Event venues and outdoor concerts often have terrible connectivity. Here's the architecture that makes GateFlow work reliably in any network conditions.",
    category: 'Technical',
    readTime: 9,
    date: 'January 10, 2026',
    author: { name: 'Omar Khalil', role: 'Principal Engineer', initials: 'OK' },
    tags: ['offline', 'architecture', 'events', 'technical'],
    sections: [
      {
        heading: 'The Two-Layer Verification Architecture',
        body: 'Every QR code contains an HMAC-SHA256 signature. The scanner app has the signing secret pre-loaded during setup. When a ticket is scanned, the app extracts the payload from the QR, recomputes the expected HMAC signature locally, and checks expiry and usage rules against a local cached copy. All of this happens in under 50ms, with zero network requests.',
      },
      {
        heading: 'The Offline Queue Architecture',
        body: 'Scans queued while offline are stored in AsyncStorage with AES-256 encryption, given a unique scanUuid to prevent double-counting during sync, and synced via POST /api/scans/bulk when connectivity is detected. The sync uses a Last Write Wins conflict resolution strategy.',
      },
      {
        heading: 'Practical Numbers',
        body: 'At a 2,000-capacity event with 4 scanner stations:',
        list: [
          'Each station can process ~1,200 scans/hour (limited by scan speed, not software)',
          'The offline queue holds up to 10,000 scans before any performance impact',
          'Sync takes under 3 seconds for a 2,000-scan backlog on a 4G connection',
        ],
      },
      {
        heading: 'What Happens When You Come Back Online',
        body: 'The moment connectivity is detected, the queue drains automatically. Scans are sent in batches of 100, each batch is deduplicated by scanUuid, and the dashboard reflects all synced scans within seconds.',
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPosts(category?: string): BlogPost[] {
  if (category && category !== 'All') {
    return blogPosts.filter((p) => p.category === category);
  }
  return blogPosts;
}
