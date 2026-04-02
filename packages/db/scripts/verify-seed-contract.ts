/**
 * Read-only shape check: DB rows expose fields the client-dashboard CRM / QR UIs expect.
 *
 * From repo root:
 *   pnpm --filter=@gate-access/db run verify:seed-contract
 *
 * Exits 0 if DB is empty (prints skip) or all sampled rows pass. Exits 1 on missing columns / bad shape.
 */
import { prisma } from '../src/client';

const CONTACT_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'jobTitle',
  'company',
  'organizationId',
] as const;

const UNIT_FIELDS = [
  'name',
  'type',
  'building',
  'sizeSqm',
  'organizationId',
  'projectId',
] as const;

const QR_FIELDS = [
  'code',
  'type',
  'isActive',
  'organizationId',
  'projectId',
  'gateId',
  'contactId',
] as const;

function assertKeys(
  label: string,
  row: Record<string, unknown>,
  keys: readonly string[]
): void {
  for (const k of keys) {
    if (!(k in row)) {
      throw new Error(`${label}: missing field "${k}"`);
    }
  }
}

async function main(): Promise<void> {
  const contact = await prisma.contact.findFirst({
    where: { deletedAt: null },
  });
  if (!contact) {
    console.log('[verify-seed-contract] skip: no Contact rows');
    return;
  }
  assertKeys('Contact', contact as Record<string, unknown>, CONTACT_FIELDS);

  const unit = await prisma.unit.findFirst({
    where: { deletedAt: null },
  });
  if (!unit) {
    console.log('[verify-seed-contract] skip: no Unit rows');
  } else {
    assertKeys('Unit', unit as Record<string, unknown>, UNIT_FIELDS);
  }

  const qr = await prisma.qRCode.findFirst({
    where: { deletedAt: null },
  });
  if (!qr) {
    console.log('[verify-seed-contract] skip: no QRCode rows');
  } else {
    assertKeys('QRCode', qr as Record<string, unknown>, QR_FIELDS);
  }

  const scan = await prisma.scanLog.findFirst({
    where: {
      qrCode: { organizationId: contact.organizationId, deletedAt: null },
    },
    include: {
      qrCode: { select: { organizationId: true, id: true } },
    },
  });
  if (!scan) {
    console.log('[verify-seed-contract] skip: no ScanLog for org (optional)');
  } else if (!scan.qrCode?.organizationId) {
    throw new Error('ScanLog: expected nested qrCode.organizationId');
  }

  console.log(
    '[verify-seed-contract] OK — sampled rows match dashboard field contract'
  );
}

main()
  .catch((e) => {
    console.error('[verify-seed-contract]', e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
