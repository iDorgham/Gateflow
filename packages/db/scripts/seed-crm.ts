import { prisma } from '../src/client';

/**
 * CRM Seeding Script
 * 
 * Generates sample leads for the newly created organizations to verify
 * the CRM Dashboard functionality.
 */
async function main() {
  console.log('🚀 Starting CRM seeding...');

  // 1. Get some existing organizations to attach leads to
  const orgs = await prisma.organization.findMany({ 
    take: 10,
    orderBy: { createdAt: 'desc' }
  });
  
  if (orgs.length === 0) {
    console.warn('⚠️ No organizations found. Please run the main seeding script first.');
    return;
  }

  console.log(`Found ${orgs.length} organizations. Generating leads...`);

  // 2. Generate a variety of leads
  const leadData = [
    {
      source: 'Direct Webform',
      notes: 'Global headquarters seeking unified visitor management for 12 gates.',
      consentGiven: true,
    },
    {
      source: 'LinkedIn Outreach',
      notes: 'Real estate developer interested in resident portal for new compound in New Cairo.',
      consentGiven: true,
    },
    {
      source: 'Referral',
      notes: 'International school looking to replace legacy paper logs with QR scanning.',
      consentGiven: true,
    },
    {
      source: 'Partner Portal',
      notes: 'Expansion project for existing nightclub client. Needs high-volume scanning support.',
      consentGiven: true,
    },
    {
      source: 'Direct Email',
      notes: 'Security firm evaluating platform for 5-star resort client in Hurghada.',
      consentGiven: false, // Testing HiTL block
    }
  ];

  for (let i = 0; i < orgs.length; i++) {
    const org = orgs[i]!;
    const data = leadData[i % leadData.length]!;

    await prisma.lead.create({
      data: {
        organizationId: org.id,
        status: i % 3 === 0 ? 'QUALIFIED' : 'NEW',
        source: data.source,
        notes: data.notes,
        consentGiven: data.consentGiven,
        score: i % 2 === 0 ? 85 : null, // Pre-score some leads
      }
    });
    
    console.log(`✅ Created lead for: ${org.name}`);
  }

  console.log('✨ CRM seeding complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
