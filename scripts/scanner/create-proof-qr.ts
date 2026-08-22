import { createHash, randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import QRCode from 'qrcode';
import { prisma, QRCodeType as PrismaQRCodeType } from '@gate-access/db';
import {
  QRCodeType,
  signQRPayload,
  verifyQRSignature,
} from '@gate-access/types';

async function main() {
  const root = path.resolve(__dirname, '../..');
  const runDate =
    process.env.SCANNER_PROOF_DATE ?? new Date().toISOString().slice(0, 10);
  const evidenceDir = path.join(
    root,
    'docs/audits/scanner-app/evidence',
    runDate
  );
  const gateId = process.env.SCANNER_GATE_ID ?? 'gate-school-1';
  const organizationId = process.env.SCANNER_ORGANIZATION_ID;
  if (!organizationId) {
    throw new Error('SCANNER_ORGANIZATION_ID is required');
  }
  const proofLabel = process.env.SCANNER_PROOF_LABEL ?? 'scan-proof';
  const secret = process.env.QR_SIGNING_SECRET ?? '';

  if (secret.length < 32) {
    throw new Error(
      'QR_SIGNING_SECRET is missing or shorter than 32 characters'
    );
  }

  const gate = await prisma.gate.findFirst({
    where: {
      id: gateId,
      organizationId,
      isActive: true,
      deletedAt: null,
    },
    select: { id: true, organizationId: true },
  });
  if (!gate) throw new Error(`Active gate not found: ${gateId}`);

  const qrId = randomUUID();
  const nonce = randomUUID();
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt.getTime() + 30 * 60 * 1000);
  const payload = {
    qrId,
    organizationId: gate.organizationId,
    type: QRCodeType.SINGLE,
    maxUses: 1,
    expiresAt: expiresAt.toISOString(),
    issuedAt: issuedAt.toISOString(),
    nonce,
  };
  const signed = signQRPayload(payload, secret);
  const verified = verifyQRSignature(signed, secret);
  if (!verified.valid || verified.payload.qrId !== qrId) {
    throw new Error('Generated QR failed local signature or qrId verification');
  }

  await prisma.qRCode.create({
    data: {
      id: qrId,
      code: signed,
      type: PrismaQRCodeType.SINGLE,
      organizationId: gate.organizationId,
      gateId: gate.id,
      maxUses: 1,
      expiresAt,
      isActive: true,
    },
  });

  await mkdir(evidenceDir, { recursive: true });
  const qrPath = path.join(evidenceDir, `${proofLabel}-qr.png`);
  await QRCode.toFile(qrPath, signed, {
    errorCorrectionLevel: 'M',
    margin: 4,
    scale: 10,
    color: { dark: '#000000', light: '#FFFFFF' },
  });

  const metadata = [
    `qrId=${qrId}`,
    `payloadQrId=${verified.payload.qrId}`,
    `organizationId=${gate.organizationId}`,
    `gateId=${gate.id}`,
    `type=${verified.payload.type}`,
    `maxUses=${verified.payload.maxUses}`,
    `issuedAt=${verified.payload.issuedAt}`,
    `expiresAt=${verified.payload.expiresAt}`,
    `nonceSha256=${createHash('sha256').update(nonce).digest('hex')}`,
    'databasePersisted=true',
    'signatureVerified=true',
    'generator=canonical GateFlow signQRPayload + Prisma QRCode persistence',
    '',
  ].join('\n');
  await writeFile(
    path.join(evidenceDir, `${proofLabel}-qr-meta.txt`),
    metadata,
    'utf8'
  );

  console.log(`QR image: ${qrPath}`);
  console.log(`QR id: ${qrId}`);
  console.log(`Expires: ${expiresAt.toISOString()}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
