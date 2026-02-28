/**
 * Compound simulation seed: Selena Bay (Hurghada) + Vernada (Sahl Hasheesh)
 * - Units with type and size (sizeSqm)
 * - Contacts: Hurghada 65% Egyptian, 35% Russian/German/Polish/Italian; Vernada 60% Egyptian, 40% international
 * - Dummy profile avatars (real-people placeholder URLs via i.pravatar.cc)
 *
 * Prerequisites: run migration (add_contact_avatar_unit_size), then prisma generate.
 * Run after seed_dev: pnpm seed:compounds (from packages/db) or npx tsx prisma/seed-compounds.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Unit type → size range (sqm) ───────────────────────────────────────────
const UNIT_SIZE_BANDS: Record<string, [number, number]> = {
  STUDIO: [35, 45],
  ONE_BR: [55, 70],
  TWO_BR: [80, 100],
  THREE_BR: [110, 130],
  FOUR_BR: [140, 160],
  VILLA: [200, 350],
  PENTHOUSE: [180, 250],
  COMMERCIAL: [50, 200],
};

// ─── Name pools by nationality (firstName, lastName) ────────────────────────
const EGYPTIAN_FIRST = ['Ahmed', 'Mohamed', 'Hassan', 'Omar', 'Khaled', 'Youssef', 'Mahmoud', 'Ibrahim', 'Fatma', 'Aisha', 'Nour', 'Sara', 'Mona', 'Dina', 'Layla'];
const EGYPTIAN_LAST = ['El-Sayed', 'Hassan', 'Ibrahim', 'Mohamed', 'Ali', 'Khalil', 'Fathy', 'Salem', 'Abdel Rahman', 'Hussein'];

const RUSSIAN_FIRST = ['Ivan', 'Dmitri', 'Alexander', 'Sergei', 'Elena', 'Olga', 'Anna', 'Maria', 'Natalia', 'Irina'];
const RUSSIAN_LAST = ['Ivanov', 'Petrov', 'Sidorov', 'Kozlov', 'Smirnov', 'Volkov', 'Sokolov'];

const GERMAN_FIRST = ['Hans', 'Klaus', 'Stefan', 'Thomas', 'Anna', 'Maria', 'Julia', 'Laura', 'Sophie'];
const GERMAN_LAST = ['Mueller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner'];

const POLISH_FIRST = ['Jan', 'Piotr', 'Michal', 'Tomasz', 'Anna', 'Katarzyna', 'Magdalena', 'Joanna', 'Aleksandra'];
const POLISH_LAST = ['Kowalski', 'Wisniewski', 'Dabrowski', 'Lewandowski', 'Wojcik', 'Kaminski'];

const ITALIAN_FIRST = ['Marco', 'Giuseppe', 'Alessandro', 'Luca', 'Elena', 'Sofia', 'Giulia', 'Francesca', 'Valentina'];
const ITALIAN_LAST = ['Rossi', 'Ferrari', 'Romano', 'Colombo', 'Ricci', 'Marino'];

type Nationality = 'egyptian' | 'russian' | 'german' | 'polish' | 'italian';

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateName(nat: Nationality): { firstName: string; lastName: string } {
  switch (nat) {
    case 'egyptian':
      return { firstName: pick(EGYPTIAN_FIRST), lastName: pick(EGYPTIAN_LAST) };
    case 'russian':
      return { firstName: pick(RUSSIAN_FIRST), lastName: pick(RUSSIAN_LAST) };
    case 'german':
      return { firstName: pick(GERMAN_FIRST), lastName: pick(GERMAN_LAST) };
    case 'polish':
      return { firstName: pick(POLISH_FIRST), lastName: pick(POLISH_LAST) };
    case 'italian':
      return { firstName: pick(ITALIAN_FIRST), lastName: pick(ITALIAN_LAST) };
  }
}

/** Real-people-style avatar URL (deterministic per id). */
function avatarUrl(id: string): string {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(id)}`;
}

const UNIT_TYPES = ['STUDIO', 'ONE_BR', 'TWO_BR', 'THREE_BR', 'FOUR_BR', 'VILLA', 'PENTHOUSE', 'COMMERCIAL'] as const;
const TYPE_WEIGHTS = [8, 15, 22, 25, 12, 6, 5, 7]; // more TWO_BR/THREE_BR

function randomUnitType(): (typeof UNIT_TYPES)[number] {
  const total = TYPE_WEIGHTS.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < UNIT_TYPES.length; i++) {
    r -= TYPE_WEIGHTS[i]!;
    if (r <= 0) return UNIT_TYPES[i]!;
  }
  return UNIT_TYPES[0]!;
}

function sizeForType(type: string): number {
  const band = UNIT_SIZE_BANDS[type] ?? [60, 90];
  return randomInRange(band[0]!, band[1]!);
}

async function main() {
  console.log('🌱 Starting compound seed (Selena Bay + Vernada)...');

  const org = await prisma.organization.findFirst({
    where: { email: 'admin@selenadev.com', deletedAt: null },
  });
  if (!org) {
    console.error('❌ Run seed_dev first (org admin@selenadev.com not found).');
    process.exit(1);
  }

  const orgId = org.id;

  // ─── Projects & gates ─────────────────────────────────────────────────────
  let selenaProject = await prisma.project.findFirst({
    where: { organizationId: orgId, name: 'Selena Bay', deletedAt: null },
  });
  if (!selenaProject) {
    selenaProject = await prisma.project.create({
      data: {
        name: 'Selena Bay',
        description: 'Residential compound',
        location: 'Hurghada, Red Sea',
        organizationId: orgId,
      },
    });
    console.log('  ✅ Project: Selena Bay');
  }

  let vernadaProject = await prisma.project.findFirst({
    where: { organizationId: orgId, name: 'Vernada', deletedAt: null },
  });
  if (!vernadaProject) {
    vernadaProject = await prisma.project.create({
      data: {
        name: 'Vernada',
        description: 'Residential compound',
        location: 'Sahl Hasheesh, Red Sea',
        organizationId: orgId,
      },
    });
    console.log('  ✅ Project: Vernada');
  }

  const selenaGates = await prisma.gate.findMany({
    where: { projectId: selenaProject.id, organizationId: orgId, deletedAt: null },
  });
  if (selenaGates.length === 0) {
    await prisma.gate.create({
      data: {
        name: 'Main Gate',
        location: 'Main Entrance',
        organizationId: orgId,
        projectId: selenaProject.id,
      },
    });
    console.log('  ✅ Gate: Selena Bay Main Gate');
  }

  const vernadaGates = await prisma.gate.findMany({
    where: { projectId: vernadaProject.id, organizationId: orgId, deletedAt: null },
  });
  if (vernadaGates.length === 0) {
    await prisma.gate.createMany({
      data: [
        { name: 'Main Gate', location: 'Main Entrance', organizationId: orgId, projectId: vernadaProject.id },
        { name: 'East Gate', location: 'East Entrance', organizationId: orgId, projectId: vernadaProject.id },
      ],
    });
    console.log('  ✅ Gates: Vernada Main Gate, East Gate');
  }

  // ─── Units: Selena Bay 214, Vernada 382 ──────────────────────────────────
  const selenaUnits = await prisma.unit.findMany({
    where: { projectId: selenaProject.id, organizationId: orgId, deletedAt: null },
  });
  if (selenaUnits.length < 214) {
    const toCreate = 214 - selenaUnits.length;
    const existingNames = new Set(selenaUnits.map((u) => u.name));
    let created = 0;
    for (let i = 0; created < toCreate; i++) {
      const type = randomUnitType();
      const name = `SB-T${Math.floor(i / 60) + 1}-${(i % 60) + 101}`;
      if (existingNames.has(name)) continue;
      existingNames.add(name);
      await prisma.unit.create({
        data: {
          name,
          type,
          sizeSqm: sizeForType(type),
          organizationId: orgId,
          projectId: selenaProject.id,
        },
      });
      created++;
    }
    console.log(`  ✅ Selena Bay units: 214`);
  }

  const vernadaUnits = await prisma.unit.findMany({
    where: { projectId: vernadaProject.id, organizationId: orgId, deletedAt: null },
  });
  if (vernadaUnits.length < 382) {
    const toCreate = 382 - vernadaUnits.length;
    const existingNames = new Set(vernadaUnits.map((u) => u.name));
    let created = 0;
    for (let i = 0; created < toCreate; i++) {
      const type = randomUnitType();
      const name = `VN-B${Math.floor(i / 80) + 1}-${(i % 80) + 101}`;
      if (existingNames.has(name)) continue;
      existingNames.add(name);
      await prisma.unit.create({
        data: {
          name,
          type,
          sizeSqm: sizeForType(type),
          organizationId: orgId,
          projectId: vernadaProject.id,
        },
      });
      created++;
    }
    console.log(`  ✅ Vernada units: 382`);
  }

  // ─── Contacts: Selena 140 (65% Egyptian, 35% RU/DE/PL/IT), Vernada 334 (60% Egyptian, 40% intl) ───
  const selenaUnitsForContacts = await prisma.unit.findMany({
    where: { projectId: selenaProject.id, organizationId: orgId, deletedAt: null },
    take: 214,
    orderBy: { createdAt: 'asc' },
  });
  const vernadaUnitsForContacts = await prisma.unit.findMany({
    where: { projectId: vernadaProject.id, organizationId: orgId, deletedAt: null },
    take: 382,
    orderBy: { createdAt: 'asc' },
  });

  const existingContactsCount = await prisma.contact.count({
    where: { organizationId: orgId, deletedAt: null },
  });
  const targetSelena = 140;
  const targetVernada = 334;

  if (existingContactsCount < targetSelena + targetVernada) {
    const internationalPool: Nationality[] = ['russian', 'german', 'polish', 'italian'];
    let contactIndex = 0;

    // Selena Bay: 65% Egyptian, 35% international
    const selenaSold = selenaUnitsForContacts.slice(0, targetSelena);
    for (let i = 0; i < selenaSold.length; i++) {
      const isEgyptian = i < Math.floor(targetSelena * 0.65);
      const nat: Nationality = isEgyptian ? 'egyptian' : pick(internationalPool);
      const { firstName, lastName } = generateName(nat);
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.sb${i + 1}@example.com`;
      const phone = `+20 1${String(contactIndex % 10)}${randomInRange(0, 9)} ${randomInRange(100, 999)} ${randomInRange(1000, 9999)}`;
      const contact = await prisma.contact.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          organizationId: orgId,
          avatarUrl: null, // set after create so we have id
        },
      });
      await prisma.contact.update({
        where: { id: contact.id },
        data: { avatarUrl: avatarUrl(contact.id) },
      });
      await prisma.contactUnit.create({
        data: { contactId: contact.id, unitId: selenaSold[i]!.id },
      });
      contactIndex++;
    }
    console.log(`  ✅ Selena Bay contacts: ${targetSelena} (65% Egyptian, 35% international)`);

    // Vernada: 60% Egyptian, 40% international
    const vernadaSold = vernadaUnitsForContacts.slice(0, targetVernada);
    for (let i = 0; i < vernadaSold.length; i++) {
      const isEgyptian = i < Math.floor(targetVernada * 0.6);
      const nat: Nationality = isEgyptian ? 'egyptian' : pick(internationalPool);
      const { firstName, lastName } = generateName(nat);
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.vn${i + 1}@example.com`;
      const phone = `+20 1${String(contactIndex % 10)}${randomInRange(0, 9)} ${randomInRange(100, 999)} ${randomInRange(1000, 9999)}`;
      const contact = await prisma.contact.create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          organizationId: orgId,
          avatarUrl: null,
        },
      });
      await prisma.contact.update({
        where: { id: contact.id },
        data: { avatarUrl: avatarUrl(contact.id) },
      });
      await prisma.contactUnit.create({
        data: { contactId: contact.id, unitId: vernadaSold[i]!.id },
      });
      contactIndex++;
    }
    console.log(`  ✅ Vernada contacts: ${targetVernada} (60% Egyptian, 40% international)`);
  }

  console.log('✅ Compound seed completed.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
