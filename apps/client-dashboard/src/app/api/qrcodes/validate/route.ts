import { NextRequest, NextResponse } from 'next/server';
import {
  QRValidateRequestSchema,
  verifyQRSignature,
  type QRValidateResponse,
  type QRRejectReason,
} from '@gate-access/types';
import { prisma, setOrganizationContext, clearOrganizationContext, isAccessAllowed } from '@gate-access/db';
import { requireAuth, isNextResponse } from '../../../../lib/require-auth';
import { checkRateLimit } from '../../../../lib/rate-limit';
import { checkGateAssignment } from '../../../../lib/gate-assignment';
import { checkLocationForGate } from '../../../../lib/location';
import { getActiveWatchlist, findWatchlistMatch } from '../../../../lib/watchlist';
import { emitEvent, EventType } from '../../../../lib/realtime/emit-event';

// ─── Configuration ────────────────────────────────────────────────────────────

const QR_SIGNING_SECRET = process.env.QR_SIGNING_SECRET ?? '';

if (!QR_SIGNING_SECRET || QR_SIGNING_SECRET.length < 32) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      '[qr/validate] QR_SIGNING_SECRET is missing or shorter than 32 characters. ' +
      'Set QR_SIGNING_SECRET to a random 64-char string before deploying.'
    );
  } else {
    console.warn(
      '[qr/validate] QR_SIGNING_SECRET is missing or shorter than 32 characters — insecure in production',
    );
  }
}

// ─── Reason mapping ───────────────────────────────────────────────────────────

const SIGNING_REASON_MAP: Record<
  QRRejectReason,
  QRValidateResponse & { status: 'rejected' }
> = {
  INVALID_FORMAT: {
    status: 'rejected',
    reason: 'invalid_format',
    message: 'QR format is invalid',
  },
  INVALID_SIGNATURE: {
    status: 'rejected',
    reason: 'invalid_signature',
    message: 'QR signature verification failed',
  },
  EXPIRED: {
    status: 'rejected',
    reason: 'expired',
    message: 'QR code has expired',
  },
  NONCE_REUSED: {
    status: 'rejected',
    reason: 'invalid_signature',
    message: 'Nonce replay detected',
  },
  MALFORMED_PAYLOAD: {
    status: 'rejected',
    reason: 'malformed_payload',
    message: 'QR payload is malformed',
  },
  UNKNOWN_VERSION: {
    status: 'rejected',
    reason: 'unknown_version',
    message: 'QR version not supported',
  },
};

// ─── Audit helpers ────────────────────────────────────────────────────────────

interface AuditTrailEntry {
  timestamp: string;
  action: string;
  resolvedBy: 'lww' | 'server' | 'client';
  details: Record<string, unknown>;
}

