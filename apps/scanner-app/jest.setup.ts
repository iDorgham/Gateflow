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
    writable: true,
  });
} catch (e) {
  console.warn('Could not define localStorage on global:', e);
}

// Also mock fetch if missing
if (typeof global.fetch === 'undefined') {
  (global as any).fetch = jest.fn();
}

jest.mock('react-native', () => ({
  Platform: { OS: 'ios', select: (objs: any) => objs.ios ?? objs.default },
  StyleSheet: {
    create: (styles: any) => styles,
    absoluteFill: {},
    absoluteFillObject: {},
  },
  View: 'View',
  Text: 'Text',
  Pressable: 'Pressable',
  ActivityIndicator: 'ActivityIndicator',
  StatusBar: { currentHeight: 24 },
  Dimensions: { get: () => ({ width: 375, height: 812 }) },
}));

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const dummyIcon = (props: any) => React.createElement('Icon', props);
  return new Proxy(
    {},
    {
      get: () => dummyIcon,
    }
  );
});

jest.mock('expo-camera', () => {
  const React = require('react');
  return {
    CameraView: (props: any) => React.createElement('CameraView', props),
    useCameraPermissions: () => [{ granted: true }, jest.fn()],
  };
});

jest.mock('expo-location', () => ({
  useForegroundPermissions: () => [{ granted: true }, jest.fn()],
  getLastKnownPositionAsync: jest.fn().mockResolvedValue(null),
}));

jest.mock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest
    .fn()
    .mockResolvedValue({ status: 'granted' }),
  launchCameraAsync: jest
    .fn()
    .mockResolvedValue({ canceled: true, assets: [] }),
  MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-jwt', () => ({
  __esModule: true,
  default: { decode: jest.fn().mockReturnValue(null) },
}));
