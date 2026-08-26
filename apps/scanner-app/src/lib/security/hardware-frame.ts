import { Buffer } from 'buffer';

/**
 * CCITT-CRC16 Checksum generator & telemetry frame validator
 * Used for gate barrier controller hardware packets (BFT, Came, Nice, Modbus/Shelly IP relays).
 * Polynomial: 0x1021 (X^16 + X^12 + X^5 + 1), Initial value: 0xFFFF
 */

export function computeCrc16Ccitt(data: string | Uint8Array): string {
  const bytes = typeof data === 'string' ? Buffer.from(data, 'utf8') : data;

  let crc = 0xffff;

  for (let i = 0; i < bytes.length; i++) {
    crc ^= (bytes[i] & 0xff) << 8;
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

export interface HardwareTelemetryFrame {
  version: string;
  gateId: string;
  command: string;
  payloadHex: string;
  checksum: string;
}

/**
 * Encodes a raw barrier command packet with CRC16 frame checksum.
 */
export function encodeHardwareFrame(
  gateId: string,
  command: string,
  payloadHex: string
): string {
  const rawBody = `GFHW:v1:${gateId}:${command}:${payloadHex}`;
  const checksum = computeCrc16Ccitt(rawBody);
  return `${rawBody}:${checksum}`;
}

/**
 * Decodes and validates a hardware barrier controller telemetry frame.
 */
export function decodeAndValidateFrame(frame: string): {
  valid: boolean;
  frame?: HardwareTelemetryFrame;
  error?: 'CORRUPTED_CRC' | 'INVALID_FORMAT';
} {
  if (!frame || !frame.startsWith('GFHW:v1:')) {
    return { valid: false, error: 'INVALID_FORMAT' };
  }

  const parts = frame.split(':');
  if (parts.length !== 6) {
    return { valid: false, error: 'INVALID_FORMAT' };
  }

  const [, version, gateId, command, payloadHex, checksum] = parts;
  const rawBody = `GFHW:${version}:${gateId}:${command}:${payloadHex}`;
  const computedChecksum = computeCrc16Ccitt(rawBody);

  if (computedChecksum.toUpperCase() !== checksum.toUpperCase()) {
    return { valid: false, error: 'CORRUPTED_CRC' };
  }

  return {
    valid: true,
    frame: {
      version,
      gateId,
      command,
      payloadHex,
      checksum,
    },
  };
}
