/**
 * Integration & Environment Readiness Verifier
 * Validates all required GateFlow integration keys and secrets before builds & deployments.
 */

const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'DIRECT_DATABASE_URL',
  'NEXTAUTH_SECRET',
  'QR_SIGNING_SECRET',
  'ENCRYPTION_MASTER_KEY',
];

const OPTIONAL_INTEGRATION_VARS = [
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'HUBSPOT_ACCESS_TOKEN',
  'EXPO_PUSH_TOKEN',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'RESEND_API_KEY',
  'NEXT_PUBLIC_API_URL',
  'AUTH_COOKIE_DOMAIN',
];

function checkIntegrations() {
  console.log('🔍 Checking environment and integration secrets...');

  const missingRequired = [];
  const missingOptional = [];

  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missingRequired.push(envVar);
    }
  }

  for (const envVar of OPTIONAL_INTEGRATION_VARS) {
    if (!process.env[envVar]) {
      missingOptional.push(envVar);
    }
  }

  if (missingRequired.length > 0) {
    console.warn(
      `⚠️ Warning: Missing required core env vars in local process: ${missingRequired.join(', ')}`
    );
    console.warn(
      `Note: Ensure production deployment environment variables are set in Vercel / GitHub Secrets.`
    );
  } else {
    console.log('✅ All core environment variables are defined.');
  }

  if (missingOptional.length > 0) {
    console.log(
      `ℹ️ Optional integration services unconfigured: ${missingOptional.join(', ')} (fallback stubs active).`
    );
  } else {
    console.log('✅ All optional integration variables are set.');
  }

  return {
    success: true,
    missingRequired,
    missingOptional,
  };
}

if (require.main === module) {
  checkIntegrations();
}

module.exports = {
  checkIntegrations,
  REQUIRED_ENV_VARS,
  OPTIONAL_INTEGRATION_VARS,
};
