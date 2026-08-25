import crypto from 'crypto';

export interface CronAuthResult {
  isAuthorized: boolean;
  errorReason?: 'MISSING_SECRET' | 'INVALID_BEARER' | 'SIGNATURE_MISMATCH';
  timestamp: string;
}

export type DestructiveActionType =
  | 'DELETE_WORKSPACE'
  | 'BULK_REVOKE_PASSES'
  | 'RESET_CREDENTIALS'
  | 'PERIMETER_LOCKDOWN';

export interface DestructiveActionRequest {
  actorId: string;
  actorRole: 'SUPER_ADMIN' | 'ORGANIZATION_ADMIN' | 'OPERATOR' | 'GUARD';
  actorOrganizationId: string;
  targetOrganizationId: string;
  actionType: DestructiveActionType;
  confirmationCode?: string;
  has2FAVerified?: boolean;
}

export interface DestructiveActionAuthResult {
  isAuthorized: boolean;
  errorReason?:
    | 'INSUFFICIENT_ROLE'
    | 'TENANT_MISMATCH'
    | 'MISSING_CONFIRMATION'
    | 'MISSING_2FA';
  auditLogPayload?: {
    actorId: string;
    actorRole: string;
    targetOrganizationId: string;
    actionType: DestructiveActionType;
    timestamp: string;
    status: 'AUTHORIZED' | 'DENIED';
  };
}

/**
 * Fail-closed cron authentication verifier ensuring only requests with valid bearer secrets execute.
 */
export function verifyCronBearerAuth(
  authHeader?: string,
  configuredSecret?: string
): CronAuthResult {
  const timestamp = new Date().toISOString();

  if (!configuredSecret || configuredSecret.trim().length === 0) {
    return {
      isAuthorized: false,
      errorReason: 'MISSING_SECRET',
      timestamp,
    };
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      isAuthorized: false,
      errorReason: 'INVALID_BEARER',
      timestamp,
    };
  }

  const token = authHeader.replace('Bearer ', '').trim();

  // Timing-safe comparison to prevent side-channel timing attacks
  const tokenBuf = Buffer.from(token, 'utf-8');
  const secretBuf = Buffer.from(configuredSecret, 'utf-8');

  if (tokenBuf.length !== secretBuf.length) {
    return {
      isAuthorized: false,
      errorReason: 'SIGNATURE_MISMATCH',
      timestamp,
    };
  }

  const isMatch = crypto.timingSafeEqual(tokenBuf, secretBuf);

  if (!isMatch) {
    return {
      isAuthorized: false,
      errorReason: 'SIGNATURE_MISMATCH',
      timestamp,
    };
  }

  return {
    isAuthorized: true,
    timestamp,
  };
}

/**
 * Validates role, tenant boundary, 2FA confirmation, and confirmation text for high-impact destructive mutations.
 */
export function authorizeDestructiveAction(
  req: DestructiveActionRequest,
  expectedConfirmationCode: string = 'CONFIRM_DESTRUCTIVE_ACTION'
): DestructiveActionAuthResult {
  const timestamp = new Date().toISOString();

  // Role validation: Only SUPER_ADMIN or ORGANIZATION_ADMIN
  const allowedRoles = new Set(['SUPER_ADMIN', 'ORGANIZATION_ADMIN']);
  if (!allowedRoles.has(req.actorRole)) {
    return {
      isAuthorized: false,
      errorReason: 'INSUFFICIENT_ROLE',
      auditLogPayload: {
        actorId: req.actorId,
        actorRole: req.actorRole,
        targetOrganizationId: req.targetOrganizationId,
        actionType: req.actionType,
        timestamp,
        status: 'DENIED',
      },
    };
  }

  // Multi-tenant boundary check: Org admin cannot affect other organizations
  if (
    req.actorRole === 'ORGANIZATION_ADMIN' &&
    req.actorOrganizationId !== req.targetOrganizationId
  ) {
    return {
      isAuthorized: false,
      errorReason: 'TENANT_MISMATCH',
      auditLogPayload: {
        actorId: req.actorId,
        actorRole: req.actorRole,
        targetOrganizationId: req.targetOrganizationId,
        actionType: req.actionType,
        timestamp,
        status: 'DENIED',
      },
    };
  }

  // 2FA verification requirement for destructive actions
  if (!req.has2FAVerified) {
    return {
      isAuthorized: false,
      errorReason: 'MISSING_2FA',
      auditLogPayload: {
        actorId: req.actorId,
        actorRole: req.actorRole,
        targetOrganizationId: req.targetOrganizationId,
        actionType: req.actionType,
        timestamp,
        status: 'DENIED',
      },
    };
  }

  // Confirmation code validation
  if (req.confirmationCode !== expectedConfirmationCode) {
    return {
      isAuthorized: false,
      errorReason: 'MISSING_CONFIRMATION',
      auditLogPayload: {
        actorId: req.actorId,
        actorRole: req.actorRole,
        targetOrganizationId: req.targetOrganizationId,
        actionType: req.actionType,
        timestamp,
        status: 'DENIED',
      },
    };
  }

  return {
    isAuthorized: true,
    auditLogPayload: {
      actorId: req.actorId,
      actorRole: req.actorRole,
      targetOrganizationId: req.targetOrganizationId,
      actionType: req.actionType,
      timestamp,
      status: 'AUTHORIZED',
    },
  };
}