function makeAuditEntry(
  action: string,
  details: Record<string, unknown>,
): AuditTrailEntry {
  return { timestamp: new Date().toISOString(), action, resolvedBy: 'server', details };
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Step 1 — Authenticate: verify Bearer JWT, extract claims.
    const authResult = await requireAuth(request);
    if (isNextResponse(authResult)) return authResult;
    const claims = authResult;

    // Step 2 — Rate limit: 100 req/min per authenticated user.
    const rl = await checkRateLimit(`validate:${claims.sub}`);
    if (!rl.allowed) {
      const body: QRValidateResponse = {
        status: 'rejected',
        reason: 'rate_limited',
        message: 'Too many requests — please slow down',
      };
      return NextResponse.json(body, {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)),
          'X-RateLimit-Limit': String(rl.limit),
          'X-RateLimit-Remaining': '0',
        },
      });
    }

    // Step 2.5 — Require organization (fail-closed: no org = no validate).
    if (!claims.orgId) {
      return json<QRValidateResponse>(
        {
          status: 'rejected',
          reason: 'wrong_org',
          message: 'Organization context required to validate QR codes',
        },
        403,
      );
    }

    // Step 3 — Set tenant context for downstream DB helpers.
    setOrganizationContext({ organizationId: claims.orgId });

    // Step 4 — Parse & validate request body.
    const body = await request.json();
    const parsed = QRValidateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid request body', errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { qrPayload, scanContext } = parsed.data;

    // Step 5 — Cryptographic verification: signature + payload expiry.
    const sigResult = verifyQRSignature(qrPayload, QR_SIGNING_SECRET);
    if (sigResult.valid === false) {
      return json<QRValidateResponse>(SIGNING_REASON_MAP[sigResult.reason], 403);
    }

    const payload = sigResult.payload;

    // Step 6 — Tenant isolation: QR orgId must match token orgId.
    if (payload.organizationId !== claims.orgId) {
      return json<QRValidateResponse>(
        {
          status: 'rejected',
          reason: 'wrong_org',
          message: 'QR code does not belong to your organization',
        },
        403,
      );
    }

    // Step 7 — DB lookup: record must exist.
    const qrCode = await prisma.qRCode.findUnique({ 
      where: { id: payload.qrId },
      include: {
        visitorQR: {
          include: {
            accessRule: true,
          },
        },
      },
    });

    if (!qrCode) {
      return json<QRValidateResponse>(
        { status: 'rejected', reason: 'not_found', message: 'QR code record not found' },
        403,
      );
    }

    // Defense-in-depth: re-verify org on the DB row (prevents payload/DB desync).
    if (qrCode.organizationId !== claims.orgId) {
      return json<QRValidateResponse>(
        {
          status: 'rejected',
          reason: 'wrong_org',
          message: 'QR code does not belong to your organization',
        },
        403,
      );
    }

    // Step 8 — Active / revoked check.
    if (!qrCode.isActive || qrCode.deletedAt !== null) {
      await logRejection(qrCode.id, 'inactive', scanContext, claims.sub);
      return json<QRValidateResponse>(
        { status: 'rejected', reason: 'inactive', message: 'QR code has been deactivated or revoked' },
        403,
      );
    }

    // Step 9 — DB-level expiration (authoritative — admin may have changed expiresAt).
    if (qrCode.expiresAt !== null && new Date() > qrCode.expiresAt) {
      await logRejection(qrCode.id, 'expired', scanContext, claims.sub);
      return json<QRValidateResponse>(
        { status: 'rejected', reason: 'expired', message: 'QR code has expired' },
        403,
      );
    }

    // Step 10 — Type-specific usage limits.
    switch (qrCode.type) {
      case 'SINGLE':
        if (qrCode.currentUses >= 1) {
          await logRejection(qrCode.id, 'max_uses_reached', scanContext, claims.sub);
          return json<QRValidateResponse>(
            { status: 'rejected', reason: 'max_uses_reached', message: 'Single-use QR code already scanned' },
            403,
          );
        }
        break;

      case 'RECURRING':
        if (qrCode.maxUses !== null && qrCode.currentUses >= qrCode.maxUses) {
          await logRejection(qrCode.id, 'max_uses_reached', scanContext, claims.sub);
          return json<QRValidateResponse>(
            {
              status: 'rejected',
              reason: 'max_uses_reached',
              message: `Max uses (${qrCode.maxUses}) reached`,
            },
            403,
          );
        }
        break;

      case 'VISITOR':
      case 'OPEN':
        if (qrCode.visitorQR?.accessRule) {
          const access = isAccessAllowed(qrCode.visitorQR.accessRule);
          if (!access.allowed) {
            await logRejection(qrCode.id, 'denied', scanContext, claims.sub);
            return json<QRValidateResponse>(
              {
                status: 'rejected',
                reason: 'denied',
                message: access.reason || 'Access denied based on resident rules',
              },
              403,
            );
          }
        }
        // Also check maxUses if applicable (e.g. for ONETIME visitor QRs)
        if (qrCode.maxUses !== null && qrCode.currentUses >= qrCode.maxUses) {
          await logRejection(qrCode.id, 'max_uses_reached', scanContext, claims.sub);
          return json<QRValidateResponse>(
            {
              status: 'rejected',
              reason: 'max_uses_reached',
              message: 'Visitor QR max uses reached',
            },
            403,
          );
        }
        break;

      case 'PERMANENT':
        // No usage limit.
        break;
    }

    // Step 11 — Resolve gateId (context takes precedence over QR default).
    const gateId = scanContext?.gateId ?? qrCode.gateId;
    if (!gateId) {
      return json<QRValidateResponse>(
        {
          status: 'rejected',
          reason: 'invalid_format',
          message: 'No gate ID provided and QR code has no default gate',
        },
        400,
      );
    }

    // Step 11b — Gate–account assignment: when org uses assignments, operator must be assigned to this gate.
    const assignmentError = await checkGateAssignment(claims, gateId);
    if (assignmentError) {
      return json<QRValidateResponse>(
        { status: 'rejected', reason: 'denied', message: assignmentError },
        403,
      );
    }

    // Step 11c — Location rule: when gate has locationEnforced, require device location within radius.
    const gateForLocation = await prisma.gate.findFirst({
      where: { id: gateId, organizationId: claims.orgId, deletedAt: null },
      select: {
        latitude: true,
        longitude: true,
        locationRadiusMeters: true,
        locationEnforced: true,
      },
    });
    if (gateForLocation) {
      const loc = scanContext;
      const lat = loc?.latitude ?? (loc?.location && typeof (loc.location as { latitude?: number }).latitude === 'number' ? (loc.location as { latitude: number }).latitude : null);
      const lon = loc?.longitude ?? (loc?.location && typeof (loc.location as { longitude?: number }).longitude === 'number' ? (loc.location as { longitude: number }).longitude : null);
      const deviceLocation =
        lat != null && lon != null ? { latitude: lat, longitude: lon } : null;
      const locationResult = checkLocationForGate(gateForLocation, deviceLocation);
      if (!locationResult.allowed) {
        const msg = 'message' in locationResult ? locationResult.message : 'Scan only allowed at gate location.';
        return json<QRValidateResponse>(
          {
            status: 'rejected',
            reason: 'not_on_location',
            message: msg,
          },
          403,
        );
      }
    }

    // Step 11d — Watchlist: if scanContext has visitor identity, check org watchlist; on match reject and create incident.
    const visitorName = scanContext?.visitorName ?? null;
    const visitorPhone = scanContext?.visitorPhone ?? null;
    const visitorIdNumber = scanContext?.visitorIdNumber ?? null;
    if (visitorName || visitorPhone || visitorIdNumber) {
      const entries = await getActiveWatchlist(claims.orgId);
      const match = findWatchlistMatch(entries, {
        name: visitorName,
        phone: visitorPhone,
        idNumber: visitorIdNumber,
      });
      if (match) {
        await prisma.incident.create({
          data: {
            organizationId: claims.orgId,
            gateId,
            userId: claims.sub,
            reason: 'watchlist_match',
            status: 'UNDER_REVIEW',
            notes: `Watchlist entry ${match.entryId} matched on ${match.matchedField}.`,
          },
        });
        return json<QRValidateResponse>(
          {
            status: 'rejected',
            reason: 'blocked_watchlist',
            message: 'Blocked person on security list.',
          },
          403,
        );
      }
    }

    // Step 12 — Atomic transaction: re-check usage (TOCTOU guard), increment, log.
    const auditEntry = makeAuditEntry('validated', {
      qrType: qrCode.type,
      usesBeforeScan: qrCode.currentUses,
      gateId,
      deviceId: scanContext?.deviceId ?? null,
      location: scanContext?.location ?? null,
      nonce: payload.nonce,
    });

    const scanLog = await prisma.$transaction(async (tx) => {
      // Re-read inside the transaction to prevent races.
      const fresh = await tx.qRCode.findUnique({ 
        where: { id: qrCode.id },
        include: { visitorQR: { include: { accessRule: true } } }
      });
      if (!fresh) throw new Error('QR code disappeared during transaction');

      // Re-check logic for VISITOR/OPEN as well
      if (fresh.type === 'VISITOR' || fresh.type === 'OPEN') {
        if (fresh.visitorQR?.accessRule) {
          const access = isAccessAllowed(fresh.visitorQR.accessRule);
          if (!access.allowed) throw new UsageLimitError(access.reason || 'Access denied');
        }
      }

      if (fresh.type === 'SINGLE' && fresh.currentUses >= 1) {
        throw new UsageLimitError('Single-use QR code already scanned');
      }
      if (
        (fresh.type === 'RECURRING' || fresh.type === 'VISITOR' || fresh.type === 'OPEN') &&
        fresh.maxUses !== null &&
        fresh.currentUses >= fresh.maxUses
      ) {
        throw new UsageLimitError(`Max uses (${fresh.maxUses}) reached`);
      }

      await tx.qRCode.update({
        where: { id: qrCode.id },
        data: { currentUses: { increment: 1 } },
      });

      return tx.scanLog.create({
        data: {
          status: 'SUCCESS',
          scannedAt: new Date(),
          userId: claims.sub,
          qrCodeId: qrCode.id,
          gateId,
          deviceId: scanContext?.deviceId ?? null,
          auditTrail: [auditEntry] as unknown as Parameters<
            typeof tx.scanLog.create
          >[0]['data']['auditTrail'],
        },
      });
    });

    emitEvent(claims.orgId, EventType.SCAN_RECORDED, { scanId: scanLog.id, gateId, qrCodeId: qrCode.id }).catch(() => {});
    return json<QRValidateResponse>({ status: 'accepted', scanId: scanLog.id }, 200);
  } catch (error) {
    if (error instanceof UsageLimitError) {
      return json<QRValidateResponse>(
        { status: 'rejected', reason: 'max_uses_reached', message: error.message },
        403,
      );
    }
    console.error('[qr/validate] Unhandled error:', error);
    return json<QRValidateResponse>(
      { status: 'rejected', reason: 'internal_error', message: 'Internal server error' },
      500,
    );
  } finally {
    clearOrganizationContext();
  }
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

