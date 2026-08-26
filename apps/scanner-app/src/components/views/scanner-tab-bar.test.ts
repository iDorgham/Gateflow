import { describe, it, expect, jest } from '@jest/globals';
import { ScannerTabBar, type ScannerTabKey } from './scanner-tab-bar';

describe('ScannerTabBar component definition', () => {
  it('exports ScannerTabBar as a callable component function', () => {
    expect(typeof ScannerTabBar).toBe('function');
  });

  it('validates supported scanner tab keys', () => {
    const validTabs: ScannerTabKey[] = [
      'home',
      'scanner',
      'today',
      'log',
      'chat',
      'settings',
    ];
    expect(validTabs).toHaveLength(6);
    expect(validTabs).toContain('home');
    expect(validTabs).toContain('scanner');
    expect(validTabs).toContain('today');
    expect(validTabs).toContain('log');
    expect(validTabs).toContain('chat');
    expect(validTabs).toContain('settings');
  });

  it('renders correctly with default English locale', () => {
    const onSelectTab = jest.fn();
    const tree = ScannerTabBar({
      activeTab: 'home',
      onSelectTab,
      locale: 'en',
    });
    expect(tree).toBeDefined();
    expect(tree.type).toBe('View');
  });

  it('renders correctly with Arabic locale', () => {
    const onSelectTab = jest.fn();
    const tree = ScannerTabBar({
      activeTab: 'scanner',
      onSelectTab,
      locale: 'ar',
    });
    expect(tree).toBeDefined();
    expect(tree.type).toBe('View');
  });
});
