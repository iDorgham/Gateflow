import { hash, verify } from '@node-rs/argon2';
import { randomBytes } from 'crypto';

// ─── Configuration ────────────────────────────────────────────────────────────

// algorithm defaults to Argon2id in @node-rs/argon2
const ARGON2_OPTIONS = {
  memoryCost: 65536, // 64 MiB
  timeCost: 3, // 3 iterations
  parallelism: 4,
};

// ─── Utils ──────────────────────────────────────────────────────────────────

export function generateTemporaryPassword(): string {
  // 9 bytes * 8 bits = 72 bits. 72 / 6 = 12 base64 chars.
  return randomBytes(9).toString('base64url') + 'Aa1!';
}

// ─── Password Hashing (Argon2id per PRD §7) ──────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return hash(password, ARGON2_OPTIONS);
}

export async function verifyPassword(
  passwordHash: string,
  password: string
): Promise<boolean> {
  return verify(passwordHash, password);
}
