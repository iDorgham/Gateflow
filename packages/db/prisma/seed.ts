/*
 * Seed script: Create default Project for each existing Organization
 *
 * Run with: npx prisma db seed
 * Or: npx tsx prisma/seed.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DEFAULT_CONTACT_TAGS = [
  { name: 'family', color: '#22c55e' },
  { name: 'maid', color: '#3b82f6' },
  { name: 'driver', color: '#a855f7' },
  { name: 'prospect', color: '#f59e0b' },
  { name: 'agent', color: '#ef4444' },
] as const;

async function main() {
  console.log('🌱 Starting seed: Create default projects...');

  // Get all organizations without a default project
  const organizations = await prisma.organization.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      projects: true,
    },
  });

  console.log(`📊 Found ${organizations.length} organizations`);

  for (const org of organizations) {
    // Check if org already has projects
    if (org.projects.length > 0) {
      console.log(
        `  ⏭️  Skipping "${org.name}" - already has ${org.projects.length} project(s)`
      );
      continue;
    }

    // Create default "Main" project
    const project = await prisma.project.create({
      data: {
        name: 'Main',
        organizationId: org.id,
      },
    });

    console.log(
      `  ✅ Created default project "${project.name}" for org "${org.name}"`
    );
  }

  // Seed default contact tags per organization (idempotent via unique [organizationId, name]).
  for (const org of organizations) {
    await prisma.tag.createMany({
      data: DEFAULT_CONTACT_TAGS.map((tag) => ({
        organizationId: org.id,
        name: tag.name,
        color: tag.color,
      })),
      skipDuplicates: true,
    });
  }
  console.log('✅ Seeded default contact tags for all organizations');

  // Handle unassigned gates and QR codes
  // Assign them to the default "Main" project for each org
  const orgsWithProjects = await prisma.organization.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      projects: {
        where: { deletedAt: null },
        take: 1,
      },
      gates: {
        where: { projectId: null },
      },
      qrCodes: {
        where: { projectId: null },
      },
    },
  });

  for (const org of orgsWithProjects) {
    const mainProject = org.projects[0];
    if (!mainProject) continue;

    // Assign unassigned gates to main project
    if (org.gates.length > 0) {
      await prisma.gate.updateMany({
        where: {
          id: { in: org.gates.map((g) => g.id) },
          projectId: null,
        },
        data: {
          projectId: mainProject.id,
        },
      });
      console.log(
        `  ✅ Assigned ${org.gates.length} gates to Main project for "${org.name}"`
      );
    }

    // Assign unassigned QR codes to main project
    if (org.qrCodes.length > 0) {
      await prisma.qRCode.updateMany({
        where: {
          id: { in: org.qrCodes.map((q) => q.id) },
          projectId: null,
        },
        data: {
          projectId: mainProject.id,
        },
      });
      console.log(
        `  ✅ Assigned ${org.qrCodes.length} QR codes to Main project for "${org.name}"`
      );
    }
  }

  console.log('✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
