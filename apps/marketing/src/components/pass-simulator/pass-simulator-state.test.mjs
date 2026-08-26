import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePassSimulatorInput,
  generateSimulatedPass,
  DEFAULT_PASS_INPUT,
} from './pass-simulator-state.ts';

describe('pass-simulator-state (node:test)', () => {
  it('validates default input as valid', () => {
    const result = validatePassSimulatorInput(DEFAULT_PASS_INPUT);
    assert.equal(result.isValid, true);
    assert.equal(Object.keys(result.errors).length, 0);
  });

  it('rejects short or empty visitor names', () => {
    const result = validatePassSimulatorInput({
      ...DEFAULT_PASS_INPUT,
      visitorName: 'A',
    });
    assert.equal(result.isValid, false);
    assert.ok(result.errors.visitorName);
  });

  it('rejects empty destination unit', () => {
    const result = validatePassSimulatorInput({
      ...DEFAULT_PASS_INPUT,
      destinationUnit: '',
    });
    assert.equal(result.isValid, false);
    assert.ok(result.errors.destinationUnit);
  });

  it('rejects validHours out of bounds', () => {
    const result = validatePassSimulatorInput({
      ...DEFAULT_PASS_INPUT,
      validHours: 100,
    });
    assert.equal(result.isValid, false);
    assert.ok(result.errors.validHours);
  });

  it('generates a complete simulated pass payload', () => {
    const baseTime = 1700000000000;
    const pass = generateSimulatedPass(
      {
        visitorName: 'Omar Khaled',
        destinationUnit: 'Building 14',
        gateZone: 'East Gate',
        accessType: 'VIP_ESCORT',
        validHours: 12,
      },
      baseTime
    );

    assert.match(pass.passId, /^demo_pass_/);
    assert.equal(pass.visitorName, 'Omar Khaled');
    assert.equal(pass.destinationUnit, 'Building 14');
    assert.equal(pass.gateZone, 'East Gate');
    assert.equal(pass.accessType, 'VIP_ESCORT');
    assert.equal(pass.isSimulatedDemo, true);
    assert.ok(pass.scanUrl.includes('https://gateflow.site/p/'));
    assert.equal(
      pass.expiresAt,
      new Date(baseTime + 12 * 3600 * 1000).toISOString()
    );
  });
});
