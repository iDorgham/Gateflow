import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';

// ─── Configuration ────────────────────────────────────────────────────────────

const ARGON2_OPTIONS: argon2.Options & { raw: false } = {
  type: argon2.argon2id,
  memoryCost: 65536, // 64 MiB
  timeCost: 3, // 3 iterations
  parallelism: 4,
  raw: false,
};

// ─── Utils ──────────────────────────────────────────────────────────────────

export function generateTemporaryPassword(): string {
  // 9 bytes * 8 bits = 72 bits. 72 / 6 = 12 base64 chars.
  return randomBytes(9).toString('base64url') + 'Aa1!';
}

// ─── Password Hashing (Argon2id per PRD §7) ──────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  return argon2.verify(hash, password);
}
