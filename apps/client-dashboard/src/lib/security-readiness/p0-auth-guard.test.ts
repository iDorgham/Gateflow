import {
  verifyCronBearerAuth,
  authorizeDestructiveAction,
} from './p0-auth-guard';

describe('p0-auth-guard', () => {
  describe('verifyCronBearerAuth', () => {
    it('authorizes requests with matching bearer secret', () => {
      const result = verifyCronBearerAuth(
        'Bearer super_secret_cron_key_123',
        'super_secret_cron_key_123'
      );
      expect(result.isAuthorized).toBe(true);
    });

    it('fails closed when configured secret is missing', () => {
      const result = verifyCronBearerAuth('Bearer key', '');
      expect(result.isAuthorized).toBe(false);
      expect(result.errorReason).toBe('MISSING_SECRET');
    });

    it('fails closed when auth header is missing or malformed', () => {
      const result = verifyCronBearerAuth(
        'Basic key',
        'super_secret_cron_key_123'
      );
      expect(result.isAuthorized).toBe(false);
      expect(result.errorReason).toBe('INVALID_BEARER');
    });

    it('rejects signature mismatch', () => {
      const result = verifyCronBearerAuth(
        'Bearer wrong_token_abc_12345',
        'super_secret_cron_key_123'
      );
      expect(result.isAuthorized).toBe(false);
      expect(result.errorReason).toBe('SIGNATURE_MISMATCH');
    });
  });

  describe('authorizeDestructiveAction', () => {
    it('authorizes valid organization admin destructive action with 2FA and code', () => {
      const result = authorizeDestructiveAction(
        {
          actorId: 'admin-01',
          actorRole: 'ORGANIZATION_ADMIN',
          actorOrganizationId: 'org-palm-hills',
          targetOrganizationId: 'org-palm-hills',
          actionType: 'BULK_REVOKE_PASSES',
          has2FAVerified: true,
          confirmationCode: 'CONFIRM_DESTRUCTIVE_ACTION',
        },
        'CONFIRM_DESTRUCTIVE_ACTION'
      );

      expect(result.isAuthorized).toBe(true);
      expect(result.auditLogPayload?.status).toBe('AUTHORIZED');
    });

    it('allows SUPER_ADMIN across different target organizations', () => {
      const result = authorizeDestructiveAction(
        {
          actorId: 'super-admin-01',
          actorRole: 'SUPER_ADMIN',
          actorOrganizationId: 'gateflow-platform',
          targetOrganizationId: 'org-palm-hills',
          actionType: 'DELETE_WORKSPACE',
          has2FAVerified: true,
          confirmationCode: 'CONFIRM_DESTRUCTIVE_ACTION',
        },
        'CONFIRM_DESTRUCTIVE_ACTION'
      );

      expect(result.isAuthorized).toBe(true);
    });

    it('rejects action if role is insufficient (OPERATOR/GUARD)', () => {
      const result = authorizeDestructiveAction({
        actorId: 'guard-01',
        actorRole: 'GUARD',
        actorOrganizationId: 'org-palm-hills',
        targetOrganizationId: 'org-palm-hills',
        actionType: 'DELETE_WORKSPACE',
        has2FAVerified: true,
        confirmationCode: 'CONFIRM_DESTRUCTIVE_ACTION',
      });

      expect(result.isAuthorized).toBe(false);
      expect(result.errorReason).toBe('INSUFFICIENT_ROLE');
    });

    it('rejects cross-tenant attempt by organization admin', () => {
      const result = authorizeDestructiveAction({
        actorId: 'admin-01',
        actorRole: 'ORGANIZATION_ADMIN',
        actorOrganizationId: 'org-palm-hills',
        targetOrganizationId: 'org-marassi',
        actionType: 'BULK_REVOKE_PASSES',
        has2FAVerified: true,
        confirmationCode: 'CONFIRM_DESTRUCTIVE_ACTION',
      });

      expect(result.isAuthorized).toBe(false);
      expect(result.errorReason).toBe('TENANT_MISMATCH');
    });

    it('rejects action when 2FA is missing', () => {
      const result = authorizeDestructiveAction({
        actorId: 'admin-01',
        actorRole: 'ORGANIZATION_ADMIN',
        actorOrganizationId: 'org-palm-hills',
        targetOrganizationId: 'org-palm-hills',
        actionType: 'RESET_CREDENTIALS',
        has2FAVerified: false,
        confirmationCode: 'CONFIRM_DESTRUCTIVE_ACTION',
      });

      expect(result.isAuthorized).toBe(false);
      expect(result.errorReason).toBe('MISSING_2FA');
    });
  });
});
