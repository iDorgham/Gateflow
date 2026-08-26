import {
  computeCrc16Ccitt,
  encodeHardwareFrame,
  decodeAndValidateFrame,
} from './hardware-frame';

describe('hardware-frame CCITT-CRC16 validation', () => {
  const GATE_ID = 'gate_red_sea_01';
  const COMMAND = 'PULSE_OPEN';
  const PAYLOAD_HEX = 'A1B2C3D4';

  test('computeCrc16Ccitt is deterministic and matches expected checksum length', () => {
    const checksum = computeCrc16Ccitt('TEST_FRAME_DATA');
    expect(checksum).toMatch(/^[0-9A-F]{4}$/);
    expect(computeCrc16Ccitt('TEST_FRAME_DATA')).toBe(checksum);
  });

  test('encodeHardwareFrame produces valid frame with checksum suffix', () => {
    const frame = encodeHardwareFrame(GATE_ID, COMMAND, PAYLOAD_HEX);
    expect(frame.startsWith('GFHW:v1:')).toBe(true);

    const validation = decodeAndValidateFrame(frame);
    expect(validation.valid).toBe(true);
    expect(validation.frame?.gateId).toBe(GATE_ID);
    expect(validation.frame?.command).toBe(COMMAND);
    expect(validation.frame?.payloadHex).toBe(PAYLOAD_HEX);
  });

  test('decodeAndValidateFrame rejects frame with corrupted checksum', () => {
    const frame = encodeHardwareFrame(GATE_ID, COMMAND, PAYLOAD_HEX);
    // Tamper with last char of checksum
    const corrupted = frame.slice(0, -1) + (frame.endsWith('0') ? '1' : '0');

    const validation = decodeAndValidateFrame(corrupted);
    expect(validation.valid).toBe(false);
    expect(validation.error).toBe('CORRUPTED_CRC');
  });

  test('decodeAndValidateFrame rejects corrupted payload body', () => {
    const frame = encodeHardwareFrame(GATE_ID, COMMAND, PAYLOAD_HEX);
    const tampered = frame.replace(PAYLOAD_HEX, 'FFFFFFFF');

    const validation = decodeAndValidateFrame(tampered);
    expect(validation.valid).toBe(false);
    expect(validation.error).toBe('CORRUPTED_CRC');
  });

  test('decodeAndValidateFrame rejects invalid frame format', () => {
    expect(decodeAndValidateFrame('').valid).toBe(false);
    expect(decodeAndValidateFrame('INVALID:PREFIX:DATA').valid).toBe(false);
  });
});
