// Mock global.localStorage TO PREVENT SecurityError in Node test environment
// Some dependencies (like async-storage) might try to access it on import.

const mockStorage = {
  getItem: (key: string) => null,
  setItem: (key: string, value: string) => {},
  removeItem: (key: string) => {},
  clear: () => {},
  length: 0,
  key: (index: number) => null,
};

try {
  Object.defineProperty(global, 'localStorage', {
    value: mockStorage,
    configurable: true,
    enumerable: true,
    writable: true
  });
} catch (e) {
  console.warn('Could not define localStorage on global:', e);
}

// Also mock fetch if missing
if (typeof global.fetch === 'undefined') {
  (global as any).fetch = jest.fn();
}
