/**
 * Resolve Resident Portal → Client Dashboard API base (no trailing slash).
 * Mirrors `api-upstream.cjs` used by next.config.js.
 */
export function resolveResidentApiBase(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env
): string {
  const configured =
    (env.RESIDENT_API_UPSTREAM && String(env.RESIDENT_API_UPSTREAM).trim()) ||
    (env.NEXT_PUBLIC_API_URL && String(env.NEXT_PUBLIC_API_URL).trim()) ||
    '';

  if (configured) {
    return configured.replace(/\/$/, '');
  }

  const isProd =
    env.NODE_ENV === 'production' || env.VERCEL_ENV === 'production';
  if (isProd) {
    throw new Error(
      'RESIDENT_API_UPSTREAM or NEXT_PUBLIC_API_URL is required in production (fail-closed; no localhost default)'
    );
  }

  return 'http://localhost:3001/api';
}

export function resolveResidentRewriteDestination(
  env: NodeJS.ProcessEnv | Record<string, string | undefined> = process.env
): string {
  return `${resolveResidentApiBase(env)}/resident/:path*`;
}
