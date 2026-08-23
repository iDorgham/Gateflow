import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { prisma } from '@gate-access/db';

async function main() {
  const root = path.resolve(__dirname, '../..');
  const runDate =
    process.env.SCANNER_PROOF_DATE ?? new Date().toISOString().slice(0, 10);
  const proofLabel = process.env.SCANNER_PROOF_LABEL ?? 'scan-proof';
  const evidenceDir = path.join(
    root,
    'docs/audits/scanner-app/evidence',
    runDate
  );
  const qrMeta = await readFile(
    path.join(evidenceDir, `${proofLabel}-qr-meta.txt`),
    'utf8'
  );
  const qrId = qrMeta.match(/^qrId=(.+)$/m)?.[1];
  const payloadQrId = qrMeta.match(/^payloadQrId=(.+)$/m)?.[1];
  if (!qrId || qrId !== payloadQrId) {
    throw new Error(
      'QR metadata is missing or payloadQrId does not match qrId'
    );
  }

  const organizationId = process.env.SCANNER_ORGANIZATION_ID;
  if (!organizationId) {
    throw new Error('SCANNER_ORGANIZATION_ID is required');
  }

  const qr = await prisma.qRCode.findFirst({
    where: { id: qrId, organizationId, deletedAt: null },
    select: {
      id: true,
      organizationId: true,
      currentUses: true,
      maxUses: true,
      isActive: true,
    },
  });
  const scan = await prisma.scanLog.findFirst({
    where: { qrCode: { id: qrId, organizationId, deletedAt: null } },
    orderBy: { scannedAt: 'desc' },
    select: {
      id: true,
      status: true,
      scannedAt: true,
      qrCodeId: true,
      gateId: true,
      scanUuid: true,
    },
  });
  if (!qr || !scan) throw new Error(`No persisted scan found for qrId ${qrId}`);

  const verified =
    qr.id === qrId &&
    qr.organizationId === organizationId &&
    scan.qrCodeId === qrId &&
    scan.status === 'SUCCESS' &&
    scan.gateId === (process.env.SCANNER_GATE_ID ?? 'gate-school-1') &&
    qr.currentUses === qr.maxUses &&
    qr.currentUses === 1;
  if (!verified)
    throw new Error('Persisted scan does not satisfy grant invariants');

  const output = [
    `qrId=${qrId}`,
    `payloadQrId=${payloadQrId}`,
    `scanId=${scan.id}`,
    `scanStatus=${scan.status}`,
    `scannedAt=${scan.scannedAt.toISOString()}`,
    `gateId=${scan.gateId}`,
    `scanUuid=${scan.scanUuid ?? 'null'}`,
    `currentUses=${qr.currentUses}`,
    `maxUses=${qr.maxUses}`,
    `grantInvariantVerified=${verified}`,
    '',
  ].join('\n');
  await writeFile(
    path.join(evidenceDir, `${proofLabel}-scan-meta.txt`),
    output,
    'utf8'
  );
  console.log(`Verified scanId ${scan.id} for qrId ${qrId}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
