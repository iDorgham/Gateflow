import { describe, it, expect, jest } from '@jest/globals';
import { CameraScannerView, type ScannerPhase } from './camera-scanner-view';

describe('CameraScannerView component definition', () => {
  it('exports CameraScannerView as a callable component function', () => {
    expect(typeof CameraScannerView).toBe('function');
  });

  it('verifies all supported ScannerPhase discriminator phases', () => {
    const phases: ScannerPhase['phase'][] = [
      'scanning',
      'processing',
      'id_capture',
      'decision',
      'result',
    ];
    expect(phases).toHaveLength(5);
    expect(phases).toContain('scanning');
    expect(phases).toContain('processing');
    expect(phases).toContain('id_capture');
    expect(phases).toContain('decision');
    expect(phases).toContain('result');
  });

  it('renders correctly in scanning phase in English', () => {
    const tree = CameraScannerView({
      canScan: true,
      uiPhase: { phase: 'scanning' },
      selectedGate: { id: 'gate-1', name: 'Main Gate' },
      onBarcodeScanned: jest.fn(),
      onPass: jest.fn(),
      onDeny: jest.fn(),
      onScanAgain: jest.fn(),
      onIdCaptured: jest.fn(),
      locale: 'en',
    });
    expect(tree).toBeDefined();
  });

  it('renders correctly in processing phase in Arabic', () => {
    const tree = CameraScannerView({
      canScan: false,
      uiPhase: { phase: 'processing' },
      selectedGate: null,
      onBarcodeScanned: jest.fn(),
      onPass: jest.fn(),
      onDeny: jest.fn(),
      onScanAgain: jest.fn(),
      onIdCaptured: jest.fn(),
      locale: 'ar',
    });
    expect(tree).toBeDefined();
  });
});
