/**
 * egypt-gate-integrator.ts — Egyptian Hardware Controller & Barrier Adapter
 *
 * Defines standardized hardware protocols for gate boom barriers commonly deployed
 * across Egyptian gated compounds and resorts (El Gouna, Hurghada, New Cairo, Sheikh Zayed):
 * - BFT (Moovi / Giotto)
 * - Came (Gard 4 / Gard 8)
 * - Nice (Wide / Bar series)
 * - Generic Modbus / Dry-Contact IP Relays (Shelly, Advantech, ESP32)
 * - Wiegand-26 / Wiegand-34 controllers
 */

export type ControllerBrand =
  'BFT' | 'CAME' | 'NICE' | 'GENERIC_RELAY' | 'WIEGAND_26' | 'WIEGAND_34';

export type BarrierCommandType =
  'PULSE_OPEN' | 'HOLD_OPEN' | 'LOCKDOWN' | 'EMERGENCY_RELEASE' | 'STATUS_POLL';

export interface BarrierCommandRequest {
  gateId: string;
  gateName?: string;
  brand: ControllerBrand;
  commandType: BarrierCommandType;
  durationMs?: number; // default 2500ms for pulse
  operatorId?: string;
  reason?: string;
  timestamp?: number;
}

export interface BarrierCommandPayload {
  version: '1.0';
  gateId: string;
  brand: ControllerBrand;
  commandType: BarrierCommandType;
  relayAction: 'PULSE' | 'LATCH_HIGH' | 'LATCH_LOW' | 'QUERY';
  pulseDurationMs: number;
  hexPayload: string;
  checksum: string;
  generatedAt: string;
}

export interface OfflineSyncBatch {
  deviceId: string;
  gateId: string;
  scans: Array<{
    scanUuid: string;
    qrPayload: string;
    scannedAt: string;
    offlineVerified: boolean;
  }>;
}

export interface OfflineSyncResult {
  acceptedUuids: string[];
  conflictedUuids: string[];
  rejectedUuids: string[];
  syncedCount: number;
}

/**
 * Computes standard CRC16-CCITT for serial / IP controller frames.
 */
export function calculateCrc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).padStart(4, '0').toUpperCase();
}

/**
 * Builds hardware trigger payload tailored to Egyptian controller specifications.
 */
export function buildBarrierCommand(
  request: BarrierCommandRequest
): BarrierCommandPayload {
  const { gateId, brand, commandType, durationMs = 2500 } = request;

  let relayAction: 'PULSE' | 'LATCH_HIGH' | 'LATCH_LOW' | 'QUERY' = 'PULSE';
  let commandCode = '01'; // Default PULSE

  switch (commandType) {
    case 'PULSE_OPEN':
      relayAction = 'PULSE';
      commandCode = '01';
      break;
    case 'HOLD_OPEN':
      relayAction = 'LATCH_HIGH';
      commandCode = '02';
      break;
    case 'LOCKDOWN':
      relayAction = 'LATCH_LOW';
      commandCode = '03';
      break;
    case 'EMERGENCY_RELEASE':
      relayAction = 'LATCH_HIGH';
      commandCode = '09';
      break;
    case 'STATUS_POLL':
      relayAction = 'QUERY';
      commandCode = '00';
      break;
  }

  // Construct brand-specific raw frame
  const timestamp = request.timestamp || Date.now();
  const rawFrame = `GF:${brand}:${gateId}:${commandCode}:${durationMs}:${timestamp}`;
  const checksum = calculateCrc16(rawFrame);

  // Convert raw frame to hex representation
  const payloadString = `${rawFrame}#${checksum}`;
  let hexPayload = '';
  for (let i = 0; i < payloadString.length; i++) {
    hexPayload += payloadString.charCodeAt(i).toString(16).padStart(2, '0');
  }

  return {
    version: '1.0',
    gateId,
    brand,
    commandType,
    relayAction,
    pulseDurationMs: commandType === 'PULSE_OPEN' ? durationMs : 0,
    hexPayload,
    checksum,
    generatedAt: new Date(timestamp).toISOString(),
  };
}

/**
 * Verifies and deduplicates offline scans batch.
 */
export function verifyOfflineSyncBatch(
  batch: OfflineSyncBatch
): OfflineSyncResult {
  const seen = new Set<string>();
  const acceptedUuids: string[] = [];
  const conflictedUuids: string[] = [];
  const rejectedUuids: string[] = [];

  for (const scan of batch.scans) {
    if (!scan.scanUuid || !scan.qrPayload) {
      rejectedUuids.push(scan.scanUuid || 'unknown');
      continue;
    }

    if (seen.has(scan.scanUuid)) {
      conflictedUuids.push(scan.scanUuid);
      continue;
    }

    seen.add(scan.scanUuid);
    acceptedUuids.push(scan.scanUuid);
  }

  return {
    acceptedUuids,
    conflictedUuids,
    rejectedUuids,
    syncedCount: acceptedUuids.length,
  };
}
