/**
 * Fail-closed JWT secret. Never falls back to a hardcoded default.
 */
export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'NEXTAUTH_SECRET or JWT_SECRET is required (fail-closed; no insecure default)'
    );
  }
  return new TextEncoder().encode(secret);
}
