import { describe, it, expect, jest } from '@jest/globals';
import { ScannerTopBar } from './scanner-top-bar';

describe('ScannerTopBar component definition', () => {
  it('exports ScannerTopBar as a callable component function', () => {
    expect(typeof ScannerTopBar).toBe('function');
  });

  it('renders top bar in English with gate and active shift', () => {
    const tree = ScannerTopBar({
      selectedGate: { id: 'gate-1', name: 'Main Gate' },
      onOpenGateSelector: jest.fn(),
      shiftLoading: false,
      shiftBusy: false,
      isShiftActive: true,
      onToggleShift: jest.fn(),
      onOpenQueue: jest.fn(),
      onLogout: jest.fn(),
      isLoggingOut: false,
      locale: 'en',
    });
    expect(tree).toBeDefined();
    expect(tree.type).toBe('View');
  });

  it('renders top bar in Arabic with unselected gate and inactive shift', () => {
    const tree = ScannerTopBar({
      selectedGate: null,
      onOpenGateSelector: jest.fn(),
      shiftLoading: false,
      shiftBusy: false,
      isShiftActive: false,
      onToggleShift: jest.fn(),
      onOpenQueue: jest.fn(),
      onLogout: jest.fn(),
      isLoggingOut: false,
      locale: 'ar',
    });
    expect(tree).toBeDefined();
    expect(tree.type).toBe('View');
  });
});