class UsageLimitError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'UsageLimitError';
  }
}

function json<T>(data: T, status: number): NextResponse {
  return NextResponse.json(data, { status });
}

const REJECTION_STATUS_MAP: Record<string, 'EXPIRED' | 'MAX_USES_REACHED' | 'INACTIVE' | 'FAILED' | 'DENIED'> =
  {
    expired: 'EXPIRED',
    max_uses_reached: 'MAX_USES_REACHED',
    inactive: 'INACTIVE',
    denied: 'DENIED',
  };

/**
 * Append a rejection ScanLog entry for forensics / audit trail.
 * Best-effort: failure here must not block the caller's response.
 */
async function logRejection(
  qrCodeId: string,
  reason: string,
  scanContext:
    | { gateId?: string; deviceId?: string; location?: Record<string, unknown> }
    | undefined,
  userId: string,
): Promise<void> {
  try {
    const gateId = scanContext?.gateId;
    if (!gateId) return; // ScanLog.gateId is required

    await prisma.scanLog.create({
      data: {
        status: REJECTION_STATUS_MAP[reason] ?? 'FAILED',
        scannedAt: new Date(),
        userId,
        qrCodeId,
        gateId,
        deviceId: scanContext?.deviceId ?? null,
        auditTrail: [
          makeAuditEntry('rejected', { reason, deviceId: scanContext?.deviceId ?? null }),
        ] as unknown as Parameters<typeof prisma.scanLog.create>[0]['data']['auditTrail'],
      },
    });
  } catch (err) {
    console.error('[qr/validate] Failed to log rejection:', err);
  }
}
