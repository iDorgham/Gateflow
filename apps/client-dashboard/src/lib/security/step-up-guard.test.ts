import {
  issueStepUpToken,
  verifyStepUpToken,
  requireStepUp,
} from './step-up-guard';
import { NextRequest } from 'next/server';

describe('step-up-guard', () => {
  const USER_ID = 'usr_admin_123';
  const ORG_ID = 'org_selena_456';
  const ACTION = 'COMPLIANCE_AUDIT_EXPORT';

  test('issueStepUpToken and verifyStepUpToken successfully round-trip', () => {
    const token = issueStepUpToken({
      userId: USER_ID,
      orgId: ORG_ID,
      action: ACTION,
    });

    expect(typeof token).toBe('string');
    expect(token.includes('.')).toBe(true);

    const result = verifyStepUpToken(token, {
      userId: USER_ID,
      orgId: ORG_ID,
      action: ACTION,
    });

    expect(result.valid).toBe(true);
    expect(result.payload?.userId).toBe(USER_ID);
    expect(result.payload?.action).toBe(ACTION);
  });

  test('verifyStepUpToken rejects missing token', () => {
    const result = verifyStepUpToken(null, { userId: USER_ID });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('MISSING');
  });

  test('verifyStepUpToken rejects tampered signature', () => {
    const token = issueStepUpToken({
      userId: USER_ID,
      orgId: ORG_ID,
      action: ACTION,
    });

    const [payloadB64, signature] = token.split('.');
    const tamperedSig = signature.slice(0, -4) + 'zzzz';
    const tamperedToken = `${payloadB64}.${tamperedSig}`;

    const result = verifyStepUpToken(tamperedToken, { userId: USER_ID });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('TAMPERED');
  });

  test('verifyStepUpToken rejects expired tokens', () => {
    const expiredToken = issueStepUpToken({
      userId: USER_ID,
      orgId: ORG_ID,
      action: ACTION,
      ttlMs: -1000, // already expired
    });

    const result = verifyStepUpToken(expiredToken, {
      userId: USER_ID,
      orgId: ORG_ID,
      action: ACTION,
    });

    expect(result.valid).toBe(false);
    expect(result.reason).toBe('EXPIRED');
  });

  test('verifyStepUpToken rejects mismatched user or action', () => {
    const token = issueStepUpToken({
      userId: USER_ID,
      orgId: ORG_ID,
      action: ACTION,
    });

    const wrongUserResult = verifyStepUpToken(token, {
      userId: 'usr_different_999',
      orgId: ORG_ID,
      action: ACTION,
    });
    expect(wrongUserResult.valid).toBe(false);
    expect(wrongUserResult.reason).toBe('MISMATCH');

    const wrongActionResult = verifyStepUpToken(token, {
      userId: USER_ID,
      orgId: ORG_ID,
      action: 'DANGER_PURGE',
    });
    expect(wrongActionResult.valid).toBe(false);
    expect(wrongActionResult.reason).toBe('MISMATCH');
  });

  test('requireStepUp returns 403 response when header is missing', () => {
    const req = new NextRequest('https://app.gateflow.site/api/danger/purge');
    const response = requireStepUp(req, {
      userId: USER_ID,
      orgId: ORG_ID,
      action: ACTION,
    });

    expect(response).not.toBeNull();
    expect(response?.status).toBe(403);
  });

  test('requireStepUp returns null (pass) when valid header is provided', () => {
    const token = issueStepUpToken({
      userId: USER_ID,
      orgId: ORG_ID,
      action: ACTION,
    });

    const req = new NextRequest('https://app.gateflow.site/api/danger/purge', {
      headers: {
        'x-gateflow-stepup-token': token,
      },
    });

    const response = requireStepUp(req, {
      userId: USER_ID,
      orgId: ORG_ID,
      action: ACTION,
    });

    expect(response).toBeNull();
  });
});
