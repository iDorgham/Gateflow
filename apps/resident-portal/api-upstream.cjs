/**
 * Resolve Resident Portal → Client Dashboard API base URL.
 * Used by next.config rewrites and server fetches.
 *
 * @param {NodeJS.ProcessEnv | Record<string, string | undefined>} [env]
 * @returns {string} Base ending without trailing slash (e.g. http://host/api)
 */
function resolveResidentApiBase(env = process.env) {
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

/**
 * Next.js rewrite destination for /api/resident/:path*
 * @param {NodeJS.ProcessEnv | Record<string, string | undefined>} [env]
 */
function resolveResidentRewriteDestination(env = process.env) {
  return `${resolveResidentApiBase(env)}/resident/:path*`;
}

module.exports = {
  resolveResidentApiBase,
  resolveResidentRewriteDestination,
};
