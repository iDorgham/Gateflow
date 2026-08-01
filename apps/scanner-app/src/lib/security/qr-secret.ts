export const QR_SECRET_MISSING = 'QR_SECRET_MISSING' as const;

export type QrSecretResolution =
  | { ok: true; secret: string }
  | { ok: false; reason: typeof QR_SECRET_MISSING; message: string };

/**
 * Fail closed when the HMAC QR secret is missing outside explicit development.
 * Explicit development is `__DEV__` or an intentional insecure override flag.
 */
export function resolveQrSecretForScan(input: {
  secret: string | undefined | null;
  isExplicitDev: boolean;
}): QrSecretResolution {
  const secret = (input.secret ?? '').trim();
  if (secret.length > 0) {
    return { ok: true, secret };
  }
  if (input.isExplicitDev) {
    return { ok: true, secret: '' };
  }
  return {
    ok: false,
    reason: QR_SECRET_MISSING,
    message:
      'QR HMAC secret is not configured. Set EXPO_PUBLIC_QR_SECRET before scanning.',
  };
}

/** Runtime helper used by the scanner shell. */
export function resolveRuntimeQrSecret(
  envSecret: string | undefined = process.env.EXPO_PUBLIC_QR_SECRET
): QrSecretResolution {
  const allowInsecure =
    process.env.EXPO_PUBLIC_ALLOW_INSECURE_QR === '1' ||
    process.env.EXPO_PUBLIC_ALLOW_INSECURE_QR === 'true';
  return resolveQrSecretForScan({
    secret: envSecret,
    isExplicitDev:
      typeof __DEV__ !== 'undefined' ? __DEV__ || allowInsecure : allowInsecure,
  });
}
