/**
 * One-time data migration: encrypt any Webhook.secret values that are not
 * yet in the "enc:v1:" format.
 *
 * Run with:
 *   cd packages/db
 *   ENCRYPTION_MASTER_KEY=<your-key> npx ts-node --skip-project scripts/migrate-webhook-secrets.ts
 *
 * Or from the repo root:
 *   ENCRYPTION_MASTER_KEY=<your-key> pnpm --filter=@gate-access/db exec \
 *     ts-node --skip-project scripts/migrate-webhook-secrets.ts
 *
 * The script is idempotent — re-running it is safe.
 * Values already in "enc:v1:" format are skipped.
 *
 * Exit codes:
 *   0  — migration completed (including no-op when all secrets are already encrypted)
 *   1  — fatal error (DB connection failed, encryption key missing, etc.)
 */

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { PrismaClient } from '@prisma/client';

// ─── Inline crypto helpers (avoids cross-package import at script runtime) ────

const ENCRYPTED_PREFIX = 'enc:v1:';

function buildMasterKey(): Buffer {
  const raw = process.env.ENCRYPTION_MASTER_KEY;
  if (!raw) {
    console.error(
      'ERROR: ENCRYPTION_MASTER_KEY environment variable is not set.\n' +
        'Set it to the same value used by the application before running this script.',
    );
    process.exit(1);
  }
  const key = Buffer.from(raw, 'hex');
  if (key.length !== 32) {
    console.error(
      `ERROR: ENCRYPTION_MASTER_KEY must be 64 hex characters (32 bytes). ` +
        `Got ${raw.length} characters (${key.length} bytes).`,
    );
    process.exit(1);
  }
  return key;
}

const MASTER_KEY = buildMasterKey();

function encrypt(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', MASTER_KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return ENCRYPTED_PREFIX + Buffer.concat([iv, tag, ciphertext]).toString('base64');
}

/** Decrypt — accepts both "enc:v1:" prefixed values and old prefix-less format. */
function decrypt(value: string): string {
  const b64 = value.startsWith(ENCRYPTED_PREFIX) ? value.slice(ENCRYPTED_PREFIX.length) : value;
  const data = Buffer.from(b64, 'base64');
  if (data.length < 28) throw new Error('data too short');
  const decipher = createDecipheriv('aes-256-gcm', MASTER_KEY, data.subarray(0, 12));
  decipher.setAuthTag(data.subarray(12, 28));
  return Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString('utf8');
}

function isEncrypted(value: string): boolean {
  return value.startsWith(ENCRYPTED_PREFIX);
}

// ─── Migration ────────────────────────────────────────────────────────────────

async function main() {
  const prisma = new PrismaClient();

  console.log('=== Webhook secret migration ===\n');

  let skipped = 0;
  let reWrapped = 0; // old-format encrypted → new format
  let encrypted = 0; // plaintext → new format
  let failed = 0;

  try {
    // Fetch all non-deleted webhooks (include soft-deleted for completeness)
    const webhooks = await prisma.webhook.findMany({
      select: { id: true, secret: true },
    });

    console.log(`Found ${webhooks.length} webhook(s) to inspect.\n`);

    for (const wh of webhooks) {
      if (isEncrypted(wh.secret)) {
        skipped++;
        continue; // already in new format
      }

      // Try to decrypt as old format (no prefix but valid AES-256-GCM data)
      let plaintext: string;
      let wasOldFormat: boolean;

      try {
        plaintext = decrypt(wh.secret);
        wasOldFormat = true;
      } catch {
        // Decryption failed → the value is stored as plaintext
        plaintext = wh.secret;
        wasOldFormat = false;
      }

      const newSecret = encrypt(plaintext);

      try {
        await prisma.webhook.update({
          where: { id: wh.id },
          data: { secret: newSecret },
        });

        if (wasOldFormat) {
          reWrapped++;
          console.log(`  [re-wrapped]  webhook ${wh.id} — re-encrypted with enc:v1: prefix`);
        } else {
          encrypted++;
          console.log(`  [encrypted]   webhook ${wh.id} — plaintext secret encrypted`);
        }
      } catch (updateErr) {
        failed++;
        console.error(`  [FAILED]      webhook ${wh.id} — DB update error:`, updateErr);
      }
    }
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n=== Summary ===');
  console.log(`  Already encrypted (skipped) : ${skipped}`);
  console.log(`  Re-wrapped to new format    : ${reWrapped}`);
  console.log(`  Encrypted from plaintext    : ${encrypted}`);
  console.log(`  Failed                      : ${failed}`);

  if (failed > 0) {
    console.error('\nMigration completed with errors — review failures above.');
    process.exit(1);
  } else {
    console.log('\nMigration completed successfully.');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
